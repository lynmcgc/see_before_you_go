import { Request, Response } from 'express';
import { getOneMapToken, decodePolyline } from './onemapClient';

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

interface OSRMRoute {
  geometry: {
    coordinates: [number, number][]; // [longitude, latitude]
    type: string;
  };
  legs: Array<{
    steps?: OSRMStep[];
    distance: number;
    duration: number;
  }>;
  distance: number;
  duration: number;
}

export async function handleRoute(req: Request, res: Response) {
  try {
    const { startLat, startLng, endLat, endLng, mode, routeType, start, end } = req.query;

    let sLat: number;
    let sLng: number;
    let eLat: number;
    let eLng: number;

    if (start && end) {
      const [stLatStr, stLngStr] = String(start).split(',');
      const [edLatStr, edLngStr] = String(end).split(',');
      sLat = parseFloat(stLatStr);
      sLng = parseFloat(stLngStr);
      eLat = parseFloat(edLatStr);
      eLng = parseFloat(edLngStr);
    } else {
      if (!startLat || !startLng || !endLat || !endLng) {
        return res.status(400).json({ error: 'Missing start or end coordinates' });
      }
      sLat = parseFloat(startLat as string);
      sLng = parseFloat(startLng as string);
      eLat = parseFloat(endLat as string);
      eLng = parseFloat(endLng as string);
    }

    // Map travel mode / routeType: 'drive' | 'walk' | 'cycle' | 'pt' | 'transit'
    const rawMode = (routeType as string) || (mode as string) || 'driving';
    let oneMapRouteType = 'drive';
    if (rawMode === 'walking' || rawMode === 'walk') {
      oneMapRouteType = 'walk';
    } else if (rawMode === 'cycling' || rawMode === 'cycle') {
      oneMapRouteType = 'cycle';
    } else if (rawMode === 'transit' || rawMode === 'pt') {
      oneMapRouteType = 'pt';
    } else {
      oneMapRouteType = 'drive';
    }

    // 1. Try OneMap Routing Service with token if available
    const token = await getOneMapToken();
    if (token) {
      try {
        const oneMapUrl = `https://www.onemap.gov.sg/api/public/routingsvc/route?start=${sLat},${sLng}&end=${eLat},${eLng}&routeType=${oneMapRouteType}`;
        const omHeaders = {
          Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}`,
          Accept: 'application/json',
        };

        const omRes = await fetch(oneMapUrl, { headers: omHeaders });
        if (omRes.ok) {
          const omData = await omRes.json();

          // Handle standard drive / walk / cycle response
          if (omData.route_geometry) {
            const polyline = decodePolyline(omData.route_geometry);
            const totalDistanceM = omData.route_summary?.total_distance || 0;
            const totalTimeS = omData.route_summary?.total_time || 0;

            const steps: Array<{
              instruction: string;
              distanceKm: number;
              durationMin: number;
              roadName: string;
              mode: string;
            }> = [];

            if (Array.isArray(omData.route_instructions)) {
              omData.route_instructions.forEach((inst: any) => {
                const instructionText = Array.isArray(inst) ? inst[1] : (inst.instruction || '');
                const stepDistM = Array.isArray(inst) ? parseFloat(inst[2]) || 0 : (inst.distance || 0);
                const stepTimeS = Array.isArray(inst) ? parseFloat(inst[3]) || 0 : (inst.time || 0);

                if (instructionText) {
                  steps.push({
                    instruction: instructionText,
                    distanceKm: +(stepDistM / 1000).toFixed(2),
                    durationMin: Math.max(1, Math.round(stepTimeS / 60)),
                    roadName: instructionText.split(' onto ')[1] || 'Corridor Link',
                    mode: rawMode,
                  });
                }
              });
            }

            return res.json({
              success: true,
              source: 'onemap',
              polyline,
              distanceKm: +(totalDistanceM / 1000).toFixed(1),
              durationMin: Math.max(1, Math.round(totalTimeS / 60)),
              steps: steps.slice(0, 10),
              rawSummary: omData.route_summary,
            });
          } else if (omData.plan) {
            // Public transport plan
            return res.json({
              success: true,
              source: 'onemap_pt',
              plan: omData.plan,
            });
          }
        }
      } catch (omErr) {
        console.warn('OneMap routing attempt error, falling back to OSRM:', omErr);
      }
    }

    // 2. Fallback / Primary OSRM Engine
    let osrmProfile = 'car';
    if (rawMode === 'walking' || rawMode === 'walk') {
      osrmProfile = 'foot';
    } else if (rawMode === 'cycling' || rawMode === 'cycle') {
      osrmProfile = 'bike';
    } else if (rawMode === 'transit' || rawMode === 'pt') {
      osrmProfile = 'car';
    }

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

        const polyline: [number, number][] = route.geometry.coordinates.map(
          (coord) => [coord[1], coord[0]]
        );

        const distanceKm = +(route.distance / 1000).toFixed(1);
        let durationMin = Math.round(route.duration / 60);

        if (rawMode === 'transit' || rawMode === 'pt') {
          durationMin = Math.round(durationMin * 1.3) + 6;
        }

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

            if (st.distance > 10 || steps.length === 0) {
              steps.push({
                instruction,
                distanceKm: stepDistKm,
                durationMin: stepDurMin,
                roadName: road,
                mode: rawMode,
              });
            }
          });
        }

        return res.json({
          success: true,
          source: 'osrm',
          polyline,
          distanceKm,
          durationMin: Math.max(2, durationMin),
          steps: steps.slice(0, 10),
        });
      }
    }

    return res.status(502).json({ error: 'Routing engine service unavailable' });
  } catch (error: any) {
    console.error('Error in /api/route:', error);
    return res.status(500).json({ error: 'Failed to calculate route' });
  }
}
