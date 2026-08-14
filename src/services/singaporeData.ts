import { LocationPoint, TrafficCamera, TrafficIncident } from '../types';

export const SINGAPORE_PRESET_LOCATIONS: LocationPoint[] = [
  {
    name: 'Woodlands Checkpoint',
    address: 'Woodlands Crossing, Singapore 738203',
    postalCode: '738203',
    latitude: 1.4439,
    longitude: 103.7698,
  },
  {
    name: 'Tuas Checkpoint',
    address: '501 Jalan Ahmad Ibrahim, Singapore 639937',
    postalCode: '639937',
    latitude: 1.3486,
    longitude: 103.6368,
  },
  {
    name: 'Changi Airport Terminal 3',
    address: '65 Airport Boulevard, Singapore 819663',
    postalCode: '819663',
    latitude: 1.3572,
    longitude: 103.9897,
  },
  {
    name: 'Marina Bay Sands',
    address: '10 Bayfront Avenue, Singapore 018956',
    postalCode: '018956',
    latitude: 1.2834,
    longitude: 103.8607,
  },
  {
    name: 'Orchard Road (ION Orchard)',
    address: '2 Orchard Turn, Singapore 238801',
    postalCode: '238801',
    latitude: 1.3040,
    longitude: 103.8318,
  },
  {
    name: 'Jurong East MRT / Westgate',
    address: '3 Gateway Drive, Singapore 608532',
    postalCode: '608532',
    latitude: 1.3331,
    longitude: 103.7436,
  },
  {
    name: 'Tampines Mall / Hub',
    address: '4 Tampines Central 5, Singapore 529510',
    postalCode: '529510',
    latitude: 1.3532,
    longitude: 103.9452,
  },
  {
    name: 'Ang Mo Kio Hub',
    address: '53 Ang Mo Kio Ave 3, Singapore 569933',
    postalCode: '569933',
    latitude: 1.3691,
    longitude: 103.8483,
  },
  {
    name: 'Raffles Place (CBD)',
    address: 'Raffles Place, Financial District, Singapore 048616',
    postalCode: '048616',
    latitude: 1.2840,
    longitude: 103.8515,
  },
  {
    name: 'Sentosa Gateway / Resort',
    address: '8 Sentosa Gateway, Singapore 098269',
    postalCode: '098269',
    latitude: 1.2560,
    longitude: 103.8210,
  },
  {
    name: 'Woodlands Civic Centre',
    address: '900 South Woodlands Drive, Singapore 730900',
    postalCode: '730900',
    latitude: 1.4361,
    longitude: 103.7865,
  },
  {
    name: 'Bugis Junction',
    address: '200 Victoria Street, Singapore 188021',
    postalCode: '188021',
    latitude: 1.3006,
    longitude: 103.8558,
  },
  {
    name: 'Punggol Waterway Point',
    address: '83 Punggol Central, Singapore 828761',
    postalCode: '828761',
    latitude: 1.4067,
    longitude: 103.9022,
  },
  {
    name: 'Clementi Central',
    address: '3155 Commonwealth Ave W, Singapore 129588',
    postalCode: '129588',
    latitude: 1.3150,
    longitude: 103.7650,
  }
];

