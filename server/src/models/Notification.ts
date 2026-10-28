import mongoose, { Document, Schema } from 'mongoose';

export interface INotificationTemplate extends Document {
  name: string;
  code: string;
  channel: 'PUSH' | 'SMS' | 'EMAIL' | 'ALL';
  subject?: string;
  content: string;
  variables: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationTemplateSchema = new Schema<INotificationTemplate>(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true, uppercase: true },
    channel: { type: String, enum: ['PUSH', 'SMS', 'EMAIL', 'ALL'], default: 'PUSH' },
    subject: { type: String },
    content: { type: String, required: true },
    variables: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const NotificationTemplate = mongoose.model<INotificationTemplate>(
  'NotificationTemplate',
  NotificationTemplateSchema
);

export interface INotification extends Document {
  title: string;
  message: string;
  channel: 'PUSH' | 'SMS' | 'EMAIL';
  targetAudience: 'ALL' | 'CUSTOMERS' | 'DRIVERS' | 'INDIVIDUAL';
  recipientId?: mongoose.Types.ObjectId;
  recipientModel?: 'Customer' | 'Driver';
  recipientPhone?: string;
  recipientEmail?: string;
  status: 'PENDING' | 'SENT' | 'FAILED';
  metadata?: any;
  sentBy: mongoose.Types.ObjectId;
  sentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    channel: { type: String, enum: ['PUSH', 'SMS', 'EMAIL'], default: 'PUSH' },
    targetAudience: {
      type: String,
      enum: ['ALL', 'CUSTOMERS', 'DRIVERS', 'INDIVIDUAL'],
      default: 'ALL',
      index: true,
    },
    recipientId: { type: Schema.Types.ObjectId, refPath: 'recipientModel' },
    recipientModel: { type: String, enum: ['Customer', 'Driver'] },
    recipientPhone: { type: String },
    recipientEmail: { type: String },
    status: { type: String, enum: ['PENDING', 'SENT', 'FAILED'], default: 'SENT' },
    metadata: { type: Schema.Types.Mixed },
    sentBy: { type: Schema.Types.ObjectId, ref: 'AdminUser', required: true },
    sentAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
