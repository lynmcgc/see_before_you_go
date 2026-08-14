import { Request, Response } from 'express';

export async function handleTrafficCameras(req: Request, res: Response) {
  try {
    // If LTA_DATAMALL_KEY is defined, we can use DataMall or data.gov.sg
    // As per guardrail requirement, if user specifically configures or calls a provider requiring a token/key:
    // Any API key/token is read ONLY inside files in repo-root api/ directory via process.env.[EXACT_NAME]
    const ltaKey = process.env.LTA_DATAMALL_KEY;

    let headers: Record<string, string> = {
      Accept: 'application/json',
    };

    if (ltaKey) {
      headers['AccountKey'] = ltaKey;
    }

    const upstreamRes = await fetch('https://api.data.gov.sg/v1/transport/traffic-images', {
      headers,
    });

    if (!upstreamRes.ok) {
      return res.status(upstreamRes.status).json({
        error: `Upstream service returned status ${upstreamRes.status}`,
      });
    }

    const data = await upstreamRes.json();
    return res.json(data);
  } catch (error: any) {
    console.error('Error in /api/traffic-cameras:', error);
    return res.status(500).json({ error: 'Failed to fetch traffic cameras' });
  }
}
