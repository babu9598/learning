import { Driver } from '../models/Driver';
import { Booking } from '../models/Booking';
import { interpolateCoordinate } from '../utils/geoUtils';
import { BookingStatus, OnlineStatus } from '../config/constants';
import { io } from '../server';
import { logger } from '../utils/logger';

let simulationInterval: NodeJS.Timeout | null = null;
let simulationStep = 0;

export class SimulationService {
  /**
   * Start periodic simulation of live driver locations
   */
  static startSimulation() {
    if (simulationInterval) return;

    logger.info('Live fleet simulation engine started.');

    simulationInterval = setInterval(async () => {
      try {
        simulationStep++;
        const activeDrivers = await Driver.find({
          onlineStatus: { $in: [OnlineStatus.ONLINE, OnlineStatus.ON_TRIP] },
        }).populate('assignedVehicle');

        if (!activeDrivers.length) return;

        const updates = [];

        for (const driver of activeDrivers) {
          const coords = driver.currentLocation?.coordinates || [80.2707, 13.0827];
          let lng = coords[0];
          let lat = coords[1];

          // Check if driver has an active booking
          const activeBooking = await Booking.findOne({
            driver: driver._id,
            status: {
              $in: [
                BookingStatus.DRIVER_ASSIGNED,
                BookingStatus.DRIVER_ACCEPTED,
                BookingStatus.DRIVER_ARRIVING,
                BookingStatus.TRIP_STARTED,
              ],
            },
          });

          let heading = driver.currentLocation?.heading || 0;
          let speed = 25 + (simulationStep % 25);

          if (activeBooking) {
            const target =
              activeBooking.status === BookingStatus.TRIP_STARTED
                ? activeBooking.dropLocation
                : activeBooking.pickupLocation;

            // Move slightly towards target
            const nextPoint = interpolateCoordinate({ lat, lng }, { lat: target.lat, lng: target.lng }, 0.05);
            lat = nextPoint.lat;
            lng = nextPoint.lng;
            heading = (heading + 15) % 360;
          } else {
            // Idle wander jitter
            const deltaLat = (Math.sin(simulationStep * 0.1 + (driver._id as any).toString().charCodeAt(0)) * 0.0004);
            const deltaLng = (Math.cos(simulationStep * 0.1 + (driver._id as any).toString().charCodeAt(1)) * 0.0004);
            lat = Number((lat + deltaLat).toFixed(6));
            lng = Number((lng + deltaLng).toFixed(6));
            speed = 0;
          }

          driver.currentLocation = {
            type: 'Point',
            coordinates: [lng, lat],
            heading,
            speed,
            lastUpdated: new Date(),
            address: driver.currentLocation?.address || 'Metro Road',
          };

          await driver.save();

          updates.push({
            driverId: driver.driverId,
            id: driver._id,
            name: driver.name,
            serviceType: driver.serviceType,
            onlineStatus: driver.onlineStatus,
            location: {
              lat,
              lng,
              heading,
              speed,
              lastUpdated: new Date(),
            },
            vehicle: driver.assignedVehicle,
          });
        }

        if (io && updates.length > 0) {
          io.emit('fleet:locations', updates);
        }
      } catch (err) {
        // Silently capture simulator ticks
      }
    }, 4000); // Ticks every 4 seconds
  }

  static stopSimulation() {
    if (simulationInterval) {
      clearInterval(simulationInterval);
      simulationInterval = null;
      logger.info('Live fleet simulation stopped.');
    }
  }
}
