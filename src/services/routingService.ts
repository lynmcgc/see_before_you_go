import { LocationPoint, TravelMode, CalculatedRoute, RouteStep } from '../types';
import { SINGAPORE_PRESET_LOCATIONS } from './singaporeData';
import { calculateHaversineDistanceKm } from './cameraMatcher';

/**
 * Searches for Singapore locations using OneMap search API or fallback dataset
 */
export async function searchLocations(query: string): Promise<LocationPoint[]> {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return [];

  try {
    const res = await fetch(
      `/api/search-locations?searchVal=${encodeURIComponent(trimmed)}`
    );

    if (res.ok) {
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        return data.results.slice(0, 6).map((item: any) => ({
          name: item.SEARCHVAL || item.BUILDING || item.ADDRESS,
          address: item.ADDRESS,
          postalCode: item.POSTAL,
          latitude: parseFloat(item.LATITUDE),
          longitude: parseFloat(item.LONGITUDE),
        }));
      }
    }
  } catch (err) {
    console.debug('Search failed, using local landmarks:', err);
  }

  // Fallback to local landmark matching
  const matches = SINGAPORE_PRESET_LOCATIONS.filter(
    (loc) =>
      loc.name.toLowerCase().includes(trimmed) ||
      loc.address?.toLowerCase().includes(trimmed) ||
      loc.postalCode?.includes(trimmed)
  );

  return matches.slice(0, 6);
}

/**
 * Interpolates intermediate coordinates along expressway corridor between two Singapore points
 */
function generateRoadPolyline(
  start: LocationPoint,
  end: LocationPoint,
  mode: TravelMode
): [number, number][] {
  const points: [number, number][] = [];
  const steps = 16;
  const startLat = start.latitude;
  const startLng = start.longitude;
  const endLat = end.latitude;
  const endLng = end.longitude;

  // Add natural slight curve simulating Singapore road corridors
  const midLat = (startLat + endLat) / 2;
  const midLng = (startLng + endLng) / 2;
  // Offset curve perpendicular to direct line
  const dLat = endLat - startLat;
  const dLng = endLng - startLng;
  const curveFactor = mode === 'driving' ? 0.08 : 0.03;
  const controlLat = midLat - dLng * curveFactor;
  const controlLng = midLng + dLat * curveFactor;

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // Quadratic bezier
    const lat =
      (1 - t) * (1 - t) * startLat + 2 * (1 - t) * t * controlLat + t * t * endLat;
    const lng =
      (1 - t) * (1 - t) * startLng + 2 * (1 - t) * t * controlLng + t * t * endLng;
    points.push([parseFloat(lat.toFixed(5)), parseFloat(lng.toFixed(5))]);
  }

  return points;
}

/**
 * Generates turn-by-turn route steps
 */
function generateSteps(
  start: LocationPoint,
  end: LocationPoint,
  mode: TravelMode,
  totalDistanceKm: number,
  totalDurationMin: number
): RouteStep[] {
  if (mode === 'driving') {
    return [
      {
        instruction: `Depart from ${start.name} onto local arterial link`,
        distanceKm: +(totalDistanceKm * 0.15).toFixed(1),
        durationMin: Math.round(totalDurationMin * 0.18),
        roadName: 'Arterial Road',
        mode: 'driving',
      },
      {
        instruction: `Merge onto Expressway corridor toward ${end.name}`,
        distanceKm: +(totalDistanceKm * 0.7).toFixed(1),
        durationMin: Math.round(totalDurationMin * 0.64),
        roadName: 'Expressway',
        mode: 'driving',
      },
      {
        instruction: `Take exit toward ${end.name} and arrive at destination`,
        distanceKm: +(totalDistanceKm * 0.15).toFixed(1),
        durationMin: Math.round(totalDurationMin * 0.18),
        roadName: 'Access Road',
        mode: 'driving',
      },
    ];
  } else if (mode === 'transit') {
    return [
      {
        instruction: `Walk 4 mins from ${start.name} to nearest MRT / Bus stop`,
        distanceKm: +(totalDistanceKm * 0.05).toFixed(1),
        durationMin: 4,
        roadName: 'Sheltered Walkway',
        mode: 'walking',
      },
      {
        instruction: `Board MRT / Bus toward destination sector`,
        distanceKm: +(totalDistanceKm * 0.9).toFixed(1),
        durationMin: Math.max(12, totalDurationMin - 8),
        roadName: 'Public Transport Line',
        mode: 'transit',
      },
      {
        instruction: `Alight and walk 4 mins to ${end.name}`,
        distanceKm: +(totalDistanceKm * 0.05).toFixed(1),
        durationMin: 4,
        roadName: 'Sheltered Walkway',
        mode: 'walking',
      },
    ];
  } else {
    // Walking
    return [
      {
        instruction: `Walk from ${start.name} via park connector / walkway`,
        distanceKm: +(totalDistanceKm * 0.5).toFixed(1),
        durationMin: Math.round(totalDurationMin * 0.5),
        roadName: 'Park Connector Network (PCN)',
        mode: 'walking',
      },
      {
        instruction: `Continue along pedestrian path to ${end.name}`,
        distanceKm: +(totalDistanceKm * 0.5).toFixed(1),
        durationMin: Math.round(totalDurationMin * 0.5),
        roadName: 'Footpath',
        mode: 'walking',
      },
    ];
  }
}

/**
 * Calculates multimodal route between start and destination
 */
export async function calculateRoute(
  start: LocationPoint,
  end: LocationPoint,
  mode: TravelMode
): Promise<CalculatedRoute> {
  const directDistanceKm = calculateHaversineDistanceKm(
    start.latitude,
    start.longitude,
    end.latitude,
    end.longitude
  );

  // Road factor for Singapore urban network: ~1.25x - 1.35x direct haversine
  const distanceMultiplier = mode === 'driving' ? 1.28 : mode === 'transit' ? 1.35 : 1.2;
  const distanceKm = parseFloat(
    Math.max(0.5, directDistanceKm * distanceMultiplier).toFixed(1)
  );

  // Speed estimates (km/h)
  let speedKmh = 45; // average driving speed in SG with traffic
  if (mode === 'transit') speedKmh = 26; // includes waiting/transfers
  if (mode === 'walking') speedKmh = 4.8;

  let durationMin = Math.round((distanceKm / speedKmh) * 60);
  if (durationMin < 2) durationMin = 2;

  // Congestion heuristic based on route
  let congestionLevel: 'low' | 'moderate' | 'heavy' = 'low';
  if (
    start.name.includes('Woodlands') ||
    end.name.includes('Woodlands') ||
    start.name.includes('Orchard') ||
    end.name.includes('Orchard')
  ) {
    congestionLevel = 'heavy';
    durationMin = Math.round(durationMin * 1.3);
  } else if (distanceKm > 10) {
    congestionLevel = 'moderate';
  }

  const polyline = generateRoadPolyline(start, end, mode);
  const steps = generateSteps(start, end, mode, distanceKm, durationMin);

  return {
    id: `route-${Date.now()}`,
    summary: `${mode.toUpperCase()} route via Singapore corridor (${distanceKm} km)`,
    distanceKm,
    durationMin,
    polyline,
    steps,
    mode,
    congestionLevel,
    startLocation: start,
    endLocation: end,
  };
}
