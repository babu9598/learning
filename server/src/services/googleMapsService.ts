import { ENV } from '../config/environment';
import { logger } from '../utils/logger';
import { calculateDistanceKm, Coordinates } from '../utils/geoUtils';

export interface RouteDistanceResult {
  distanceKm: number;
  durationMins: number;
  originAddress?: string;
  destinationAddress?: string;
  status: 'GOOGLE_MAPS_LIVE' | 'GEODESIC_FALLBACK';
}

export interface DynamicRouteResult {
  distanceKm: number;
  durationMins: number;
  originAddress?: string;
  destinationAddress?: string;
  hasTolls: boolean;
  tollFee: number;
  tollPlazaCount: number;
  tollSource: 'GOOGLE_MAPS_ROUTES_API' | 'GOOGLE_MAPS_DIRECTIONS_API' | 'DYNAMIC_HIGHWAY_CORRIDOR';
  status: 'GOOGLE_MAPS_LIVE' | 'GEODESIC_FALLBACK';
}

export class GoogleMapsService {
  private static apiKey = ENV.GOOGLE_MAPS_API_KEY;

  /**
   * Dynamically calculate driving route, distance, duration, and highway toll fees
   * directly from Google Maps API.
   * Completely eliminates manual toll entry!
   */
  static async getDrivingDistanceAndTolls(
    origin: Coordinates,
    destination: Coordinates,
    options: {
      serviceType?: string;
      tripScope?: string;
      estimatedTollPerKm?: number;
    } = {}
  ): Promise<DynamicRouteResult> {
    const isTruck = options.serviceType === 'GOODS_TRUCK';
    const isInterStation = options.tripScope === 'INTER_STATION';

    if (this.apiKey) {
      // 1. Attempt Google Routes API v2 with live Toll computation if enabled
      try {
        const routesUrl = 'https://routes.googleapis.com/directions/v2:computeRoutes';
        const routesRes = await fetch(routesUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': this.apiKey,
            'X-Goog-FieldMask': 'routes.distanceMeters,routes.duration,routes.travelAdvisory.tollInfo',
          },
          body: JSON.stringify({
            origin: { location: { latLng: { latitude: origin.lat, longitude: origin.lng } } },
            destination: { location: { latLng: { latitude: destination.lat, longitude: destination.lng } } },
            travelMode: 'DRIVE',
            extraComputations: ['TOLLS'],
          }),
          signal: AbortSignal.timeout(4000),
        });

        const routesData: any = await routesRes.json();
        if (routesData.routes && routesData.routes.length > 0) {
          const route = routesData.routes[0];
          const distKm = Number(((route.distanceMeters || 0) / 1000).toFixed(2));
          const durSec = parseInt(route.duration?.replace('s', '') || '0', 10);
          const durMins = Math.max(1, Math.round(durSec / 60));
          const estimatedPrice = route.travelAdvisory?.tollInfo?.estimatedPrice?.[0];

          let tollAmount = 0;
          if (estimatedPrice && estimatedPrice.units) {
            tollAmount = Number(estimatedPrice.units) + (estimatedPrice.nanos ? Number(estimatedPrice.nanos) / 1e9 : 0);
          }

          logger.info(`🗺️ Google Maps Routes API: ${distKm} km, Toll: ₹${tollAmount}`);
          return {
            distanceKm: distKm,
            durationMins: durMins,
            hasTolls: tollAmount > 0,
            tollFee: Math.round(tollAmount),
            tollPlazaCount: tollAmount > 0 ? 1 : 0,
            tollSource: 'GOOGLE_MAPS_ROUTES_API',
            status: 'GOOGLE_MAPS_LIVE',
          };
        }
      } catch (err) {
        // Fall through to Directions API
      }

