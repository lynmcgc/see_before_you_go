import { Request, Response } from 'express';

export async function handleTrafficIncidents(req: Request, res: Response) {
  try {
    const ltaKey = process.env.LTA_DATAMALL_KEY;

    if (ltaKey) {
      const upstreamRes = await fetch(
        'https://datamall2.mytransport.sg/ltaodataservice/TrafficIncidents',
        {
          headers: {
            AccountKey: ltaKey,
            Accept: 'application/json',
          },
        }
      );

      if (upstreamRes.ok) {
        const data = await upstreamRes.json();
        return res.json(data);
      }
    }

    // Default return standard structure if live DataMall key not provided or falls back
    return res.json({ value: [] });
  } catch (error: any) {
    console.error('Error in /api/traffic-incidents:', error);
    return res.status(500).json({ error: 'Failed to fetch traffic incidents' });
  }
}
