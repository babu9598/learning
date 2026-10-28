import mongoose, { Document, Schema } from 'mongoose';
import { PaymentMethod, PaymentStatus } from '../config/constants';

export interface IPayment extends Document {
  transactionId: string;
  booking: mongoose.Types.ObjectId;
  customer: mongoose.Types.ObjectId;
  driver?: mongoose.Types.ObjectId;
  amount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  gatewayTransactionId?: string;
  gatewayResponse?: any;
  refundDetails?: {
    refundId?: string;
    refundAmount?: number;
    refundReason?: string;
    refundedAt?: Date;
    refundedBy?: mongoose.Types.ObjectId;
  };
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    transactionId: { type: String, required: true, unique: true, index: true },
    booking: { type: Schema.Types.ObjectId, ref: 'Booking', required: true, index: true },
    customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
    driver: { type: Schema.Types.ObjectId, ref: 'Driver', index: true },
    amount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
      index: true,
    },
    gatewayTransactionId: { type: String },
    gatewayResponse: { type: Schema.Types.Mixed },
    refundDetails: {
      refundId: String,
      refundAmount: Number,
      refundReason: String,
      refundedAt: Date,
      refundedBy: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
    },
    paidAt: { type: Date },
  },
  { timestamps: true }
);

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);
