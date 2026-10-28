import mongoose, { Document, Schema } from 'mongoose';

export interface IAppSetting extends Document {
  general: {
    companyName: string;
    tagline: string;
    supportEmail: string;
    supportPhone: string;
    officeAddress: string;
    currency: string;
    currencySymbol: string;
    timezone: string;
  };
  booking: {
    maxSearchRadiusKm: number;
    driverAcceptTimeoutSec: number;
    allowScheduledBookings: boolean;
    scheduledAdvanceBookingHours: number;
    freeCancellationMins: number;
    autoAssignDriver: boolean;
  };
  fare: {
    defaultTaxPercentage: number;
    defaultSurgeMultiplier: number;
    nightChargeEnabled: boolean;
  };
  commission: {
    defaultCommissionPercentage: number;
    defaultTdsPercentage: number;
    minPayoutAmount: number;
    payoutCycleDays: number;
  };
  paymentGateways: {
    razorpayEnabled: boolean;
    razorpayKeyId?: string;
    razorpayKeySecret?: string;
    stripeEnabled: boolean;
    stripePublishableKey?: string;
    stripeSecretKey?: string;
    cashOnDeliveryEnabled: boolean;
    upiEnabled: boolean;
    walletEnabled: boolean;
  };
  maps: {
    provider: 'GOOGLE_MAPS' | 'OPEN_STREET_MAP';
    googleMapsApiKey?: string;
    enableLiveTracking: boolean;
    locationUpdateIntervalSec: number;
  };
  notifications: {
    smsProvider: 'TWILIO' | 'AWS_SNS' | 'MSG91';
    smsApiKey?: string;
    emailProvider: 'SENDGRID' | 'SES' | 'SMTP';
    smtpHost?: string;
    smtpPort?: number;
    smtpUser?: string;
  };
  tax: {
    gstNumber?: string;
    panNumber?: string;
    gstRate: number;
    tdsRate: number;
  };
  security: {
    sessionTimeoutMins: number;
    maxLoginAttempts: number;
    lockoutDurationMins: number;
    requireTwoFactor: boolean;
  };
  updatedAt: Date;
}

const AppSettingSchema = new Schema<IAppSetting>(
  {
    general: {
      companyName: { type: String, default: 'DropTaxi & Freight Logistics' },
      tagline: { type: String, default: 'Smart Intercity Taxis & Rapid Goods Transport' },
      supportEmail: { type: String, default: 'support@droptaxi-goods.com' },
      supportPhone: { type: String, default: '+91 98765 43210' },
      officeAddress: { type: String, default: 'Anna Salai, Guindy, Chennai, TN 600032' },
      currency: { type: String, default: 'INR' },
      currencySymbol: { type: String, default: '₹' },
      timezone: { type: String, default: 'Asia/Kolkata' },
    },
    booking: {
      maxSearchRadiusKm: { type: Number, default: 15 },
      driverAcceptTimeoutSec: { type: Number, default: 45 },
      allowScheduledBookings: { type: Boolean, default: true },
      scheduledAdvanceBookingHours: { type: Number, default: 48 },
      freeCancellationMins: { type: Number, default: 5 },
      autoAssignDriver: { type: Boolean, default: true },
    },
    fare: {
      defaultTaxPercentage: { type: Number, default: 5 },
      defaultSurgeMultiplier: { type: Number, default: 1.0 },
      nightChargeEnabled: { type: Boolean, default: true },
    },
    commission: {
      defaultCommissionPercentage: { type: Number, default: 20 },
      defaultTdsPercentage: { type: Number, default: 1 },
      minPayoutAmount: { type: Number, default: 1000 },
      payoutCycleDays: { type: Number, default: 7 },
    },
    paymentGateways: {
      razorpayEnabled: { type: Boolean, default: true },
      razorpayKeyId: { type: String, default: 'rzp_test_123456789' },
      razorpayKeySecret: { type: String, default: 'rzp_secret_987654321' },
      stripeEnabled: { type: Boolean, default: false },
      stripePublishableKey: { type: String, default: '' },
      stripeSecretKey: { type: String, default: '' },
      cashOnDeliveryEnabled: { type: Boolean, default: true },
      upiEnabled: { type: Boolean, default: true },
      walletEnabled: { type: Boolean, default: true },
    },
    maps: {
      provider: { type: String, enum: ['GOOGLE_MAPS', 'OPEN_STREET_MAP'], default: 'OPEN_STREET_MAP' },
      googleMapsApiKey: { type: String, default: '' },
      enableLiveTracking: { type: Boolean, default: true },
      locationUpdateIntervalSec: { type: Number, default: 5 },
    },
    notifications: {
      smsProvider: { type: String, enum: ['TWILIO', 'AWS_SNS', 'MSG91'], default: 'MSG91' },
      smsApiKey: { type: String, default: '' },
      emailProvider: { type: String, enum: ['SENDGRID', 'SES', 'SMTP'], default: 'SENDGRID' },
      smtpHost: { type: String, default: '' },
      smtpPort: { type: Number, default: 587 },
      smtpUser: { type: String, default: '' },
    },
    tax: {
      gstNumber: { type: String, default: '33AAAAA0000A1Z5' },
      panNumber: { type: String, default: 'AAAAA0000A' },
      gstRate: { type: Number, default: 5 },
      tdsRate: { type: Number, default: 1 },
    },
    security: {
      sessionTimeoutMins: { type: Number, default: 120 },
      maxLoginAttempts: { type: Number, default: 5 },
      lockoutDurationMins: { type: Number, default: 15 },
      requireTwoFactor: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

export const AppSetting = mongoose.model<IAppSetting>('AppSetting', AppSettingSchema);
