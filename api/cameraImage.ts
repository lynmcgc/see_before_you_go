import { Request, Response } from 'express';
import { lookup } from 'dns/promises';
import { isIP } from 'net';

const ALLOWED_IMAGE_HOSTNAMES = new Set<string>([
  'images.example.com',
  'cdn.example.com',
]);

async function isAllowedCameraUrl(rawUrl: string): Promise<boolean> {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return false;
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return false;
  }

  const hostname = parsed.hostname.toLowerCase();
  if (!ALLOWED_IMAGE_HOSTNAMES.has(hostname)) {
    return false;
  }

  if (await isPrivateOrLocalHost(hostname)) {
    return false;
  }

  return true;
}

async function isPrivateOrLocalHost(hostname: string): Promise<boolean> {
  if (hostname === 'localhost') {
    return true;
  }

  if (isIP(hostname)) {
    return isPrivateIp(hostname);
  }

  try {
    const { address } = await lookup(hostname);
    return isPrivateIp(address);
  } catch {
    return true;
  }
}

function isPrivateIp(ip: string): boolean {
  if (ip === '::1') return true;
  if (ip.startsWith('fe80:')) return true;
  if (ip.startsWith('fc') || ip.startsWith('fd')) return true;

  const v4Match = ip.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!v4Match) {
    return false;
  }

  const a = Number(v4Match[1]);
  const b = Number(v4Match[2]);

  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;

  return false;
}

export async function handleCameraImage(req: Request, res: Response) {
  try {
    const imageUrl = req.query.url as string;
    if (!imageUrl || !(await isAllowedCameraUrl(imageUrl))) {
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
