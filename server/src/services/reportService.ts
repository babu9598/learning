import { Booking } from '../models/Booking';
import { Driver } from '../models/Driver';
import { Customer } from '../models/Customer';
import { Vehicle } from '../models/Vehicle';
import { BookingStatus } from '../config/constants';

export class ReportService {
  /**
   * Generate Booking Report
   */
  static async getBookingReport(startDate?: string, endDate?: string) {
    const match: any = {};
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        match.createdAt.$lte = end;
      }
    }

    const bookings = await Booking.find(match)
      .populate('customer', 'name mobile')
      .populate('driver', 'name mobile')
      .populate('vehicle', 'vehicleNumber category')
      .sort({ createdAt: -1 });

    const summary = {
      totalBookings: bookings.length,
      completed: bookings.filter((b) => b.status === BookingStatus.TRIP_COMPLETED).length,
      cancelled: bookings.filter((b) => b.status === BookingStatus.CANCELLED).length,
      grossFare: bookings.reduce((sum, b) => sum + (b.fareBreakdown?.finalFare || 0), 0),
      totalDistance: bookings.reduce((sum, b) => sum + (b.distanceKm || 0), 0),
    };

    return {
      summary,
      rows: bookings.map((b) => ({
        bookingId: b.bookingId,
        date: b.createdAt,
        customerName: (b.customer as any)?.name || 'Guest',
        driverName: (b.driver as any)?.name || 'Unassigned',
        serviceType: b.serviceType,
        vehicleCategory: b.vehicleCategory,
        pickup: b.pickupLocation?.address,
        drop: b.dropLocation?.address,
        distanceKm: b.distanceKm,
        finalFare: b.fareBreakdown?.finalFare,
        platformCommission: b.commissionDetails?.platformCommission || 0,
        driverEarnings: b.commissionDetails?.driverEarnings || 0,
        paymentStatus: b.paymentStatus,
        status: b.status,
      })),
    };
  }

  /**
   * Generate Revenue Report
   */
  static async getRevenueReport(startDate?: string, endDate?: string) {
    const match: any = { status: BookingStatus.TRIP_COMPLETED };
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        match.createdAt.$lte = end;
      }
    }

    const completedBookings = await Booking.find(match).sort({ createdAt: -1 });

    const totalGross = completedBookings.reduce((sum, b) => sum + (b.fareBreakdown?.finalFare || 0), 0);
    const totalDiscounts = completedBookings.reduce((sum, b) => sum + (b.fareBreakdown?.discount || 0), 0);
    const totalTaxes = completedBookings.reduce((sum, b) => sum + (b.fareBreakdown?.tax || 0), 0);
    const totalCommission = completedBookings.reduce((sum, b) => sum + (b.commissionDetails?.platformCommission || 0), 0);
    const totalDriverEarnings = completedBookings.reduce((sum, b) => sum + (b.commissionDetails?.driverEarnings || 0), 0);

    return {
      summary: {
        totalGross,
        totalDiscounts,
        totalTaxes,
        totalCommission,
        totalDriverEarnings,
        netRevenue: totalCommission - totalDiscounts,
      },
      rows: completedBookings.map((b) => ({
        bookingId: b.bookingId,
        date: b.createdAt,
        serviceType: b.serviceType,
        category: b.vehicleCategory,
        subtotal: b.fareBreakdown?.subtotal,
        discount: b.fareBreakdown?.discount,
        tax: b.fareBreakdown?.tax,
        finalFare: b.fareBreakdown?.finalFare,
        platformCommission: b.commissionDetails?.platformCommission || 0,
        driverEarnings: b.commissionDetails?.driverEarnings || 0,
      })),
    };
  }

  /**
   * Generate Driver Performance Report
   */
  static async getDriverReport() {
    const drivers = await Driver.find()
      .populate('assignedVehicle', 'vehicleNumber category')
      .sort({ totalTrips: -1 });

    return {
      summary: {
        totalDrivers: drivers.length,
        totalTripsDone: drivers.reduce((sum, d) => sum + d.totalTrips, 0),
        totalPayoutsDistributed: drivers.reduce((sum, d) => sum + d.totalEarnings, 0),
        averageRating: Number(
          (drivers.reduce((sum, d) => sum + d.rating, 0) / (drivers.length || 1)).toFixed(2)
        ),
      },
      rows: drivers.map((d) => ({
        driverId: d.driverId,
        name: d.name,
        mobile: d.mobile,
        serviceType: d.serviceType,
        rating: d.rating,
        totalTrips: d.totalTrips,
        totalEarnings: d.totalEarnings,
        payableBalance: d.payableBalance,
        acceptanceRate: `${d.acceptanceRate}%`,
        cancellationRate: `${d.cancellationRate}%`,
        status: d.status,
        kycStatus: d.kycStatus,
      })),
    };
  }

  /**
   * Generate Vehicle Fleet Utilization Report
   */
  static async getVehicleReport() {
    const vehicles = await Vehicle.find()
      .populate('assignedDriver', 'name driverId mobile')
      .sort({ totalTrips: -1 });

    return {
      summary: {
        totalVehicles: vehicles.length,
        activeVehicles: vehicles.filter((v) => v.status === 'ACTIVE').length,
        expiredDocuments: vehicles.filter((v) => v.isDocumentExpired).length,
        totalFleetRevenue: vehicles.reduce((sum, v) => sum + v.totalRevenue, 0),
      },
      rows: vehicles.map((v) => ({
        vehicleId: v.vehicleId,
        vehicleNumber: v.vehicleNumber,
        category: v.category,
        serviceType: v.serviceType,
        brand: `${v.brand} ${v.model}`,
        assignedDriver: (v.assignedDriver as any)?.name || 'Unassigned',
        status: v.status,
        isDocumentExpired: v.isDocumentExpired ? 'YES' : 'NO',
        totalTrips: v.totalTrips,
        totalRevenue: v.totalRevenue,
      })),
    };
  }
}
