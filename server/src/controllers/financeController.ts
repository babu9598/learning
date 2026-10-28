import { Response } from 'express';
import { CouponService } from '../services/couponService';
import { FinanceService } from '../services/financeService';
import { AuthenticatedRequest } from '../middleware/auth';
import { logAuditEvent } from '../middleware/auditLogger';
import { AuditAction, AuditModule } from '../config/constants';
import { successResponse, errorResponse } from '../utils/response';

export class CouponController {
  static async getCoupons(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const coupons = await CouponService.getCoupons();
      successResponse(res, coupons, 'Coupons fetched');
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }

  static async createCoupon(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const coupon = await CouponService.createCoupon(req.body);
      await logAuditEvent(req, {
        module: AuditModule.COUPONS,
        action: AuditAction.CREATE,
        recordId: coupon._id.toString(),
        targetModel: 'Coupon',
        newValue: coupon,
        description: `Created coupon ${coupon.code}`,
      });
      successResponse(res, coupon, 'Coupon created', 201);
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }

  static async updateCoupon(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const coupon = await CouponService.updateCoupon(id, req.body);
      await logAuditEvent(req, {
        module: AuditModule.COUPONS,
        action: AuditAction.UPDATE,
        recordId: coupon._id.toString(),
        targetModel: 'Coupon',
        newValue: req.body,
        description: `Updated coupon ${coupon.code}`,
      });
      successResponse(res, coupon, 'Coupon updated');
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }

  static async deleteCoupon(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const result = await CouponService.deleteCoupon(id);
      await logAuditEvent(req, {
        module: AuditModule.COUPONS,
        action: AuditAction.DELETE,
        recordId: id,
        targetModel: 'Coupon',
        description: `Deleted coupon ${id}`,
      });
      successResponse(res, result, 'Coupon deleted');
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }

  static async validateCoupon(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { code, amount, category } = req.body;
      const result = await CouponService.validateCoupon(code, amount, category);
      successResponse(res, result, 'Coupon validation result');
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }
}

export class FinanceController {
  static async getTransactions(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const result = await FinanceService.getTransactions(req.query);
      successResponse(res, result.transactions, 'Transactions fetched', 200, result.meta);
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }

  static async getPayouts(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const result = await FinanceService.getPayouts(req.query);
      successResponse(res, result.payouts, 'Payouts fetched', 200, result.meta);
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }

  static async processPayout(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const payout = await FinanceService.processPayout(id, req.body, req.user?._id?.toString());
      await logAuditEvent(req, {
        module: AuditModule.PAYOUTS,
        action: AuditAction.PAYOUT_PROCESSED,
        recordId: payout._id.toString(),
        targetModel: 'Payout',
        newValue: req.body,
        description: `Processed payout ${payout.payoutId} with status ${req.body.status}`,
      });
      successResponse(res, payout, 'Payout updated successfully');
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }

  static async generatePayoutBatch(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const payouts = await FinanceService.generatePayoutBatch(req.body.driverId);
      await logAuditEvent(req, {
        module: AuditModule.PAYOUTS,
        action: AuditAction.CREATE,
        description: `Generated payout batch of ${payouts.length} records`,
      });
      successResponse(res, payouts, `Generated ${payouts.length} payout records`, 201);
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }

  static async getCommissionRules(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const rules = await FinanceService.getCommissionRules();
      successResponse(res, rules, 'Commission rules fetched');
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }

  static async updateCommissionRule(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const rule = await FinanceService.updateCommissionRule(id, req.body);
      await logAuditEvent(req, {
        module: AuditModule.FINANCE,
        action: AuditAction.UPDATE,
        recordId: rule._id.toString(),
        targetModel: 'CommissionRule',
        newValue: req.body,
        description: 'Updated commission rule',
      });
      successResponse(res, rule, 'Commission rule updated');
    } catch (error: any) {
      errorResponse(res, error.message);
    }
  }
}
