import mongoose from 'mongoose';
import { connectDB } from '../config/db';
import { AdminRole, Permission, DriverStatus, KycStatus, OnlineStatus, ServiceType, TripScope, VehicleCategory, VehicleStatus, BookingStatus, BookingType, PaymentMethod, PaymentStatus, PayoutStatus, TicketPriority, TicketStatus, AuditAction, AuditModule } from '../config/constants';
import { Role } from '../models/Role';
import { AdminUser } from '../models/AdminUser';
import { FareRule } from '../models/FareRule';
import { SurgeRule } from '../models/SurgeRule';
import { Coupon } from '../models/Coupon';
import { Customer } from '../models/Customer';
import { Vehicle } from '../models/Vehicle';
import { Driver } from '../models/Driver';
import { DriverDocument } from '../models/DriverDocument';
import { Booking } from '../models/Booking';
import { Trip } from '../models/Trip';
import { Payment } from '../models/Payment';
import { DriverEarning, CommissionRule } from '../models/Commission';
import { Payout } from '../models/Payout';
import { SupportTicket } from '../models/SupportTicket';
import { Notification, NotificationTemplate } from '../models/Notification';
import { AuditLog } from '../models/AuditLog';
import { AppSetting } from '../models/AppSetting';
import { logger } from '../utils/logger';

