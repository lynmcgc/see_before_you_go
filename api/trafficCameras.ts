import { Request, Response } from 'express';

export async function handleTrafficCameras(req: Request, res: Response) {
  try {
    const dateTime = req.query.date_time as string | undefined;

    // Read API key from server environment if configured
    const apiKey =
      process.env.DATA_GOV_SG_API_KEY ||
      process.env.DATAGOV_API_KEY ||
      process.env.X_API_KEY ||
      process.env.LTA_DATAMALL_KEY;

    const headers: Record<string, string> = {
      Accept: 'application/json',
    };

    if (apiKey && apiKey.trim()) {
      headers['x-api-key'] = apiKey.trim();
    }

    let url = 'https://api.data.gov.sg/v1/transport/traffic-images';
    if (dateTime && dateTime.trim()) {
      url += `?date_time=${encodeURIComponent(dateTime.trim())}`;
    }

    const upstreamRes = await fetch(url, {
      headers,
    });

    if (!upstreamRes.ok) {
      return res.status(upstreamRes.status).json({
        error: `Upstream traffic images service returned status ${upstreamRes.status}`,
      });
    }

    const data = await upstreamRes.json();
    return res.json(data);
  } catch (error: any) {
    console.error('Error in /api/traffic-cameras:', error);
    return res.status(500).json({ error: 'Failed to fetch traffic cameras' });
  }
}

