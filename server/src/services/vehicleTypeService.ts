import { VehicleType, IVehicleType } from '../models/VehicleType';
import { FareRule } from '../models/FareRule';
import { ServiceType, TripScope } from '../config/constants';

export interface VehicleTypeFilterParams {
  search?: string;
  serviceType?: ServiceType;
  wheelCount?: number;
  isActive?: boolean | string;
  page?: number;
  limit?: number;
}

export class VehicleTypeService {
  /**
   * Sync a vehicle type's pricing with the FareRule collection
   * This guarantees that FareService / BookingService dynamically calculate fares
   * using the vehicle type's latest pricing parameters.
   */
  static async syncFareRules(vehicleType: IVehicleType) {
    const { code, name, serviceType, pricing, isActive } = vehicleType;

    // 1. Inter-Station (Local / City) Fare Rule
    const interDefaults = {
      category: code,
      serviceType,
      tripScope: TripScope.INTER_STATION,
      title: `${name} (City Local Drop)`,
      baseFare: pricing?.interStation?.baseFare ?? (serviceType === ServiceType.DROP_TAXI ? 150 : 250),
      baseDistanceKm: pricing?.interStation?.baseDistanceKm ?? 2,
      perKmRate: pricing?.interStation?.perKmRate ?? (serviceType === ServiceType.DROP_TAXI ? 15 : 22),
      minimumFare: pricing?.interStation?.minimumFare ?? (serviceType === ServiceType.DROP_TAXI ? 150 : 250),
      driverBata: 0, // Zero bata for local trips
      estimatedTollPerKm: 0,
      perMinuteRate: pricing?.interStation?.perMinuteRate ?? 2,
      waitingChargePerMin: pricing?.interStation?.waitingChargePerMin ?? 3,
      freeWaitingMins: pricing?.interStation?.freeWaitingMins ?? 5,
      driverCommissionPercentage: pricing?.interStation?.driverCommissionPercentage ?? 15,
      bookingRadiusKm: pricing?.interStation?.bookingRadiusKm ?? 15,
      cancellationPercentage: pricing?.interStation?.cancellationPercentage ?? 10,
      customerCancellationTimeHours: pricing?.interStation?.customerCancellationTimeHours ?? 1,
      driverCancellationTimeHours: pricing?.interStation?.driverCancellationTimeHours ?? 2,
      driverDailyMaxCancellations: pricing?.interStation?.driverDailyMaxCancellations ?? 3,
      walletMinAmount: pricing?.interStation?.walletMinAmount ?? 500,
      incentives: pricing?.interStation?.incentives ?? { daily: [], weekly: [], monthly: [] },
      isActive,
    };

    await FareRule.findOneAndUpdate(
      { category: code, tripScope: TripScope.INTER_STATION },
      {
        $setOnInsert: interDefaults,
        $set: {
          title: `${name} (City Local Drop)`,
          isActive,
          ...(pricing?.interStation
            ? {
                baseFare: pricing.interStation.baseFare,
                baseDistanceKm: pricing.interStation.baseDistanceKm,
                perKmRate: pricing.interStation.perKmRate,
                minimumFare: pricing.interStation.minimumFare,
                driverBata: 0,
                estimatedTollPerKm: 0,
                perMinuteRate: pricing.interStation.perMinuteRate ?? 2,
                waitingChargePerMin: pricing.interStation.waitingChargePerMin ?? 3,
                freeWaitingMins: pricing.interStation.freeWaitingMins ?? 5,
                driverCommissionPercentage: pricing.interStation.driverCommissionPercentage ?? 15,
                bookingRadiusKm: pricing.interStation.bookingRadiusKm ?? 15,
                cancellationPercentage: pricing.interStation.cancellationPercentage ?? 10,
                customerCancellationTimeHours: pricing.interStation.customerCancellationTimeHours ?? 1,
                driverCancellationTimeHours: pricing.interStation.driverCancellationTimeHours ?? 2,
                driverDailyMaxCancellations: pricing.interStation.driverDailyMaxCancellations ?? 3,
                walletMinAmount: pricing.interStation.walletMinAmount ?? 500,
                incentives: pricing.interStation.incentives ?? { daily: [], weekly: [], monthly: [] },
              }
            : {}),
        },
      },
      { upsert: true, new: true }
    );

    // 2. Outstation (Intercity Drop) Fare Rule
    const outDefaults = {
      category: code,
      serviceType,
      tripScope: TripScope.OUTSTATION,
      title: `${name} (Outstation One-Way Drop)`,
      baseFare: pricing?.outstation?.baseFare ?? (serviceType === ServiceType.DROP_TAXI ? 200 : 450),
      baseDistanceKm: pricing?.outstation?.baseDistanceKm ?? 2,
      perKmRate: pricing?.outstation?.perKmRate ?? (serviceType === ServiceType.DROP_TAXI ? 13 : 20),
      minimumFare: pricing?.outstation?.minimumFare ?? (serviceType === ServiceType.DROP_TAXI ? 200 : 450),
      driverBata: pricing?.outstation?.driverBata ?? (serviceType === ServiceType.DROP_TAXI ? 350 : 450),
      estimatedTollPerKm: pricing?.outstation?.estimatedTollPerKm ?? 1.35,
      perMinuteRate: pricing?.outstation?.perMinuteRate ?? 2,
      waitingChargePerMin: pricing?.outstation?.waitingChargePerMin ?? 3,
      freeWaitingMins: pricing?.outstation?.freeWaitingMins ?? 5,
      driverCommissionPercentage: pricing?.outstation?.driverCommissionPercentage ?? 15,
      bookingRadiusKm: pricing?.outstation?.bookingRadiusKm ?? 25,
      cancellationPercentage: pricing?.outstation?.cancellationPercentage ?? 10,
      customerCancellationTimeHours: pricing?.outstation?.customerCancellationTimeHours ?? 2,
      driverCancellationTimeHours: pricing?.outstation?.driverCancellationTimeHours ?? 3,
      driverDailyMaxCancellations: pricing?.outstation?.driverDailyMaxCancellations ?? 3,
      walletMinAmount: pricing?.outstation?.walletMinAmount ?? 500,
      incentives: pricing?.outstation?.incentives ?? { daily: [], weekly: [], monthly: [] },
      isActive,
    };

    await FareRule.findOneAndUpdate(
      { category: code, tripScope: TripScope.OUTSTATION },
      {
        $setOnInsert: outDefaults,
        $set: {
          title: `${name} (Outstation One-Way Drop)`,
          isActive,
          ...(pricing?.outstation
            ? {
                baseFare: pricing.outstation.baseFare,
                baseDistanceKm: pricing.outstation.baseDistanceKm,
                perKmRate: pricing.outstation.perKmRate,
                minimumFare: pricing.outstation.minimumFare,
                driverBata: pricing.outstation.driverBata,
                estimatedTollPerKm: pricing.outstation.estimatedTollPerKm,
                perMinuteRate: pricing.outstation.perMinuteRate ?? 2,
                waitingChargePerMin: pricing.outstation.waitingChargePerMin ?? 3,
                freeWaitingMins: pricing.outstation.freeWaitingMins ?? 5,
                driverCommissionPercentage: pricing.outstation.driverCommissionPercentage ?? 15,
                bookingRadiusKm: pricing.outstation.bookingRadiusKm ?? 25,
                cancellationPercentage: pricing.outstation.cancellationPercentage ?? 10,
                customerCancellationTimeHours: pricing.outstation.customerCancellationTimeHours ?? 2,
                driverCancellationTimeHours: pricing.outstation.driverCancellationTimeHours ?? 3,
                driverDailyMaxCancellations: pricing.outstation.driverDailyMaxCancellations ?? 3,
                walletMinAmount: pricing.outstation.walletMinAmount ?? 500,
                incentives: pricing.outstation.incentives ?? { daily: [], weekly: [], monthly: [] },
              }
            : {}),
        },
      },
      { upsert: true, new: true }
    );
  }

