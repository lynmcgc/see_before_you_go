import { TrafficCamera, TrafficIncident, CalculatedRoute, MatchedCamera, LocationPoint } from '../types';

/**
 * Calculates Great-Circle distance between two points in kilometers using Haversine formula
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Finds the nearest camera to a given coordinate point
 */
export function findNearestCamera(
  point: { latitude: number; longitude: number },
  cameras: TrafficCamera[],
  maxDistanceKm: number = 8.0 // Singapore expressway cameras are well distributed within ~5-8km
): { camera: TrafficCamera; distanceKm: number } | null {
  if (!cameras || cameras.length === 0) return null;

  let nearestCamera: TrafficCamera | null = null;
  let minDistance = Infinity;

  for (const camera of cameras) {
    const dist = calculateHaversineDistanceKm(
      point.latitude,
      point.longitude,
      camera.location.latitude,
      camera.location.longitude
    );

    if (dist < minDistance && dist <= maxDistanceKm) {
      minDistance = dist;
      nearestCamera = camera;
    }
  }

  if (nearestCamera) {
    return {
      camera: nearestCamera,
      distanceKm: parseFloat(minDistance.toFixed(2)),
    };
  }

  return null;
}

/**
 * Finds distance from a point to the nearest segment on the route polyline
 */
export function minDistanceToRoutePolylineKm(
  point: { latitude: number; longitude: number },
  polyline: [number, number][]
): number {
  if (!polyline || polyline.length === 0) return Infinity;

  let minDistance = Infinity;
  for (const coord of polyline) {
    const dist = calculateHaversineDistanceKm(
      point.latitude,
      point.longitude,
      coord[0],
      coord[1]
    );
    if (dist < minDistance) {
      minDistance = dist;
    }
  }
  return minDistance;
}

/**
 * Identifies traffic incidents that fall within the route corridor (default < 1.5 km buffer)
 */
export function detectCorridorIncidents(
  route: CalculatedRoute,
  incidents: TrafficIncident[],
  corridorThresholdKm: number = 1.5
): TrafficIncident[] {
  if (!route.polyline || route.polyline.length === 0 || !incidents) return [];

  return incidents.filter((incident) => {
    const dist = minDistanceToRoutePolylineKm(
      { latitude: incident.latitude, longitude: incident.longitude },
      route.polyline
    );
    return dist <= corridorThresholdKm;
  });
}

/**
 * Matches start, end, and detected corridor jam/incident points to their closest traffic cameras
 * Start (Home) and End (Destination) are tagged as free access.
 * En-route and Jam points are tagged as Pro subscription feeds ($4.99/mo).
 * Returns up to 6 total matched cameras.
 */
export function matchCamerasToRoute(
  route: CalculatedRoute,
  cameras: TrafficCamera[],
  incidents: TrafficIncident[]
): MatchedCamera[] {
  const matched: MatchedCamera[] = [];
  const addedCameraIds = new Set<string>();

  // 1. Match Start Location Camera (Home/Origin - FREE)
  const startMatch = findNearestCamera(route.startLocation, cameras);
  if (startMatch) {
    matched.push({
      camera: startMatch.camera,
      role: 'start',
      distanceKm: startMatch.distanceKm,
      pointLabel: `Origin: ${route.startLocation.name}`,
      isFreeAccess: true,
    });
    addedCameraIds.add(startMatch.camera.cameraId);
  }

  // 2. Match Jam / Incident Points along corridor (PRO)
  const corridorIncidents = detectCorridorIncidents(route, incidents);
  const jamCameras: MatchedCamera[] = [];
  for (const incident of corridorIncidents) {
    const jamMatch = findNearestCamera(
      { latitude: incident.latitude, longitude: incident.longitude },
      cameras
    );

    if (jamMatch && !addedCameraIds.has(jamMatch.camera.cameraId)) {
      jamCameras.push({
        camera: jamMatch.camera,
        role: 'jam',
        distanceKm: jamMatch.distanceKm,
        pointLabel: `Jam Alert: ${incident.type} on ${incident.roadName}`,
        relatedIncident: incident,
        isFreeAccess: false,
      });
      addedCameraIds.add(jamMatch.camera.cameraId);
    }
  }

  // Add up to 2-3 jam cameras
  matched.push(...jamCameras.slice(0, 3));

  // 3. Match En-route Expressway Cameras along the route polyline (PRO)
  if (route.polyline.length > 4) {
    // Check intermediate sample points along the route
    const sampleStep = Math.max(1, Math.floor(route.polyline.length / 5));
    for (let i = sampleStep; i < route.polyline.length - sampleStep; i += sampleStep) {
      if (matched.length >= 5) break; // Leave room for destination

      const pt = route.polyline[i];
      const enrouteMatch = findNearestCamera(
        { latitude: pt[0], longitude: pt[1] },
        cameras,
        2.5 // corridor for expressway cameras
      );

      if (enrouteMatch && !addedCameraIds.has(enrouteMatch.camera.cameraId)) {
        matched.push({
          camera: enrouteMatch.camera,
          role: 'enroute',
          distanceKm: enrouteMatch.distanceKm,
          pointLabel: `En-Route: ${enrouteMatch.camera.roadName}`,
          isFreeAccess: false,
        });
        addedCameraIds.add(enrouteMatch.camera.cameraId);
      }
    }
  }

  // 4. Match End Location Camera (Destination - FREE)
  const endMatch = findNearestCamera(route.endLocation, cameras);
  if (endMatch && !addedCameraIds.has(endMatch.camera.cameraId)) {
    matched.push({
      camera: endMatch.camera,
      role: 'end',
      distanceKm: endMatch.distanceKm,
      pointLabel: `Destination: ${route.endLocation.name}`,
      isFreeAccess: true,
    });
    addedCameraIds.add(endMatch.camera.cameraId);
  } else if (endMatch && addedCameraIds.has(endMatch.camera.cameraId)) {
    // If start and end matched same camera (very close trip), label accordingly
    const existing = matched.find((m) => m.camera.cameraId === endMatch.camera.cameraId);
    if (existing && existing.role === 'start') {
      existing.pointLabel = `Origin & Destination: ${route.startLocation.name}`;
      existing.isFreeAccess = true;
    }
  }

  // Capped at up to 6 cameras depending on the jam along the journey
  return matched.slice(0, 6);
}

