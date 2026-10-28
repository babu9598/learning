export type ServiceType = 'DROP_TAXI' | 'GOODS_TRUCK';

export type TripScope = 'INTER_STATION' | 'OUTSTATION';

export type VehicleCategory =
  | 'TAXI_MINI'
  | 'TAXI_SEDAN'
  | 'TAXI_SUV'
  | 'TAXI_INNOVA'
  | 'TRUCK_MINI_1TON'
  | 'TRUCK_MEDIUM_3TON'
  | 'TRUCK_HEAVY_7TON';

export type DriverStatus = 'ACTIVE' | 'PENDING_APPROVAL' | 'SUSPENDED' | 'BLOCKED';
export type KycStatus = 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
export type OnlineStatus = 'ONLINE' | 'OFFLINE' | 'ON_TRIP';

export type VehicleStatus = 'ACTIVE' | 'INACTIVE' | 'UNDER_MAINTENANCE' | 'DOCUMENTS_EXPIRED';

export type BookingStatus =
  | 'REQUESTED'
  | 'SEARCHING_DRIVER'
  | 'DRIVER_ASSIGNED'
  | 'DRIVER_ACCEPTED'
  | 'DRIVER_ARRIVING'
  | 'DRIVER_ARRIVED'
  | 'TRIP_STARTED'
  | 'TRIP_COMPLETED'
  | 'CANCELLED';

export type PaymentMethod = 'UPI' | 'CARD' | 'CASH' | 'WALLET' | 'GATEWAY';
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
export type PayoutStatus = 'PENDING' | 'PROCESSING' | 'PAID' | 'REJECTED';
export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'WAITING_FOR_USER' | 'RESOLVED' | 'CLOSED';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface AdminRoleInfo {
  _id: string;
  name: string;
  code: string;
  description: string;
  permissions: string[];
  isSystem: boolean;
}

export interface AdminUser {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  mobile: string;
  role: AdminRoleInfo;
  avatar?: string;
  isActive: boolean;
  lastLogin?: string;
  customPermissions?: string[];
}

export interface Customer {
  _id: string;
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
  registeredDate: string;
  createdAt: string;
}

export interface VehicleTypePricing {
  baseFare: number;
  baseDistanceKm: number;
  perKmRate: number;
  minimumFare: number;
  driverBata: number;
  estimatedTollPerKm: number;
  perMinuteRate?: number;
  waitingChargePerMin?: number;
}

