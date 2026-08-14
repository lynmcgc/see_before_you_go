import { Request, Response } from 'express';

interface OSRMStep {
  maneuver: {
    instruction?: string;
    type?: string;
    modifier?: string;
  };
  name: string;
  distance: number;
  duration: number;
}

interface OSRMLeg {
  steps?: OSRMStep[];
  distance: number;
  duration: number;
}

interface OSRMRoute {
  geometry: {
    coordinates: [number, number][]; // [longitude, latitude]
    type: string;
  };
  legs: OSRMLeg[];
  distance: number;
  duration: number;
}

export async function handleRoute(req: Request, res: Response) {
  try {
    const { startLat, startLng, endLat, endLng, mode } = req.query;

    if (!startLat || !startLng || !endLat || !endLng) {
      return res.status(400).json({ error: 'Missing start or end coordinates' });
    }

    const sLat = parseFloat(startLat as string);
    const sLng = parseFloat(startLng as string);
    const eLat = parseFloat(endLat as string);
    const eLng = parseFloat(endLng as string);
    const travelMode = (mode as string) || 'driving';

    // Map travel mode to OSRM profile
    // OSRM supports: 'car' (driving), 'foot' (walking), 'bike' (cycling)
    let osrmProfile = 'car';
    if (travelMode === 'walking') {
      osrmProfile = 'foot';
    } else if (travelMode === 'transit') {
      // Transit will use road routing with transit-paced duration estimation
      osrmProfile = 'car';
    }

    // 1. Query OSRM routing engine with full geometry and turn steps
    const osrmUrl = `https://router.project-osrm.org/route/v1/${osrmProfile}/${sLng},${sLat};${eLng},${eLat}?overview=full&geometries=geojson&steps=true`;

    const upstream = await fetch(osrmUrl, {
      headers: {
        'User-Agent': 'SeeBeforeYouGo-Singapore/1.0',
        Accept: 'application/json',
      },
    });

    if (upstream.ok) {
      const data = await upstream.json();

      if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
        const route: OSRMRoute = data.routes[0];

        // OSRM coordinates are [lng, lat], convert to Leaflet standard [lat, lng]
        const polyline: [number, number][] = route.geometry.coordinates.map(
          (coord) => [coord[1], coord[0]]
        );

        const distanceKm = +(route.distance / 1000).toFixed(1);
        let durationMin = Math.round(route.duration / 60);

        if (travelMode === 'transit') {
          // Adjust transit duration for waiting and boarding
          durationMin = Math.round(durationMin * 1.3) + 6;
        }

        // Format turn-by-turn steps
        const steps: Array<{
          instruction: string;
          distanceKm: number;
          durationMin: number;
          roadName: string;
          mode: string;
        }> = [];

        if (route.legs && route.legs.length > 0 && route.legs[0].steps) {
          route.legs[0].steps.forEach((st) => {
            const stepDistKm = +(st.distance / 1000).toFixed(2);
            const stepDurMin = Math.max(1, Math.round(st.duration / 60));
            const road = st.name || 'Expressway / Arterial Link';
            
            let instruction = st.maneuver.instruction;
            if (!instruction) {
              const modifier = st.maneuver.modifier ? ` ${st.maneuver.modifier}` : '';
              const type = st.maneuver.type || 'turn';
              instruction = `${type}${modifier} onto ${road}`;
            }

            // Only add substantial steps
            if (st.distance > 10 || steps.length === 0) {
              steps.push({
                instruction,
                distanceKm: stepDistKm,
                durationMin: stepDurMin,
                roadName: road,
                mode: travelMode,
              });
            }
          });
        }

        return res.json({
          success: true,
          polyline,
          distanceKm,
          durationMin: Math.max(2, durationMin),
          steps: steps.slice(0, 10),
        });
      }
    }

    // Fallback: If external router is temporarily unreachable, return structured notification
    return res.status(502).json({ error: 'Routing engine service unavailable' });
  } catch (error: any) {
    console.error('Error in /api/route:', error);
    return res.status(500).json({ error: 'Failed to calculate route' });
  }
}
