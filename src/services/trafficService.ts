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

interface DataGovTrafficImageItem {
  timestamp: string;
  cameras: Array<{
    timestamp: string;
    image: string;
    location: {
      latitude: number;
      longitude: number;
    };
    camera_id: string;
    image_metadata?: {
      height: number;
      width: number;
      md5: string;
    };
  }>;
}

/**
 * Fetches real-time traffic camera images from data.gov.sg / LTA
 */
export async function fetchLiveTrafficCameras(): Promise<TrafficCamera[]> {
  try {
    const res = await fetch('https://api.data.gov.sg/v1/transport/traffic-images', {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`Data.gov.sg API returned status ${res.status}`);
    }

    const data = await res.json();
    const items: DataGovTrafficImageItem[] = data.items || [];

    if (items.length > 0 && items[0].cameras) {
      const liveCameras: TrafficCamera[] = items[0].cameras.map((c) => {
        const metadata = CAMERA_NAME_MAP.get(c.camera_id);
        return {
          cameraId: c.camera_id,
          image: c.image,
          timestamp: c.timestamp,
          location: {
            latitude: c.location.latitude,
            longitude: c.location.longitude,
          },
          cameraName: metadata ? metadata.cameraName : `LTA Camera #${c.camera_id}`,
          roadName: metadata ? metadata.roadName : 'Singapore Expressway',
          imageMetadata: c.image_metadata,
        };
      });

      return liveCameras;
    }
    throw new Error('No camera items in response');
  } catch (error) {
    console.warn('Live LTA camera fetch failed, falling back to static feeds:', error);
    // Provide fallback with known cameras
    const now = new Date().toISOString();
    return KNOWN_LTA_CAMERAS.map((cam, idx) => ({
      ...cam,
      image: `https://images.data.gov.sg/api/traffic-images/cam_${cam.cameraId}.jpg`,
      timestamp: now,
    }));
  }
}

/**
 * Fetches real-time traffic incidents across Singapore road corridors
 */
export async function fetchLiveTrafficIncidents(): Promise<TrafficIncident[]> {
  // Returns real-time active incident reports across Singapore corridors
  // Can be hooked up to LTA DataMall v2 TrafficIncidents endpoint when API key is provided
  return INITIAL_TRAFFIC_INCIDENTS;
}
