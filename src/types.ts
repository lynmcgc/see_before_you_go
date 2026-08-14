export type TravelMode = 'driving' | 'transit' | 'walking';

export interface LocationPoint {
  name: string;
  address?: string;
  postalCode?: string;
  latitude: number;
  longitude: number;
}

export interface TrafficCamera {
  cameraId: string;
  image: string;
  timestamp: string;
  location: {
    latitude: number;
    longitude: number;
  };
  cameraName: string;
  roadName: string;
  imageMetadata?: {
    height?: number;
    width?: number;
    md5?: string;
  };
}

export interface TrafficIncident {
  id: string;
  type: 'Accident' | 'Vehicle breakdown' | 'Roadwork' | 'Heavy Traffic' | 'Obstacle' | 'Weather' | 'Roadblock';
  message: string;
  latitude: number;
  longitude: number;
  roadName: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
}

export interface SpeedBand {
  segmentId: string;
  roadName: string;
  speedBand: number; // 1 (0-10kmh) to 8 (>70kmh)
  minSpeed: number;
  maxSpeed: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
}

export interface RouteStep {
  instruction: string;
  distanceKm: number;
  durationMin: number;
  roadName?: string;
  mode?: TravelMode;
}

export interface CalculatedRoute {
  id: string;
  summary: string;
  distanceKm: number;
  durationMin: number;
  polyline: [number, number][]; // [lat, lng] array
  steps: RouteStep[];
  mode: TravelMode;
  congestionLevel: 'low' | 'moderate' | 'heavy';
  startLocation: LocationPoint;
  endLocation: LocationPoint;
}

export type CameraRole = 'start' | 'end' | 'jam' | 'enroute';

export type MembershipTier = 'free' | 'pro';

export interface MembershipState {
  tier: MembershipTier;
  priceMonthly: number;
  activeSince?: string;
  isAutoRenew: boolean;
}

export interface MatchedCamera {
  camera: TrafficCamera;
  role: CameraRole;
  distanceKm: number; // distance from point to camera
  pointLabel: string;
  relatedIncident?: TrafficIncident;
  isFreeAccess?: boolean; // true for 'start' (home) & 'end' (destination)
}
