import { Payment } from '../models/Payment';
import { Payout } from '../models/Payout';
import { DriverEarning, CommissionRule } from '../models/Commission';
import { Driver } from '../models/Driver';
import { PayoutStatus } from '../config/constants';

export class FinanceService {
  /**
   * Get all transactions with filters & pagination
   */
  static async getTransactions(params: any) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 10));
    const skip = (page - 1) * limit;

    const query: any = {};
    if (params.search) {
      query.transactionId = { $regex: params.search, $options: 'i' };
    }
    if (params.status) query.status = params.status;
    if (params.paymentMethod) query.paymentMethod = params.paymentMethod;

    const [transactions, total] = await Promise.all([
      Payment.find(query)
        .populate('customer', 'name email mobile customerId')
        .populate('driver', 'name mobile driverId')
        .populate('booking', 'bookingId serviceType fareBreakdown')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Payment.countDocuments(query),
    ]);

    return {
      transactions,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get all driver payouts
   */
  static async getPayouts(params: any) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 10));
    const skip = (page - 1) * limit;

    const query: any = {};
    if (params.status) query.status = params.status;
    if (params.driverId) query.driver = params.driverId;

    const [payouts, total] = await Promise.all([
      Payout.find(query)
        .populate('driver', 'name mobile email driverId bankDetails payableBalance')
        .populate('processedBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Payout.countDocuments(query),
    ]);

    return {
      payouts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Process a payout record (Mark as Paid/Processing/Rejected)
   */
  static async processPayout(id: string, data: any, adminUserId?: string) {
    const payout = await Payout.findById(id).populate('driver');
    if (!payout) throw new Error('Payout record not found');

    payout.status = data.status;
    payout.paymentMode = data.paymentMode || payout.paymentMode;
    payout.bankReferenceNumber = data.bankReferenceNumber || payout.bankReferenceNumber;
    payout.notes = data.notes || payout.notes;

    if (data.status === PayoutStatus.PAID) {
      payout.paidAmount = data.paidAmount || payout.netPayable;
      payout.pendingAmount = Math.max(0, payout.netPayable - payout.paidAmount);
      payout.processedAt = new Date();
      payout.processedBy = adminUserId as any;

      // Deduct payable balance from driver
      await Driver.findByIdAndUpdate(payout.driver._id, {
        $inc: { payableBalance: -payout.paidAmount },
      });

      // Mark earnings as paid
      await DriverEarning.updateMany(
        { driver: payout.driver._id, isPaidOut: false },
        { isPaidOut: true, payoutRef: payout._id }
      );
    }

    await payout.save();
    return payout;
  }

  /**
   * Generate new Payout records for drivers with pending balances
   */
  static async generatePayoutBatch(driverId?: string) {
    const driverQuery: any = { payableBalance: { $gt: 0 } };
    if (driverId) driverQuery._id = driverId;

    const eligibleDrivers = await Driver.find(driverQuery);
    const createdPayouts = [];

    const now = new Date();
    const periodStart = new Date();
    periodStart.setDate(periodStart.getDate() - 7);

    for (const driver of eligibleDrivers) {
      const unpaidEarnings = await DriverEarning.find({
        driver: driver._id,
        isPaidOut: false,
      });

      if (unpaidEarnings.length === 0 && driver.payableBalance <= 0) continue;

      const grossEarnings = unpaidEarnings.reduce((acc, e) => acc + e.tripFare, 0) || driver.payableBalance;
      const platformCommission = unpaidEarnings.reduce((acc, e) => acc + e.platformCommissionAmount, 0);
      const taxDeductions = unpaidEarnings.reduce((acc, e) => acc + e.taxDeducted, 0);
      const netPayable = driver.payableBalance;

      const payoutCount = await Payout.countDocuments();
      const payoutId = `PAY-${String(payoutCount + 1).padStart(6, '0')}`;

      const payout = await Payout.create({
        payoutId,
        driver: driver._id,
        periodStart,
        periodEnd: now,
        totalTrips: unpaidEarnings.length,
        grossEarnings,
        platformCommission,
        taxDeductions,
        netPayable,
        paidAmount: 0,
        pendingAmount: netPayable,
        status: PayoutStatus.PENDING,
        paymentMode: driver.bankDetails?.upiId ? 'UPI' : 'BANK_TRANSFER',
      });

      createdPayouts.push(payout);
    }

    return createdPayouts;
  }

  /**
   * Get Commission Rules
   */
  static async getCommissionRules() {
    return CommissionRule.find().sort({ createdAt: -1 });
  }

  static async updateCommissionRule(id: string, data: any) {
    const rule = await CommissionRule.findByIdAndUpdate(id, data, { new: true });
    if (!rule) throw new Error('Commission rule not found');
    return rule;
  }
}
