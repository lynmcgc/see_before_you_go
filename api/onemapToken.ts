import { Request, Response } from 'express';
import { getOneMapToken } from './onemapClient';

/**
 * Endpoint to mint / get cached OneMap token:
 * POST /api/onemap/token
 * Returns status and active token expiry if configured.
 */
export async function handleOneMapToken(req: Request, res: Response) {
  try {
    const token = await getOneMapToken();

    if (!token) {
      if (!process.env.ONEMAP_EMAIL && !process.env.ONEMAP_API_KEY) {
        return res.status(500).json({ error: 'credential not configured' });
      }
      return res.status(502).json({ error: 'Failed to obtain OneMap token from upstream' });
    }

    return res.json({
      success: true,
      message: 'OneMap token active',
      token,
    });
  } catch (error: any) {
    console.error('Error in /api/onemap/token:', error);
    return res.status(500).json({ error: 'Failed to mint token' });
  }
}
