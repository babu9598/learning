import { Request, Response, NextFunction } from 'express';
import { GoogleMapsService } from '../services/googleMapsService';

export class GoogleMapsController {
  static async getDrivingDistance(req: Request, res: Response, next: NextFunction) {
    try {
      const { originLat, originLng, destLat, destLng } = req.query;
      if (!originLat || !originLng || !destLat || !destLng) {
        return res.status(400).json({ error: 'Origin and destination coordinates are required' });
      }

      const result = await GoogleMapsService.getDrivingDistance(
        { lat: Number(originLat), lng: Number(originLng) },
        { lat: Number(destLat), lng: Number(destLng) }
      );

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async geocode(req: Request, res: Response, next: NextFunction) {
    try {
      const { address } = req.query;
      if (!address) {
        return res.status(400).json({ error: 'Address query parameter is required' });
      }

      const result = await GoogleMapsService.geocodeAddress(String(address));
      if (!result) {
        return res.status(404).json({ error: 'Location not found' });
      }

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async reverseGeocode(req: Request, res: Response, next: NextFunction) {
    try {
      const { lat, lng } = req.query;
      if (!lat || !lng) {
        return res.status(400).json({ error: 'lat and lng parameters are required' });
      }

      const result = await GoogleMapsService.reverseGeocode(Number(lat), Number(lng));
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getDirections(req: Request, res: Response, next: NextFunction) {
    try {
      const { originLat, originLng, destLat, destLng } = req.query;
      if (!originLat || !originLng || !destLat || !destLng) {
        return res.status(400).json({ error: 'Origin and destination coordinates are required' });
      }

      const result = await GoogleMapsService.getDirections(
        { lat: Number(originLat), lng: Number(originLng) },
        { lat: Number(destLat), lng: Number(destLng) }
      );

      if (!result) {
        return res.status(404).json({ error: 'Could not calculate directions' });
      }

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async placesAutocomplete(req: Request, res: Response, next: NextFunction) {
    try {
      const { input } = req.query;
      if (!input) {
        return res.json([]);
      }

      const results = await GoogleMapsService.placesAutocomplete(String(input));
      res.json(results);
    } catch (error) {
      next(error);
    }
  }
}
