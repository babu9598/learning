export enum AdminRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  OPERATIONS_ADMIN = 'OPERATIONS_ADMIN',
  FINANCE_ADMIN = 'FINANCE_ADMIN',
  SUPPORT_ADMIN = 'SUPPORT_ADMIN',
  MARKETING_ADMIN = 'MARKETING_ADMIN',
  CUSTOM = 'CUSTOM',
}

export enum Permission {
  // Drivers
  DRIVERS_VIEW = 'drivers:view',
  DRIVERS_CREATE = 'drivers:create',
  DRIVERS_EDIT = 'drivers:edit',
  DRIVERS_DELETE = 'drivers:delete',
  DRIVERS_APPROVE = 'drivers:approve',
  DRIVERS_EXPORT = 'drivers:export',

  // Vehicles
  VEHICLES_VIEW = 'vehicles:view',
  VEHICLES_CREATE = 'vehicles:create',
  VEHICLES_EDIT = 'vehicles:edit',
  VEHICLES_DELETE = 'vehicles:delete',
  VEHICLES_EXPORT = 'vehicles:export',

  // Customers
  CUSTOMERS_VIEW = 'customers:view',
  CUSTOMERS_EDIT = 'customers:edit',
  CUSTOMERS_BLOCK = 'customers:block',
  CUSTOMERS_EXPORT = 'customers:export',

  // Bookings
  BOOKINGS_VIEW = 'bookings:view',
  BOOKINGS_CREATE = 'bookings:create',
  BOOKINGS_EDIT = 'bookings:edit',
  BOOKINGS_CANCEL = 'bookings:cancel',
  BOOKINGS_EXPORT = 'bookings:export',

  // Fares & Pricing
  FARES_VIEW = 'fares:view',
  FARES_MANAGE = 'fares:manage',

  // Coupons
  COUPONS_VIEW = 'coupons:view',
  COUPONS_MANAGE = 'coupons:manage',

  // Finance & Payouts
  FINANCE_VIEW = 'finance:view',
  FINANCE_EXPORT = 'finance:export',
  PAYOUTS_MANAGE = 'payouts:manage',
  COMMISSIONS_MANAGE = 'commissions:manage',

  // Live Fleet Tracking
  TRACKING_VIEW = 'tracking:view',

  // Reports
  REPORTS_VIEW = 'reports:view',
  REPORTS_EXPORT = 'reports:export',

  // Notifications
  NOTIFICATIONS_VIEW = 'notifications:view',
  NOTIFICATIONS_SEND = 'notifications:send',

  // Support
  SUPPORT_VIEW = 'support:view',
  SUPPORT_MANAGE = 'support:manage',

  // Admin Users & Settings
  ADMIN_USERS_MANAGE = 'admin_users:manage',
  SETTINGS_MANAGE = 'settings:manage',
  AUDIT_LOGS_VIEW = 'audit_logs:view',
}

export enum DriverStatus {
  ACTIVE = 'ACTIVE',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  SUSPENDED = 'SUSPENDED',
  BLOCKED = 'BLOCKED',
}

export enum KycStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum DriverDocumentType {
  DRIVING_LICENSE = 'DRIVING_LICENSE',
  RC_BOOK = 'RC_BOOK',
  FITNESS_CERTIFICATE = 'FITNESS_CERTIFICATE',
  INSURANCE = 'INSURANCE',
  AADHAAR_CARD = 'AADHAAR_CARD',
  PAN_CARD = 'PAN_CARD',
  LIVE_PHOTO = 'LIVE_PHOTO',
  POLICE_VERIFICATION = 'POLICE_VERIFICATION',
  ADDRESS_PROOF = 'ADDRESS_PROOF',
}

export const MANDATORY_KYC_DOCUMENTS = [
  DriverDocumentType.DRIVING_LICENSE,
  DriverDocumentType.RC_BOOK,
  DriverDocumentType.FITNESS_CERTIFICATE,
  DriverDocumentType.INSURANCE,
  DriverDocumentType.AADHAAR_CARD,
  DriverDocumentType.PAN_CARD,
  DriverDocumentType.LIVE_PHOTO,
];

export enum OnlineStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  ON_TRIP = 'ON_TRIP',
}

export enum TripScope {
  INTER_STATION = 'INTER_STATION',
  OUTSTATION = 'OUTSTATION',
}

export enum ServiceType {
  DROP_TAXI = 'DROP_TAXI',
  GOODS_TRUCK = 'GOODS_TRUCK',
}

export enum VehicleCategory {
  // Taxi Categories
  TAXI_MINI = 'TAXI_MINI',
  TAXI_SEDAN = 'TAXI_SEDAN',
  TAXI_SUV = 'TAXI_SUV',
  TAXI_INNOVA = 'TAXI_INNOVA',

  // Goods Truck Categories
  TRUCK_MINI_1TON = 'TRUCK_MINI_1TON',
  TRUCK_MEDIUM_3TON = 'TRUCK_MEDIUM_3TON',
  TRUCK_HEAVY_7TON = 'TRUCK_HEAVY_7TON',
}

export enum VehicleStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  UNDER_MAINTENANCE = 'UNDER_MAINTENANCE',
  DOCUMENTS_EXPIRED = 'DOCUMENTS_EXPIRED',
}

export enum BookingType {
  INSTANT = 'INSTANT',
  SCHEDULED = 'SCHEDULED',
}

export enum BookingStatus {
  REQUESTED = 'REQUESTED',
  SEARCHING_DRIVER = 'SEARCHING_DRIVER',
  DRIVER_ASSIGNED = 'DRIVER_ASSIGNED',
  DRIVER_ACCEPTED = 'DRIVER_ACCEPTED',
  DRIVER_ARRIVING = 'DRIVER_ARRIVING',
  DRIVER_ARRIVED = 'DRIVER_ARRIVED',
  TRIP_STARTED = 'TRIP_STARTED',
  TRIP_COMPLETED = 'TRIP_COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentMethod {
  UPI = 'UPI',
  CARD = 'CARD',
  CASH = 'CASH',
  WALLET = 'WALLET',
  GATEWAY = 'GATEWAY',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum PayoutStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  PAID = 'PAID',
  REJECTED = 'REJECTED',
}

export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  WAITING_FOR_USER = 'WAITING_FOR_USER',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum AuditModule {
  AUTH = 'AUTH',
  DRIVERS = 'DRIVERS',
  VEHICLES = 'VEHICLES',
  CUSTOMERS = 'CUSTOMERS',
  BOOKINGS = 'BOOKINGS',
  FARES = 'FARES',
  COUPONS = 'COUPONS',
  FINANCE = 'FINANCE',
  PAYOUTS = 'PAYOUTS',
  NOTIFICATIONS = 'NOTIFICATIONS',
  SUPPORT = 'SUPPORT',
  ADMIN_USERS = 'ADMIN_USERS',
  SETTINGS = 'SETTINGS',
}

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  SUSPEND = 'SUSPEND',
  BLOCK = 'BLOCK',
  UNBLOCK = 'UNBLOCK',
  REFUND = 'REFUND',
  PAYOUT_PROCESSED = 'PAYOUT_PROCESSED',
  STATUS_CHANGE = 'STATUS_CHANGE',
}
