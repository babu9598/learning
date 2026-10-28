import mongoose, { Document, Schema } from 'mongoose';

export interface ITrip extends Document {
  tripId: string;
  booking: mongoose.Types.ObjectId;
  driver: mongoose.Types.ObjectId;
  customer: mongoose.Types.ObjectId;
  vehicle: mongoose.Types.ObjectId;
  startTime: Date;
  endTime?: Date;
  startLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  endLocation?: {
    lat: number;
    lng: number;
    address: string;
  };
  currentLocation?: {
    lat: number;
    lng: number;
  };
  routeTrajectory: {
    lat: number;
    lng: number;
    timestamp: Date;
    speed?: number;
  }[];
  totalDistanceKm: number;
  totalDurationMins: number;
  waitingDurationMins: number;
  averageSpeedKmH: number;
  maxSpeedKmH: number;
  status: 'STARTED' | 'COMPLETED' | 'CANCELLED';
  createdAt: Date;
  updatedAt: Date;
}

const TripSchema = new Schema<ITrip>(
  {
    tripId: { type: String, required: true, unique: true, index: true },
    booking: { type: Schema.Types.ObjectId, ref: 'Booking', required: true, index: true },
    driver: { type: Schema.Types.ObjectId, ref: 'Driver', required: true, index: true },
    customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
    vehicle: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date },
    startLocation: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      address: { type: String, required: true },
    },
    endLocation: {
      lat: Number,
      lng: Number,
      address: String,
    },
    currentLocation: {
      lat: Number,
      lng: Number,
    },
    routeTrajectory: [
      {
        lat: Number,
        lng: Number,
        timestamp: { type: Date, default: Date.now },
        speed: Number,
      },
    ],
    totalDistanceKm: { type: Number, default: 0 },
    totalDurationMins: { type: Number, default: 0 },
    waitingDurationMins: { type: Number, default: 0 },
    averageSpeedKmH: { type: Number, default: 0 },
    maxSpeedKmH: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['STARTED', 'COMPLETED', 'CANCELLED'],
      default: 'STARTED',
      index: true,
    },
  },
  { timestamps: true }
);

export const Trip = mongoose.model<ITrip>('Trip', TripSchema);
