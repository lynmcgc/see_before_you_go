import { Request, Response } from 'express';
import { getOneMapToken } from './onemapClient';

export async function handleSearchLocations(req: Request, res: Response) {
  try {
    const searchVal = req.query.searchVal as string;
    if (!searchVal || !searchVal.trim()) {
      return res.json({ results: [] });
    }

    const token = await getOneMapToken();

    const headers: Record<string, string> = {
      Accept: 'application/json',
    };

    if (token) {
      headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    }

    const url = `https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${encodeURIComponent(
      searchVal.trim()
    )}&returnGeom=Y&getAddrDetails=Y&pageNum=1`;

    const upstreamRes = await fetch(url, { headers });

    if (!upstreamRes.ok) {
      // If token missing/unauthorized, still check status
      if (upstreamRes.status === 401 || upstreamRes.status === 403) {
        if (!token && !process.env.ONEMAP_EMAIL && !process.env.ONEMAP_API_KEY) {
          return res.status(500).json({ error: 'credential not configured' });
        }
      }
      return res.status(upstreamRes.status).json({
        error: `OneMap API returned status ${upstreamRes.status}`,
      });
    }

    const data = await upstreamRes.json();
    return res.json(data);
  } catch (error: any) {
    console.error('Error in /api/search-locations:', error);
    return res.status(500).json({ error: 'Failed to search locations' });
  }
}