      // 2. Query Google Maps Directions API to detect toll roads and plazas
      try {
        const dirUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&key=${this.apiKey}&mode=driving`;
        const dirRes = await fetch(dirUrl, { signal: AbortSignal.timeout(4500) });
        const dirData: any = await dirRes.json();

        if (dirData.status === 'OK' && dirData.routes?.length > 0) {
          const route = dirData.routes[0];
          const leg = route.legs[0];
          const distanceKm = Number((leg.distance.value / 1000).toFixed(2));
          const durationMins = Math.max(1, Math.round(leg.duration.value / 60));

          // Inspect turn-by-turn steps & route warnings for Toll roads
          const warnings: string[] = route.warnings || [];
          const hasTollWarning = warnings.some((w: string) => w.toLowerCase().includes('toll'));
          const tollSteps = (leg.steps || []).filter(
            (s: any) => s.html_instructions && s.html_instructions.toLowerCase().includes('toll')
          );
          const hasTolls = hasTollWarning || tollSteps.length > 0;

          let tollFee = 0;
          if (hasTolls && !isInterStation) {
            // Count distinct toll road stages / plazas
            const tollCount = Math.max(1, tollSteps.length);
            const tollPerPlaza = isTruck ? 175 : 85;
            const ratePerKm = options.estimatedTollPerKm || (isTruck ? 2.5 : 1.35);
            
            // Dynamic FASTag toll based on toll plazas detected by Google Maps
            const plazaBased = tollCount * tollPerPlaza;
            const distBased = distanceKm > 20 ? Math.round(distanceKm * ratePerKm) : 0;
            tollFee = Math.max(plazaBased, distBased);
          }

          logger.info(`🗺️ Google Maps Directions: ${distanceKm} km, Tolls: ₹${tollFee} (${hasTolls ? 'Toll road detected' : 'No tolls'})`);

          return {
            distanceKm,
            durationMins,
            originAddress: leg.start_address,
            destinationAddress: leg.end_address,
            hasTolls,
            tollFee,
            tollPlazaCount: tollSteps.length,
            tollSource: 'GOOGLE_MAPS_DIRECTIONS_API',
            status: 'GOOGLE_MAPS_LIVE',
          };
        }
      } catch (err) {
        logger.warn('Google Maps Directions request failed. Using distance matrix fallback.', err);
      }
    }

    // 3. Fallback: Haversine distance & corridor estimation
    const basicDist = await this.getDrivingDistance(origin, destination);
    let fallbackToll = 0;
    if (!isInterStation && basicDist.distanceKm > 20) {
      const rate = options.estimatedTollPerKm || (isTruck ? 2.5 : 1.35);
      fallbackToll = Math.round(basicDist.distanceKm * rate);
    }

    return {
      distanceKm: basicDist.distanceKm,
      durationMins: basicDist.durationMins,
      originAddress: basicDist.originAddress,
      destinationAddress: basicDist.destinationAddress,
      hasTolls: fallbackToll > 0,
      tollFee: fallbackToll,
      tollPlazaCount: fallbackToll > 0 ? 1 : 0,
      tollSource: 'DYNAMIC_HIGHWAY_CORRIDOR',
      status: basicDist.status,
    };
  }

  /**
   * Calculate live driving distance and traffic duration using Google Maps Distance Matrix API
   */
  static async getDrivingDistance(
    origin: Coordinates,
    destination: Coordinates
  ): Promise<RouteDistanceResult> {
    if (this.apiKey) {
      try {
        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.lat},${origin.lng}&destinations=${destination.lat},${destination.lng}&key=${this.apiKey}&mode=driving`;
        
        const response = await fetch(url, { signal: AbortSignal.timeout(4000) });
        const data: any = await response.json();

        if (
          data.status === 'OK' &&
          data.rows?.[0]?.elements?.[0]?.status === 'OK'
        ) {
          const element = data.rows[0].elements[0];
          const distanceMeters = element.distance.value;
          const durationSeconds = element.duration.value;

          const distanceKm = Number((distanceMeters / 1000).toFixed(2));
          const durationMins = Math.max(1, Math.round(durationSeconds / 60));

          logger.info(`🗺️ Google Maps Distance Matrix: ${distanceKm} km, ${durationMins} mins`);

          return {
            distanceKm,
            durationMins,
            originAddress: data.origin_addresses?.[0],
            destinationAddress: data.destination_addresses?.[0],
            status: 'GOOGLE_MAPS_LIVE',
          };
        } else {
          logger.warn(`Google Maps API status: ${data.status} / ${data.error_message || ''}. Using Haversine.`);
        }
      } catch (error) {
        logger.warn('Google Maps Distance Matrix request timed out or failed. Falling back to Geodesic.', error);
      }
    }

    // High accuracy Haversine geodesic fallback
    const haversineDist = calculateDistanceKm(origin, destination);
    // Road factor multiplier (~1.25x for winding roads)
    const distanceKm = Number((haversineDist * 1.25).toFixed(2));
    const durationMins = Math.max(10, Math.round((distanceKm / 40) * 60));

    return {
      distanceKm,
      durationMins,
      status: 'GEODESIC_FALLBACK',
    };
  }

  /**
   * Geocode an address to Lat/Lng coordinates
   */
  static async geocodeAddress(address: string) {
    if (!this.apiKey) return null;
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${this.apiKey}&region=in`;
      const response = await fetch(url, { signal: AbortSignal.timeout(4000) });
      const data: any = await response.json();

      if (data.status === 'OK' && data.results?.length > 0) {
        const first = data.results[0];
        return {
          formattedAddress: first.formatted_address,
          lat: first.geometry.location.lat,
          lng: first.geometry.location.lng,
          placeId: first.place_id,
          components: first.address_components,
        };
      }
    } catch (error) {
      logger.error('Error in Google Maps Geocoding:', error);
    }
    return null;
  }

  /**
   * Reverse geocode Lat/Lng to human readable address
   */
  static async reverseGeocode(lat: number, lng: number) {
    if (!this.apiKey) {
      return { formattedAddress: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}` };
    }
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${this.apiKey}`;
      const response = await fetch(url, { signal: AbortSignal.timeout(4000) });
      const data: any = await response.json();

      if (data.status === 'OK' && data.results?.length > 0) {
        return {
          formattedAddress: data.results[0].formatted_address,
          placeId: data.results[0].place_id,
          results: data.results,
        };
      }
    } catch (error) {
      logger.error('Error in Google Maps Reverse Geocoding:', error);
    }
    return { formattedAddress: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}` };
  }

  /**
   * Get Driving Turn-by-Turn Directions and Polyline
   */
  static async getDirections(origin: Coordinates, destination: Coordinates) {
    if (!this.apiKey) return null;
    try {
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&key=${this.apiKey}&mode=driving`;
      const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
      const data: any = await response.json();

      if (data.status === 'OK' && data.routes?.length > 0) {
        const route = data.routes[0];
        const leg = route.legs[0];
        return {
          distanceText: leg.distance.text,
          distanceValueMeters: leg.distance.value,
          durationText: leg.duration.text,
          durationValueSeconds: leg.duration.value,
          startAddress: leg.start_address,
          endAddress: leg.end_address,
          overviewPolyline: route.overview_polyline.points,
          bounds: route.bounds,
          steps: leg.steps.map((s: any) => ({
            instruction: s.html_instructions.replace(/<[^>]*>?/gm, ''),
            distance: s.distance.text,
            duration: s.duration.text,
            startLocation: s.start_location,
            endLocation: s.end_location,
          })),
        };
      }
    } catch (error) {
      logger.error('Error in Google Maps Directions API:', error);
    }
    return null;
  }

  /**
   * Places autocomplete for auto-filling customer addresses
   */
  static async placesAutocomplete(input: string) {
    if (!this.apiKey) return [];
    try {
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&components=country:in&key=${this.apiKey}`;
      const response = await fetch(url, { signal: AbortSignal.timeout(4000) });
      const data: any = await response.json();

      if (data.status === 'OK') {
        return data.predictions.map((p: any) => ({
          description: p.description,
          placeId: p.place_id,
          mainText: p.structured_formatting?.main_text,
          secondaryText: p.structured_formatting?.secondary_text,
        }));
      }
    } catch (error) {
      logger.error('Error in Google Maps Autocomplete:', error);
    }
    return [];
  }
}
