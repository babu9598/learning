import mongoose, { Document, Schema } from 'mongoose';
import { TicketPriority, TicketStatus } from '../config/constants';

export interface ITicketMessage {
  senderType: 'USER' | 'ADMIN';
  senderId: mongoose.Types.ObjectId;
  senderName: string;
  message: string;
  attachments?: string[];
  createdAt: Date;
}

export interface ISupportTicket extends Document {
  ticketId: string;
  userType: 'CUSTOMER' | 'DRIVER';
  customer?: mongoose.Types.ObjectId;
  driver?: mongoose.Types.ObjectId;
  booking?: mongoose.Types.ObjectId;
  category: 'BILLING' | 'TRIP_ISSUE' | 'DRIVER_BEHAVIOR' | 'APP_ISSUE' | 'LOST_ITEM' | 'SAFETY' | 'OTHER';
  priority: TicketPriority;
  subject: string;
  description: string;
  attachments: string[];
  status: TicketStatus;
  assignedAdmin?: mongoose.Types.ObjectId;
  messages: ITicketMessage[];
  resolutionNotes?: string;
  resolvedAt?: Date;
  resolvedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TicketMessageSubSchema = new Schema<ITicketMessage>(
  {
    senderType: { type: String, enum: ['USER', 'ADMIN'], required: true },
    senderId: { type: Schema.Types.ObjectId, required: true },
    senderName: { type: String, required: true },
    message: { type: String, required: true },
    attachments: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const SupportTicketSchema = new Schema<ISupportTicket>(
  {
    ticketId: { type: String, required: true, unique: true, index: true },
    userType: { type: String, enum: ['CUSTOMER', 'DRIVER'], required: true },
    customer: { type: Schema.Types.ObjectId, ref: 'Customer' },
    driver: { type: Schema.Types.ObjectId, ref: 'Driver' },
    booking: { type: Schema.Types.ObjectId, ref: 'Booking' },
    category: {
      type: String,
      enum: ['BILLING', 'TRIP_ISSUE', 'DRIVER_BEHAVIOR', 'APP_ISSUE', 'LOST_ITEM', 'SAFETY', 'OTHER'],
      default: 'TRIP_ISSUE',
    },
    priority: {
      type: String,
      enum: Object.values(TicketPriority),
      default: TicketPriority.MEDIUM,
      index: true,
    },
    subject: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    attachments: [{ type: String }],
    status: {
      type: String,
      enum: Object.values(TicketStatus),
      default: TicketStatus.OPEN,
      index: true,
    },
    assignedAdmin: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
    messages: [TicketMessageSubSchema],
    resolutionNotes: { type: String },
    resolvedAt: { type: Date },
    resolvedBy: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
  },
  { timestamps: true }
);

export const SupportTicket = mongoose.model<ISupportTicket>('SupportTicket', SupportTicketSchema);
