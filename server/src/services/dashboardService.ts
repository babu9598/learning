import { Customer } from '../models/Customer';
import { Driver } from '../models/Driver';
import { Vehicle } from '../models/Vehicle';
import { Booking } from '../models/Booking';
import { Payout } from '../models/Payout';
import { BookingStatus, DriverStatus, KycStatus, OnlineStatus, PayoutStatus } from '../config/constants';

/**
 * Standard date range parser for all dashboard analytics and booking filters.
 * Prevents UTC-midnight date shifting and synchronizes date intervals across queries.
 */
export function parseDateRange(
  period: string = 'today',
  startDateStr?: string,
  endDateStr?: string
): { rangeStart: Date; rangeEnd: Date } {
  const now = new Date();
  let rangeStart = new Date(now);
  let rangeEnd = new Date(now);

  if (period === 'this_week') {
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    rangeStart = new Date(now.getFullYear(), now.getMonth(), diff, 0, 0, 0, 0);
    rangeEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  } else if (period === 'this_month') {
    rangeStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    rangeEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  } else if (period === 'custom' && startDateStr) {
    const [sy, sm, sd] = startDateStr.split('-').map(Number);
    rangeStart = new Date(sy, sm - 1, sd, 0, 0, 0, 0);
    if (endDateStr) {
      const [ey, em, ed] = endDateStr.split('-').map(Number);
      rangeEnd = new Date(ey, em - 1, ed, 23, 59, 59, 999);
    } else {
      rangeEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    }
  } else {
    // Default: 'today'
    rangeStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    rangeEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  }

  return { rangeStart, rangeEnd };
}

/**
 * Formats a Date instance as YYYY-MM-DD in local time
 */