export interface VehicleType {
  _id: string;
  typeId: string;
  name: string;
  code: string;
  serviceType: 'DROP_TAXI' | 'GOODS_TRUCK';
  wheelCount: number;
  wheelType: string;
  capacity: {
    passengers?: number;
    luggageBags?: number;
    weightTons?: number;
    dimensions?: string;
  };
  modelsExample?: string;
  features?: string[];
  badge?: string;
  imageUrl?: string;
  pricing?: {
    interStation?: VehicleTypePricing;
    outstation?: VehicleTypePricing;
  };
  isActive: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Vehicle {
  _id: string;
  vehicleId: string;
  vehicleNumber: string;
  category: VehicleCategory;
  serviceType: ServiceType;
  brand: string;
  model: string;
  year: number;
  capacity: {
    passengers?: number;
    weightTons?: number;
    volumeCubicFt?: number;
  };
  fuelType: string;
  assignedDriver?: {
    _id: string;
    driverId: string;
    name: string;
    mobile: string;
  };
  documents: {
    rc: { docNumber: string; expiryDate: string; status: string; docUrl: string };
    insurance: { docNumber: string; expiryDate: string; status: string; docUrl: string };
    fitness: { docNumber: string; expiryDate: string; status: string; docUrl: string };
    permit: { docNumber: string; expiryDate: string; status: string; docUrl: string };
  };
  status: VehicleStatus;
  isDocumentExpired: boolean;
  totalTrips: number;
  totalRevenue: number;
  createdAt: string;
}

export interface Driver {
  _id: string;
  driverId: string;
  name: string;
  email: string;
  mobile: string;
  avatar?: string;
  serviceType: ServiceType;
  status: DriverStatus;
  kycStatus: KycStatus;
  onlineStatus: OnlineStatus;
  assignedVehicle?: Vehicle;
  currentLocation: {
    coordinates: [number, number]; // [lng, lat]
    heading?: number;
    speed?: number;
    address?: string;
    lastUpdated?: string;
  };
  rating: number;
  totalTrips: number;
  acceptanceRate: number;
  cancellationRate: number;
  totalEarnings: number;
  payableBalance: number;
  bankDetails?: {
    accountNumber?: string;
    ifscCode?: string;
    bankName?: string;
    holderName?: string;
    upiId?: string;
  };
  createdAt: string;
}

export type KycDocumentType =
  | 'DRIVING_LICENSE'
  | 'RC_BOOK'
  | 'FITNESS_CERTIFICATE'
  | 'INSURANCE'
  | 'AADHAAR_CARD'
  | 'PAN_CARD'
  | 'LIVE_PHOTO'
  | 'POLICE_VERIFICATION'
  | 'ADDRESS_PROOF';

export interface DriverDocument {
  _id: string;
  driver: string;
  documentType: KycDocumentType | string;
  documentNumber: string;
  documentUrl: string;
  documentName?: string;
  status: KycStatus;
  rejectionReason?: string;
  expiryDate?: string;
  verifiedAt?: string;
}

export interface LocationPoint {
  address: string;
  lat: number;
  lng: number;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface FareBreakdown {
  baseFare: number;
  distanceFare: number;
  timeFare: number;
  waitingCharge: number;
  nightCharge: number;
  surgeCharge: number;
  extraStopCharge: number;
  subtotal: number;
  discount: number;
  tax: number;
  tollFee: number;
  driverBata: number;
  isFinalCalculated?: boolean;
  actualTollEnteredByDriver?: boolean;
  driverBataEnteredByDriver?: boolean;
  finalFare: number;
  currency: string;
}

export interface Booking {
  _id: string;
  bookingId: string;
  customer: Customer;
  driver?: Driver;
  vehicle?: Vehicle;
  serviceType: ServiceType;
  vehicleCategory: VehicleCategory;
  tripScope?: TripScope;
  bookingType: 'INSTANT' | 'SCHEDULED';
  scheduledTime?: string;
  pickupLocation: LocationPoint;
  dropLocation: LocationPoint;
  extraStops: LocationPoint[];
  distanceKm: number;
  estimatedDurationMins: number;
  fareBreakdown: FareBreakdown;
  appliedCoupon?: {
    code: string;
    discountAmount: number;
  };
  commissionDetails?: {
    ratePercent: number;
    platformCommission: number;
    driverEarnings: number;
    taxDeducted: number;
  };
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: BookingStatus;
  cancellation?: {
    cancelledBy: string;
    reason: string;
    cancelledAt: string;
    cancellationFee: number;
  };
  timeline: {
    status: BookingStatus;
    timestamp: string;
    note?: string;
  }[];
  goodsDetails?: {
    itemType?: string;
    approxWeightKg?: number;
    receiverName?: string;
    receiverMobile?: string;
    notes?: string;
  };
  createdAt: string;
}

export interface IIncentiveTier {
  targetBookings: number;
  rewardAmount: number;
}

export interface FareRule {
  _id: string;
  category: VehicleCategory | string;
  serviceType: ServiceType;
  tripScope?: TripScope;
  title: string;
  baseFare: number;
  baseDistanceKm: number;
  perKmRate: number;
  driverBata: number;
  estimatedTollPerKm?: number;
  perMinuteRate: number;
  minimumFare: number;
  waitingChargePerMin: number;
  freeWaitingMins: number;
  nightChargeMultiplier: number;
  nightStartTime?: string;
  nightEndTime?: string;
  cancellationFee: number;
  cancellationPercentage: number;
  customerCancellationTimeHours: number;
  driverCancellationTimeHours: number;
  driverDailyMaxCancellations: number;
  driverCommissionPercentage: number;
  bookingRadiusKm: number;
  walletMinAmount: number;
  incentives?: {
    daily?: IIncentiveTier[];
    weekly?: IIncentiveTier[];
    monthly?: IIncentiveTier[];
  };
  extraStopCharge: number;
  taxPercentage: number;
  isActive: boolean;
}

export interface SurgeRule {
  _id: string;
  zoneName: string;
  multiplier: number;
  reason: 'DEMAND' | 'WEATHER' | 'PEAK_HOURS' | 'FESTIVAL' | 'CUSTOM';
  startTime?: string;
  endTime?: string;
  isActive: boolean;
  affectedCategories: string[];
}

export interface Coupon {
  _id: string;
  code: string;
  title: string;
  description?: string;
  discountType: 'PERCENTAGE' | 'FLAT';
  discountValue: number;
  maxDiscountAmount: number;
  minBookingAmount: number;
  applicableCategories: VehicleCategory[];
  usageLimit: number;
  perCustomerLimit: number;
  currentUses: number;
  totalDiscountGiven: number;
  revenueGenerated: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface PaymentTransaction {
  _id: string;
  transactionId: string;
  booking: Booking;
  customer: Customer;
  driver?: Driver;
  amount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  paidAt?: string;
  createdAt: string;
}

export interface PayoutRecord {
  _id: string;
  payoutId: string;
  driver: Driver;
  periodStart: string;
  periodEnd: string;
  totalTrips: number;
  grossEarnings: number;
  platformCommission: number;
  taxDeductions: number;
  netPayable: number;
  paidAmount: number;
  pendingAmount: number;
  status: PayoutStatus;
  paymentMode: string;
  bankReferenceNumber?: string;
  processedBy?: { name: string; email: string };
  processedAt?: string;
  createdAt: string;
}

export interface SupportTicket {
  _id: string;
  ticketId: string;
  userType: 'CUSTOMER' | 'DRIVER';
  customer?: Customer;
  driver?: Driver;
  booking?: Booking;
  category: string;
  priority: TicketPriority;
  subject: string;
  description: string;
  status: TicketStatus;
  assignedAdmin?: { name: string; email: string };
  messages: {
    senderType: 'USER' | 'ADMIN';
    senderName: string;
    message: string;
    createdAt: string;
  }[];
  resolutionNotes?: string;
  createdAt: string;
}

export interface AuditLogItem {
  _id: string;
  adminName: string;
  adminEmail: string;
  module: string;
  action: string;
  recordId?: string;
  description?: string;
  previousValue?: any;
  newValue?: any;
  ipAddress?: string;
  timestamp: string;
}

export interface DashboardKPIs {
  totalCustomers: number;
  totalDrivers: number;
  activeDrivers: number;
  onlineDrivers: number;
  totalVehicles: number;
  todayBookings: number;
  ongoingTrips: number;
  completedTrips: number;
  cancelledTrips: number;
  todayRevenue: number;
  todayDriverEarnings: number;
  todayPlatformCommission: number;
  totalGrossRevenue: number;
  totalPlatformCommission: number;
  totalDriverEarnings: number;
  pendingPayoutsAmount: number;
  pendingPayoutsCount: number;
}
