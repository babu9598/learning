import crypto from 'crypto';
import mongoose from 'mongoose';
import { Booking } from '../models/Booking';
import { Customer } from '../models/Customer';
import { Driver } from '../models/Driver';
import { Payment, IPayment } from '../models/Payment';
import { DriverEarning } from '../models/Commission';
import { BookingStatus, PaymentMethod, PaymentStatus } from '../config/constants';
import { ENV } from '../config/environment';
import { io } from '../server';
import { logger } from '../utils/logger';

export interface CreateOrderInput {
  bookingId: string;
  amount?: number;
  paymentMethod: PaymentMethod;
  customerId?: string;
}

export interface VerifyPaymentInput {
  bookingId: string;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  gatewayResponse?: any;
}

export class PaymentService {
  /**
   * Create a Payment Order (Razorpay Order or Sandbox Instant Order)
   */
  static async createOrder(input: CreateOrderInput) {
    const { bookingId, paymentMethod } = input;

    const booking = await Booking.findById(bookingId).populate('customer').populate('driver');
    if (!booking) {
      throw new Error(`Booking not found with ID: ${bookingId}`);
    }

    const payableAmount = input.amount || booking.fareBreakdown.finalFare;
    const amountInPaise = Math.round(payableAmount * 100);

    // Generate unique internal transaction ID
    const internalTxId = `TXN_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Razorpay Integration (Live or Test Sandbox)
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_droptaxi_sandbox';
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || 'sandbox_secret_key_123';

    let razorpayOrderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // If real Razorpay credentials provided in environment, create live Razorpay order
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
      try {
        const authHeader = Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString('base64');
        const rzpResponse = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${authHeader}`,
          },
          body: JSON.stringify({
            amount: amountInPaise,
            currency: 'INR',
            receipt: booking.bookingId,
            notes: {
              bookingId: booking._id.toString(),
              customerName: (booking.customer as any)?.name || 'Valued Rider',
              serviceType: booking.serviceType,
            },
          }),
        });

        if (rzpResponse.ok) {
          const rzpData = (await rzpResponse.json()) as any;
          razorpayOrderId = rzpData.id;
        }
      } catch (err) {
        logger.warn('Razorpay Live API request failed, falling back to sandbox order:', err);
      }
    }

    // Upsert / Create Pending Payment record in MongoDB
    let payment = await Payment.findOne({ booking: booking._id, status: PaymentStatus.PENDING });
    if (!payment) {
      payment = await Payment.create({
        transactionId: internalTxId,
        booking: booking._id,
        customer: booking.customer ? (booking.customer as any)._id : new mongoose.Types.ObjectId(),
        driver: booking.driver ? (booking.driver as any)._id : undefined,
        amount: payableAmount,
        paymentMethod,
        status: PaymentStatus.PENDING,
        gatewayTransactionId: razorpayOrderId,
      });
    } else {
      payment.paymentMethod = paymentMethod;
      payment.amount = payableAmount;
      payment.gatewayTransactionId = razorpayOrderId;
      await payment.save();
    }

    return {
      orderId: razorpayOrderId,
      internalTxId: payment.transactionId,
      amount: payableAmount,
      amountInPaise,
      currency: 'INR',
      keyId: razorpayKeyId,
      bookingId: booking.bookingId,
      customer: {
        name: (booking.customer as any)?.name || 'Valued Customer',
        email: (booking.customer as any)?.email || 'customer@droptaxi.com',
        mobile: (booking.customer as any)?.mobile || '9876543210',
      },
    };
  }

  /**
   * Verify Payment (Razorpay signature, Wallet deduction, or Cash collection)
   */
  static async verifyPayment(input: VerifyPaymentInput) {
    const { bookingId, paymentMethod, razorpayOrderId, razorpayPaymentId, razorpaySignature } = input;

    const booking = await Booking.findById(bookingId).populate('customer').populate('driver');
    if (!booking) {
      throw new Error('Booking not found');
    }

    const payableAmount = booking.fareBreakdown.finalFare;
    const finalTxId =
      razorpayPaymentId ||
      input.transactionId ||
      `PAY_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // 1. Signature Verification for Razorpay if live keys configured
    if (razorpayOrderId && razorpayPaymentId && razorpaySignature && process.env.RAZORPAY_KEY_SECRET) {
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');

      if (expectedSignature !== razorpaySignature) {
        throw new Error('Invalid Razorpay signature. Payment verification failed.');
      }
    }

    // 2. Handle Wallet Payment Balance Deduction
    if (paymentMethod === PaymentMethod.WALLET && booking.customer) {
      const customer = await Customer.findById((booking.customer as any)._id || booking.customer);
      if (customer) {
        if ((customer.walletBalance || 0) < payableAmount) {
          throw new Error(
            `Insufficient wallet balance (₹${customer.walletBalance || 0}). Amount required: ₹${payableAmount}`
          );
        }
        customer.walletBalance = Number(((customer.walletBalance || 0) - payableAmount).toFixed(2));
        await customer.save();
      }
    }

    // 3. Update or Create MongoDB Payment Record as COMPLETED
    let payment = await Payment.findOne({ booking: booking._id });
    if (!payment) {
      payment = await Payment.create({
        transactionId: finalTxId,
        booking: booking._id,
        customer: (booking.customer as any)?._id || booking.customer,
        driver: (booking.driver as any)?._id || booking.driver,
        amount: payableAmount,
        paymentMethod,
        status: PaymentStatus.COMPLETED,
        gatewayTransactionId: razorpayPaymentId || razorpayOrderId,
        gatewayResponse: input.gatewayResponse || { verified: true, timestamp: new Date().toISOString() },
        paidAt: new Date(),
      });
    } else {
      payment.status = PaymentStatus.COMPLETED;
      payment.paymentMethod = paymentMethod;
      payment.paidAt = new Date();
      payment.gatewayTransactionId = razorpayPaymentId || payment.gatewayTransactionId;
      payment.gatewayResponse = input.gatewayResponse || { verified: true, timestamp: new Date().toISOString() };
      await payment.save();
    }

    // 4. Update Booking Document to PAID & Completed
    booking.paymentStatus = PaymentStatus.COMPLETED;
    booking.paymentMethod = paymentMethod;
    if (booking.status !== BookingStatus.TRIP_COMPLETED) {
      booking.status = BookingStatus.TRIP_COMPLETED;
    }
    booking.timeline.push({
      status: BookingStatus.TRIP_COMPLETED,
      timestamp: new Date(),
      note: `Payment of ₹${payableAmount} verified successfully via ${paymentMethod} (Tx: ${finalTxId})`,
    });
    await booking.save();

    // 5. Update Driver Earning record if present
    if (booking.driver) {
      await DriverEarning.findOneAndUpdate(
        { booking: booking._id },
        { payoutStatus: 'PAID', paidAt: new Date() }
      );
    }

    // 6. Real-Time Broadcast via Socket.IO
    if (io) {
      const payload = {
        bookingId: booking._id.toString(),
        bookingCode: booking.bookingId,
        paymentId: payment._id.toString(),
        transactionId: finalTxId,
        amount: payableAmount,
        paymentMethod,
        status: PaymentStatus.COMPLETED,
        paidAt: payment.paidAt,
      };

      io.emit('payment:success', payload);
      io.emit('booking:updated', booking);
      io.to(`booking:${booking._id}`).emit('payment:success', payload);
      if (booking.driver) {
        io.to(`driver:${(booking.driver as any)._id || booking.driver}`).emit('payment:received', payload);
      }
    }

    logger.info(`✅ Payment verified for Booking ${booking.bookingId}: ₹${payableAmount} via ${paymentMethod}`);

    return {
      success: true,
      bookingId: booking.bookingId,
      transactionId: finalTxId,
      amount: payableAmount,
      paymentMethod,
      paymentStatus: PaymentStatus.COMPLETED,
      paidAt: payment.paidAt,
      receiptNumber: `RCP-${String(Math.floor(100000 + Math.random() * 900000))}`,
    };
  }

  /**
   * Process Webhook Event from Razorpay or Payment Gateway
   */
  static async processWebhook(rawBody: string, signature: string, payload: any) {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'droptaxi_webhook_secret_key';

    if (process.env.RAZORPAY_WEBHOOK_SECRET && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

      if (expectedSignature !== signature) {
        logger.error('❌ Razorpay Webhook signature verification failed');
        throw new Error('Invalid webhook signature');
      }
    }

    const event = payload.event;
    logger.info(`🔔 Received Payment Webhook Event: ${event}`);

    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentEntity = payload.payload?.payment?.entity || payload.payload?.order?.entity;
      const notes = paymentEntity?.notes || {};
      const bookingId = notes.bookingId;

      if (bookingId) {
        await this.verifyPayment({
          bookingId,
          paymentMethod: PaymentMethod.UPI,
          razorpayPaymentId: paymentEntity.id,
          razorpayOrderId: paymentEntity.order_id,
          gatewayResponse: payload,
        });
      }
    }

    return { received: true, event };
  }
}
