import mongoose, { Document, Schema } from 'mongoose';
import { PayoutStatus } from '../config/constants';

export interface IPayout extends Document {
  payoutId: string;
  driver: mongoose.Types.ObjectId;
  periodStart: Date;
  periodEnd: Date;
  totalTrips: number;
  grossEarnings: number;
  platformCommission: number;
  taxDeductions: number;
  netPayable: number;
  paidAmount: number;
  pendingAmount: number;
  status: PayoutStatus;
  paymentMode: 'BANK_TRANSFER' | 'UPI' | 'CHEQUE' | 'MANUAL';
  bankReferenceNumber?: string;
  processedBy?: mongoose.Types.ObjectId;
  processedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PayoutSchema = new Schema<IPayout>(
  {
    payoutId: { type: String, required: true, unique: true, index: true },
    driver: { type: Schema.Types.ObjectId, ref: 'Driver', required: true, index: true },
    periodStart: { type: Date, required: true },
    periodEnd: { type: Date, required: true },
    totalTrips: { type: Number, default: 0 },
    grossEarnings: { type: Number, required: true },
    platformCommission: { type: Number, required: true },
    taxDeductions: { type: Number, default: 0 },
    netPayable: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    pendingAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(PayoutStatus),
      default: PayoutStatus.PENDING,
      index: true,
    },
    paymentMode: {
      type: String,
      enum: ['BANK_TRANSFER', 'UPI', 'CHEQUE', 'MANUAL'],
      default: 'BANK_TRANSFER',
    },
    bankReferenceNumber: { type: String },
    processedBy: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
    processedAt: { type: Date },
    notes: { type: String },
  },
  { timestamps: true }
);

export const Payout = mongoose.model<IPayout>('Payout', PayoutSchema);
