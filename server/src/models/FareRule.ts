import mongoose, { Document, Schema } from 'mongoose';
import { ServiceType, TripScope, VehicleCategory } from '../config/constants';

export interface IIncentiveTier {
  targetBookings: number;
  rewardAmount: number;
}

export interface IFareRule extends Document {
  category: VehicleCategory | string;
  serviceType: ServiceType;
  tripScope: TripScope;
  title: string;
  baseFare: number;
  baseDistanceKm: number;
  perKmRate: number;
  driverBata: number; // 0 for INTER_STATION, allowance for OUTSTATION
  estimatedTollPerKm: number; // dynamic corridor toll estimate
  perMinuteRate: number;
  minimumFare: number;
  waitingChargePerMin: number;
  freeWaitingMins: number;
  nightChargeMultiplier: number;
  nightStartTime: string; // e.g., "22:00"
  nightEndTime: string;   // e.g., "05:00"
  cancellationFee: number;
  cancellationPercentage: number; // % of fare charged on cancellation
  customerCancellationTimeHours: number; // in hours
  driverCancellationTimeHours: number;   // in hours
  driverDailyMaxCancellations: number;   // max cancellations per day
  driverCommissionPercentage: number;   // platform commission %
  bookingRadiusKm: number;              // driver dispatch radius
  walletMinAmount: number;              // minimum driver wallet balance to accept bookings
  incentives: {
    daily: IIncentiveTier[];
    weekly: IIncentiveTier[];
    monthly: IIncentiveTier[];
  };
  extraStopCharge: number;
  taxPercentage: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const IncentiveTierSchema = new Schema<IIncentiveTier>(
  {
    targetBookings: { type: Number, required: true },
    rewardAmount: { type: Number, required: true },
  },
  { _id: false }
);

const FareRuleSchema = new Schema<IFareRule>(
  {
    category: {
      type: String,
      required: true,
      index: true,
    },
    serviceType: {
      type: String,
      enum: Object.values(ServiceType),
      required: true,
      index: true,
    },
    tripScope: {
      type: String,
      enum: Object.values(TripScope),
      default: TripScope.OUTSTATION,
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    baseFare: { type: Number, required: true, default: 100 },
    baseDistanceKm: { type: Number, required: true, default: 2 },
    perKmRate: { type: Number, required: true, default: 15 },
    driverBata: { type: Number, default: 0 },
    estimatedTollPerKm: { type: Number, default: 1.35 },
    perMinuteRate: { type: Number, required: true, default: 2 },
    minimumFare: { type: Number, required: true, default: 100 },
    waitingChargePerMin: { type: Number, required: true, default: 3 },
    freeWaitingMins: { type: Number, default: 5 },
    nightChargeMultiplier: { type: Number, default: 1.25 },
    nightStartTime: { type: String, default: '22:00' },
    nightEndTime: { type: String, default: '05:00' },
    cancellationFee: { type: Number, default: 50 },
    cancellationPercentage: { type: Number, default: 10 },
    customerCancellationTimeHours: { type: Number, default: 1 },
    driverCancellationTimeHours: { type: Number, default: 2 },
    driverDailyMaxCancellations: { type: Number, default: 3 },
    driverCommissionPercentage: { type: Number, default: 15 },
    bookingRadiusKm: { type: Number, default: 15 },
    walletMinAmount: { type: Number, default: 500 },
    incentives: {
      daily: { type: [IncentiveTierSchema], default: [] },
      weekly: { type: [IncentiveTierSchema], default: [] },
      monthly: { type: [IncentiveTierSchema], default: [] },
    },
    extraStopCharge: { type: Number, default: 50 },
    taxPercentage: { type: Number, default: 5 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Compound index on category + serviceType + tripScope
FareRuleSchema.index({ category: 1, serviceType: 1, tripScope: 1 }, { unique: true });

export const FareRule = mongoose.model<IFareRule>('FareRule', FareRuleSchema);
