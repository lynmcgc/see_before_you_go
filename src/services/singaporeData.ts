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

// Complete reference of LTA Traffic Cameras mapped from DataMall Traffic-Imagesv2
export const KNOWN_LTA_CAMERAS: Omit<TrafficCamera, 'image' | 'timestamp'>[] = [
  // KPE (1001 - 1006)
  { cameraId: '1001', cameraName: 'KPE (Kallang Bahru / Airport Flyover)', roadName: 'Kallang-Paya Lebar Expressway (KPE)', location: { latitude: 1.29531332, longitude: 103.871146 } },
  { cameraId: '1002', cameraName: 'KPE (PIE / Kallang River Exit)', roadName: 'Kallang-Paya Lebar Expressway (KPE)', location: { latitude: 1.319541067, longitude: 103.8785627 } },
  { cameraId: '1003', cameraName: 'KPE (Aljunied Road)', roadName: 'Kallang-Paya Lebar Expressway (KPE)', location: { latitude: 1.323957439, longitude: 103.8728576 } },
  { cameraId: '1004', cameraName: 'KPE (Geylang Road)', roadName: 'Kallang-Paya Lebar Expressway (KPE)', location: { latitude: 1.319535712, longitude: 103.8750668 } },
  { cameraId: '1005', cameraName: 'KPE (Defu Flyover / Hougang)', roadName: 'Kallang-Paya Lebar Expressway (KPE)', location: { latitude: 1.363519886, longitude: 103.905394 } },
  { cameraId: '1006', cameraName: 'KPE (Tampines Road Entrance)', roadName: 'Kallang-Paya Lebar Expressway (KPE)', location: { latitude: 1.357098686, longitude: 103.902042 } },

  // MCE (1501 - 1505)
  { cameraId: '1501', cameraName: 'MCE (Marina Coastal Expressway / Marina Bay)', roadName: 'Marina Coastal Expressway (MCE)', location: { latitude: 1.27414394350065, longitude: 103.851316802547 } },
  { cameraId: '1502', cameraName: 'MCE (Marina South Viaduct)', roadName: 'Marina Coastal Expressway (MCE)', location: { latitude: 1.27135090682664, longitude: 103.861828440597 } },
  { cameraId: '1503', cameraName: 'MCE (Marina Boulevard Entrance)', roadName: 'Marina Coastal Expressway (MCE)', location: { latitude: 1.27066408655104, longitude: 103.856977943394 } },
  { cameraId: '1504', cameraName: 'MCE / ECP (Benjamin Sheares Bridge)', roadName: 'Marina Coastal Expressway (MCE)', location: { latitude: 1.29409891409364, longitude: 103.876056196568 } },
  { cameraId: '1505', cameraName: 'MCE (Marina East Tunnel)', roadName: 'Marina Coastal Expressway (MCE)', location: { latitude: 1.2752977149006, longitude: 103.866390381759 } },

  // CTE (1701 - 1711)
  { cameraId: '1701', cameraName: 'CTE (Moulmein Flyover)', roadName: 'Central Expressway (CTE)', location: { latitude: 1.323604823, longitude: 103.8587802 } },
  { cameraId: '1702', cameraName: 'CTE (Braddell Flyover)', roadName: 'Central Expressway (CTE)', location: { latitude: 1.34355015, longitude: 103.8601984 } },
  { cameraId: '1703', cameraName: 'CTE (Whampoa Flyover)', roadName: 'Central Expressway (CTE)', location: { latitude: 1.32814722194857, longitude: 103.862203282048 } },
  { cameraId: '1704', cameraName: 'CTE (Havelock Road / Chin Swee)', roadName: 'Central Expressway (CTE)', location: { latitude: 1.28569398886979, longitude: 103.837524510188 } },
  { cameraId: '1705', cameraName: 'CTE (Ang Mo Kio Ave 5 Flyover)', roadName: 'Central Expressway (CTE)', location: { latitude: 1.375925022, longitude: 103.8587986 } },
  { cameraId: '1706', cameraName: 'CTE (Yio Chu Kang Flyover)', roadName: 'Central Expressway (CTE)', location: { latitude: 1.38861, longitude: 103.85806 } },
  { cameraId: '1707', cameraName: 'CTE (Outram Road Tunnel Entrance)', roadName: 'Central Expressway (CTE)', location: { latitude: 1.28036584335876, longitude: 103.830451146503 } },
  { cameraId: '1709', cameraName: 'CTE (Cairnhill / Bukit Timah Road)', roadName: 'Central Expressway (CTE)', location: { latitude: 1.31384231654635, longitude: 103.845603032574 } },
  { cameraId: '1711', cameraName: 'CTE (Bishan Flyover)', roadName: 'Central Expressway (CTE)', location: { latitude: 1.35296, longitude: 103.85719 } },

  // BKE & Woodlands (2701 - 2708)
  { cameraId: '2701', cameraName: 'Woodlands Causeway (Towards Johor)', roadName: 'Woodlands Checkpoint', location: { latitude: 1.447023728, longitude: 103.7716543 } },
  { cameraId: '2702', cameraName: 'BKE (Woodlands Flyover / Checkpoint Exit)', roadName: 'Bukit Timah Expressway (BKE)', location: { latitude: 1.445554109, longitude: 103.7683397 } },
  { cameraId: '2703', cameraName: 'BKE (Dairy Farm / Rifle Range)', roadName: 'Bukit Timah Expressway (BKE)', location: { latitude: 1.35047790791386, longitude: 103.791033581325 } },
  { cameraId: '2704', cameraName: 'BKE (Mandai Lake Flyover)', roadName: 'Bukit Timah Expressway (BKE)', location: { latitude: 1.429588536, longitude: 103.769311 } },
  { cameraId: '2705', cameraName: 'BKE (Dairy Farm Flyover)', roadName: 'Bukit Timah Expressway (BKE)', location: { latitude: 1.36728572, longitude: 103.7794698 } },
  { cameraId: '2706', cameraName: 'BKE (Mandai Road Flyover)', roadName: 'Bukit Timah Expressway (BKE)', location: { latitude: 1.414142, longitude: 103.771168 } },
  { cameraId: '2707', cameraName: 'BKE (Senja Flyover)', roadName: 'Bukit Timah Expressway (BKE)', location: { latitude: 1.3983, longitude: 103.774247 } },
  { cameraId: '2708', cameraName: 'BKE (Cashew / Bukit Panjang Flyover)', roadName: 'Bukit Timah Expressway (BKE)', location: { latitude: 1.3865, longitude: 103.7747 } },

  // ECP (3702 - 3798)
  { cameraId: '3702', cameraName: 'ECP (Changi Airport / Coast)', roadName: 'East Coast Parkway (ECP)', location: { latitude: 1.33831, longitude: 103.98032 } },
  { cameraId: '3704', cameraName: 'ECP (Fort Road Flyover)', roadName: 'East Coast Parkway (ECP)', location: { latitude: 1.2958550156561, longitude: 103.880314665981 } },
  { cameraId: '3705', cameraName: 'ECP (Tanah Merah Coast)', roadName: 'East Coast Parkway (ECP)', location: { latitude: 1.32743, longitude: 103.97383 } },
  { cameraId: '3793', cameraName: 'ECP (Laguna Flyover)', roadName: 'East Coast Parkway (ECP)', location: { latitude: 1.309330837, longitude: 103.9350504 } },
  { cameraId: '3795', cameraName: 'ECP (Still Road South)', roadName: 'East Coast Parkway (ECP)', location: { latitude: 1.30145145166066, longitude: 103.910596320237 } },
  { cameraId: '3796', cameraName: 'ECP (Tanjong Katong Flyover)', roadName: 'East Coast Parkway (ECP)', location: { latitude: 1.297512569, longitude: 103.8983019 } },
  { cameraId: '3797', cameraName: 'ECP (Mountbatten Road)', roadName: 'East Coast Parkway (ECP)', location: { latitude: 1.29565733262976, longitude: 103.885283049309 } },
  { cameraId: '3798', cameraName: 'ECP (Benjamin Sheares Bridge / Marina East)', roadName: 'East Coast Parkway (ECP)', location: { latitude: 1.29158484, longitude: 103.8615987 } },

  // AYE, Tuas & Sentosa (4701 - 4799)
  { cameraId: '4701', cameraName: 'AYE (Alexandra Flyover)', roadName: 'Ayer Rajah Expressway (AYE)', location: { latitude: 1.2871, longitude: 103.79633 } },
  { cameraId: '4702', cameraName: 'AYE (Keppel Viaduct)', roadName: 'Ayer Rajah Expressway (AYE)', location: { latitude: 1.27237, longitude: 103.8324 } },
  { cameraId: '4703', cameraName: 'Tuas Checkpoint (Departure Plaza)', roadName: 'Tuas Checkpoint', location: { latitude: 1.348697862, longitude: 103.6350413 } },
  { cameraId: '4704', cameraName: 'AYE (Radin Mas Flyover)', roadName: 'Ayer Rajah Expressway (AYE)', location: { latitude: 1.27877, longitude: 103.82375 } },
  { cameraId: '4705', cameraName: 'AYE (Pandan Reservoir / Teban)', roadName: 'Ayer Rajah Expressway (AYE)', location: { latitude: 1.32618, longitude: 103.73028 } },
  { cameraId: '4706', cameraName: 'AYE (Buona Vista Flyover)', roadName: 'Ayer Rajah Expressway (AYE)', location: { latitude: 1.29792, longitude: 103.78205 } },
  { cameraId: '4707', cameraName: 'AYE (Tuas Flyover)', roadName: 'Ayer Rajah Expressway (AYE)', location: { latitude: 1.33344648135658, longitude: 103.652700847056 } },
  { cameraId: '4708', cameraName: 'AYE (Portsdown Flyover)', roadName: 'Ayer Rajah Expressway (AYE)', location: { latitude: 1.29939, longitude: 103.7799 } },
  { cameraId: '4709', cameraName: 'AYE (Clementi Flyover)', roadName: 'Ayer Rajah Expressway (AYE)', location: { latitude: 1.312019, longitude: 103.763002 } },
  { cameraId: '4710', cameraName: 'AYE (Faber Flyover)', roadName: 'Ayer Rajah Expressway (AYE)', location: { latitude: 1.32153, longitude: 103.75273 } },
  { cameraId: '4712', cameraName: 'AYE (Towards Tuas Checkpoint)', roadName: 'Ayer Rajah Expressway (AYE)', location: { latitude: 1.341244001, longitude: 103.6439134 } },
  { cameraId: '4713', cameraName: 'Tuas Second Link (Arrival Corridor)', roadName: 'Tuas Checkpoint', location: { latitude: 1.347645829, longitude: 103.6366955 } },
  { cameraId: '4714', cameraName: 'AYE (West Coast Highway Flyover)', roadName: 'Ayer Rajah Expressway (AYE)', location: { latitude: 1.31023, longitude: 103.76438 } },
  { cameraId: '4716', cameraName: 'AYE (Benoi Flyover)', roadName: 'Ayer Rajah Expressway (AYE)', location: { latitude: 1.32227, longitude: 103.67453 } },
  { cameraId: '4798', cameraName: 'Sentosa Gateway / Telok Blangah', roadName: 'Sentosa Gateway', location: { latitude: 1.25999999687243, longitude: 103.823611110166 } },
  { cameraId: '4799', cameraName: 'HarbourFront / Keppel Road Entrance', roadName: 'Telok Blangah Road', location: { latitude: 1.26027777363278, longitude: 103.823888890049 } },

  // PIE (5794 - 6716)
  { cameraId: '5794', cameraName: 'PIE (Eunos Flyover)', roadName: 'Pan Island Expressway (PIE)', location: { latitude: 1.3309693, longitude: 103.9168616 } },
  { cameraId: '5795', cameraName: 'PIE (Paya Lebar Flyover)', roadName: 'Pan Island Expressway (PIE)', location: { latitude: 1.326024822, longitude: 103.905625 } },
  { cameraId: '5797', cameraName: 'PIE (Woodsville Flyover)', roadName: 'Pan Island Expressway (PIE)', location: { latitude: 1.322875288, longitude: 103.8910793 } },
  { cameraId: '5798', cameraName: 'PIE (Kallang Bahru Flyover)', roadName: 'Pan Island Expressway (PIE)', location: { latitude: 1.32036078126842, longitude: 103.877174116489 } },
  { cameraId: '5799', cameraName: 'PIE (Kim Keat Flyover)', roadName: 'Pan Island Expressway (PIE)', location: { latitude: 1.328171608, longitude: 103.8685191 } },
  { cameraId: '6701', cameraName: 'PIE (Whampoa Flyover)', roadName: 'Pan Island Expressway (PIE)', location: { latitude: 1.329334, longitude: 103.858222 } },
  { cameraId: '6703', cameraName: 'PIE (Thomson Flyover)', roadName: 'Pan Island Expressway (PIE)', location: { latitude: 1.328899, longitude: 103.84121 } },
  { cameraId: '6704', cameraName: 'PIE (Mount Pleasant Flyover)', roadName: 'Pan Island Expressway (PIE)', location: { latitude: 1.32657403632366, longitude: 103.826857295633 } },
  { cameraId: '6705', cameraName: 'PIE (Adam Flyover)', roadName: 'Pan Island Expressway (PIE)', location: { latitude: 1.332124, longitude: 103.81768 } },
  { cameraId: '6706', cameraName: 'PIE (Eng Neo Flyover / BKE)', roadName: 'Pan Island Expressway (PIE)', location: { latitude: 1.349428893, longitude: 103.7952799 } },
  { cameraId: '6708', cameraName: 'PIE (Jurong West / Pioneer)', roadName: 'Pan Island Expressway (PIE)', location: { latitude: 1.345996, longitude: 103.69016 } },
  { cameraId: '6710', cameraName: 'PIE (Anak Bukit Flyover)', roadName: 'Pan Island Expressway (PIE)', location: { latitude: 1.344205, longitude: 103.78577 } },
  { cameraId: '6711', cameraName: 'PIE (Upper Changi Flyover)', roadName: 'Pan Island Expressway (PIE)', location: { latitude: 1.33771, longitude: 103.977827 } },
  { cameraId: '6712', cameraName: 'PIE (Clementi Road Flyover)', roadName: 'Pan Island Expressway (PIE)', location: { latitude: 1.332691, longitude: 103.770278 } },
  { cameraId: '6713', cameraName: 'PIE (Tampines Flyover)', roadName: 'Pan Island Expressway (PIE)', location: { latitude: 1.340298, longitude: 103.945652 } },
  { cameraId: '6714', cameraName: 'PIE (Jalan Bahar Flyover)', roadName: 'Pan Island Expressway (PIE)', location: { latitude: 1.361742, longitude: 103.703341 } },
  { cameraId: '6715', cameraName: 'PIE (Corporation Flyover)', roadName: 'Pan Island Expressway (PIE)', location: { latitude: 1.356299, longitude: 103.716071 } },
  { cameraId: '6716', cameraName: 'PIE (Tuas Road Flyover)', roadName: 'Pan Island Expressway (PIE)', location: { latitude: 1.322893, longitude: 103.6635051 } },

  // TPE (7791 - 7798)
  { cameraId: '7791', cameraName: 'TPE (Loyang Flyover)', roadName: 'Tampines Expressway (TPE)', location: { latitude: 1.354245, longitude: 103.963782 } },
  { cameraId: '7793', cameraName: 'TPE (Tampines Ave 10)', roadName: 'Tampines Expressway (TPE)', location: { latitude: 1.37704704, longitude: 103.92946983 } },
  { cameraId: '7794', cameraName: 'TPE (Punggol Flyover)', roadName: 'Tampines Expressway (TPE)', location: { latitude: 1.37988658, longitude: 103.92009174 } },
  { cameraId: '7795', cameraName: 'TPE (Punggol West Flyover)', roadName: 'Tampines Expressway (TPE)', location: { latitude: 1.38432741, longitude: 103.91585701 } },
  { cameraId: '7796', cameraName: 'TPE (Seletar Flyover)', roadName: 'Tampines Expressway (TPE)', location: { latitude: 1.39559294, longitude: 103.90515712 } },
  { cameraId: '7797', cameraName: 'TPE (Jalan Kayu Flyover)', roadName: 'Tampines Expressway (TPE)', location: { latitude: 1.40002575, longitude: 103.85702534 } },
  { cameraId: '7798', cameraName: 'TPE (Yio Chu Kang)', roadName: 'Tampines Expressway (TPE)', location: { latitude: 1.39748842, longitude: 103.85400467 } },

  // KJE (8701 - 8706)
  { cameraId: '8701', cameraName: 'KJE (Choa Chu Kang Way)', roadName: 'Kranji Expressway (KJE)', location: { latitude: 1.38647, longitude: 103.74143 } },
  { cameraId: '8702', cameraName: 'KJE (BKE Junction Flyover)', roadName: 'Kranji Expressway (KJE)', location: { latitude: 1.39059, longitude: 103.7717 } },
  { cameraId: '8704', cameraName: 'KJE (Choa Chu Kang Drive)', roadName: 'Kranji Expressway (KJE)', location: { latitude: 1.3899, longitude: 103.74843 } },
  { cameraId: '8706', cameraName: 'KJE (Tengah Flyover)', roadName: 'Kranji Expressway (KJE)', location: { latitude: 1.3664, longitude: 103.70899 } },

  // SLE (9701 - 9706)
  { cameraId: '9701', cameraName: 'SLE (Lentor Flyover)', roadName: 'Seletar Expressway (SLE)', location: { latitude: 1.39466333, longitude: 103.83474601 } },
  { cameraId: '9702', cameraName: 'SLE (Upper Thomson Flyover)', roadName: 'Seletar Expressway (SLE)', location: { latitude: 1.39474081, longitude: 103.81797086 } },
  { cameraId: '9703', cameraName: 'SLE (Woodlands South Flyover)', roadName: 'Seletar Expressway (SLE)', location: { latitude: 1.422857, longitude: 103.773005 } },
  { cameraId: '9704', cameraName: 'SLE (Mandai Flyover)', roadName: 'Seletar Expressway (SLE)', location: { latitude: 1.42214311, longitude: 103.79542062 } },
  { cameraId: '9705', cameraName: 'SLE (Woodlands Ave 2 Flyover)', roadName: 'Seletar Expressway (SLE)', location: { latitude: 1.42627712, longitude: 103.78716637 } },
  { cameraId: '9706', cameraName: 'SLE (Ulu Sembawang Flyover)', roadName: 'Seletar Expressway (SLE)', location: { latitude: 1.41270056, longitude: 103.80642712 } },
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
