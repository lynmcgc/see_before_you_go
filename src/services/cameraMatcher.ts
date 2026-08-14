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
  maxDistanceKm: number = 25.0 // Cover all Singapore regions
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
 * Identifies traffic incidents that fall within the route corridor (default < 3.0 km buffer)
 */
export function detectCorridorIncidents(
  route: CalculatedRoute,
  incidents: TrafficIncident[],
  corridorThresholdKm: number = 3.0
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
  if (!cameras || cameras.length === 0) return [];

  const matched: MatchedCamera[] = [];
  const addedCameraIds = new Set<string>();

  // 1. Match Start Location Camera (Home/Origin - FREE)
  const startMatch = findNearestCamera(route.startLocation, cameras, 20.0);
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

  // 2. Match End Location Camera (Destination - FREE)
  const endMatch = findNearestCamera(route.endLocation, cameras, 20.0);
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
    const existing = matched.find((m) => m.camera.cameraId === endMatch.camera.cameraId);
    if (existing && existing.role === 'start') {
      existing.pointLabel = `Origin & Destination: ${route.startLocation.name}`;
      existing.isFreeAccess = true;
    }
  }

  // 3. Match Jam / Incident Points along corridor (PRO)
  const corridorIncidents = detectCorridorIncidents(route, incidents, 4.0);
  const jamCameras: MatchedCamera[] = [];
  for (const incident of corridorIncidents) {
    if (matched.length + jamCameras.length >= 6) break;

    const jamMatch = findNearestCamera(
      { latitude: incident.latitude, longitude: incident.longitude },
      cameras,
      12.0
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
  matched.push(...jamCameras);

  // 4. Match En-route Expressway Cameras along the route polyline (PRO)
  if (route.polyline && route.polyline.length > 2 && matched.length < 6) {
    const sampleCount = 6;
    const step = Math.max(1, Math.floor(route.polyline.length / sampleCount));
    for (let i = step; i < route.polyline.length - 1; i += step) {
      if (matched.length >= 6) break;

      const pt = route.polyline[i];
      const enrouteMatch = findNearestCamera(
        { latitude: pt[0], longitude: pt[1] },
        cameras,
        8.0 // corridor buffer for expressway cameras
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

  // 5. If fewer than 2 cameras matched (e.g. short localized journey), fill remaining slots with closest cameras
  if (matched.length < 2 && cameras.length > 0) {
    for (const cam of cameras) {
      if (matched.length >= 4) break;
      if (!addedCameraIds.has(cam.cameraId)) {
        const dist = calculateHaversineDistanceKm(
          route.startLocation.latitude,
          route.startLocation.longitude,
          cam.location.latitude,
          cam.location.longitude
        );
        matched.push({
          camera: cam,
          role: 'enroute',
          distanceKm: parseFloat(dist.toFixed(2)),
          pointLabel: `Corridor: ${cam.roadName}`,
          isFreeAccess: false,
        });
        addedCameraIds.add(cam.cameraId);
      }
    }
  }

  return matched.slice(0, 6);
}

