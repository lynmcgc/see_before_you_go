// Token cache and OneMap API helper
interface CachedToken {
  token: string;
  expiresAt: number; // epoch ms
}

let cachedToken: CachedToken | null = null;

/**
 * Gets a valid OneMap Access Token.
 * 1. Checks if a static ONEMAP_API_KEY is provided in process.env.
 * 2. Checks active in-memory cached token.
 * 3. If expired or empty, mints a new token from https://www.onemap.gov.sg/api/auth/post/getToken
 *    using ONEMAP_EMAIL and ONEMAP_PASSWORD.
 */
export async function getOneMapToken(): Promise<string | null> {
  // Direct token provided via env
  if (process.env.ONEMAP_API_KEY && process.env.ONEMAP_API_KEY.trim().length > 10) {
    return process.env.ONEMAP_API_KEY.trim();
  }

  // Active in-memory cache check (buffer by 5 minutes before 3-day expiry)
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now + 5 * 60 * 1000) {
    return cachedToken.token;
  }

  const email = process.env.ONEMAP_EMAIL;
  const password = process.env.ONEMAP_PASSWORD;

  if (!email || !password) {
    return null;
  }

  try {
    const res = await fetch('https://www.onemap.gov.sg/api/auth/post/getToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Failed to mint OneMap token:', res.status, errText);
      return null;
    }

    const data = await res.json();
    const token = data.access_token || data.token;
    if (token) {
      // OneMap tokens last 3 days (72 hours)
      const expiryMs = data.expiry_timestamp
        ? new Date(data.expiry_timestamp).getTime()
        : now + 3 * 24 * 60 * 60 * 1000;

      cachedToken = {
        token,
        expiresAt: expiryMs,
      };
      console.log('Successfully minted and cached OneMap token (valid for 3 days)');
      return token;
    }
  } catch (error) {
    console.error('Error minting OneMap token:', error);
  }

  return null;
}

/**
 * Decode Google / OneMap Polyline Algorithm string to [lat, lng] array
 */
export function decodePolyline(encoded: string): [number, number][] {
  const points: [number, number][] = [];
  let index = 0;
  const len = encoded.length;
  let lat = 0;
  let lng = 0;

  while (index < len) {
    let b: number;
    let shift = 0;
    let result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    points.push([lat / 1e5, lng / 1e5]);
  }

  return points;
}
