import { FareRule, IFareRule } from '../models/FareRule';
import { SurgeRule } from '../models/SurgeRule';
import { Coupon } from '../models/Coupon';
import { Coordinates } from '../utils/geoUtils';
import { GoogleMapsService } from './googleMapsService';
import { ServiceType, TripScope, VehicleCategory } from '../config/constants';
import { IBooking } from '../models/Booking';

export interface FareCalculationInput {
  vehicleCategory: VehicleCategory | string;
  serviceType: ServiceType;
  tripScope?: TripScope;
  pickupLocation: Coordinates;
  dropLocation: Coordinates;
  extraStopsCount?: number;
  couponCode?: string;
  isNight?: boolean;
  scheduledTime?: Date;
}

export class FareService {
  /**
   * Dynamic Backend Pricing Calculation Engine with Google Maps Distance & Duration
   * Supports both Inter-Station (Local / City) and Outstation (Intercity Drop)
   */
  static async calculateFare(input: FareCalculationInput) {
    const {
      vehicleCategory,
      serviceType,
      tripScope = TripScope.OUTSTATION,
      pickupLocation,
      dropLocation,
      extraStopsCount = 0,
      couponCode,
    } = input;

    // 1. Fetch Fare Rule for category + tripScope
    let fareRule = await FareRule.findOne({
      category: vehicleCategory,
      tripScope,
      isActive: true,
    });

    if (!fareRule) {
      // Fallback: category regardless of scope, or serviceType + scope, or serviceType
      fareRule =
        (await FareRule.findOne({ category: vehicleCategory, isActive: true })) ||
        (await FareRule.findOne({ serviceType, tripScope, isActive: true })) ||
        (await FareRule.findOne({ serviceType, isActive: true }));

      if (!fareRule) {
        throw new Error(
          `Pricing rule not found for category ${vehicleCategory} (${tripScope})`
        );
      }
    }

    // 2. Calculate Distance, Duration, and Dynamic Highway Tolls via Google Maps Engine
    const routeInfo = await GoogleMapsService.getDrivingDistanceAndTolls(
      pickupLocation,
      dropLocation,
      {
        serviceType,
        tripScope,
        estimatedTollPerKm: fareRule.estimatedTollPerKm,
      }
    );
    const distanceKm = routeInfo.distanceKm;
    const estimatedDurationMins = routeInfo.durationMins;

    // 3. Base & Distance Fare
    const chargeableDistanceKm = Math.max(0, distanceKm - fareRule.baseDistanceKm);
    const distanceFare = Number((chargeableDistanceKm * fareRule.perKmRate).toFixed(2));
    const timeFare = Number((estimatedDurationMins * fareRule.perMinuteRate).toFixed(2));
    const extraStopCharge = extraStopsCount * fareRule.extraStopCharge;

    // 4. Check Night Surcharge
    const currentHour = input.scheduledTime
      ? new Date(input.scheduledTime).getHours()
      : new Date().getHours();
    const isNightTime = currentHour >= 22 || currentHour < 5;
    const nightCharge = isNightTime
      ? Number(((fareRule.baseFare + distanceFare) * (fareRule.nightChargeMultiplier - 1)).toFixed(2))
      : 0;

    // 5. Check Surge Pricing
    const activeSurge = await SurgeRule.findOne({
      isActive: true,
      $or: [{ affectedCategories: { $in: [vehicleCategory] } }, { affectedCategories: { $size: 0 } }],
    });
    const surgeMultiplier = activeSurge ? activeSurge.multiplier : 1.0;
    const surgeCharge =
      surgeMultiplier > 1.0
        ? Number(((fareRule.baseFare + distanceFare) * (surgeMultiplier - 1)).toFixed(2))
        : 0;

    // 6. Subtotal (Base + Distance + Time + Night + Surge + Extra Stops)
    let subtotal =
      fareRule.baseFare + distanceFare + timeFare + extraStopCharge + nightCharge + surgeCharge;
    subtotal = Math.max(subtotal, fareRule.minimumFare);

    // 7. Coupon Discount
    let discount = 0;
    let validCoupon: any = null;
    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true,
        startDate: { $lte: new Date() },
        endDate: { $gte: new Date() },
      });

      if (coupon && subtotal >= coupon.minBookingAmount) {
        if (coupon.discountType === 'PERCENTAGE') {
          discount = Math.min(coupon.maxDiscountAmount, (subtotal * coupon.discountValue) / 100);
        } else {
          discount = Math.min(coupon.maxDiscountAmount, coupon.discountValue);
        }
        discount = Number(discount.toFixed(2));
        validCoupon = coupon;
      }
    }

    // 8. Tax / GST Calculation (5%)
    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = Number(((taxableAmount * fareRule.taxPercentage) / 100).toFixed(2));

    // 9. Dynamic Toll Calculation directly from Google Maps API
    // Dynamic highway FASTag tolls computed automatically by Google Maps; ₹0 for local/city routes
    const tollFee = routeInfo.tollFee || 0;

    // 10. Driver Bata (Allowance):
    // Rule: Inter-station has NO driver bata (₹0). Outstation has driver bata.
    const driverBata =
      tripScope === TripScope.INTER_STATION
        ? 0
        : (fareRule.driverBata !== undefined && fareRule.driverBata > 0
            ? fareRule.driverBata
            : (serviceType === ServiceType.GOODS_TRUCK ? 400 : 350));

    // 11. Final Calculated Price (Locked from upfront Google Maps dynamic calculation)
    const finalFare = Number((taxableAmount + tax + tollFee + driverBata).toFixed(2));

    return {
      distanceKm,
      estimatedDurationMins,
      fareBreakdown: {
        baseFare: fareRule.baseFare,
        distanceFare,
        timeFare,
        waitingCharge: 0,
        nightCharge,
        surgeCharge,
        extraStopCharge,
        subtotal: Number(subtotal.toFixed(2)),
        discount,
        tax,
        tollFee,
        driverBata,
        isFinalCalculated: true, // Upfront final dynamic price locked via Google Maps
        actualTollEnteredByDriver: false,
        finalFare,
        currency: 'INR',
      },
      appliedCoupon: validCoupon
        ? {
            couponId: validCoupon._id,
            code: validCoupon.code,
            discountAmount: discount,
          }
        : undefined,
    };
  }

  /**
   * Final Fare Confirmation upon ride completion.
   * Retains dynamic Google Maps toll fees with zero manual entry required.
   */
  static recalculateFinalFare(
    booking: IBooking,
    actualToll?: number,
    driverBata?: number,
    actualDistanceKm?: number
  ) {
    const isInterStation = booking.tripScope === TripScope.INTER_STATION;
    // Inter-station strictly has 0 driver bata
    const resolvedDriverBata = isInterStation
      ? 0
      : (driverBata !== undefined && driverBata > 0 ? Number(driverBata) : (booking.fareBreakdown.driverBata || 0));
    // Default to the authoritative dynamic Google Maps toll
    const resolvedToll = actualToll !== undefined && actualToll > 0 ? Number(actualToll) : (booking.fareBreakdown.tollFee || 0);

    // Recalculate distance fare if actual distance was provided
    let distanceFare = booking.fareBreakdown.distanceFare;
    let baseFare = booking.fareBreakdown.baseFare;
    if (actualDistanceKm !== undefined && actualDistanceKm > 0 && actualDistanceKm !== booking.distanceKm) {
      const perKm = booking.distanceKm > 0 ? distanceFare / booking.distanceKm : 14;
      distanceFare = Number((actualDistanceKm * perKm).toFixed(2));
    }

    const subtotal = Number(
      (
        baseFare +
        distanceFare +
        (booking.fareBreakdown.timeFare || 0) +
        (booking.fareBreakdown.extraStopCharge || 0) +
        (booking.fareBreakdown.nightCharge || 0) +
        (booking.fareBreakdown.surgeCharge || 0)
      ).toFixed(2)
    );

    const discount = booking.fareBreakdown.discount || 0;
    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = Number(((taxableAmount * 5) / 100).toFixed(2));
    const finalFare = Number((taxableAmount + tax + resolvedToll + resolvedDriverBata).toFixed(2));

    return {
      baseFare,
      distanceFare,
      timeFare: booking.fareBreakdown.timeFare || 0,
      waitingCharge: booking.fareBreakdown.waitingCharge || 0,
      nightCharge: booking.fareBreakdown.nightCharge || 0,
      surgeCharge: booking.fareBreakdown.surgeCharge || 0,
      extraStopCharge: booking.fareBreakdown.extraStopCharge || 0,
      subtotal,
      discount,
      tax,
      tollFee: resolvedToll,
      driverBata: resolvedDriverBata,
      isFinalCalculated: true,
      actualTollEnteredByDriver: false,
      finalFare,
      currency: 'INR',
    };
  }

  static async getFareRules() {
    return FareRule.find().sort({ serviceType: 1, tripScope: 1, baseFare: 1 });
  }

  static async getPublicFareRules() {
    return FareRule.find({ isActive: true }).sort({ serviceType: 1, tripScope: 1, baseFare: 1 });
  }

  static async createFareRule(data: Partial<IFareRule>) {
    return FareRule.create(data);
  }

  static async updateFareRule(id: string, data: Partial<IFareRule>) {
    const rule = await FareRule.findByIdAndUpdate(id, data, { new: true });
    if (!rule) throw new Error('Fare rule not found');
    return rule;
  }

  static async deleteFareRule(id: string) {
    const deleted = await FareRule.findByIdAndDelete(id);
    if (!deleted) throw new Error('Fare rule not found');
    return { success: true };
  }

  static async getSurgeRules() {
    return SurgeRule.find().sort({ createdAt: -1 });
  }

  static async createSurgeRule(data: any) {
    return SurgeRule.create(data);
  }

  static async updateSurgeRule(id: string, data: any) {
    const surge = await SurgeRule.findByIdAndUpdate(id, data, { new: true });
    if (!surge) throw new Error('Surge rule not found');
    return surge;
  }

  static async deleteSurgeRule(id: string) {
    await SurgeRule.findByIdAndDelete(id);
    return { success: true };
  }
}
