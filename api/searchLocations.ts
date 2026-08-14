import { Request, Response } from 'express';

export async function handleSearchLocations(req: Request, res: Response) {
  try {
    const searchVal = req.query.searchVal as string;
    if (!searchVal || !searchVal.trim()) {
      return res.json({ results: [] });
    }

    const oneMapKey = process.env.ONEMAP_API_KEY;

    let headers: Record<string, string> = {
      Accept: 'application/json',
    };

    if (oneMapKey) {
      headers['Authorization'] = `Bearer ${oneMapKey}`;
    }

    const url = `https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${encodeURIComponent(
      searchVal.trim()
    )}&returnGeom=Y&getAddrDetails=Y&pageNum=1`;

    const upstreamRes = await fetch(url, { headers });

    if (!upstreamRes.ok) {
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
