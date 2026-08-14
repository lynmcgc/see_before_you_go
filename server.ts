import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { handleTrafficCameras } from './api/trafficCameras';
import { handleTrafficIncidents } from './api/trafficIncidents';
import { handleSearchLocations } from './api/searchLocations';
import { handleRoute } from './api/route';
import { handleRevGeocode } from './api/revGeocode';
import { handleOneMapToken } from './api/onemapToken';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes (all credentials processed strictly inside /api/)
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Traffic Data feeds (LTA DataMall & data.gov.sg)
  app.get('/api/traffic-cameras', handleTrafficCameras);
  app.get('/api/traffic-incidents', handleTrafficIncidents);

  // OneMap Backend Logic (Auth Token, Search/Geocode, RevGeocode, Routing)
  app.post('/api/onemap/token', handleOneMapToken);
  app.get('/api/onemap/token', handleOneMapToken);

  app.get('/api/search-locations', handleSearchLocations);
  app.get('/api/onemap/search', handleSearchLocations);

  app.get('/api/revgeocode', handleRevGeocode);
  app.get('/api/onemap/revgeocode', handleRevGeocode);

  app.get('/api/route', handleRoute);
  app.get('/api/onemap/route', handleRoute);

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
