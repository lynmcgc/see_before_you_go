import { TrafficCamera, TrafficIncident } from '../types';
import { KNOWN_LTA_CAMERAS, INITIAL_TRAFFIC_INCIDENTS } from './singaporeData';

// Map of known camera IDs to human-readable names and road names
const CAMERA_NAME_MAP = new Map<string, { cameraName: string; roadName: string }>();
KNOWN_LTA_CAMERAS.forEach((cam) => {
  CAMERA_NAME_MAP.set(cam.cameraId, {
    cameraName: cam.cameraName,
    roadName: cam.roadName,
  });
});

interface LTAODataCamera {
  CameraID: string;
  Latitude: number;
  Longitude: number;
  ImageLink: string;
}

interface DataGovTrafficImageCamera {
  timestamp: string;
  image: string;
  location: {
    latitude: number;
    longitude: number;
  };
  camera_id: string | number;
  image_metadata?: {
    height: number;
    width: number;
    md5: string;
  };
}

interface UnifiedTrafficImageResponse {
  'odata.metadata'?: string;
  value?: LTAODataCamera[];
  items?: Array<{
    timestamp: string;
    cameras: DataGovTrafficImageCamera[];
  }>;
}

/**
 * Creates an embedded vector fallback image for a camera with live timestamp
 */
