import mongoose, { Document, Schema } from 'mongoose';
import { ServiceType, VehicleCategory, VehicleStatus } from '../config/constants';

export interface IVehicleDocument {
  docNumber: string;
  docUrl: string;
  expiryDate: Date;
  status: 'VALID' | 'EXPIRED' | 'PENDING';
}

export interface IVehicle {
  _id: mongoose.Types.ObjectId;
  vehicleId: string;
  vehicleNumber: string;
  category: VehicleCategory;
  serviceType: ServiceType;
  brand: string;
  model: string;
  year: number;
  capacity: {
    passengers?: number;
    weightTons?: number;
    volumeCubicFt?: number;
  };
  fuelType: 'PETROL' | 'DIESEL' | 'CNG' | 'ELECTRIC';
  assignedDriver?: mongoose.Types.ObjectId;
  documents: {
    rc: IVehicleDocument;
    insurance: IVehicleDocument;
    fitness: IVehicleDocument;
    permit: IVehicleDocument;
  };
  status: VehicleStatus;
  isDocumentExpired: boolean;
  totalTrips: number;
  totalRevenue: number;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSubSchema = new Schema<IVehicleDocument>(
  {
    docNumber: { type: String, default: '' },
    docUrl: { type: String, default: '' },
    expiryDate: { type: Date, required: true },
    status: { type: String, enum: ['VALID', 'EXPIRED', 'PENDING'], default: 'VALID' },
  },
  { _id: false }
);

const VehicleSchema = new Schema(
  {
    vehicleId: { type: String, required: true, unique: true, index: true },
    vehicleNumber: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
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
    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    capacity: {
      passengers: { type: Number },
      weightTons: { type: Number },
      volumeCubicFt: { type: Number },
    },
    fuelType: {
      type: String,
      enum: ['PETROL', 'DIESEL', 'CNG', 'ELECTRIC'],
      default: 'DIESEL',
    },
    assignedDriver: { type: Schema.Types.ObjectId, ref: 'Driver' },
    documents: {
      rc: { type: DocumentSubSchema, required: true },
      insurance: { type: DocumentSubSchema, required: true },
      fitness: { type: DocumentSubSchema, required: true },
      permit: { type: DocumentSubSchema, required: true },
    },
    status: {
      type: String,
      enum: Object.values(VehicleStatus),
      default: VehicleStatus.ACTIVE,
      index: true,
    },
    isDocumentExpired: { type: Boolean, default: false },
    totalTrips: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
  },
  { timestamps: true }
);

VehicleSchema.pre('save', function (next) {
  const now = new Date();
  const docs = (this as any).documents;
  if (docs) {
    const expired =
      (docs.rc && docs.rc.expiryDate < now) ||
      (docs.insurance && docs.insurance.expiryDate < now) ||
      (docs.fitness && docs.fitness.expiryDate < now) ||
      (docs.permit && docs.permit.expiryDate < now);
    (this as any).isDocumentExpired = !!expired;
    if (expired && (this as any).status === VehicleStatus.ACTIVE) {
      (this as any).status = VehicleStatus.DOCUMENTS_EXPIRED;
    }
  }
  next();
});

export const Vehicle = mongoose.model<IVehicle & Document>('Vehicle', VehicleSchema);
