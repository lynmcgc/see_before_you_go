import { Request, Response } from 'express';

export async function handleCameraImage(req: Request, res: Response) {
  try {
    const imageUrl = req.query.url as string;
    if (!imageUrl || !imageUrl.startsWith('http')) {
      return res.status(400).json({ error: 'Valid image URL is required' });
    }

    const imageRes = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
        Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      },
    });

    if (!imageRes.ok) {
      return res.status(imageRes.status).send('Failed to fetch upstream camera image');
    }

    const contentType = imageRes.headers.get('content-type') || 'image/jpeg';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=30');
    res.setHeader('Access-Control-Allow-Origin', '*');

    const arrayBuffer = await imageRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return res.send(buffer);
  } catch (err) {
    console.error('Error in /api/camera-image proxy:', err);
    return res.status(500).json({ error: 'Failed to proxy camera image' });
  }
}
