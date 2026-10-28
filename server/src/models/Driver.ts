import mongoose, { Document, Schema } from 'mongoose';
import { DriverStatus, KycStatus, OnlineStatus, ServiceType } from '../config/constants';

export interface IDriver extends Document {
  driverId: string;
  name: string;
  email: string;
  mobile: string;
  avatar?: string;
  serviceType: ServiceType;
  status: DriverStatus;
  kycStatus: KycStatus;
  onlineStatus: OnlineStatus;
  assignedVehicle?: mongoose.Types.ObjectId;
  currentLocation: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
    heading?: number;
    speed?: number;
    lastUpdated?: Date;
    address?: string;
  };
  rating: number;
  totalTrips: number;
  acceptanceRate: number;
  cancellationRate: number;
  totalEarnings: number;
  payableBalance: number;
  joinedDate: Date;
  bankDetails?: {
    accountNumber?: string;
    ifscCode?: string;
    bankName?: string;
    holderName?: string;
    upiId?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const DriverSchema = new Schema<IDriver>(
  {
    driverId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    mobile: { type: String, required: true, unique: true, trim: true, index: true },
    avatar: { type: String, default: '' },
    serviceType: {
      type: String,
      enum: Object.values(ServiceType),
      default: ServiceType.DROP_TAXI,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(DriverStatus),
      default: DriverStatus.PENDING_APPROVAL,
      index: true,
    },
    kycStatus: {
      type: String,
      enum: Object.values(KycStatus),
      default: KycStatus.PENDING,
      index: true,
    },
    onlineStatus: {
      type: String,
      enum: Object.values(OnlineStatus),
      default: OnlineStatus.OFFLINE,
      index: true,
    },
    assignedVehicle: { type: Schema.Types.ObjectId, ref: 'Vehicle' },
    currentLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [80.2707, 13.0827], // Default Chennai coordinates
        index: '2dsphere',
      },
      heading: { type: Number, default: 0 },
      speed: { type: Number, default: 0 },
      lastUpdated: { type: Date, default: Date.now },
      address: { type: String, default: '' },
    },
    rating: { type: Number, default: 4.8 },
    totalTrips: { type: Number, default: 0 },
    acceptanceRate: { type: Number, default: 95 },
    cancellationRate: { type: Number, default: 2 },
    totalEarnings: { type: Number, default: 0 },
    payableBalance: { type: Number, default: 0 },
    joinedDate: { type: Date, default: Date.now },
    bankDetails: {
      accountNumber: String,
      ifscCode: String,
      bankName: String,
      holderName: String,
      upiId: String,
    },
  },
  { timestamps: true }
);

export const Driver = mongoose.model<IDriver>('Driver', DriverSchema);