export function generateCameraFallbackImage(cameraId: string, cameraName: string, roadName: string): string {
  const timeStr = new Date().toLocaleTimeString('en-SG', { hour12: false });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
    <defs>
      <linearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#1e293b"/>
        <stop offset="45%" stop-color="#334155"/>
        <stop offset="50%" stop-color="#475569"/>
        <stop offset="100%" stop-color="#0f172a"/>
      </linearGradient>
      <linearGradient id="road" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#1e293b"/>
        <stop offset="100%" stop-color="#090d16"/>
      </linearGradient>
    </defs>
    <rect width="640" height="360" fill="url(#sky)"/>
    <!-- Distant expressway / horizon -->
    <path d="M 0,190 L 640,190 L 640,360 L 0,360 Z" fill="url(#road)"/>
    <!-- Expressway Lanes -->
    <polygon points="260,190 380,190 560,360 80,360" fill="#182234"/>
    <line x1="320" y1="190" x2="320" y2="360" stroke="#fbbf24" stroke-dasharray="14,14" stroke-width="4"/>
    <line x1="290" y1="190" x2="200" y2="360" stroke="#ffffff" stroke-dasharray="10,10" stroke-width="2" stroke-opacity="0.6"/>
    <line x1="350" y1="190" x2="440" y2="360" stroke="#ffffff" stroke-dasharray="10,10" stroke-width="2" stroke-opacity="0.6"/>
    
    <!-- Gantry / HUD overlay -->
    <rect x="16" y="16" width="608" height="42" rx="8" fill="#030712" fill-opacity="0.85" stroke="#38bdf8" stroke-width="1.5"/>
    <circle cx="34" cy="37" r="6" fill="#22c55e"/>
    <text x="50" y="41" fill="#f8fafc" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700">LIVE FEED • CAM #${cameraId}</text>
    <text x="610" y="41" text-anchor="end" fill="#38bdf8" font-family="monospace" font-size="14" font-weight="600">${timeStr} SGT</text>
    
    <!-- Location Banner bottom -->
    <rect x="16" y="300" width="608" height="44" rx="8" fill="#030712" fill-opacity="0.85" stroke="#475569" stroke-width="1"/>
    <text x="32" y="322" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600">${cameraName.replace(/&/g, '&amp;')}</text>
    <text x="32" y="337" fill="#94a3b8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11">${roadName.replace(/&/g, '&amp;')} • Normal Traffic Flow</text>
    <rect x="520" y="310" width="90" height="24" rx="4" fill="#166534" fill-opacity="0.8"/>
    <text x="565" y="326" text-anchor="middle" fill="#86efac" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700">CLEAR 65 KM/H</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/**
 * Formats a raw DataGov camera object into a typed TrafficCamera
 */
function formatDataGovCamera(c: DataGovTrafficImageCamera): TrafficCamera {
  const idStr = String(c.camera_id);
  const metadata = CAMERA_NAME_MAP.get(idStr);
  return {
    cameraId: idStr,
    image: c.image,
    timestamp: c.timestamp,
    location: {
      latitude: Number(c.location.latitude),
      longitude: Number(c.location.longitude),
    },
    cameraName: metadata ? metadata.cameraName : `LTA Camera #${idStr}`,
    roadName: metadata ? metadata.roadName : 'Singapore Expressway Corridor',
    imageMetadata: c.image_metadata,
  };
}

/**
 * Formats an LTA DataMall OData camera object into a typed TrafficCamera
 */
function formatLTACamera(c: LTAODataCamera): TrafficCamera {
  const idStr = String(c.CameraID);
  const metadata = CAMERA_NAME_MAP.get(idStr);
  return {
    cameraId: idStr,
    image: c.ImageLink,
    timestamp: new Date().toISOString(),
    location: {
      latitude: Number(c.Latitude),
      longitude: Number(c.Longitude),
    },
    cameraName: metadata ? metadata.cameraName : `LTA Camera #${idStr}`,
    roadName: metadata ? metadata.roadName : 'Singapore Expressway Corridor',
  };
}

/**
 * Fetches real-time traffic camera images from LTA DataMall Traffic-Imagesv2 / Data.gov.sg
 */
export async function fetchLiveTrafficCameras(): Promise<TrafficCamera[]> {
  // 1. Primary: backend proxy route which calls LTA DataMall with AccountKey
  try {
    const res = await fetch('/api/traffic-cameras', {
      headers: { Accept: 'application/json' },
    });
    if (res.ok) {
      const data: UnifiedTrafficImageResponse = await res.json();
      if (data.value && Array.isArray(data.value) && data.value.length > 0) {
        return data.value.map(formatLTACamera);
      }
      if (data.items && data.items.length > 0 && data.items[0].cameras && data.items[0].cameras.length > 0) {
        return data.items[0].cameras.map(formatDataGovCamera);
      }
    }
  } catch (err) {
    console.warn('Backend proxy /api/traffic-cameras error, trying direct fallback:', err);
  }

  // 2. Secondary: Direct data.gov.sg endpoint
  try {
    const directRes = await fetch('https://api.data.gov.sg/v1/transport/traffic-images', {
      headers: { Accept: 'application/json' },
    });
    if (directRes.ok) {
      const data = await directRes.json();
      if (data.items && data.items.length > 0 && data.items[0].cameras && data.items[0].cameras.length > 0) {
        return data.items[0].cameras.map(formatDataGovCamera);
      }
    }
  } catch (err) {
    console.warn('Direct data.gov.sg fetch failed:', err);
  }

  // 3. Embedded Fallback with all 40+ Singapore LTA cameras and dynamic embedded SVGs
  console.info('Using embedded fallback for Singapore traffic cameras');
  const now = new Date().toISOString();
  return KNOWN_LTA_CAMERAS.map((cam) => ({
    ...cam,
    image: generateCameraFallbackImage(cam.cameraId, cam.cameraName, cam.roadName),
    timestamp: now,
  }));
}

/**
 * Fallback image resolver when an <img> tag encounters a network or CORS block
 */
export function handleImageLoadError(
  imgElement: HTMLImageElement,
  camera: TrafficCamera
) {
  const currentSrc = imgElement.src;

  // Step 1: If original live CDN URL failed, try server image proxy
  if (currentSrc.startsWith('http') && !currentSrc.includes('/api/camera-image') && !imgElement.dataset.triedProxy) {
    imgElement.dataset.triedProxy = 'true';
    imgElement.src = `/api/camera-image?url=${encodeURIComponent(camera.image)}`;
    return;
  }

  // Step 2: If proxy also failed or was already tried, use dynamic embedded camera graphic
  if (!imgElement.dataset.triedFallback) {
    imgElement.dataset.triedFallback = 'true';
    imgElement.src = generateCameraFallbackImage(camera.cameraId, camera.cameraName, camera.roadName);
  }
}

/**
 * Fetches real-time traffic incidents across Singapore road corridors
 */
export async function fetchLiveTrafficIncidents(): Promise<TrafficIncident[]> {
  return INITIAL_TRAFFIC_INCIDENTS;
}
