import mongoose, { Document, Schema } from 'mongoose';
import { AdminRole, Permission } from '../config/constants';

export interface IRole extends Document {
  name: string;
  code: AdminRole;
  description: string;
  permissions: Permission[];
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RoleSchema = new Schema<IRole>(
  {
    name: { type: String, required: true, trim: true },
    code: {
      type: String,
      required: true,
      unique: true,
      enum: Object.values(AdminRole),
    },
    description: { type: String, default: '' },
    permissions: [{ type: String, enum: Object.values(Permission) }],
    isSystem: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Role = mongoose.model<IRole>('Role', RoleSchema);
