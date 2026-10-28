import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAdminUser extends Document {
  name: string;
  email: string;
  password?: string;
  mobile: string;
  role: mongoose.Types.ObjectId;
  avatar?: string;
  isActive: boolean;
  lastLogin?: Date;
  customPermissions?: string[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const AdminUserSchema = new Schema<IAdminUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true, select: false },
    mobile: { type: String, required: true, trim: true },
    role: { type: Schema.Types.ObjectId, ref: 'Role', required: true },
    avatar: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
    customPermissions: [{ type: String }],
  },
  { timestamps: true }
);

AdminUserSchema.pre<IAdminUser>('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err: any) {
    next(err);
  }
});

AdminUserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

export const AdminUser = mongoose.model<IAdminUser>('AdminUser', AdminUserSchema);