// Reference known LTA Traffic Cameras with coordinates and human readable road names
export const KNOWN_LTA_CAMERAS: Omit<TrafficCamera, 'image' | 'timestamp'>[] = [
  {
    cameraId: '1701',
    cameraName: 'CTE (Moulmein Flyover)',
    roadName: 'Central Expressway (CTE)',
    location: { latitude: 1.3188, longitude: 103.8533 }
  },
  {
    cameraId: '1702',
    cameraName: 'CTE (Braddell Flyover)',
    roadName: 'Central Expressway (CTE)',
    location: { latitude: 1.3432, longitude: 103.8573 }
  },
  {
    cameraId: '1703',
    cameraName: 'CTE (Ang Mo Kio Ave 5 Flyover)',
    roadName: 'Central Expressway (CTE)',
    location: { latitude: 1.3789, longitude: 103.8576 }
  },
  {
    cameraId: '1704',
    cameraName: 'CTE (Bukit Timah Rd Entrance)',
    roadName: 'Central Expressway (CTE)',
    location: { latitude: 1.3115, longitude: 103.8458 }
  },
  {
    cameraId: '1705',
    cameraName: 'CTE (Buyong Road / Orchard)',
    roadName: 'Central Expressway (CTE)',
    location: { latitude: 1.3012, longitude: 103.8423 }
  },
  {
    cameraId: '1706',
    cameraName: 'CTE (Yio Chu Kang Flyover)',
    roadName: 'Central Expressway (CTE)',
    location: { latitude: 1.3932, longitude: 103.8642 }
  },
  {
    cameraId: '2701',
    cameraName: 'Woodlands Causeway (Towards Johor)',
    roadName: 'Woodlands Checkpoint',
    location: { latitude: 1.4485, longitude: 103.7692 }
  },
  {
    cameraId: '2702',
    cameraName: 'BKE (Woodlands Flyover / Checkpoint Exit)',
    roadName: 'Bukit Timah Expressway (BKE)',
    location: { latitude: 1.4398, longitude: 103.7712 }
  },
  {
    cameraId: '2703',
    cameraName: 'BKE (Turf Club Flyover)',
    roadName: 'Bukit Timah Expressway (BKE)',
    location: { latitude: 1.4253, longitude: 103.7645 }
  },
  {
    cameraId: '2704',
    cameraName: 'BKE (Mandai Lake Flyover)',
    roadName: 'Bukit Timah Expressway (BKE)',
    location: { latitude: 1.3986, longitude: 103.7758 }
  },
  {
    cameraId: '2705',
    cameraName: 'BKE (Dairy Farm Flyover)',
    roadName: 'Bukit Timah Expressway (BKE)',
    location: { latitude: 1.3654, longitude: 103.7752 }
  },
  {
    cameraId: '4701',
    cameraName: 'Tuas Second Link (Towards Malaysia)',
    roadName: 'Tuas Checkpoint',
    location: { latitude: 1.3496, longitude: 103.6334 }
  },
  {
    cameraId: '4702',
    cameraName: 'AYE (Tuas West Drive Flyover)',
    roadName: 'Ayer Rajah Expressway (AYE)',
    location: { latitude: 1.3326, longitude: 103.6425 }
  },
  {
    cameraId: '4703',
    cameraName: 'AYE (Benoi Sector Flyover)',
    roadName: 'Ayer Rajah Expressway (AYE)',
    location: { latitude: 1.3175, longitude: 103.6948 }
  },
  {
    cameraId: '4704',
    cameraName: 'AYE (Jurong Town Hall Flyover)',
    roadName: 'Ayer Rajah Expressway (AYE)',
    location: { latitude: 1.3218, longitude: 103.7431 }
  },
  {
    cameraId: '4705',
    cameraName: 'AYE (Clementi Flyover)',
    roadName: 'Ayer Rajah Expressway (AYE)',
    location: { latitude: 1.3112, longitude: 103.7634 }
  },
  {
    cameraId: '4706',
    cameraName: 'AYE (Buona Vista Flyover)',
    roadName: 'Ayer Rajah Expressway (AYE)',
    location: { latitude: 1.2981, longitude: 103.7885 }
  },
  {
    cameraId: '4707',
    cameraName: 'AYE (Keppel Viaduct / VivoCity)',
    roadName: 'Ayer Rajah Expressway (AYE)',
    location: { latitude: 1.2721, longitude: 103.8248 }
  },
  {
    cameraId: '5701',
    cameraName: 'PIE (Jalan Anak Bukit Flyover)',
    roadName: 'Pan Island Expressway (PIE)',
    location: { latitude: 1.3429, longitude: 103.7745 }
  },
  {
    cameraId: '5702',
    cameraName: 'PIE (Eng Neo Flyover)',
    roadName: 'Pan Island Expressway (PIE)',
    location: { latitude: 1.3346, longitude: 103.7994 }
  },
  {
    cameraId: '5703',
    cameraName: 'PIE (Whampoa Flyover)',
    roadName: 'Pan Island Expressway (PIE)',
    location: { latitude: 1.3275, longitude: 103.8562 }
  },
  {
    cameraId: '5704',
    cameraName: 'PIE (Woodsville Flyover / Kallang Way)',
    roadName: 'Pan Island Expressway (PIE)',
    location: { latitude: 1.3262, longitude: 103.8741 }
  },
  {
    cameraId: '5705',
    cameraName: 'PIE (Paya Lebar Flyover)',
    roadName: 'Pan Island Expressway (PIE)',
    location: { latitude: 1.3321, longitude: 103.8935 }
  },
  {
    cameraId: '5706',
    cameraName: 'PIE (Bedok North Flyover)',
    roadName: 'Pan Island Expressway (PIE)',
    location: { latitude: 1.3392, longitude: 103.9214 }
  },
  {
    cameraId: '5707',
    cameraName: 'PIE (Tampines Flyover)',
    roadName: 'Pan Island Expressway (PIE)',
    location: { latitude: 1.3498, longitude: 103.9482 }
  },
  {
    cameraId: '5708',
    cameraName: 'PIE (Changi Airport Flyover)',
    roadName: 'Pan Island Expressway (PIE)',
    location: { latitude: 1.3592, longitude: 103.9785 }
  },
  {
    cameraId: '6701',
    cameraName: 'ECP (Benjamin Sheares Bridge)',
    roadName: 'East Coast Parkway (ECP)',
    location: { latitude: 1.2915, longitude: 103.8614 }
  },
  {
    cameraId: '6702',
    cameraName: 'ECP (Tanjong Rhu / Fort Road Flyover)',
    roadName: 'East Coast Parkway (ECP)',
    location: { latitude: 1.2982, longitude: 103.8821 }
  },
  {
    cameraId: '6703',
    cameraName: 'ECP (Marine Parade Flyover)',
    roadName: 'East Coast Parkway (ECP)',
    location: { latitude: 1.3025, longitude: 103.9142 }
  },
  {
    cameraId: '6704',
    cameraName: 'ECP (Laguna Flyover / Bedok)',
    roadName: 'East Coast Parkway (ECP)',
    location: { latitude: 1.3142, longitude: 103.9456 }
  },
  {
    cameraId: '6705',
    cameraName: 'ECP (Changi Coast Road / Airport Entrance)',
    roadName: 'East Coast Parkway (ECP)',
    location: { latitude: 1.3498, longitude: 103.9852 }
  },
  {
    cameraId: '7701',
    cameraName: 'SLE (Lentor Flyover)',
    roadName: 'Seletar Expressway (SLE)',
    location: { latitude: 1.3962, longitude: 103.8345 }
  },
  {
    cameraId: '7702',
    cameraName: 'SLE (Upper Thomson Flyover)',
    roadName: 'Seletar Expressway (SLE)',
    location: { latitude: 1.4082, longitude: 103.8115 }
  },
  {
    cameraId: '8701',
    cameraName: 'TPE (Punggol Flyover)',
    roadName: 'Tampines Expressway (TPE)',
    location: { latitude: 1.3942, longitude: 103.9145 }
  },
  {
    cameraId: '8702',
    cameraName: 'TPE (Seletar Aerospace Flyover)',
    roadName: 'Tampines Expressway (TPE)',
    location: { latitude: 1.4085, longitude: 103.8742 }
  },
  {
    cameraId: '9701',
    cameraName: 'MCE (Marina Boulevard / Central Blvd)',
    roadName: 'Marina Coastal Expressway (MCE)',
    location: { latitude: 1.2755, longitude: 103.8568 }
  },
  {
    cameraId: '9702',
    cameraName: 'KPE (Kallang Bahru Tunnel Entrance)',
    roadName: 'Kallang-Paya Lebar Expressway (KPE)',
    location: { latitude: 1.3154, longitude: 103.8725 }
  }
];