export function formatLocalYMD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export class DashboardService {
  /**
   * Get all KPI metrics strictly derived from real database records for the requested period
   */
  static async getKpiMetrics(period: string = 'today', startDateStr?: string, endDateStr?: string) {
    const { rangeStart, rangeEnd } = parseDateRange(period, startDateStr, endDateStr);

    const [
      totalCustomers,
      totalDrivers,
      activeDrivers,
      onlineDrivers,
      totalVehicles,
      periodBookingsStats,
      allTimeFinancials,
      pendingPayoutsStats,
    ] = await Promise.all([
      // 1. Total Customers
      Customer.countDocuments(),

      // 2. Total Drivers
      Driver.countDocuments(),

      // 3. Active Drivers (Approved & Active)
      Driver.countDocuments({ status: DriverStatus.ACTIVE, kycStatus: KycStatus.APPROVED }),

      // 4. Online / On-Trip Drivers
      Driver.countDocuments({ onlineStatus: { $in: [OnlineStatus.ONLINE, OnlineStatus.ON_TRIP] } }),

      // 5. Total Fleet Vehicles
      Vehicle.countDocuments(),

      // 6. Period Bookings Aggregation (strictly matching date range)
      Booking.aggregate([
        {
          $match: {
            createdAt: { $gte: rangeStart, $lte: rangeEnd },
          },
        },
        {
          $group: {
            _id: null,
            totalBookingsToday: { $sum: 1 },
            ongoingTrips: {
              $sum: {
                $cond: [
                  {
                    $in: [
                      '$status',
                      [
                        BookingStatus.DRIVER_ASSIGNED,
                        BookingStatus.DRIVER_ACCEPTED,
                        BookingStatus.DRIVER_ARRIVING,
                        BookingStatus.DRIVER_ARRIVED,
                        BookingStatus.TRIP_STARTED,
                      ],
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            completedTripsToday: {
              $sum: { $cond: [{ $eq: ['$status', BookingStatus.TRIP_COMPLETED] }, 1, 0] },
            },
            cancelledTripsToday: {
              $sum: { $cond: [{ $eq: ['$status', BookingStatus.CANCELLED] }, 1, 0] },
            },
            revenueToday: {
              $sum: {
                $cond: [
                  { $eq: ['$status', BookingStatus.TRIP_COMPLETED] },
                  { $ifNull: ['$fareBreakdown.finalFare', 0] },
                  0,
                ],
              },
            },
            driverEarningsToday: {
              $sum: {
                $cond: [
                  { $eq: ['$status', BookingStatus.TRIP_COMPLETED] },
                  {
                    $ifNull: [
                      '$commissionDetails.driverEarnings',
                      { $multiply: ['$fareBreakdown.finalFare', 0.8] },
                    ],
                  },
                  0,
                ],
              },
            },
            commissionToday: {
              $sum: {
                $cond: [
                  { $eq: ['$status', BookingStatus.TRIP_COMPLETED] },
                  {
                    $ifNull: [
                      '$commissionDetails.platformCommission',
                      { $multiply: ['$fareBreakdown.finalFare', 0.2] },
                    ],
                  },
                  0,
                ],
              },
            },
          },
        },
      ]),

      // 7. All-time Financials Aggregation
      Booking.aggregate([
        {
          $match: {
            status: BookingStatus.TRIP_COMPLETED,
          },
        },
        {
          $group: {
            _id: null,
            totalGrossRevenue: { $sum: '$fareBreakdown.finalFare' },
            totalDriverEarnings: { $sum: '$commissionDetails.driverEarnings' },
            totalPlatformCommission: { $sum: '$commissionDetails.platformCommission' },
            totalDiscountsGiven: { $sum: '$fareBreakdown.discount' },
            totalCompletedTrips: { $sum: 1 },
          },
        },
      ]),

      // 8. Pending Payouts Aggregation
      Payout.aggregate([
        {
          $match: {
            status: { $in: [PayoutStatus.PENDING, PayoutStatus.PROCESSING] },
          },
        },
        {
          $group: {
            _id: null,
            totalPendingAmount: { $sum: '$pendingAmount' },
            pendingCount: { $sum: 1 },
          },
        },
      ]),
    ]);

    const periodStats = periodBookingsStats[0] || {
      totalBookingsToday: 0,
      ongoingTrips: 0,
      completedTripsToday: 0,
      cancelledTripsToday: 0,
      revenueToday: 0,
      driverEarningsToday: 0,
      commissionToday: 0,
    };

    const financials = allTimeFinancials[0] || {
      totalGrossRevenue: 0,
      totalDriverEarnings: 0,
      totalPlatformCommission: 0,
      totalDiscountsGiven: 0,
      totalCompletedTrips: 0,
    };

    const payouts = pendingPayoutsStats[0] || {
      totalPendingAmount: 0,
      pendingCount: 0,
    };

    return {
      kpis: {
        totalCustomers,
        totalDrivers,
        activeDrivers,
        onlineDrivers,
        totalVehicles,
        todayBookings: periodStats.totalBookingsToday,
        ongoingTrips: periodStats.ongoingTrips,
        completedTrips: periodStats.completedTripsToday,
        cancelledTrips: periodStats.cancelledTripsToday,
        todayRevenue: Math.round(periodStats.revenueToday),
        todayDriverEarnings: Math.round(periodStats.driverEarningsToday),
        todayPlatformCommission: Math.round(periodStats.commissionToday),
        totalGrossRevenue: Math.round(financials.totalGrossRevenue),
        totalPlatformCommission: Math.round(financials.totalPlatformCommission),
        totalDriverEarnings: Math.round(financials.totalDriverEarnings),
        pendingPayoutsAmount: Math.round(payouts.totalPendingAmount),
        pendingPayoutsCount: payouts.pendingCount,
      },
    };
  }

  /**
   * Get Booking analytics (Today, This Week, This Month, Custom) strictly from database records
   */
  static async getBookingAnalytics(
    timeframe: string = 'today',
    startDateStr?: string,
    endDateStr?: string
  ) {
    const { rangeStart, rangeEnd } = parseDateRange(timeframe, startDateStr, endDateStr);
    const isToday = timeframe === 'today';
    const format = isToday ? '%H:00' : '%Y-%m-%d';

    const analytics = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: rangeStart, $lte: rangeEnd },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format, date: '$createdAt' } },
          totalBookings: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', BookingStatus.TRIP_COMPLETED] }, 1, 0] },
          },
          cancelled: {
            $sum: { $cond: [{ $eq: ['$status', BookingStatus.CANCELLED] }, 1, 0] },
          },
          taxiBookings: {
            $sum: { $cond: [{ $eq: ['$serviceType', 'DROP_TAXI'] }, 1, 0] },
          },
          truckBookings: {
            $sum: { $cond: [{ $eq: ['$serviceType', 'GOODS_TRUCK'] }, 1, 0] },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const dataMap = new Map<string, any>();
    analytics.forEach((item) => {
      dataMap.set(item._id, {
        total: item.totalBookings || 0,
        completed: item.completed || 0,
        cancelled: item.cancelled || 0,
        taxi: item.taxiBookings || 0,
        truck: item.truckBookings || 0,
      });
    });

    if (isToday) {
      const timeSlots = ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];
      const slotMap = new Map<string, any>();
      timeSlots.forEach((slot) => {
        slotMap.set(slot, { total: 0, completed: 0, cancelled: 0, taxi: 0, truck: 0 });
      });

      analytics.forEach((item) => {
        const hour = parseInt(item._id.split(':')[0], 10);
        const slotHour = Math.floor(hour / 2) * 2;
        const slotKey = `${String(slotHour).padStart(2, '0')}:00`;
        const slot = slotMap.get(slotKey) || { total: 0, completed: 0, cancelled: 0, taxi: 0, truck: 0 };
        slot.total += item.totalBookings || 0;
        slot.completed += item.completed || 0;
        slot.cancelled += item.cancelled || 0;
        slot.taxi += item.taxiBookings || 0;
        slot.truck += item.truckBookings || 0;
        slotMap.set(slotKey, slot);
      });

      return timeSlots.map((slot) => {
        const d = slotMap.get(slot)!;
        return {
          date: slot,
          total: d.total,
          completed: d.completed,
          cancelled: d.cancelled,
          taxi: d.taxi,
          truck: d.truck,
        };
      });
    }

    // Daily breakdown for this_week, this_month, custom
    const result = [];
    const curr = new Date(rangeStart);
    while (curr <= rangeEnd) {
      const dateStr = formatLocalYMD(curr);
      const existing = dataMap.get(dateStr);
      result.push({
        date: dateStr,
        total: existing ? existing.total : 0,
        completed: existing ? existing.completed : 0,
        cancelled: existing ? existing.cancelled : 0,
        taxi: existing ? existing.taxi : 0,
        truck: existing ? existing.truck : 0,
      });
      curr.setDate(curr.getDate() + 1);
    }
    return result;
  }

  /**
   * Get Revenue Analytics (Gross, Commission, Driver Earnings) strictly from database records
   */
  static async getRevenueAnalytics(
    timeframe: string | number = 'today',
    startDateStr?: string,
    endDateStr?: string
  ) {
    const tfStr = typeof timeframe === 'string' ? timeframe : 'today';
    const { rangeStart, rangeEnd } = parseDateRange(tfStr, startDateStr, endDateStr);
    const isToday = tfStr === 'today';
    const format = isToday ? '%H:00' : '%Y-%m-%d';

    const revenue = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: rangeStart, $lte: rangeEnd },
          status: BookingStatus.TRIP_COMPLETED,
        },
      },
      {
        $group: {
          _id: { $dateToString: { format, date: '$createdAt' } },
          grossRevenue: { $sum: '$fareBreakdown.finalFare' },
          platformCommission: {
            $sum: {
              $ifNull: ['$commissionDetails.platformCommission', { $multiply: ['$fareBreakdown.finalFare', 0.2] }],
            },
          },
          driverEarnings: {
            $sum: {
              $ifNull: ['$commissionDetails.driverEarnings', { $multiply: ['$fareBreakdown.finalFare', 0.8] }],
            },
          },
          discounts: { $sum: { $ifNull: ['$fareBreakdown.discount', 0] } },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const revMap = new Map<string, any>();
    revenue.forEach((item) => {
      revMap.set(item._id, {
        gross: Math.round(item.grossRevenue || 0),
        commission: Math.round(item.platformCommission || 0),
        driverEarnings: Math.round(item.driverEarnings || 0),
        discounts: Math.round(item.discounts || 0),
      });
    });

    if (isToday) {
      const timeSlots = ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];
      const slotMap = new Map<string, any>();
      timeSlots.forEach((slot) => {
        slotMap.set(slot, { gross: 0, commission: 0, driverEarnings: 0, discounts: 0 });
      });

      revenue.forEach((item) => {
        const hour = parseInt(item._id.split(':')[0], 10);
        const slotHour = Math.floor(hour / 2) * 2;
        const slotKey = `${String(slotHour).padStart(2, '0')}:00`;
        const slot = slotMap.get(slotKey) || { gross: 0, commission: 0, driverEarnings: 0, discounts: 0 };
        slot.gross += Math.round(item.grossRevenue || 0);
        slot.commission += Math.round(item.platformCommission || 0);
        slot.driverEarnings += Math.round(item.driverEarnings || 0);
        slot.discounts += Math.round(item.discounts || 0);
        slotMap.set(slotKey, slot);
      });

      return timeSlots.map((slot) => {
        const d = slotMap.get(slot)!;
        return {
          date: slot,
          gross: d.gross,
          commission: d.commission,
          driverEarnings: d.driverEarnings,
          discounts: d.discounts,
        };
      });
    }

    // Daily breakdown for this_week, this_month, custom
    const result = [];
    const curr = new Date(rangeStart);
    while (curr <= rangeEnd) {
      const dateStr = formatLocalYMD(curr);
      const existing = revMap.get(dateStr);
      result.push({
        date: dateStr,
        gross: existing ? existing.gross : 0,
        commission: existing ? existing.commission : 0,
        driverEarnings: existing ? existing.driverEarnings : 0,
        discounts: existing ? existing.discounts : 0,
      });
      curr.setDate(curr.getDate() + 1);
    }
    return result;
  }

  /**
   * Get Booking Status Distribution strictly within the requested date range
   */
  static async getBookingStatusDistribution(
    period: string = 'today',
    startDateStr?: string,
    endDateStr?: string
  ) {
    const { rangeStart, rangeEnd } = parseDateRange(period, startDateStr, endDateStr);

    const statusCounts = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: rangeStart, $lte: rangeEnd },
        },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    return statusCounts.map((item) => ({
      status: item._id,
      count: item.count,
    }));
  }

  /**
   * Get Vehicle Category Usage & Revenue Analytics strictly within the requested date range
   */
  static async getVehicleCategoryAnalytics(
    period: string = 'today',
    startDateStr?: string,
    endDateStr?: string
  ) {
    const { rangeStart, rangeEnd } = parseDateRange(period, startDateStr, endDateStr);

    const categoryStats = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: rangeStart, $lte: rangeEnd },
        },
      },
      {
        $group: {
          _id: '$vehicleCategory',
          totalBookings: { $sum: 1 },
          completedBookings: {
            $sum: { $cond: [{ $eq: ['$status', BookingStatus.TRIP_COMPLETED] }, 1, 0] },
          },
          totalRevenue: {
            $sum: {
              $cond: [
                { $eq: ['$status', BookingStatus.TRIP_COMPLETED] },
                { $ifNull: ['$fareBreakdown.finalFare', 0] },
                0,
              ],
            },
          },
        },
      },
      { $sort: { totalRevenue: -1 } },
    ]);

    const catMap = new Map<string, { bookings: number; completed: number; revenue: number }>();
    categoryStats.forEach((item) => {
      if (item._id) {
        catMap.set(item._id, {
          bookings: item.totalBookings || 0,
          completed: item.completedBookings || 0,
          revenue: Math.round(item.totalRevenue || 0),
        });
      }
    });

    const allCategories = [
      'TAXI_SEDAN',
      'TRUCK_MINI_1TON',
      'TAXI_SUV',
      'TRUCK_MEDIUM_3TON',
      'TRUCK_HEAVY_7TON',
      'TAXI_MINI',
    ];

    const result = allCategories.map((category) => {
      const data = catMap.get(category);
      return {
        category,
        bookings: data ? data.bookings : 0,
        completed: data ? data.completed : 0,
        revenue: data ? data.revenue : 0,
      };
    });

    categoryStats.forEach((item) => {
      if (item._id && !allCategories.includes(item._id)) {
        result.push({
          category: item._id,
          bookings: item.totalBookings || 0,
          completed: item.completedBookings || 0,
          revenue: Math.round(item.totalRevenue || 0),
        });
      }
    });

    return result.sort((a, b) => b.revenue - a.revenue);
  }

  /**
   * Get Customer Growth & Cohort Analytics
   */
  static async getCustomerAnalytics(days = 14) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const customerGrowth = await Customer.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          newCustomers: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return customerGrowth.map((item) => ({
      date: item._id,
      newCustomers: item.newCustomers,
    }));
  }
}
