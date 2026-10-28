import mongoose, { Document, Schema } from 'mongoose';

export interface ICustomer extends Document {
  customerId: string;
  name: string;
  email: string;
  mobile: string;
  avatar?: string;
  walletBalance: number;
  totalTrips: number;
  totalSpent: number;
  rating: number;
  status: 'ACTIVE' | 'BLOCKED';
  registeredDate: Date;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema = new Schema<ICustomer>(
  {
    customerId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    mobile: { type: String, required: true, unique: true, trim: true, index: true },
    avatar: { type: String, default: '' },
    walletBalance: { type: Number, default: 0 },
    totalTrips: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    rating: { type: Number, default: 5.0 },
    status: { type: String, enum: ['ACTIVE', 'BLOCKED'], default: 'ACTIVE', index: true },
    registeredDate: { type: Date, default: Date.now },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
    },
  },
  { timestamps: true }
);

export const Customer = mongoose.model<ICustomer>('Customer', CustomerSchema);
