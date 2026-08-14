import { Request, Response } from 'express';
import { getOneMapToken } from './onemapClient';

/**
 * OneMap Reverse Geocode:
 * https://www.onemap.gov.sg/api/public/revgeocode?location=1.3,103.8&buffer=40&addressType=All
 * Requires Authorization token.
 */
export async function handleRevGeocode(req: Request, res: Response) {
  try {
    const { location, buffer, addressType } = req.query;

    if (!location) {
      return res.status(400).json({ error: 'Missing location parameter (format: lat,lng)' });
    }

    const token = await getOneMapToken();
    if (!token && !process.env.ONEMAP_EMAIL && !process.env.ONEMAP_API_KEY) {
      return res.status(500).json({ error: 'credential not configured' });
    }

    const headers: Record<string, string> = {
      Accept: 'application/json',
    };

    if (token) {
      headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    }

    const locParam = encodeURIComponent(String(location));
    const bufParam = encodeURIComponent(String(buffer || '40'));
    const addrParam = encodeURIComponent(String(addressType || 'All'));

    const url = `https://www.onemap.gov.sg/api/public/revgeocode?location=${locParam}&buffer=${bufParam}&addressType=${addrParam}`;

    const upstreamRes = await fetch(url, { headers });

    if (!upstreamRes.ok) {
      if ((upstreamRes.status === 401 || upstreamRes.status === 403) && !token) {
        return res.status(500).json({ error: 'credential not configured' });
      }
      return res.status(upstreamRes.status).json({
        error: `OneMap RevGeocode returned status ${upstreamRes.status}`,
      });
    }

    const data = await upstreamRes.json();
    return res.json(data);
  } catch (error: any) {
    console.error('Error in /api/onemap/revgeocode:', error);
    return res.status(500).json({ error: 'Failed to reverse geocode' });
  }
}