  static async getVehicleTypes(params: VehicleTypeFilterParams) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 50));
    const skip = (page - 1) * limit;

    const query: any = {};

    if (params.search) {
      query.$or = [
        { name: { $regex: params.search, $options: 'i' } },
        { code: { $regex: params.search, $options: 'i' } },
        { modelsExample: { $regex: params.search, $options: 'i' } },
        { wheelType: { $regex: params.search, $options: 'i' } },
      ];
    }

    if (params.serviceType) query.serviceType = params.serviceType;
    if (params.wheelCount) query.wheelCount = Number(params.wheelCount);
    if (params.isActive !== undefined && params.isActive !== '') {
      query.isActive = String(params.isActive) === 'true';
    }

    const [types, total] = await Promise.all([
      VehicleType.find(query).sort({ sortOrder: 1, createdAt: 1 }).skip(skip).limit(limit),
      VehicleType.countDocuments(query),
    ]);

    return {
      types,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getActiveVehicleTypes(serviceType?: ServiceType) {
    const query: any = { isActive: true };
    if (serviceType) query.serviceType = serviceType;
    return VehicleType.find(query).sort({ sortOrder: 1, createdAt: 1 });
  }

  static async getVehicleTypeById(id: string) {
    const vehicleType = await VehicleType.findById(id);
    if (!vehicleType) throw new Error('Vehicle type not found');
    return vehicleType;
  }

  static async createVehicleType(data: any) {
    const count = await VehicleType.countDocuments();
    const typeId = `VT-${String(count + 1).padStart(4, '0')}`;

    const code = String(data.code || data.name.replace(/[^a-zA-Z0-9]/g, '_')).toUpperCase().trim();
    const wheelCount = Number(data.wheelCount || 4);
    const wheelType = data.wheelType || `${wheelCount}-Wheeler`;

    const vehicleType = await VehicleType.create({
      ...data,
      typeId,
      code,
      wheelCount,
      wheelType,
    });

    // Automatically sync FareRules
    await this.syncFareRules(vehicleType);

    return vehicleType;
  }

  static async updateVehicleType(id: string, data: any) {
    const vehicleType = await VehicleType.findById(id);
    if (!vehicleType) throw new Error('Vehicle type not found');

    if (data.code) {
      data.code = String(data.code).toUpperCase().trim();
    }
    if (data.wheelCount) {
      data.wheelCount = Number(data.wheelCount);
      if (!data.wheelType) {
        data.wheelType = `${data.wheelCount}-Wheeler`;
      }
    }

    Object.assign(vehicleType, data);
    await vehicleType.save();

    // Automatically sync FareRules
    await this.syncFareRules(vehicleType);

    return vehicleType;
  }

  static async toggleStatus(id: string) {
    const vehicleType = await VehicleType.findById(id);
    if (!vehicleType) throw new Error('Vehicle type not found');

    vehicleType.isActive = !vehicleType.isActive;
    await vehicleType.save();

    // Sync FareRules active state
    await this.syncFareRules(vehicleType);

    return vehicleType;
  }

  static async deleteVehicleType(id: string) {
    const vehicleType = await VehicleType.findById(id);
    if (!vehicleType) throw new Error('Vehicle type not found');

    const code = vehicleType.code;
    await VehicleType.findByIdAndDelete(id);

    // Deactivate matching FareRules
    await FareRule.updateMany({ category: code }, { isActive: false });

    return { message: 'Vehicle type deleted and associated fare rules deactivated' };
  }

  /**
   * Seed standard fleet vehicle types if table is empty
   */
  static async seedDefaultVehicleTypes() {
    const count = await VehicleType.countDocuments();
    if (count > 0) return;

    const defaults = [
      // 1. Drop Taxi - Sedan
      {
        typeId: 'VT-0001',
        name: 'Sedan Cab',
        code: 'TAXI_SEDAN',
        serviceType: ServiceType.DROP_TAXI,
        wheelCount: 4,
        wheelType: '4-Wheeler',
        capacity: { passengers: 4, luggageBags: 2 },
        modelsExample: 'Swift Dzire, Toyota Etios, Hyundai Aura',
        features: ['Chilled Air Conditioning', 'Extra Rear Legroom', 'Clean & Sanitized', 'Zero Return Fare'],
        badge: 'Couples & Solo',
        imageUrl: '/vehicles/sedan_cab.jpg',
        pricing: {
          interStation: { baseFare: 150, baseDistanceKm: 2, perKmRate: 15, minimumFare: 150, driverBata: 0, estimatedTollPerKm: 0 },
          outstation: { baseFare: 200, baseDistanceKm: 2, perKmRate: 13, minimumFare: 200, driverBata: 350, estimatedTollPerKm: 1.35 },
        },
        isActive: true,
        sortOrder: 1,
      },
      // 2. Drop Taxi - SUV
      {
        typeId: 'VT-0002',
        name: 'SUV Cab',
        code: 'TAXI_SUV',
        serviceType: ServiceType.DROP_TAXI,
        wheelCount: 4,
        wheelType: '4-Wheeler',
        capacity: { passengers: 6, luggageBags: 4 },
        modelsExample: 'Maruti Ertiga, Renault Triber, Lodgy',
        features: ['Spacious 3 Rows', 'High Ground Clearance', 'Luggage Carrier', 'Family Comfort'],
        badge: 'Family Favorite',
        imageUrl: '/vehicles/suv_cab.jpg',
        pricing: {
          interStation: { baseFare: 220, baseDistanceKm: 2, perKmRate: 20, minimumFare: 220, driverBata: 0, estimatedTollPerKm: 0 },
          outstation: { baseFare: 350, baseDistanceKm: 2, perKmRate: 18, minimumFare: 350, driverBata: 450, estimatedTollPerKm: 1.35 },
        },
        isActive: true,
        sortOrder: 2,
      },
      // 3. Drop Taxi - Premium Innova
      {
        typeId: 'VT-0003',
        name: 'Premium Innova',
        code: 'TAXI_INNOVA',
        serviceType: ServiceType.DROP_TAXI,
        wheelCount: 4,
        wheelType: '4-Wheeler',
        capacity: { passengers: 7, luggageBags: 5 },
        modelsExample: 'Toyota Innova Crysta / Hycross',
        features: ['Captain Recliner Seats', 'VIP Luxury Comfort', 'Dual Zone Climate', 'Executive Ride'],
        badge: 'Luxury Executive',
        imageUrl: '/vehicles/innova_crysta.jpg',
        pricing: {
          interStation: { baseFare: 300, baseDistanceKm: 2, perKmRate: 25, minimumFare: 300, driverBata: 0, estimatedTollPerKm: 0 },
          outstation: { baseFare: 450, baseDistanceKm: 2, perKmRate: 22, minimumFare: 450, driverBata: 550, estimatedTollPerKm: 1.35 },
        },
        isActive: true,
        sortOrder: 3,
      },
      // 4. Drop Taxi - Hatchback
      {
        typeId: 'VT-0004',
        name: 'Hatchback Mini',
        code: 'TAXI_HATCHBACK',
        serviceType: ServiceType.DROP_TAXI,
        wheelCount: 4,
        wheelType: '4-Wheeler',
        capacity: { passengers: 4, luggageBags: 1 },
        modelsExample: 'Maruti WagonR, Celerio, Tata Tiago',
        features: ['Budget Friendly', 'City Agile', 'AC Standard', 'Fast Pickup'],
        badge: 'Most Economical',
        imageUrl: '/vehicles/sedan_cab.jpg',
        pricing: {
          interStation: { baseFare: 120, baseDistanceKm: 2, perKmRate: 13, minimumFare: 120, driverBata: 0, estimatedTollPerKm: 0 },
          outstation: { baseFare: 180, baseDistanceKm: 2, perKmRate: 11, minimumFare: 180, driverBata: 300, estimatedTollPerKm: 1.35 },
        },
        isActive: true,
        sortOrder: 4,
      },
      // 5. Goods Truck - Mini Truck (Tata Ace)
      {
        typeId: 'VT-0005',
        name: 'Tata Ace (Chhota Hathi)',
        code: 'TRUCK_MINI_1TON',
        serviceType: ServiceType.GOODS_TRUCK,
        wheelCount: 4,
        wheelType: '4-Wheeler',
        capacity: { weightTons: 0.75, dimensions: '5.5 x 4.5 ft' },
        modelsExample: 'Tata Ace Gold / HT / EV',
        features: ['Local House Shifting', 'E-commerce Parcels', 'Vegetables/FMCG', 'Fast City Access'],
        badge: 'Small Business Pick',
        imageUrl: '/vehicles/tata_ace_truck.jpg',
        pricing: {
          interStation: { baseFare: 250, baseDistanceKm: 2, perKmRate: 22, minimumFare: 250, driverBata: 0, estimatedTollPerKm: 0 },
          outstation: { baseFare: 450, baseDistanceKm: 2, perKmRate: 18, minimumFare: 450, driverBata: 400, estimatedTollPerKm: 1.5 },
        },
        isActive: true,
        sortOrder: 5,
      },
      // 6. Goods Truck - Pickup 8ft / Bolero Maxi
      {
        typeId: 'VT-0006',
        name: 'Pickup 8ft / Bolero Maxi',
        code: 'TRUCK_MEDIUM_3TON',
        serviceType: ServiceType.GOODS_TRUCK,
        wheelCount: 4,
        wheelType: '4-Wheeler',
        capacity: { weightTons: 1.5, dimensions: '8.0 x 5.0 ft' },
        modelsExample: 'Mahindra Bolero Maxi Truck, Dost Strong',
        features: ['Heavy Industrial Goods', 'Furniture Relocation', 'Tiles & Ceramic Loads', 'Intercity Cargo'],
        badge: 'Most Popular Freight',
        imageUrl: '/vehicles/bolero_pickup.jpg',
        pricing: {
          interStation: { baseFare: 400, baseDistanceKm: 2, perKmRate: 28, minimumFare: 400, driverBata: 0, estimatedTollPerKm: 0 },
          outstation: { baseFare: 700, baseDistanceKm: 2, perKmRate: 25, minimumFare: 700, driverBata: 500, estimatedTollPerKm: 1.8 },
        },
        isActive: true,
        sortOrder: 6,
      },
      // 7. Goods Truck - Tata 407 (6-Wheeler)
      {
        typeId: 'VT-0007',
        name: 'Tata 407 (10-14ft Heavy Freight)',
        code: 'TRUCK_HEAVY_7TON',
        serviceType: ServiceType.GOODS_TRUCK,
        wheelCount: 6,
        wheelType: '6-Wheeler',
        capacity: { weightTons: 4.0, dimensions: '10.0 x 6.0 ft' },
        modelsExample: 'Tata 407 Gold SFC, Eicher Pro 2049',
        features: ['Heavy Commercial Loads', 'Wholesale Market Dispatch', 'Steel/Hardware Transport', 'All-Weather Covered'],
        badge: 'Heavy Carrier',
        imageUrl: '/vehicles/tata_407.jpg',
        pricing: {
          interStation: { baseFare: 650, baseDistanceKm: 2, perKmRate: 38, minimumFare: 650, driverBata: 0, estimatedTollPerKm: 0 },
          outstation: { baseFare: 1200, baseDistanceKm: 2, perKmRate: 32, minimumFare: 1200, driverBata: 700, estimatedTollPerKm: 2.5 },
        },
        isActive: true,
        sortOrder: 7,
      },
      // 8. Goods Truck - 10-Wheeler Multi-Axle
      {
        typeId: 'VT-0008',
        name: '10-Wheeler Multi-Axle Carrier',
        code: 'TRUCK_HEAVY_10WHEEL',
        serviceType: ServiceType.GOODS_TRUCK,
        wheelCount: 10,
        wheelType: '10-Wheeler',
        capacity: { weightTons: 16.0, dimensions: '22.0 x 8.0 ft' },
        modelsExample: 'Tata Signa 2823, Ashok Leyland 2820',
        features: ['Interstate Bulk Freight', 'Factory Shipment', 'Construction Steel & Cement', 'High Capacity Long Haul'],
        badge: 'Bulk Long Haul',
        imageUrl: '/vehicles/tata_407.jpg',
        pricing: {
          interStation: { baseFare: 1500, baseDistanceKm: 5, perKmRate: 55, minimumFare: 1500, driverBata: 0, estimatedTollPerKm: 0 },
          outstation: { baseFare: 2500, baseDistanceKm: 5, perKmRate: 48, minimumFare: 2500, driverBata: 1000, estimatedTollPerKm: 4.0 },
        },
        isActive: true,
        sortOrder: 8,
      },
    ];

    for (const item of defaults) {
      const created = await VehicleType.create(item);
      await this.syncFareRules(created);
    }
  }
}
