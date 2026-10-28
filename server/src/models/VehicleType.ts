import mongoose, { Document, Schema } from 'mongoose';
import { ServiceType } from '../config/constants';

export interface IVehicleTypePricing {
  baseFare: number;
  baseDistanceKm: number;
  perKmRate: number;
  minimumFare: number;
  driverBata: number;
  estimatedTollPerKm: number;
  perMinuteRate?: number;
  waitingChargePerMin?: number;
  freeWaitingMins?: number;
  driverCommissionPercentage?: number;
  bookingRadiusKm?: number;
  cancellationPercentage?: number;
  customerCancellationTimeHours?: number;
  driverCancellationTimeHours?: number;
  driverDailyMaxCancellations?: number;
  walletMinAmount?: number;
  incentives?: {
    daily?: { targetBookings: number; rewardAmount: number }[];
    weekly?: { targetBookings: number; rewardAmount: number }[];
    monthly?: { targetBookings: number; rewardAmount: number }[];
  };
}

export interface IVehicleType extends Document {
  typeId: string;
  name: string;
  code: string;
  serviceType: ServiceType;
  wheelCount: number;
  wheelType: string;
  capacity: {
    passengers?: number;
    luggageBags?: number;
    weightTons?: number;
    dimensions?: string;
  };
  modelsExample: string;
  features: string[];
  badge?: string;
  imageUrl?: string;
  pricing?: {
    interStation?: IVehicleTypePricing;
    outstation?: IVehicleTypePricing;
  };
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const VehicleTypePricingSubSchema = new Schema<IVehicleTypePricing>(
  {
    baseFare: { type: Number, default: 100 },
    baseDistanceKm: { type: Number, default: 2 },
    perKmRate: { type: Number, default: 15 },
    minimumFare: { type: Number, default: 100 },
    driverBata: { type: Number, default: 0 },
    estimatedTollPerKm: { type: Number, default: 1.35 },
    perMinuteRate: { type: Number, default: 2 },
    waitingChargePerMin: { type: Number, default: 3 },
    freeWaitingMins: { type: Number, default: 5 },
    driverCommissionPercentage: { type: Number, default: 15 },
    bookingRadiusKm: { type: Number, default: 15 },
    cancellationPercentage: { type: Number, default: 10 },
    customerCancellationTimeHours: { type: Number, default: 1 },
    driverCancellationTimeHours: { type: Number, default: 2 },
    driverDailyMaxCancellations: { type: Number, default: 3 },
    walletMinAmount: { type: Number, default: 500 },
    incentives: {
      daily: [{ targetBookings: Number, rewardAmount: Number }],
      weekly: [{ targetBookings: Number, rewardAmount: Number }],
      monthly: [{ targetBookings: Number, rewardAmount: Number }],
    },
  },
  { _id: false }
);

const VehicleTypeSchema = new Schema<IVehicleType>(
  {
    typeId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    serviceType: {
      type: String,
      enum: Object.values(ServiceType),
      required: true,
      index: true,
    },
    wheelCount: { type: Number, required: true, default: 4, index: true },
    wheelType: { type: String, required: true, default: '4-Wheeler' },
    capacity: {
      passengers: { type: Number },
      luggageBags: { type: Number },
      weightTons: { type: Number },
      dimensions: { type: String },
    },
    modelsExample: { type: String, default: '' },
    features: { type: [String], default: [] },
    badge: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    pricing: {
      interStation: { type: VehicleTypePricingSubSchema, required: false },
      outstation: { type: VehicleTypePricingSubSchema, required: false },
    },
    isActive: { type: Boolean, default: true, index: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const VehicleType = mongoose.model<IVehicleType>('VehicleType', VehicleTypeSchema);
