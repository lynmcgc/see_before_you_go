import { Request, Response } from 'express';

const DEFAULT_LTA_ACCOUNT_KEY = 'QofEdWTaR1SP5iHOF5zgjA==';

export async function handleTrafficCameras(req: Request, res: Response) {
  try {
    const accountKey =
      process.env.LTA_DATAMALL_ACCOUNT_KEY ||
      process.env.LTA_DATAMALL_KEY ||
      DEFAULT_LTA_ACCOUNT_KEY;

    // 1. Primary: LTA DataMall Traffic-Imagesv2
    try {
      const ltaRes = await fetch(
        'https://datamall2.mytransport.sg/ltaodataservice/Traffic-Imagesv2',
        {
          headers: {
            AccountKey: accountKey,
            accept: 'application/json',
          },
        }
      );

      if (ltaRes.ok) {
        const ltaData = await ltaRes.json();
        if (ltaData.value && Array.isArray(ltaData.value) && ltaData.value.length > 0) {
          // Normalize to both OData format and standard items format for full client compatibility
          const normalizedCameras = ltaData.value.map((c: any) => ({
            camera_id: String(c.CameraID),
            image: c.ImageLink,
            location: {
              latitude: Number(c.Latitude),
              longitude: Number(c.Longitude),
            },
            timestamp: new Date().toISOString(),
          }));

          return res.json({
            'odata.metadata': ltaData['odata.metadata'] || 'https://datamall2.mytransport.sg/ltaodataservice/$metadata#Traffic-Imagesv2',
            value: ltaData.value,
            items: [
              {
                timestamp: new Date().toISOString(),
                cameras: normalizedCameras,
              },
            ],
            api_info: { status: 'healthy', source: 'LTA_DATAMALL_V2' },
          });
        }
      }
    } catch (ltaErr) {
      console.warn('LTA DataMall v2 fetch failed, falling back to data.gov.sg:', ltaErr);
    }

    // 2. Secondary fallback: Data.gov.sg v1
    const dataGovRes = await fetch(
      'https://api.data.gov.sg/v1/transport/traffic-images',
      {
        headers: { Accept: 'application/json' },
      }
    );

    if (dataGovRes.ok) {
      const dataGovData = await dataGovRes.json();
      return res.json(dataGovData);
    }

    return res.status(502).json({ error: 'Failed to retrieve traffic camera feeds from upstream' });
  } catch (error: any) {
    console.error('Error in /api/traffic-cameras handler:', error);
    return res.status(500).json({ error: 'Internal error fetching traffic cameras' });
  }
}
