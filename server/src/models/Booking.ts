import mongoose, { Document, Schema } from 'mongoose';
import {
  BookingStatus,
  BookingType,
  PaymentMethod,
  PaymentStatus,
  ServiceType,
  TripScope,
  VehicleCategory,
} from '../config/constants';

export interface ILocationPoint {
  address: string;
  lat: number;
  lng: number;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface IFareBreakdown {
  baseFare: number;
  distanceFare: number;
  timeFare: number;
  waitingCharge: number;
  nightCharge: number;
  surgeCharge: number;
  extraStopCharge: number;
  subtotal: number;
  discount: number;
  tax: number;
  tollFee: number;
  driverBata: number; // strictly 0 for INTER_STATION
  isFinalCalculated: boolean; // True only after driver enters post-ride toll & bata
  actualTollEnteredByDriver?: boolean;
  driverBataEnteredByDriver?: boolean;
  finalFare: number;
  currency: string;
}

export interface IBooking extends Document {
  bookingId: string;
  customer: mongoose.Types.ObjectId;
  driver?: mongoose.Types.ObjectId;
  vehicle?: mongoose.Types.ObjectId;
  serviceType: ServiceType;
  vehicleCategory: VehicleCategory;
  tripScope: TripScope;
  bookingType: BookingType;
  scheduledTime?: Date;
  pickupLocation: ILocationPoint;
  dropLocation: ILocationPoint;
  extraStops: ILocationPoint[];
  distanceKm: number;
  estimatedDurationMins: number;
  fareBreakdown: IFareBreakdown;
  appliedCoupon?: {
    couponId: mongoose.Types.ObjectId;
    code: string;
    discountAmount: number;
  };
  commissionDetails?: {
    ratePercent: number;
    platformCommission: number;
    driverEarnings: number;
    taxDeducted: number;
  };
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: BookingStatus;
  cancellation?: {
    cancelledBy: 'CUSTOMER' | 'DRIVER' | 'ADMIN' | 'SYSTEM';
    reason: string;
    cancelledAt: Date;
    cancellationFee: number;
  };
  timeline: {
    status: BookingStatus;
    timestamp: Date;
    note?: string;
  }[];
  otp?: string;
  goodsDetails?: {
    itemType?: string;
    approxWeightKg?: number;
    receiverName?: string;
    receiverMobile?: string;
    notes?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const LocationPointSubSchema = new Schema<ILocationPoint>(
  {
    address: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    city: String,
    state: String,
    pincode: String,
  },
  { _id: false }
);

const FareBreakdownSubSchema = new Schema<IFareBreakdown>(
  {
    baseFare: { type: Number, default: 0 },
    distanceFare: { type: Number, default: 0 },
    timeFare: { type: Number, default: 0 },
    waitingCharge: { type: Number, default: 0 },
    nightCharge: { type: Number, default: 0 },
    surgeCharge: { type: Number, default: 0 },
    extraStopCharge: { type: Number, default: 0 },
    subtotal: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    tollFee: { type: Number, default: 0 },
    driverBata: { type: Number, default: 0 },
    isFinalCalculated: { type: Boolean, default: false },
    actualTollEnteredByDriver: { type: Boolean, default: false },
    driverBataEnteredByDriver: { type: Boolean, default: false },
    finalFare: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
  },
  { _id: false }
);

const BookingSchema = new Schema<IBooking>(
  {
    bookingId: { type: String, required: true, unique: true, index: true },
    customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
    driver: { type: Schema.Types.ObjectId, ref: 'Driver', index: true },
    vehicle: { type: Schema.Types.ObjectId, ref: 'Vehicle' },
    serviceType: {
      type: String,
      enum: Object.values(ServiceType),
      required: true,
      index: true,
    },
    vehicleCategory: {
      type: String,
      enum: Object.values(VehicleCategory),
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
    bookingType: {
      type: String,
      enum: Object.values(BookingType),
      default: BookingType.INSTANT,
    },
    scheduledTime: { type: Date },
    pickupLocation: { type: LocationPointSubSchema, required: true },
    dropLocation: { type: LocationPointSubSchema, required: true },
    extraStops: [LocationPointSubSchema],
    distanceKm: { type: Number, required: true },
    estimatedDurationMins: { type: Number, required: true },
    fareBreakdown: { type: FareBreakdownSubSchema, required: true },
    appliedCoupon: {
      couponId: { type: Schema.Types.ObjectId, ref: 'Coupon' },
      code: String,
      discountAmount: Number,
    },
    commissionDetails: {
      ratePercent: Number,
      platformCommission: Number,
      driverEarnings: Number,
      taxDeducted: Number,
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      default: PaymentMethod.UPI,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(BookingStatus),
      default: BookingStatus.REQUESTED,
      index: true,
    },
    cancellation: {
      cancelledBy: { type: String, enum: ['CUSTOMER', 'DRIVER', 'ADMIN', 'SYSTEM'] },
      reason: String,
      cancelledAt: Date,
      cancellationFee: { type: Number, default: 0 },
    },
    timeline: [
      {
        status: { type: String, enum: Object.values(BookingStatus) },
        timestamp: { type: Date, default: Date.now },
        note: String,
      },
    ],
    otp: { type: String, default: '1234' },
    goodsDetails: {
      itemType: String,
      approxWeightKg: Number,
      receiverName: String,
      receiverMobile: String,
      notes: String,
    },
  },
  { timestamps: true }
);

export const Booking = mongoose.model<IBooking>('Booking', BookingSchema);
