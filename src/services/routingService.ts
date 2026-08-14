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
 * Singapore major expressway and arterial nodes for realistic offline fallback routing
 */
const SINGAPORE_ROAD_NODES: { id: string; name: string; lat: number; lng: number }[] = [
  { id: 'woodlands_ckp', name: 'BKE / Woodlands Checkpoint', lat: 1.4439, lng: 103.7698 },
  { id: 'bke_sle_junc', name: 'BKE / SLE Interchange', lat: 1.4230, lng: 103.7715 },
  { id: 'bke_mandai', name: 'BKE / Mandai Rd', lat: 1.4020, lng: 103.7725 },
  { id: 'bke_kje_junc', name: 'BKE / KJE Interchange', lat: 1.3780, lng: 103.7710 },
  { id: 'bke_pie_junc', name: 'BKE / PIE Interchange', lat: 1.3530, lng: 103.7745 },
  { id: 'sle_cte_tpe_junc', name: 'SLE / CTE / TPE Seletar Interchange', lat: 1.3980, lng: 103.8650 },
  { id: 'cte_amk', name: 'CTE / Ang Mo Kio Ave 5', lat: 1.3770, lng: 103.8560 },
  { id: 'cte_braddell', name: 'CTE / Braddell Rd', lat: 1.3430, lng: 103.8580 },
  { id: 'cte_pie_junc', name: 'CTE / PIE Whampoa Interchange', lat: 1.3280, lng: 103.8610 },
  { id: 'cte_cairnhill', name: 'CTE / Cairnhill Circle Tunnel', lat: 1.3090, lng: 103.8410 },
  { id: 'cte_chinatown', name: 'CTE / Merchant Rd / Chin Swee', lat: 1.2880, lng: 103.8420 },
  { id: 'cte_aye_junc', name: 'CTE / AYE Radin Mas Interchange', lat: 1.2770, lng: 103.8290 },
  { id: 'pie_jurong', name: 'PIE / Jurong East / Toh Guan', lat: 1.3400, lng: 103.7500 },
  { id: 'pie_clementi', name: 'PIE / Clementi Ave 6', lat: 1.3320, lng: 103.7680 },
  { id: 'pie_adam', name: 'PIE / Adam Rd / Lornie', lat: 1.3340, lng: 103.8180 },
  { id: 'pie_woodleigh', name: 'PIE / Woodleigh / Upper Serangoon', lat: 1.3340, lng: 103.8710 },
  { id: 'pie_paya_lebar', name: 'PIE / Paya Lebar', lat: 1.3300, lng: 103.8960 },
  { id: 'pie_bedok', name: 'PIE / Bedok North', lat: 1.3360, lng: 103.9280 },
  { id: 'pie_tampines', name: 'PIE / Tampines Ave 5', lat: 1.3500, lng: 103.9500 },
  { id: 'pie_changi', name: 'PIE / Changi Airport Terminal Link', lat: 1.3580, lng: 103.9870 },
  { id: 'aye_tuas_ckp', name: 'AYE / Tuas Checkpoint', lat: 1.3486, lng: 103.6368 },
  { id: 'aye_pioneer', name: 'AYE / Pioneer Rd North', lat: 1.3200, lng: 103.6980 },
  { id: 'aye_jurong_town', name: 'AYE / Jurong Town Hall', lat: 1.3150, lng: 103.7430 },
  { id: 'aye_clementi', name: 'AYE / Clementi Rd', lat: 1.3060, lng: 103.7700 },
  { id: 'aye_buona_vista', name: 'AYE / North Buona Vista', lat: 1.2970, lng: 103.7880 },
  { id: 'aye_alexandra', name: 'AYE / Alexandra Rd', lat: 1.2820, lng: 103.8120 },
  { id: 'ecp_changi', name: 'ECP / Changi Airport Coast', lat: 1.3550, lng: 103.9890 },
  { id: 'ecp_marine_parade', name: 'ECP / Marine Parade', lat: 1.3020, lng: 103.9050 },
  { id: 'ecp_tanjong_rhu', name: 'ECP / Tanjong Rhu / Benjamin Sheares', lat: 1.2930, lng: 103.8680 },
  { id: 'mce_marina_bay', name: 'MCE / Marina Coastal / Bayfront', lat: 1.2760, lng: 103.8550 },
  { id: 'orchard_central', name: 'Orchard Rd / Paterson', lat: 1.3040, lng: 103.8318 },
  { id: 'cbd_raffles', name: 'Raffles Place / Shenton Way', lat: 1.2840, lng: 103.8515 },
  { id: 'tpe_punggol', name: 'TPE / Punggol Rd Interchange', lat: 1.3980, lng: 103.9050 },
  { id: 'kpe_airport_link', name: 'KPE / Airport Rd Tunnel', lat: 1.3410, lng: 103.8920 },
];

