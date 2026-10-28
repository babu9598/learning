import { Driver } from '../models/Driver';
import { Booking } from '../models/Booking';
import { Trip } from '../models/Trip';
import { BookingStatus, OnlineStatus } from '../config/constants';

export class TrackingService {
  /**
   * Get live fleet positions for map visualization
   */
  static async getLiveFleet(serviceType?: string, status?: string) {
    const query: any = {};
    if (serviceType) query.serviceType = serviceType;
    if (status) {
      if (status === 'ONLINE') query.onlineStatus = OnlineStatus.ONLINE;
      else if (status === 'ON_TRIP') query.onlineStatus = OnlineStatus.ON_TRIP;
      else if (status === 'OFFLINE') query.onlineStatus = OnlineStatus.OFFLINE;
    }

    const drivers = await Driver.find(query)
      .select('name mobile avatar driverId serviceType onlineStatus rating currentLocation assignedVehicle')
      .populate('assignedVehicle', 'vehicleNumber category brand model');

    // Find active booking for on-trip drivers
    const activeTrips = await Booking.find({
      status: {
        $in: [
          BookingStatus.DRIVER_ASSIGNED,
          BookingStatus.DRIVER_ACCEPTED,
          BookingStatus.DRIVER_ARRIVING,
          BookingStatus.DRIVER_ARRIVED,
          BookingStatus.TRIP_STARTED,
        ],
      },
    })
      .populate('customer', 'name mobile')
      .populate('driver', 'name mobile driverId');

    return {
      drivers: drivers.map((d) => ({
        _id: d._id,
        driverId: d.driverId,
        name: d.name,
        mobile: d.mobile,
        avatar: d.avatar,
        serviceType: d.serviceType,
        onlineStatus: d.onlineStatus,
        rating: d.rating,
        location: {
          lat: d.currentLocation?.coordinates?.[1] || 13.0827,
          lng: d.currentLocation?.coordinates?.[0] || 80.2707,
          heading: d.currentLocation?.heading || 0,
          speed: d.currentLocation?.speed || 0,
          address: d.currentLocation?.address || 'Chennai Central',
          lastUpdated: d.currentLocation?.lastUpdated || new Date(),
        },
        vehicle: d.assignedVehicle,
      })),
      activeTrips,
    };
  }

  /**
   * Update driver GPS coordinates
   */
  static async updateDriverLocation(
    driverId: string,
    lat: number,
    lng: number,
    heading = 0,
    speed = 0,
    address = ''
  ) {
    const driver = await Driver.findByIdAndUpdate(
      driverId,
      {
        currentLocation: {
          type: 'Point',
          coordinates: [lng, lat],
          heading,
          speed,
          lastUpdated: new Date(),
          address,
        },
      },
      { new: true }
    );

    // If driver is on trip, push to Trip trajectory
    if (driver && driver.onlineStatus === OnlineStatus.ON_TRIP) {
      await Trip.findOneAndUpdate(
        { driver: driver._id, status: 'STARTED' },
        {
          $push: {
            routeTrajectory: {
              lat,
              lng,
              timestamp: new Date(),
              speed,
            },
          },
          currentLocation: { lat, lng },
        }
      );
    }

    return driver;
  }
}
