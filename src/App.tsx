import React, { useState, useEffect, useCallback } from 'react';
import {
  LocationPoint,
  TravelMode,
  CalculatedRoute,
  TrafficCamera,
  TrafficIncident,
  MatchedCamera,
} from './types';
import { SINGAPORE_PRESET_LOCATIONS } from './services/singaporeData';
import { fetchLiveTrafficCameras, fetchLiveTrafficIncidents } from './services/trafficService';
import { calculateRoute } from './services/routingService';
import { matchCamerasToRoute, detectCorridorIncidents } from './services/cameraMatcher';

import { Header } from './components/Header';
import { JourneyInputPanel } from './components/JourneyInputPanel';
import { RouteSummaryCard } from './components/RouteSummaryCard';
import { MapPanel } from './components/MapPanel';
import { CameraGalleryPanel } from './components/CameraGalleryPanel';
import { IncidentListPanel } from './components/IncidentListPanel';
import { CameraLightboxModal } from './components/CameraLightboxModal';
import { AttributionFooter } from './components/AttributionFooter';

export const App: React.FC = () => {
  // State: Locations & Travel Mode
  const [startLocation, setStartLocation] = useState<LocationPoint>(
    SINGAPORE_PRESET_LOCATIONS[0] // Woodlands Checkpoint
  );
  const [endLocation, setEndLocation] = useState<LocationPoint>(
    SINGAPORE_PRESET_LOCATIONS[8] // Raffles Place (CBD)
  );
  const [travelMode, setTravelMode] = useState<TravelMode>('driving');

  // State: Route & Traffic Data
  const [route, setRoute] = useState<CalculatedRoute | null>(null);
  const [allCameras, setAllCameras] = useState<TrafficCamera[]>([]);
  const [allIncidents, setAllIncidents] = useState<TrafficIncident[]>([]);
  const [matchedCameras, setMatchedCameras] = useState<MatchedCamera[]>([]);
  const [corridorIncidents, setCorridorIncidents] = useState<TrafficIncident[]>([]);

  // State: UI & Interaction
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selectedCameraId, setSelectedCameraId] = useState<string | null>(null);
  const [lightboxCamera, setLightboxCamera] = useState<MatchedCamera | null>(null);
  const [showAllCamerasOnMap, setShowAllCamerasOnMap] = useState(false);

  // 1. Fetch live traffic data (Cameras & Incidents)
  const refreshTrafficData = useCallback(async () => {
    setIsLoadingData(true);
    try {
      const [cameras, incidents] = await Promise.all([
        fetchLiveTrafficCameras(),
        fetchLiveTrafficIncidents(),
      ]);
      setAllCameras(cameras);
      setAllIncidents(incidents);
      setLastUpdated(new Date());

      // If route is already calculated, re-match cameras with fresh snapshots
      if (route) {
        const matched = matchCamerasToRoute(route, cameras, incidents);
        const corridorIncs = detectCorridorIncidents(route, incidents);
        setMatchedCameras(matched);
        setCorridorIncidents(corridorIncs);
      }
    } catch (err) {
      console.error('Error refreshing traffic data:', err);
    } finally {
      setIsLoadingData(false);
    }
  }, [route]);

  // Initial load of traffic data
  useEffect(() => {
    refreshTrafficData();

    // Auto-refresh every 30s for live LTA camera updates
    const interval = setInterval(() => {
      refreshTrafficData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // 2. Compute Route & Match Cameras
  const handlePlanTrip = useCallback(async () => {
    setIsCalculatingRoute(true);
    try {
      const calculated = await calculateRoute(startLocation, endLocation, travelMode);
      setRoute(calculated);

      if (allCameras.length > 0) {
        const matched = matchCamerasToRoute(calculated, allCameras, allIncidents);
        const corridorIncs = detectCorridorIncidents(calculated, allIncidents);
        setMatchedCameras(matched);
        setCorridorIncidents(corridorIncs);
      }
    } catch (err) {
      console.error('Failed to calculate route:', err);
    } finally {
      setIsCalculatingRoute(false);
    }
  }, [startLocation, endLocation, travelMode, allCameras, allIncidents]);

  // Trigger initial route calculation on startup once cameras are fetched
  useEffect(() => {
    if (allCameras.length > 0 && !route) {
      handlePlanTrip();
    }
  }, [allCameras, route, handlePlanTrip]);

  // Swap Start & Destination
  const handleSwapLocations = () => {
    const temp = startLocation;
    setStartLocation(endLocation);
    setEndLocation(temp);
  };

  // Select camera from map/gallery
  const handleSelectCamera = (cameraId: string) => {
    setSelectedCameraId(cameraId);

    // Scroll to the camera card in gallery if needed
    const cardEl = document.getElementById(`camera-card-${cameraId}`);
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* App Header */}
      <Header
        cameraCount={allCameras.length}
        lastUpdated={lastUpdated}
        isLoading={isLoadingData}
        onRefresh={refreshTrafficData}
      />

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Top Section: 2-Column Split (Left: Input & Summary, Right: Map Panel) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (5 cols): Journey Inputs & Route Stats */}
          <div className="lg:col-span-5 space-y-6">
            <JourneyInputPanel
              startLocation={startLocation}
              endLocation={endLocation}
              travelMode={travelMode}
              onStartChange={setStartLocation}
              onEndChange={setEndLocation}
              onModeChange={setTravelMode}
              onSwapLocations={handleSwapLocations}
              onPlanTrip={handlePlanTrip}
              isCalculating={isCalculatingRoute}
            />

            {route && (
              <RouteSummaryCard
                route={route}
                matchedCameras={matchedCameras}
                incidents={corridorIncidents}
              />
            )}
          </div>

          {/* Right Column (7 cols): Interactive Corridor Map */}
          <div className="lg:col-span-7">
            {route ? (
              <MapPanel
                route={route}
                matchedCameras={matchedCameras}
                allCameras={allCameras}
                corridorIncidents={corridorIncidents}
                selectedCameraId={selectedCameraId}
                onSelectCamera={handleSelectCamera}
                showAllCameras={showAllCamerasOnMap}
                onToggleShowAllCameras={() => setShowAllCamerasOnMap(!showAllCamerasOnMap)}
              />
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm h-[480px] flex flex-col items-center justify-center">
                <div className="w-8 h-8 border-3 border-sky-600 border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-sm font-medium text-slate-600">
                  Calculating Singapore route corridor & loading traffic cameras...
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Middle Section: Camera Gallery Panel */}
        {matchedCameras.length > 0 && (
          <CameraGalleryPanel
            matchedCameras={matchedCameras}
            selectedCameraId={selectedCameraId}
            onSelectCamera={handleSelectCamera}
            onOpenLightbox={(cam) => setLightboxCamera(cam)}
          />
        )}

        {/* Bottom Section: Real-time Incident List */}
        <IncidentListPanel
          corridorIncidents={corridorIncidents}
          allIncidents={allIncidents}
          matchedCameras={matchedCameras}
          onSelectCamera={handleSelectCamera}
        />
      </main>

      {/* Lightbox Modal */}
      {lightboxCamera && (
        <CameraLightboxModal
          matchedCamera={lightboxCamera}
          onClose={() => setLightboxCamera(null)}
        />
      )}

      {/* Attribution & Data Flow Footer */}
      <AttributionFooter />
    </div>
  );
};