/**
 * Creates multi-segment waypoint road path for fallback
 */
function generateRoadPolyline(
  start: LocationPoint,
  end: LocationPoint,
  mode: TravelMode
): [number, number][] {
  // Find closest Singapore road node to start and end
  let startClosest = SINGAPORE_ROAD_NODES[0];
  let startMinDist = Infinity;
  let endClosest = SINGAPORE_ROAD_NODES[0];
  let endMinDist = Infinity;

  for (const node of SINGAPORE_ROAD_NODES) {
    const dStart = calculateHaversineDistanceKm(start.latitude, start.longitude, node.lat, node.lng);
    if (dStart < startMinDist) {
      startMinDist = dStart;
      startClosest = node;
    }
    const dEnd = calculateHaversineDistanceKm(end.latitude, end.longitude, node.lat, node.lng);
    if (dEnd < endMinDist) {
      endMinDist = dEnd;
      endClosest = node;
    }
  }

  const waypoints: [number, number][] = [
    [start.latitude, start.longitude],
  ];

  if (startMinDist > 0.5) {
    waypoints.push([startClosest.lat, startClosest.lng]);
  }

  // If start & end nodes are different, find intermediate road node if distant
  if (startClosest.id !== endClosest.id) {
    const directKm = calculateHaversineDistanceKm(startClosest.lat, startClosest.lng, endClosest.lat, endClosest.lng);
    if (directKm > 5) {
      // Find intermediate node
      const midLat = (startClosest.lat + endClosest.lat) / 2;
      const midLng = (startClosest.lng + endClosest.lng) / 2;
      let midClosest = startClosest;
      let midMinDist = Infinity;
      for (const node of SINGAPORE_ROAD_NODES) {
        if (node.id !== startClosest.id && node.id !== endClosest.id) {
          const dMid = calculateHaversineDistanceKm(midLat, midLng, node.lat, node.lng);
          if (dMid < midMinDist) {
            midMinDist = dMid;
            midClosest = node;
          }
        }
      }
      if (midMinDist < directKm * 0.6) {
        waypoints.push([midClosest.lat, midClosest.lng]);
      }
    }
    waypoints.push([endClosest.lat, endClosest.lng]);
  }

  waypoints.push([end.latitude, end.longitude]);

  // Interpolate smoothly between road waypoints
  const points: [number, number][] = [];
  for (let i = 0; i < waypoints.length - 1; i++) {
    const [lat1, lng1] = waypoints[i];
    const [lat2, lng2] = waypoints[i + 1];
    const subSteps = 6;
    for (let s = 0; s < subSteps; s++) {
      const t = s / subSteps;
      points.push([
        parseFloat((lat1 + (lat2 - lat1) * t).toFixed(5)),
        parseFloat((lng1 + (lng2 - lng1) * t).toFixed(5)),
      ]);
    }
  }
  points.push([end.latitude, end.longitude]);

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
        instruction: `Head out from ${start.name} onto local road`,
        distanceKm: +(totalDistanceKm * 0.15).toFixed(1),
        durationMin: Math.max(1, Math.round(totalDurationMin * 0.15)),
        roadName: 'Local Access Road',
        mode: 'driving',
      },
      {
        instruction: `Merge onto Singapore Expressway corridor towards ${end.name}`,
        distanceKm: +(totalDistanceKm * 0.7).toFixed(1),
        durationMin: Math.max(2, Math.round(totalDurationMin * 0.7)),
        roadName: 'Expressway (PIE / CTE / AYE / BKE)',
        mode: 'driving',
      },
      {
        instruction: `Take exit ramp and arrive at ${end.name}`,
        distanceKm: +(totalDistanceKm * 0.15).toFixed(1),
        durationMin: Math.max(1, Math.round(totalDurationMin * 0.15)),
        roadName: 'Destination Link Road',
        mode: 'driving',
      },
    ];
  } else if (mode === 'transit') {
    return [
      {
        instruction: `Walk from ${start.name} to nearest Bus stop / MRT station`,
        distanceKm: +(totalDistanceKm * 0.08).toFixed(1),
        durationMin: 5,
        roadName: 'Pedestrian Linkway',
        mode: 'walking',
      },
      {
        instruction: `Board MRT / Bus service toward destination sector`,
        distanceKm: +(totalDistanceKm * 0.84).toFixed(1),
        durationMin: Math.max(10, totalDurationMin - 9),
        roadName: 'MRT / Bus Transit Route',
        mode: 'transit',
      },
      {
        instruction: `Alight and walk to ${end.name}`,
        distanceKm: +(totalDistanceKm * 0.08).toFixed(1),
        durationMin: 4,
        roadName: 'Sheltered Walkway',
        mode: 'walking',
      },
    ];
  } else {
    // Walking
    return [
      {
        instruction: `Walk from ${start.name} along pedestrian pathway`,
        distanceKm: +(totalDistanceKm * 0.5).toFixed(1),
        durationMin: Math.round(totalDurationMin * 0.5),
        roadName: 'Park Connector / Sidewalk',
        mode: 'walking',
      },
      {
        instruction: `Continue straight to ${end.name}`,
        distanceKm: +(totalDistanceKm * 0.5).toFixed(1),
        durationMin: Math.round(totalDurationMin * 0.5),
        roadName: 'Pedestrian Footpath',
        mode: 'walking',
      },
    ];
  }
}

