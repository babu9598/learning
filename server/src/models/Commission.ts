import mongoose, { Document, Schema } from 'mongoose';
import { VehicleCategory } from '../config/constants';

export interface ICommissionRule extends Document {
  ruleType: 'GLOBAL' | 'VEHICLE_WISE' | 'DRIVER_SPECIFIC' | 'LOCATION_BASED';
  category?: VehicleCategory;
  driver?: mongoose.Types.ObjectId;
  cityName?: string;
  commissionPercentage: number;
  fixedFee: number;
  taxOnCommission: number;
  isActive: boolean;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CommissionRuleSchema = new Schema<ICommissionRule>(
  {
    ruleType: {
      type: String,
      enum: ['GLOBAL', 'VEHICLE_WISE', 'DRIVER_SPECIFIC', 'LOCATION_BASED'],
      default: 'GLOBAL',
    },
    category: { type: String, enum: Object.values(VehicleCategory) },
    driver: { type: Schema.Types.ObjectId, ref: 'Driver' },
    cityName: { type: String },
    commissionPercentage: { type: Number, required: true, default: 20 },
    fixedFee: { type: Number, default: 0 },
    taxOnCommission: { type: Number, default: 18 }, // 18% GST on platform service fee
    isActive: { type: Boolean, default: true },
    description: { type: String },
  },
  { timestamps: true }
);

export const CommissionRule = mongoose.model<ICommissionRule>('CommissionRule', CommissionRuleSchema);

// Driver Earnings Schema
export interface IDriverEarning extends Document {
  booking: mongoose.Types.ObjectId;
  driver: mongoose.Types.ObjectId;
  tripFare: number;
  platformCommissionPercent: number;
  platformCommissionAmount: number;
  taxDeducted: number;
  netDriverEarnings: number;
  isPaidOut: boolean;
  payoutRef?: mongoose.Types.ObjectId;
  earnedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const DriverEarningSchema = new Schema<IDriverEarning>(
  {
    booking: { type: Schema.Types.ObjectId, ref: 'Booking', required: true, index: true },
    driver: { type: Schema.Types.ObjectId, ref: 'Driver', required: true, index: true },
    tripFare: { type: Number, required: true },
    platformCommissionPercent: { type: Number, required: true },
    platformCommissionAmount: { type: Number, required: true },
    taxDeducted: { type: Number, default: 0 },
    netDriverEarnings: { type: Number, required: true },
    isPaidOut: { type: Boolean, default: false, index: true },
    payoutRef: { type: Schema.Types.ObjectId, ref: 'Payout' },
    earnedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const DriverEarning = mongoose.model<IDriverEarning>('DriverEarning', DriverEarningSchema);
