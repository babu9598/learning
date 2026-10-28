import { Request, Response } from 'express';
import { PaymentService } from '../services/paymentService';
import { Payment } from '../models/Payment';
import { successResponse, errorResponse } from '../utils/response';
import { PaymentMethod } from '../config/constants';

export class PaymentController {
  /**
   * POST /api/payments/create-order
   * Create payment intent / order for Razorpay / UPI / Card
   */
  static async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const { bookingId, amount, paymentMethod } = req.body;
      if (!bookingId) {
        errorResponse(res, 'bookingId is required', 400);
        return;
      }

      const order = await PaymentService.createOrder({
        bookingId,
        amount: amount ? Number(amount) : undefined,
        paymentMethod: paymentMethod || PaymentMethod.UPI,
      });

      successResponse(res, order, 'Payment order created successfully', 201);
    } catch (error: any) {
      errorResponse(res, error.message, 400);
    }
  }

  /**
   * POST /api/payments/verify
   * Verify completed payment from mobile or web app
   */
  static async verifyPayment(req: Request, res: Response): Promise<void> {
    try {
      const { bookingId, paymentMethod, transactionId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

      if (!bookingId) {
        errorResponse(res, 'bookingId is required', 400);
        return;
      }

      const result = await PaymentService.verifyPayment({
        bookingId,
        paymentMethod: paymentMethod || PaymentMethod.UPI,
        transactionId,
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        gatewayResponse: req.body,
      });

      successResponse(res, result, 'Payment verified successfully', 200);
    } catch (error: any) {
      errorResponse(res, error.message, 400);
    }
  }

  /**
   * POST /api/payments/wallet-pay
   * Instant 1-tap customer wallet balance payment
   */
  static async payWithWallet(req: Request, res: Response): Promise<void> {
    try {
      const { bookingId } = req.body;
      if (!bookingId) {
        errorResponse(res, 'bookingId is required', 400);
        return;
      }

      const result = await PaymentService.verifyPayment({
        bookingId,
        paymentMethod: PaymentMethod.WALLET,
      });

      successResponse(res, result, 'Wallet payment successful', 200);
    } catch (error: any) {
      errorResponse(res, error.message, 400);
    }
  }

  /**
   * POST /api/payments/cash-confirm
   * Driver confirms physical cash collection at trip destination
   */
  static async confirmCashPayment(req: Request, res: Response): Promise<void> {
    try {
      const { bookingId } = req.body;
      if (!bookingId) {
        errorResponse(res, 'bookingId is required', 400);
        return;
      }

      const result = await PaymentService.verifyPayment({
        bookingId,
        paymentMethod: PaymentMethod.CASH,
      });

      successResponse(res, result, 'Cash payment confirmed', 200);
    } catch (error: any) {
      errorResponse(res, error.message, 400);
    }
  }

  /**
   * GET /api/payments/history/:customerId
   */
  static async getCustomerPayments(req: Request, res: Response): Promise<void> {
    try {
      const { customerId } = req.params;
      const payments = await Payment.find({ customer: customerId })
        .populate('booking', 'bookingId pickupLocation dropLocation fareBreakdown')
        .sort({ createdAt: -1 })
        .limit(20);

      successResponse(res, payments, 'Payment history retrieved');
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }
}