/**
 * Calculates multimodal route with real road network geometry
 */
export async function calculateRoute(
  start: LocationPoint,
  end: LocationPoint,
  mode: TravelMode
): Promise<CalculatedRoute> {
  // 1. First attempt real road network calculation from server route API
  try {
    const url = `/api/route?startLat=${start.latitude}&startLng=${start.longitude}&endLat=${end.latitude}&endLng=${end.longitude}&mode=${mode}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.polyline && data.polyline.length > 1) {
        let congestionLevel: 'low' | 'moderate' | 'heavy' = 'low';
        if (
          start.name.toLowerCase().includes('woodlands') ||
          end.name.toLowerCase().includes('woodlands') ||
          start.name.toLowerCase().includes('tuas') ||
          end.name.toLowerCase().includes('tuas') ||
          start.name.toLowerCase().includes('orchard') ||
          end.name.toLowerCase().includes('orchard')
        ) {
          congestionLevel = 'heavy';
        } else if (data.distanceKm > 12) {
          congestionLevel = 'moderate';
        }

        return {
          id: `route-${Date.now()}`,
          summary: `${mode.toUpperCase()} via Singapore Road Network (${data.distanceKm} km)`,
          distanceKm: data.distanceKm,
          durationMin: data.durationMin,
          polyline: data.polyline,
          steps: data.steps && data.steps.length > 0 ? data.steps : generateSteps(start, end, mode, data.distanceKm, data.durationMin),
          mode,
          congestionLevel,
          startLocation: start,
          endLocation: end,
        };
      }
    }
  } catch (err) {
    console.debug('Online road calculation fallback triggered:', err);
  }

  // 2. Fallback to Singapore road network waypoint interpolation
  const directDistanceKm = calculateHaversineDistanceKm(
    start.latitude,
    start.longitude,
    end.latitude,
    end.longitude
  );

  const distanceMultiplier = mode === 'driving' ? 1.3 : mode === 'transit' ? 1.38 : 1.25;
  const distanceKm = parseFloat(
    Math.max(0.5, directDistanceKm * distanceMultiplier).toFixed(1)
  );

  let speedKmh = 45;
  if (mode === 'transit') speedKmh = 26;
  if (mode === 'walking') speedKmh = 4.8;

  let durationMin = Math.round((distanceKm / speedKmh) * 60);
  if (durationMin < 2) durationMin = 2;

  let congestionLevel: 'low' | 'moderate' | 'heavy' = 'low';
  if (
    start.name.includes('Woodlands') ||
    end.name.includes('Woodlands') ||
    start.name.includes('Tuas') ||
    end.name.includes('Tuas') ||
    start.name.includes('Orchard') ||
    end.name.includes('Orchard')
  ) {
    congestionLevel = 'heavy';
    durationMin = Math.round(durationMin * 1.25);
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
