import { Coupon, ICoupon } from '../models/Coupon';

export class CouponService {
  static async getCoupons() {
    return Coupon.find().sort({ createdAt: -1 });
  }

  static async getCouponById(id: string) {
    const coupon = await Coupon.findById(id);
    if (!coupon) throw new Error('Coupon not found');
    return coupon;
  }

  static async createCoupon(data: any) {
    const existing = await Coupon.findOne({ code: data.code.toUpperCase() });
    if (existing) throw new Error('Coupon code already exists');

    return Coupon.create({
      ...data,
      code: data.code.toUpperCase(),
    });
  }

  static async updateCoupon(id: string, data: any) {
    if (data.code) data.code = data.code.toUpperCase();
    const coupon = await Coupon.findByIdAndUpdate(id, data, { new: true });
    if (!coupon) throw new Error('Coupon not found');
    return coupon;
  }

  static async deleteCoupon(id: string) {
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) throw new Error('Coupon not found');
    return { success: true };
  }

  static async validateCoupon(code: string, amount: number, category: string) {
    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() },
    });

    if (!coupon) {
      return { valid: false, message: 'Invalid or expired coupon code' };
    }

    if (coupon.currentUses >= coupon.usageLimit) {
      return { valid: false, message: 'Coupon usage limit exceeded' };
    }

    if (amount < coupon.minBookingAmount) {
      return {
        valid: false,
        message: `Minimum booking amount of ₹${coupon.minBookingAmount} required for this coupon`,
      };
    }

    if (
      coupon.applicableCategories &&
      coupon.applicableCategories.length > 0 &&
      !coupon.applicableCategories.includes(category as any)
    ) {
      return { valid: false, message: 'Coupon not applicable for this vehicle type' };
    }

    let discount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discount = Math.min(coupon.maxDiscountAmount, (amount * coupon.discountValue) / 100);
    } else {
      discount = Math.min(coupon.maxDiscountAmount, coupon.discountValue);
    }

    return {
      valid: true,
      coupon,
      discountAmount: Number(discount.toFixed(2)),
    };
  }
}
