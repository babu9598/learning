import mongoose, { Document, Schema } from 'mongoose';
import { KycStatus, DriverDocumentType } from '../config/constants';

export interface IDriverDocument extends Document {
  driver: mongoose.Types.ObjectId;
  documentType: DriverDocumentType | string;
  documentNumber: string;
  documentUrl: string;
  documentName?: string;
  status: KycStatus;
  rejectionReason?: string;
  verifiedBy?: mongoose.Types.ObjectId;
  verifiedAt?: Date;
  expiryDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const DriverDocumentSchema = new Schema<IDriverDocument>(
  {
    driver: { type: Schema.Types.ObjectId, ref: 'Driver', required: true, index: true },
    documentType: {
      type: String,
      required: true,
      enum: Object.values(DriverDocumentType),
      index: true,
    },
    documentNumber: { type: String, required: true },
    documentUrl: { type: String, required: true },
    documentName: { type: String },
    status: { type: String, enum: Object.values(KycStatus), default: KycStatus.PENDING, index: true },
    rejectionReason: { type: String },
    verifiedBy: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
    verifiedAt: { type: Date },
    expiryDate: { type: Date },
  },
  { timestamps: true }
);

export const DriverDocument = mongoose.model<IDriverDocument>('DriverDocument', DriverDocumentSchema);