export const INITIAL_TRAFFIC_INCIDENTS: TrafficIncident[] = [
  {
    id: 'inc-1',
    type: 'Heavy Traffic',
    message: 'Heavy traffic buildup on CTE (towards AYE) after Moulmein Flyover. Vehicle queue extending to Braddell.',
    latitude: 1.3255,
    longitude: 103.8545,
    roadName: 'Central Expressway (CTE)',
    timestamp: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
    severity: 'high'
  },
  {
    id: 'inc-2',
    type: 'Vehicle breakdown',
    message: 'Vehicle breakdown on PIE (towards Changi) near Woodsville Flyover. Lane 1 blocked. Pass with caution.',
    latitude: 1.3262,
    longitude: 103.8741,
    roadName: 'Pan Island Expressway (PIE)',
    timestamp: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
    severity: 'medium'
  },
  {
    id: 'inc-3',
    type: 'Heavy Traffic',
    message: 'Congestion on BKE (towards Woodlands Checkpoint) approaching Causeway clearance zone.',
    latitude: 1.4420,
    longitude: 103.7705,
    roadName: 'Bukit Timah Expressway (BKE)',
    timestamp: new Date(Date.now() - 9 * 60 * 1000).toISOString(),
    severity: 'high'
  },
  {
    id: 'inc-4',
    type: 'Roadwork',
    message: 'Road maintenance work on AYE (towards Tuas) before Jurong Town Hall Rd exit. Speed limit 50km/h.',
    latitude: 1.3218,
    longitude: 103.7431,
    roadName: 'Ayer Rajah Expressway (AYE)',
    timestamp: new Date(Date.now() - 28 * 60 * 1000).toISOString(),
    severity: 'low'
  }
];