const runSeed = async () => {
  try {
    await connectDB();
    logger.info('Connected to MongoDB. Starting database seeding...');

    // Clear existing data
    await Promise.all([
      Role.deleteMany({}),
      AdminUser.deleteMany({}),
      FareRule.deleteMany({}),
      SurgeRule.deleteMany({}),
      Coupon.deleteMany({}),
      Customer.deleteMany({}),
      Vehicle.deleteMany({}),
      Driver.deleteMany({}),
      DriverDocument.deleteMany({}),
      Booking.deleteMany({}),
      Trip.deleteMany({}),
      Payment.deleteMany({}),
      DriverEarning.deleteMany({}),
      CommissionRule.deleteMany({}),
      Payout.deleteMany({}),
      SupportTicket.deleteMany({}),
      Notification.deleteMany({}),
      NotificationTemplate.deleteMany({}),
      AuditLog.deleteMany({}),
      AppSetting.deleteMany({}),
    ]);
    logger.info('Cleared old database records.');

    // 1. Seed Roles
    const allPermissions = Object.values(Permission);
    const superAdminRole = await Role.create({
      name: 'Super Admin',
      code: AdminRole.SUPER_ADMIN,
      description: 'Full unrestricted system access across all business modules',
      permissions: allPermissions,
      isSystem: true,
    });

    const operationsRole = await Role.create({
      name: 'Operations Admin',
      code: AdminRole.OPERATIONS_ADMIN,
      description: 'Fleet, drivers, vehicles, live tracking and booking dispatch management',
      permissions: [
        Permission.DRIVERS_VIEW,
        Permission.DRIVERS_CREATE,
        Permission.DRIVERS_EDIT,
        Permission.DRIVERS_APPROVE,
        Permission.DRIVERS_EXPORT,
        Permission.VEHICLES_VIEW,
        Permission.VEHICLES_CREATE,
        Permission.VEHICLES_EDIT,
        Permission.VEHICLES_EXPORT,
        Permission.BOOKINGS_VIEW,
        Permission.BOOKINGS_CREATE,
        Permission.BOOKINGS_EDIT,
        Permission.BOOKINGS_CANCEL,
        Permission.BOOKINGS_EXPORT,
        Permission.TRACKING_VIEW,
        Permission.REPORTS_VIEW,
      ],
      isSystem: true,
    });

    const financeRole = await Role.create({
      name: 'Finance Admin',
      code: AdminRole.FINANCE_ADMIN,
      description: 'Payments, commissions, driver payouts and financial analytics',
      permissions: [
        Permission.FINANCE_VIEW,
        Permission.FINANCE_EXPORT,
        Permission.PAYOUTS_MANAGE,
        Permission.COMMISSIONS_MANAGE,
        Permission.FARES_VIEW,
        Permission.BOOKINGS_VIEW,
        Permission.REPORTS_VIEW,
        Permission.REPORTS_EXPORT,
      ],
      isSystem: true,
    });

    const supportRole = await Role.create({
      name: 'Support Admin',
      code: AdminRole.SUPPORT_ADMIN,
      description: 'Customer inquiries, driver grievances, tickets and issue resolution',
      permissions: [
        Permission.CUSTOMERS_VIEW,
        Permission.CUSTOMERS_EDIT,
        Permission.CUSTOMERS_BLOCK,
        Permission.SUPPORT_VIEW,
        Permission.SUPPORT_MANAGE,
        Permission.BOOKINGS_VIEW,
        Permission.DRIVERS_VIEW,
      ],
      isSystem: true,
    });

    const marketingRole = await Role.create({
      name: 'Marketing Admin',
      code: AdminRole.MARKETING_ADMIN,
      description: 'Coupons, promotions, marketing campaigns and broadcast notifications',
      permissions: [
        Permission.COUPONS_VIEW,
        Permission.COUPONS_MANAGE,
        Permission.NOTIFICATIONS_VIEW,
        Permission.NOTIFICATIONS_SEND,
        Permission.CUSTOMERS_VIEW,
        Permission.REPORTS_VIEW,
      ],
      isSystem: true,
    });

    logger.info('Seeded RBAC Roles.');

    // 2. Seed Admin Users
    const defaultPassword = 'adminPassword123!';
    const superAdmin = await AdminUser.create({
      name: 'Raghavan Iyer',
      email: 'superadmin@droptaxi.com',
      password: defaultPassword,
      mobile: '+91 98401 23456',
      role: superAdminRole._id,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isActive: true,
    });

    await AdminUser.create([
      {
        name: 'Karthik Raja',
        email: 'operations@droptaxi.com',
        password: defaultPassword,
        mobile: '+91 98402 34567',
        role: operationsRole._id,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        isActive: true,
      },
      {
        name: 'Pooja Sundaram',
        email: 'finance@droptaxi.com',
        password: defaultPassword,
        mobile: '+91 98403 45678',
        role: financeRole._id,
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        isActive: true,
      },
      {
        name: 'Deepak Sharma',
        email: 'support@droptaxi.com',
        password: defaultPassword,
        mobile: '+91 98404 56789',
        role: supportRole._id,
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        isActive: true,
      },
      {
        name: 'Ananya Menon',
        email: 'marketing@droptaxi.com',
        password: defaultPassword,
        mobile: '+91 98405 67890',
        role: marketingRole._id,
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        isActive: true,
      },
    ]);
    logger.info('Seeded Admin Users for each role.');

    // 3. Seed Fare Rules (Drop Taxi + Goods Truck for Inter-Station & Outstation)
    try {
      await FareRule.collection.dropIndex('category_1');
    } catch (e) {
      // index might not exist
    }

    await FareRule.create([
      // ==================== DROP TAXI - INTER-STATION (Local / City - NO Driver Bata) ====================
      {
        category: VehicleCategory.TAXI_SEDAN,
        serviceType: ServiceType.DROP_TAXI,
        tripScope: TripScope.INTER_STATION,
        title: 'Sedan Cab (City Local Drop)',
        baseFare: 150,
        baseDistanceKm: 3,
        perKmRate: 15,
        driverBata: 0, // Inter-station strictly NO driver bata
        estimatedTollPerKm: 0,
        perMinuteRate: 1.5,
        minimumFare: 150,
        waitingChargePerMin: 2.5,
        nightChargeMultiplier: 1.2,
        cancellationFee: 50,
        taxPercentage: 5,
        isActive: true,
      },
      {
        category: VehicleCategory.TAXI_SUV,
        serviceType: ServiceType.DROP_TAXI,
        tripScope: TripScope.INTER_STATION,
        title: 'SUV Cab (City Local Drop)',
        baseFare: 220,
        baseDistanceKm: 4,
        perKmRate: 20,
        driverBata: 0, // Inter-station strictly NO driver bata
        estimatedTollPerKm: 0,
        perMinuteRate: 2.0,
        minimumFare: 220,
        waitingChargePerMin: 3.5,
        nightChargeMultiplier: 1.25,
        cancellationFee: 80,
        taxPercentage: 5,
        isActive: true,
      },
      {
        category: VehicleCategory.TAXI_INNOVA,
        serviceType: ServiceType.DROP_TAXI,
        tripScope: TripScope.INTER_STATION,
        title: 'Premium Innova (City Local Drop)',
        baseFare: 300,
        baseDistanceKm: 4,
        perKmRate: 25,
        driverBata: 0, // Inter-station strictly NO driver bata
        estimatedTollPerKm: 0,
        perMinuteRate: 2.5,
        minimumFare: 300,
        waitingChargePerMin: 4.5,
        nightChargeMultiplier: 1.3,
        cancellationFee: 120,
        taxPercentage: 5,
        isActive: true,
      },

      // ==================== DROP TAXI - OUTSTATION (Intercity One-Way Drop) ====================
      {
        category: VehicleCategory.TAXI_SEDAN,
        serviceType: ServiceType.DROP_TAXI,
        tripScope: TripScope.OUTSTATION,
        title: 'Sedan Cab (Outstation One-Way Drop)',
        baseFare: 200,
        baseDistanceKm: 3,
        perKmRate: 13,
        driverBata: 350, // Outstation driver bata allowance
        estimatedTollPerKm: 1.35, // Dynamic highway FASTag estimate
        perMinuteRate: 1.5,
        minimumFare: 200,
        waitingChargePerMin: 2.5,
        nightChargeMultiplier: 1.25,
        cancellationFee: 60,
        taxPercentage: 5,
        isActive: true,
      },
      {
        category: VehicleCategory.TAXI_SUV,
        serviceType: ServiceType.DROP_TAXI,
        tripScope: TripScope.OUTSTATION,
        title: 'SUV Cab (Outstation Family Drop)',
        baseFare: 350,
        baseDistanceKm: 4,
        perKmRate: 18,
        driverBata: 450, // Outstation driver bata allowance
        estimatedTollPerKm: 1.35,
        perMinuteRate: 2.0,
        minimumFare: 350,
        waitingChargePerMin: 3.5,
        nightChargeMultiplier: 1.25,
        cancellationFee: 100,
        taxPercentage: 5,
        isActive: true,
      },
      {
        category: VehicleCategory.TAXI_INNOVA,
        serviceType: ServiceType.DROP_TAXI,
        tripScope: TripScope.OUTSTATION,
        title: 'Premium Innova (Outstation VIP Drop)',
        baseFare: 450,
        baseDistanceKm: 4,
        perKmRate: 22,
        driverBata: 550, // Outstation driver bata allowance
        estimatedTollPerKm: 1.35,
        perMinuteRate: 2.5,
        minimumFare: 450,
        waitingChargePerMin: 4.0,
        nightChargeMultiplier: 1.3,
        cancellationFee: 150,
        taxPercentage: 5,
        isActive: true,
      },

      // ==================== GOODS TRUCK - INTER-STATION (Intracity Freight - NO Driver Bata) ====================
      {
        category: VehicleCategory.TRUCK_MINI_1TON,
        serviceType: ServiceType.GOODS_TRUCK,
        tripScope: TripScope.INTER_STATION,
        title: 'Tata Ace (City Local Freight)',
        baseFare: 250,
        baseDistanceKm: 3,
        perKmRate: 22,
        driverBata: 0, // Inter-station strictly NO driver bata
        estimatedTollPerKm: 0,
        perMinuteRate: 2.5,
        minimumFare: 250,
        waitingChargePerMin: 4.0,
        nightChargeMultiplier: 1.2,
        cancellationFee: 100,
        taxPercentage: 5,
        isActive: true,
      },
      {
        category: VehicleCategory.TRUCK_MEDIUM_3TON,
        serviceType: ServiceType.GOODS_TRUCK,
        tripScope: TripScope.INTER_STATION,
        title: 'Pickup 8ft / Bolero Maxi (City Local Freight)',
        baseFare: 400,
        baseDistanceKm: 4,
        perKmRate: 28,
        driverBata: 0, // Inter-station strictly NO driver bata
        estimatedTollPerKm: 0,
        perMinuteRate: 3.0,
        minimumFare: 400,
        waitingChargePerMin: 6.0,
        nightChargeMultiplier: 1.25,
        cancellationFee: 150,
        taxPercentage: 5,
        isActive: true,
      },
      {
        category: VehicleCategory.TRUCK_HEAVY_7TON,
        serviceType: ServiceType.GOODS_TRUCK,
        tripScope: TripScope.INTER_STATION,
        title: 'Tata 407 (10-14ft City Freight)',
        baseFare: 650,
        baseDistanceKm: 5,
        perKmRate: 38,
        driverBata: 0, // Inter-station strictly NO driver bata
        estimatedTollPerKm: 0,
        perMinuteRate: 4.0,
        minimumFare: 650,
        waitingChargePerMin: 8.0,
        nightChargeMultiplier: 1.25,
        cancellationFee: 250,
        taxPercentage: 5,
        isActive: true,
      },

      // ==================== GOODS TRUCK - OUTSTATION (Intercity Freight Logistics) ====================
      {
        category: VehicleCategory.TRUCK_MINI_1TON,
        serviceType: ServiceType.GOODS_TRUCK,
        tripScope: TripScope.OUTSTATION,
        title: 'Tata Ace (Outstation Cargo)',
        baseFare: 450,
        baseDistanceKm: 5,
        perKmRate: 18,
        driverBata: 400, // Outstation freight driver bata
        estimatedTollPerKm: 2.2, // Highway commercial toll
        perMinuteRate: 2.5,
        minimumFare: 450,
        waitingChargePerMin: 4.0,
        nightChargeMultiplier: 1.2,
        cancellationFee: 150,
        taxPercentage: 5,
        isActive: true,
      },
      {
        category: VehicleCategory.TRUCK_MEDIUM_3TON,
        serviceType: ServiceType.GOODS_TRUCK,
        tripScope: TripScope.OUTSTATION,
        title: 'Pickup 8ft / Bolero Maxi (Outstation Cargo)',
        baseFare: 700,
        baseDistanceKm: 5,
        perKmRate: 25,
        driverBata: 500, // Outstation freight driver bata
        estimatedTollPerKm: 2.5,
        perMinuteRate: 3.5,
        minimumFare: 700,
        waitingChargePerMin: 6.0,
        nightChargeMultiplier: 1.25,
        cancellationFee: 200,
        taxPercentage: 5,
        isActive: true,
      },
      {
        category: VehicleCategory.TRUCK_HEAVY_7TON,
        serviceType: ServiceType.GOODS_TRUCK,
        tripScope: TripScope.OUTSTATION,
        title: 'Tata 407 (Outstation Logistics)',
        baseFare: 1200,
        baseDistanceKm: 8,
        perKmRate: 32,
        driverBata: 600, // Outstation freight driver bata
        estimatedTollPerKm: 3.0,
        perMinuteRate: 4.0,
        minimumFare: 1200,
        waitingChargePerMin: 8.0,
        nightChargeMultiplier: 1.3,
        cancellationFee: 400,
        taxPercentage: 5,
        isActive: true,
      },
    ]);
    logger.info('Seeded Inter-Station & Outstation Fare Rules with Zero Bata for Inter-Station.');

    // 4. Seed Surge Rules
    await SurgeRule.create([
      {
        zoneName: 'Chennai Airport & Guindy Tech Hub',
        multiplier: 1.35,
        reason: 'DEMAND',
        isActive: true,
        affectedCategories: [VehicleCategory.TAXI_SEDAN, VehicleCategory.TAXI_SUV],
      },
      {
        zoneName: 'Ambattur & Sriperumbudur Industrial Corridor',
        multiplier: 1.25,
        reason: 'DEMAND',
        isActive: true,
        affectedCategories: [VehicleCategory.TRUCK_MINI_1TON, VehicleCategory.TRUCK_MEDIUM_3TON],
      },
      {
        zoneName: 'Monsoon Heavy Rain Alert - Coastal Belt',
        multiplier: 1.5,
        reason: 'WEATHER',
        isActive: false,
        affectedCategories: [],
      },
    ]);

    // 5. Seed Coupons
    const now = new Date();
    const nextMonth = new Date();
    nextMonth.setDate(nextMonth.getDate() + 30);
    const lastMonth = new Date();
    lastMonth.setDate(lastMonth.getDate() - 30);

    await Coupon.create([
      {
        code: 'WELCOME50',
        title: 'Welcome 50% Off',
        description: 'Get 50% discount up to ₹150 on your first intercity ride or goods booking',
        discountType: 'PERCENTAGE',
        discountValue: 50,
        maxDiscountAmount: 150,
        minBookingAmount: 300,
        usageLimit: 5000,
        perCustomerLimit: 1,
        currentUses: 342,
        totalDiscountGiven: 48900,
        revenueGenerated: 245000,
        startDate: lastMonth,
        endDate: nextMonth,
        isActive: true,
      },
      {
        code: 'TRUCK100',
        title: '₹100 Flat Goods Freight Discount',
        description: 'Save flat ₹100 on all freight goods truck bookings above ₹800',
        discountType: 'FLAT',
        discountValue: 100,
        maxDiscountAmount: 100,
        minBookingAmount: 800,
        applicableCategories: [VehicleCategory.TRUCK_MINI_1TON, VehicleCategory.TRUCK_MEDIUM_3TON],
        usageLimit: 1000,
        perCustomerLimit: 2,
        currentUses: 128,
        totalDiscountGiven: 12800,
        revenueGenerated: 165000,
        startDate: lastMonth,
        endDate: nextMonth,
        isActive: true,
      },
      {
        code: 'FESTIVE20',
        title: 'Festive Season 20% Off',
        description: 'Celebrate the festive season with 20% off up to ₹300',
        discountType: 'PERCENTAGE',
        discountValue: 20,
        maxDiscountAmount: 300,
        minBookingAmount: 500,
        usageLimit: 2000,
        perCustomerLimit: 3,
        currentUses: 412,
        totalDiscountGiven: 68400,
        revenueGenerated: 490000,
        startDate: lastMonth,
        endDate: nextMonth,
        isActive: true,
      },
    ]);

    // 6. Seed Commission Rule
    await CommissionRule.create({
      ruleType: 'GLOBAL',
      commissionPercentage: 20,
      fixedFee: 0,
      taxOnCommission: 18,
      isActive: true,
      description: 'Standard 20% platform commission with 18% GST on platform fee',
    });

    // 7. Seed Customers
    const customerData = [
      { name: 'Suresh Kumar', email: 'suresh.k@gmail.com', mobile: '+91 98411 11111', totalTrips: 18, totalSpent: 14200, walletBalance: 450 },
      { name: 'Divya Bharathi', email: 'divya.b@outlook.com', mobile: '+91 98411 22222', totalTrips: 12, totalSpent: 8600, walletBalance: 120 },
      { name: 'Manoj Transport Traders', email: 'manoj.logistics@yahoo.com', mobile: '+91 98411 33333', totalTrips: 45, totalSpent: 78500, walletBalance: 3200 },
      { name: 'Priya Narayanan', email: 'priya.n@gmail.com', mobile: '+91 98411 44444', totalTrips: 8, totalSpent: 5400, walletBalance: 0 },
      { name: 'Apex Electronics Ltd', email: 'dispatch@apexelectronics.in', mobile: '+91 98411 55555', totalTrips: 62, totalSpent: 134000, walletBalance: 5000 },
      { name: 'Arun Balaji', email: 'arun.balaji@gmail.com', mobile: '+91 98411 66666', totalTrips: 14, totalSpent: 9800, walletBalance: 250 },
      { name: 'Lakshmi Textiles', email: 'orders@lakshmitex.com', mobile: '+91 98411 77777', totalTrips: 31, totalSpent: 52400, walletBalance: 1800 },
      { name: 'Vikram Sethuraman', email: 'vikram.sethu@gmail.com', mobile: '+91 98411 88888', totalTrips: 5, totalSpent: 3200, walletBalance: 50 },
    ];

    const customers = [];
    for (let i = 0; i < customerData.length; i++) {
      const c = await Customer.create({
        ...customerData[i],
        customerId: `CUST-${String(i + 1).padStart(5, '0')}`,
        rating: 4.8 + (i % 3) * 0.1,
        status: 'ACTIVE',
      });
      customers.push(c);
    }
    logger.info(`Seeded ${customers.length} Customers.`);

    // 8. Seed Vehicles
    const vehicleConfigs = [
      // Drop Taxis
      { num: 'TN 01 AB 1234', cat: VehicleCategory.TAXI_SEDAN, srv: ServiceType.DROP_TAXI, brand: 'Maruti Suzuki', model: 'Dzire VXi', year: 2023, fuel: 'CNG', pass: 4 },
      { num: 'TN 02 CD 5678', cat: VehicleCategory.TAXI_SUV, srv: ServiceType.DROP_TAXI, brand: 'Toyota', model: 'Innova Crysta', year: 2022, fuel: 'DIESEL', pass: 7 },
      { num: 'TN 07 EF 9012', cat: VehicleCategory.TAXI_MINI, srv: ServiceType.DROP_TAXI, brand: 'Hyundai', model: 'Grand i10', year: 2021, fuel: 'PETROL', pass: 4 },
      { num: 'TN 09 GH 3456', cat: VehicleCategory.TAXI_SEDAN, srv: ServiceType.DROP_TAXI, brand: 'Toyota', model: 'Etios GD', year: 2020, fuel: 'DIESEL', pass: 4 },
      { num: 'TN 10 IJ 7890', cat: VehicleCategory.TAXI_SUV, srv: ServiceType.DROP_TAXI, brand: 'Maruti Suzuki', model: 'Ertiga ZXi', year: 2023, fuel: 'CNG', pass: 6 },
      { num: 'TN 14 KL 2345', cat: VehicleCategory.TAXI_SEDAN, srv: ServiceType.DROP_TAXI, brand: 'Honda', model: 'Amaze', year: 2022, fuel: 'DIESEL', pass: 4 },
      { num: 'TN 22 MN 6789', cat: VehicleCategory.TAXI_MINI, srv: ServiceType.DROP_TAXI, brand: 'Maruti Suzuki', model: 'WagonR', year: 2021, fuel: 'CNG', pass: 4 },

      // Goods Trucks
      { num: 'TN 04 TR 1122', cat: VehicleCategory.TRUCK_MINI_1TON, srv: ServiceType.GOODS_TRUCK, brand: 'Tata Motors', model: 'Ace Gold Diesel', year: 2022, fuel: 'DIESEL', tons: 1.0 },
      { num: 'TN 05 TR 3344', cat: VehicleCategory.TRUCK_MINI_1TON, srv: ServiceType.GOODS_TRUCK, brand: 'Ashok Leyland', model: 'Dost+', year: 2023, fuel: 'DIESEL', tons: 1.5 },
      { num: 'TN 12 TR 5566', cat: VehicleCategory.TRUCK_MEDIUM_3TON, srv: ServiceType.GOODS_TRUCK, brand: 'Eicher', model: 'Pro 2049 14ft', year: 2021, fuel: 'DIESEL', tons: 3.5 },
      { num: 'TN 18 TR 7788', cat: VehicleCategory.TRUCK_MEDIUM_3TON, srv: ServiceType.GOODS_TRUCK, brand: 'Tata Motors', model: '407 Gold SFC', year: 2020, fuel: 'DIESEL', tons: 3.0 },
      { num: 'TN 20 TR 9900', cat: VehicleCategory.TRUCK_HEAVY_7TON, srv: ServiceType.GOODS_TRUCK, brand: 'BharatBenz', model: '1217R 20ft', year: 2022, fuel: 'DIESEL', tons: 7.5 },
      { num: 'TN 21 TR 4455', cat: VehicleCategory.TRUCK_HEAVY_7TON, srv: ServiceType.GOODS_TRUCK, brand: 'Ashok Leyland', model: 'Ecomet 1615', year: 2023, fuel: 'DIESEL', tons: 9.0 },
    ];

    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 2);
    const pastDate = new Date();
    pastDate.setMonth(pastDate.getMonth() - 2);

    const vehicles = [];
    for (let i = 0; i < vehicleConfigs.length; i++) {
      const cfg = vehicleConfigs[i];
      const isExpired = i === 4; // 1 vehicle intentionally with expired documents for alert demo
      const vehicle = await Vehicle.create({
        vehicleId: `VEH-${String(i + 1).padStart(5, '0')}`,
        vehicleNumber: cfg.num,
        category: cfg.cat,
        serviceType: cfg.srv,
        brand: cfg.brand,
        model: cfg.model,
        year: cfg.year,
        capacity: {
          passengers: cfg.pass,
          weightTons: cfg.tons,
        },
        fuelType: cfg.fuel,
        documents: {
          rc: { docNumber: `RC-${cfg.num.replace(/\s+/g, '')}`, docUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=300', expiryDate: isExpired ? pastDate : futureDate, status: isExpired ? 'EXPIRED' : 'VALID' },
          insurance: { docNumber: `INS-${100000 + i}`, docUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=300', expiryDate: futureDate, status: 'VALID' },
          fitness: { docNumber: `FC-${200000 + i}`, docUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=300', expiryDate: futureDate, status: 'VALID' },
          permit: { docNumber: `PRM-${300000 + i}`, docUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=300', expiryDate: futureDate, status: 'VALID' },
        },
        status: isExpired ? VehicleStatus.DOCUMENTS_EXPIRED : VehicleStatus.ACTIVE,
        totalTrips: 20 + i * 8,
        totalRevenue: (20 + i * 8) * 650,
      });
      vehicles.push(vehicle);
    }
    logger.info(`Seeded ${vehicles.length} Fleet Vehicles.`);

    // 9. Seed Drivers (Locations centered around Chennai Metro hubs)
    const driverCoords = [
      { lat: 13.0827, lng: 80.2707, name: 'Chennai Central' },
      { lat: 13.0067, lng: 80.2030, name: 'Guindy Tech Park' },
      { lat: 12.9830, lng: 80.2594, name: 'Thiruvanmiyur ECR' },
      { lat: 13.0569, lng: 80.2425, name: 'Nungambakkam' },
      { lat: 13.0382, lng: 80.1565, name: 'Porur Junction' },
      { lat: 12.9249, lng: 80.1000, name: 'Tambaram GST Road' },
      { lat: 13.1143, lng: 80.1548, name: 'Ambattur Estate' },
      { lat: 13.0850, lng: 80.2101, name: 'Anna Nagar West' },
      { lat: 12.8399, lng: 80.1543, name: 'Vandalur Outer Ring' },
      { lat: 12.9716, lng: 79.1586, name: 'Vellore Highway' },
      { lat: 12.8342, lng: 79.7036, name: 'Kanchipuram Hub' },
      { lat: 12.9902, lng: 80.1693, name: 'Chennai Airport Terminal' },
    ];

    const driverNames = [
      'Murugan Selvam', 'Ravi Chandran', 'Venkatesh Babu', 'Balamurugan K',
      'Shankar Ganesh', 'Praveen Kumar', 'Dhanush Raja', 'Mohan Raj',
      'Saravanan Mani', 'Kaviarasan S', 'Vijay Anand', 'Muthu Krishnan'
    ];

    const drivers = [];
    for (let i = 0; i < driverNames.length; i++) {
      const coord = driverCoords[i % driverCoords.length];
      const isTruck = i >= 7;
      const assignedVeh = vehicles[i % vehicles.length];

      // Stagger statuses for rich testing
      let status = DriverStatus.ACTIVE;
      let kycStatus = KycStatus.APPROVED;
      let onlineStatus = i % 3 === 0 ? OnlineStatus.ONLINE : i % 3 === 1 ? OnlineStatus.ON_TRIP : OnlineStatus.ONLINE;

      if (i === 10) {
        status = DriverStatus.PENDING_APPROVAL;
        kycStatus = KycStatus.UNDER_REVIEW;
        onlineStatus = OnlineStatus.OFFLINE;
      } else if (i === 11) {
        status = DriverStatus.SUSPENDED;
        kycStatus = KycStatus.REJECTED;
        onlineStatus = OnlineStatus.OFFLINE;
      }

      const driver = await Driver.create({
        driverId: `DRV-${String(i + 1).padStart(5, '0')}`,
        name: driverNames[i],
        email: `${driverNames[i].toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
        mobile: `+91 9884${i} 12345`,
        serviceType: isTruck ? ServiceType.GOODS_TRUCK : ServiceType.DROP_TAXI,
        status,
        kycStatus,
        onlineStatus,
        assignedVehicle: assignedVeh._id,
        currentLocation: {
          type: 'Point',
          coordinates: [coord.lng, coord.lat],
          heading: (i * 30) % 360,
          speed: onlineStatus === OnlineStatus.ON_TRIP ? 42 : 0,
          address: coord.name,
          lastUpdated: new Date(),
        },
        rating: Number((4.6 + (i % 4) * 0.1).toFixed(1)),
        totalTrips: 35 + i * 12,
        acceptanceRate: 94 + (i % 5),
        cancellationRate: 1 + (i % 3),
        totalEarnings: (35 + i * 12) * 580,
        payableBalance: 1200 + i * 450,
        bankDetails: {
          accountNumber: `918840${100000 + i}`,
          ifscCode: 'HDFC0001234',
          bankName: 'HDFC Bank',
          holderName: driverNames[i],
          upiId: `${driverNames[i].toLowerCase().replace(/\s+/g, '')}@upi`,
        },
      });

      // Update vehicle with assigned driver
      await Vehicle.findByIdAndUpdate(assignedVeh._id, { assignedDriver: driver._id });

      // Create all 7 Mandatory KYC Documents for driver
      await DriverDocument.create([
        {
          driver: driver._id,
          documentType: 'DRIVING_LICENSE',
          documentName: 'Driving Licence',
          documentNumber: `DL-TN01-${2015000 + i}`,
          documentUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800',
          status: kycStatus,
          expiryDate: futureDate,
        },
        {
          driver: driver._id,
          documentType: 'RC_BOOK',
          documentName: 'RC (Registration Certificate)',
          documentNumber: assignedVeh.vehicleNumber,
          documentUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800',
          status: kycStatus,
          expiryDate: new Date(Date.now() + 365 * 24 * 3600 * 1000 * 4),
        },
        {
          driver: driver._id,
          documentType: 'FITNESS_CERTIFICATE',
          documentName: 'FC (Fitness Certificate)',
          documentNumber: `FC-TN01-${44000 + i}`,
          documentUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800',
          status: kycStatus,
          expiryDate: new Date(Date.now() + 365 * 24 * 3600 * 1000 * 1),
        },
        {
          driver: driver._id,
          documentType: 'INSURANCE',
          documentName: 'Vehicle Insurance Policy',
          documentNumber: `POL-HDFC-${99000 + i}`,
          documentUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800',
          status: kycStatus,
          expiryDate: new Date(Date.now() + 365 * 24 * 3600 * 1000 * 1),
        },
        {
          driver: driver._id,
          documentType: 'AADHAAR_CARD',
          documentName: 'Aadhaar Card',
          documentNumber: `5421 8890 ${1000 + i}`,
          documentUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800',
          status: kycStatus,
        },
        {
          driver: driver._id,
          documentType: 'PAN_CARD',
          documentName: 'PAN Card',
          documentNumber: `BCKPT${4300 + i}K`,
          documentUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800',
          status: kycStatus,
        },
        {
          driver: driver._id,
          documentType: 'LIVE_PHOTO',
          documentName: 'Live Picture (Face Selfie)',
          documentNumber: `LIVE-PIC-${driver.driverId}`,
          documentUrl: driver.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
          status: kycStatus,
        },
      ]);

      drivers.push(driver);
    }
    logger.info(`Seeded ${drivers.length} Drivers with KYC documents.`);

    // 10. Seed Realistic Bookings across 30 days with natural distribution
    const sampleTripRoutes = [
      { from: 'Chennai Central Station, Park Town', to: 'Tidel Park, OMR, Taramani', dist: 16, fare: 380, time: 35, srv: ServiceType.DROP_TAXI, cat: VehicleCategory.TAXI_SEDAN },
      { from: 'Guindy Industrial Estate, Chennai', to: 'Sriperumbudur Tech Park, Kanchipuram', dist: 38, fare: 1450, time: 55, srv: ServiceType.GOODS_TRUCK, cat: VehicleCategory.TRUCK_MINI_1TON },
      { from: 'Chennai International Airport (MAA)', to: 'Mahabalipuram Coastal Resorts, ECR', dist: 52, fare: 1250, time: 70, srv: ServiceType.DROP_TAXI, cat: VehicleCategory.TAXI_SUV },
      { from: 'Ambattur Industrial Estate', to: 'Oragadam Auto Hub', dist: 46, fare: 2600, time: 65, srv: ServiceType.GOODS_TRUCK, cat: VehicleCategory.TRUCK_MEDIUM_3TON },
      { from: 'Anna Nagar Roundtana, Chennai', to: 'Marina Beach Light House, Santhome', dist: 12, fare: 240, time: 28, srv: ServiceType.DROP_TAXI, cat: VehicleCategory.TAXI_MINI },
      { from: 'Koyambedu Wholesale Market', to: 'Pondy Bazaar, T Nagar, Chennai', dist: 10, fare: 650, time: 25, srv: ServiceType.GOODS_TRUCK, cat: VehicleCategory.TRUCK_MINI_1TON },
      { from: 'Nungambakkam High Road', to: 'Vellore Golden Temple, Vellore', dist: 138, fare: 2950, time: 160, srv: ServiceType.DROP_TAXI, cat: VehicleCategory.TAXI_SEDAN },
      { from: 'Ennore Port Cargo Freight Yard', to: 'Hosur Industrial Area, SIPCOT', dist: 310, fare: 18500, time: 380, srv: ServiceType.GOODS_TRUCK, cat: VehicleCategory.TRUCK_HEAVY_7TON },
      { from: 'Vadapalani Murugan Temple', to: 'Siruseri IT Park, Chennai', dist: 28, fare: 520, time: 45, srv: ServiceType.DROP_TAXI, cat: VehicleCategory.TAXI_SEDAN },
      { from: 'Avadi Heavy Vehicles Factory', to: 'Maraimalai Nagar Ford Hub', dist: 64, fare: 3200, time: 85, srv: ServiceType.GOODS_TRUCK, cat: VehicleCategory.TRUCK_MEDIUM_3TON },
      { from: 'Adyar Gate Hotel, Chennai', to: 'Puducherry Promenade Beach', dist: 155, fare: 3400, time: 175, srv: ServiceType.DROP_TAXI, cat: VehicleCategory.TAXI_SUV },
    ];

    const bookings = [];
    const statuses = [
      BookingStatus.TRIP_COMPLETED,
      BookingStatus.TRIP_COMPLETED,
      BookingStatus.TRIP_COMPLETED,
      BookingStatus.TRIP_COMPLETED,
      BookingStatus.TRIP_STARTED,
      BookingStatus.DRIVER_ASSIGNED,
      BookingStatus.SEARCHING_DRIVER,
      BookingStatus.CANCELLED,
    ];

    // Generate ~95 bookings across 30 days with natural taxi + truck daily volume
    for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
      // Natural volume: 3 to 6 bookings per day with both taxi and truck represented
      const dailyCount = 3 + (dayOffset % 4);
      for (let j = 0; j < dailyCount; j++) {
        const routeIndex = (dayOffset * 3 + j) % sampleTripRoutes.length;
        const route = sampleTripRoutes[routeIndex];
        const customer = customers[(dayOffset + j) % customers.length];
        const driver = drivers[(dayOffset + j) % drivers.length];
        const vehicle = vehicles[(dayOffset + j) % vehicles.length];
        const status = dayOffset === 0 ? statuses[j % statuses.length] : BookingStatus.TRIP_COMPLETED;

        const discount = (dayOffset + j) % 5 === 0 ? 50 : 0;
        const tax = Number((route.fare * 0.05).toFixed(2));
        const finalFare = route.fare - discount + tax;

        const commRate = 20;
        const platformComm = Number(((finalFare * commRate) / 100).toFixed(2));
        const driverEarn = Number((finalFare - platformComm).toFixed(2));

        const createdAt = new Date();
        createdAt.setDate(createdAt.getDate() - dayOffset);
        createdAt.setHours(7 + ((j * 4) % 15), (j * 23) % 60, 0, 0);

        const booking = await Booking.create({
          bookingId: `${route.srv === ServiceType.DROP_TAXI ? 'TX' : 'TRK'}-${String(100000 + dayOffset * 10 + j + 1)}`,
          customer: customer._id,
          driver: status !== BookingStatus.SEARCHING_DRIVER ? driver._id : undefined,
          vehicle: status !== BookingStatus.SEARCHING_DRIVER ? vehicle._id : undefined,
          serviceType: route.srv,
          vehicleCategory: route.cat,
          bookingType: j % 4 === 0 ? BookingType.SCHEDULED : BookingType.INSTANT,
          pickupLocation: {
            address: route.from,
            lat: 13.0827 + ((dayOffset + j) % 5) * 0.02,
            lng: 80.2707 - ((dayOffset + j) % 5) * 0.02,
            city: 'Chennai',
            state: 'Tamil Nadu',
          },
          dropLocation: {
            address: route.to,
            lat: 12.9830 + ((dayOffset + j) % 4) * 0.03,
            lng: 80.2030 + ((dayOffset + j) % 4) * 0.03,
            city: 'Chennai',
            state: 'Tamil Nadu',
          },
          extraStops: [],
          distanceKm: route.dist,
          estimatedDurationMins: route.time,
          fareBreakdown: {
            baseFare: Math.round(route.fare * 0.4),
            distanceFare: Math.round(route.fare * 0.6),
            timeFare: 0,
            waitingCharge: 0,
            nightCharge: 0,
            surgeCharge: j % 3 === 0 ? 50 : 0,
            extraStopCharge: 0,
            subtotal: route.fare,
            discount,
            tax,
            tollFee: route.dist > 50 ? 80 : 0,
            finalFare,
            currency: 'INR',
          },
          commissionDetails: {
            ratePercent: commRate,
            platformCommission: platformComm,
            driverEarnings: driverEarn,
            taxDeducted: Number((platformComm * 0.18).toFixed(2)),
          },
          paymentMethod: j % 2 === 0 ? PaymentMethod.UPI : PaymentMethod.CARD,
          paymentStatus: status === BookingStatus.TRIP_COMPLETED ? PaymentStatus.COMPLETED : PaymentStatus.PENDING,
          status,
          createdAt,
          updatedAt: createdAt,
        });

        bookings.push(booking);

        // If completed, add Payment & DriverEarning records
        if (status === BookingStatus.TRIP_COMPLETED) {
          await Payment.create({
            transactionId: `TXN-${String(2000000 + dayOffset * 10 + j)}`,
            booking: booking._id,
            customer: customer._id,
            driver: driver._id,
            amount: finalFare,
            paymentMethod: booking.paymentMethod,
            status: PaymentStatus.COMPLETED,
            paidAt: createdAt,
          });

          await DriverEarning.create({
            booking: booking._id,
            driver: driver._id,
            tripFare: finalFare,
            platformCommissionPercent: commRate,
            platformCommissionAmount: platformComm,
            taxDeducted: Number((platformComm * 0.18).toFixed(2)),
            netDriverEarnings: driverEarn,
            isPaidOut: (dayOffset + j) % 2 === 0,
            earnedAt: createdAt,
          });
        }
      }
    }
    logger.info(`Seeded ${bookings.length} realistic Bookings & Financial Records across 30 days.`);

    // 11. Seed Driver Payouts
    for (let i = 0; i < 8; i++) {
      const driver = drivers[i];
      const isPaid = i < 4;
      const net = 4500 + i * 850;
      await Payout.create({
        payoutId: `PAY-${String(50000 + i + 1)}`,
        driver: driver._id,
        periodStart: lastMonth,
        periodEnd: now,
        totalTrips: 12 + i * 3,
        grossEarnings: Math.round(net * 1.25),
        platformCommission: Math.round(net * 0.25),
        taxDeductions: Math.round(net * 0.01),
        netPayable: net,
        paidAmount: isPaid ? net : 0,
        pendingAmount: isPaid ? 0 : net,
        status: isPaid ? PayoutStatus.PAID : PayoutStatus.PENDING,
        paymentMode: 'UPI',
        bankReferenceNumber: isPaid ? `UPI-REF-${8899000 + i}` : undefined,
        processedBy: isPaid ? superAdmin._id : undefined,
        processedAt: isPaid ? now : undefined,
      });
    }
    logger.info('Seeded Driver Payout Records.');

    // 12. Seed Support Tickets
    await SupportTicket.create([
      {
        ticketId: 'TCK-001001',
        userType: 'CUSTOMER',
        customer: customers[0]._id,
        category: 'BILLING',
        priority: TicketPriority.HIGH,
        subject: 'Double charged for toll on Chennai - Mahabalipuram ride',
        description: 'I was charged ₹80 on app and also had to pay cash at ECR toll booth.',
        attachments: [],
        status: TicketStatus.IN_PROGRESS,
        assignedAdmin: superAdmin._id,
        messages: [
          { senderType: 'USER', senderId: customers[0]._id, senderName: customers[0].name, message: 'Please refund the cash toll amount of ₹80 paid at toll plaza.' },
          { senderType: 'ADMIN', senderId: superAdmin._id, senderName: 'Support Desk', message: 'We have received your receipt. Reversing ₹80 to your in-app wallet immediately.' }
        ],
      },
      {
        ticketId: 'TCK-001002',
        userType: 'DRIVER',
        driver: drivers[1]._id,
        category: 'TRIP_ISSUE',
        priority: TicketPriority.MEDIUM,
        subject: 'Customer delayed loading at Ambattur industrial pickup by 45 mins',
        description: 'Waiting time charge was not auto-calculated during goods loading.',
        attachments: [],
        status: TicketStatus.RESOLVED,
        assignedAdmin: superAdmin._id,
        resolutionNotes: 'Added ₹150 extra waiting compensation to driver payable balance.',
        messages: [
          { senderType: 'USER', senderId: drivers[1]._id, senderName: drivers[1].name, message: 'Please add 45 minutes waiting charge for booking TRK-100004.' },
          { senderType: 'ADMIN', senderId: superAdmin._id, senderName: 'Operations Lead', message: 'Verified GPS timestamps. ₹150 waiting fee credited.' }
        ],
      },
    ]);

    // 13. Seed Notification Templates & Broadcasts
    await NotificationTemplate.create([
      {
        name: 'Festive Booking Offer',
        code: 'FESTIVE_PROMO',
        channel: 'PUSH',
        subject: 'Celebrate with DropTaxi discounts!',
        content: 'Get 20% off on all intercity rides this week using code FESTIVE20.',
        variables: ['NAME', 'CODE'],
        isActive: true,
      },
      {
        name: 'KYC Document Renewal Alert',
        code: 'KYC_EXPIRY_ALERT',
        channel: 'SMS',
        subject: 'Vehicle Document Expiry Reminder',
        content: 'Dear Driver, your vehicle permit/insurance is expiring in 7 days. Please upload renewed documents on the app.',
        variables: ['DRIVER_NAME', 'DOC_NAME', 'EXPIRY_DATE'],
        isActive: true,
      },
    ]);

    await Notification.create({
      title: 'Monsoon Safety Advisory for All Drivers',
      message: 'Drive at safe speeds and ensure tyre pressure and wipers are inspected.',
      channel: 'PUSH',
      targetAudience: 'DRIVERS',
      status: 'SENT',
      sentBy: superAdmin._id,
      sentAt: new Date(),
    });

    // 14. Seed Audit Logs
    await AuditLog.create([
      {
        adminUser: superAdmin._id,
        adminName: superAdmin.name,
        adminEmail: superAdmin.email,
        module: AuditModule.DRIVERS,
        action: AuditAction.APPROVE,
        recordId: drivers[0]._id.toString(),
        targetModel: 'Driver',
        description: `Approved KYC documents for driver ${drivers[0].name}`,
        timestamp: new Date(),
      },
      {
        adminUser: superAdmin._id,
        adminName: superAdmin.name,
        adminEmail: superAdmin.email,
        module: AuditModule.FARES,
        action: AuditAction.UPDATE,
        recordId: 'FARES-SEDAN',
        targetModel: 'FareRule',
        description: 'Updated Sedan per KM rate to ₹17/km',
        timestamp: new Date(),
      },
    ]);

    // 15. Seed App Settings
    await AppSetting.create({
      general: {
        companyName: 'DropTaxi & Freight Logistics',
        tagline: 'Smart Intercity Taxis & Rapid Goods Transport',
        supportEmail: 'support@droptaxi-goods.com',
        supportPhone: '+91 98765 43210',
        officeAddress: 'Anna Salai, Guindy, Chennai, TN 600032',
        currency: 'INR',
        currencySymbol: '₹',
        timezone: 'Asia/Kolkata',
      },
      booking: {
        maxSearchRadiusKm: 15,
        driverAcceptTimeoutSec: 45,
        allowScheduledBookings: true,
        scheduledAdvanceBookingHours: 48,
        freeCancellationMins: 5,
        autoAssignDriver: true,
      },
      fare: {
        defaultTaxPercentage: 5,
        defaultSurgeMultiplier: 1.0,
        nightChargeEnabled: true,
      },
      commission: {
        defaultCommissionPercentage: 20,
        defaultTdsPercentage: 1,
        minPayoutAmount: 1000,
        payoutCycleDays: 7,
      },
      paymentGateways: {
        razorpayEnabled: true,
        razorpayKeyId: 'rzp_test_123456789',
        razorpayKeySecret: 'rzp_secret_987654321',
        stripeEnabled: false,
        cashOnDeliveryEnabled: true,
        upiEnabled: true,
        walletEnabled: true,
      },
      maps: {
        provider: 'OPEN_STREET_MAP',
        enableLiveTracking: true,
        locationUpdateIntervalSec: 4,
      },
    });

    logger.info('Database seeded successfully with complete enterprise datasets! 🎉');
    process.exit(0);
  } catch (error) {
    logger.error('Error seeding database:', error);
    process.exit(1);
  }
};

runSeed();
