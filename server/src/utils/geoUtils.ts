export interface Coordinates {
  lat: number;
  lng: number;
}

// Calculate Haversine distance in KM
export const calculateDistanceKm = (coord1: Coordinates, coord2: Coordinates): number => {
  const R = 6371; // Radius of Earth in KM
  const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const dLng = ((coord2.lng - coord1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1.lat * Math.PI) / 180) *
      Math.cos((coord2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
};

// Interpolate between two coordinates
export const interpolateCoordinate = (
  start: Coordinates,
  end: Coordinates,
  fraction: number
): Coordinates => {
  const clamped = Math.max(0, Math.min(1, fraction));
  return {
    lat: Number((start.lat + (end.lat - start.lat) * clamped).toFixed(6)),
    lng: Number((start.lng + (end.lng - start.lng) * clamped).toFixed(6)),
  };
};

// Generate route path points
export const generateRoutePath = (
  start: Coordinates,
  end: Coordinates,
  steps = 20
): Coordinates[] => {
  const path: Coordinates[] = [];
  for (let i = 0; i <= steps; i++) {
    const fraction = i / steps;
    // Add slight natural road curvature
    const jitterLat = Math.sin(fraction * Math.PI) * 0.003 * (i % 2 === 0 ? 1 : -1);
    const jitterLng = Math.cos(fraction * Math.PI) * 0.003 * (i % 2 === 0 ? -1 : 1);
    path.push({
      lat: Number((start.lat + (end.lat - start.lat) * fraction + jitterLat).toFixed(6)),
      lng: Number((start.lng + (end.lng - start.lng) * fraction + jitterLng).toFixed(6)),
    });
  }
  return path;
};
