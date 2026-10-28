import mongoose, { Document, Schema } from 'mongoose';
import { AuditAction, AuditModule } from '../config/constants';

export interface IAuditLog extends Document {
  adminUser?: mongoose.Types.ObjectId;
  adminName: string;
  adminEmail: string;
  module: AuditModule;
  action: AuditAction;
  recordId?: string;
  targetModel?: string;
  previousValue?: any;
  newValue?: any;
  ipAddress?: string;
  userAgent?: string;
  description?: string;
  timestamp: Date;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    adminUser: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
    adminName: { type: String, required: true },
    adminEmail: { type: String, required: true },
    module: {
      type: String,
      enum: Object.values(AuditModule),
      required: true,
      index: true,
    },
    action: {
      type: String,
      enum: Object.values(AuditAction),
      required: true,
      index: true,
    },
    recordId: { type: String },
    targetModel: { type: String },
    previousValue: { type: Schema.Types.Mixed },
    newValue: { type: Schema.Types.Mixed },
    ipAddress: { type: String, default: '127.0.0.1' },
    userAgent: { type: String },
    description: { type: String },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
