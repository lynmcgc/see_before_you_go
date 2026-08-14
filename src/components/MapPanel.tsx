import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { CalculatedRoute, MatchedCamera, TrafficIncident, TrafficCamera } from '../types';
import { Layers, Maximize2, Camera, AlertCircle } from 'lucide-react';

interface MapPanelProps {
  route: CalculatedRoute;
  matchedCameras: MatchedCamera[];
  allCameras: TrafficCamera[];
  corridorIncidents: TrafficIncident[];
  selectedCameraId: string | null;
  onSelectCamera: (cameraId: string) => void;
  showAllCameras: boolean;
  onToggleShowAllCameras: () => void;
}

export const MapPanel: React.FC<MapPanelProps> = ({
  route,
  matchedCameras,
  allCameras,
  corridorIncidents,
  selectedCameraId,
  onSelectCamera,
  showAllCameras,
  onToggleShowAllCameras,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [1.3521, 103.8198], // Singapore central
        zoom: 12,
        zoomControl: true,
        attributionControl: true,
      });

      // Add OpenStreetMap / CARTO Positron high-clarity tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      const layerGroup = L.layerGroup().addTo(map);
      layerGroupRef.current = layerGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      // Keep map alive during simple state changes to avoid DOM re-creation flickering
    };
  }, []);

  // Update Route Polyline & Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // 1. Draw Route Polyline
    if (route.polyline && route.polyline.length > 0) {
      const latLngs: L.LatLngExpression[] = route.polyline.map((p) => [p[0], p[1]]);
      const polyline = L.polyline(latLngs, {
        color: '#0284c7', // Sky-600
        weight: 5,
        opacity: 0.85,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(layerGroup);

      // Fit bounds
      const bounds = polyline.getBounds();
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    }

    // 2. Start Marker (Green)
    const startIcon = L.divIcon({
      className: 'custom-map-icon',
      html: `
        <div style="background-color: #059669; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2.5px solid white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);">
          A
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    L.marker([route.startLocation.latitude, route.startLocation.longitude], { icon: startIcon })
      .addTo(layerGroup)
      .bindPopup(`
        <div class="p-3 text-xs">
          <div class="font-bold text-slate-900">Origin: ${route.startLocation.name}</div>
          <div class="text-slate-500">${route.startLocation.address || ''}</div>
        </div>
      `);

    // 3. End Marker (Red)
    const endIcon = L.divIcon({
      className: 'custom-map-icon',
      html: `
        <div style="background-color: #e11d48; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2.5px solid white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);">
          B
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    L.marker([route.endLocation.latitude, route.endLocation.longitude], { icon: endIcon })
      .addTo(layerGroup)
      .bindPopup(`
        <div class="p-3 text-xs">
          <div class="font-bold text-slate-900">Destination: ${route.endLocation.name}</div>
          <div class="text-slate-500">${route.endLocation.address || ''}</div>
        </div>
      `);

    // 4. Draw Incidents / Jams
    corridorIncidents.forEach((inc) => {
      const incIcon = L.divIcon({
        className: 'custom-map-icon',
        html: `
          <div style="background-color: #ea580c; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); font-size: 14px;">
            ⚠️
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      L.marker([inc.latitude, inc.longitude], { icon: incIcon })
        .addTo(layerGroup)
        .bindPopup(`
          <div class="p-3 text-xs max-w-xs">
            <div class="font-bold text-amber-700 uppercase tracking-wider text-[10px]">${inc.type}</div>
            <div class="font-semibold text-slate-900 mt-0.5">${inc.roadName}</div>
            <div class="text-slate-600 mt-1">${inc.message}</div>
          </div>
        `);
    });

    // 5. Draw Matched Cameras or All Cameras
    const matchedIds = new Set(matchedCameras.map((m) => m.camera.cameraId));
    const camerasToDraw = showAllCameras ? allCameras : matchedCameras.map((m) => m.camera);

    camerasToDraw.forEach((cam) => {
      const isMatched = matchedIds.has(cam.cameraId);
      const isSelected = selectedCameraId === cam.cameraId;
      const matchedInfo = matchedCameras.find((m) => m.camera.cameraId === cam.cameraId);

      const bgColor = isSelected ? '#4f46e5' : isMatched ? '#0284c7' : '#64748b';
      const size = isSelected ? 34 : isMatched ? 28 : 20;

      const camIcon = L.divIcon({
        className: 'custom-map-icon',
        html: `
          <div style="background-color: ${bgColor}; color: white; width: ${size}px; height: ${size}px; border-radius: 8px; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.25); cursor: pointer;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
              <circle cx="12" cy="13" r="3"/>
            </svg>
          </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });

      const marker = L.marker([cam.location.latitude, cam.location.longitude], {
        icon: camIcon,
        zIndexOffset: isSelected ? 1000 : isMatched ? 500 : 100,
      }).addTo(layerGroup);

      marker.on('click', () => {
        onSelectCamera(cam.cameraId);
      });

      marker.bindPopup(`
        <div class="p-2.5 max-w-xs text-xs">
          <div class="font-bold text-slate-900">${cam.cameraName}</div>
          <div class="text-[11px] text-slate-500 font-medium">${cam.roadName}</div>
          ${matchedInfo ? `<div class="mt-1 text-[11px] font-semibold text-sky-700">${matchedInfo.pointLabel} (${matchedInfo.distanceKm} km away)</div>` : ''}
          <div class="mt-2 rounded-lg overflow-hidden border border-slate-200">
            <img src="${cam.image}" alt="${cam.cameraName}" class="w-full h-28 object-cover" onerror="this.src='https://images.data.gov.sg/api/traffic-images/cam_${cam.cameraId}.jpg'" />
          </div>
          <div class="text-[10px] text-slate-400 mt-1">LTA Camera ID #${cam.cameraId}</div>
        </div>
      `);
    });
  }, [route, matchedCameras, allCameras, corridorIncidents, selectedCameraId, showAllCameras]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden flex flex-col h-[480px] lg:h-[540px] relative">
      {/* Map Control Overlay Header */}
      <div className="absolute top-3 left-3 right-3 z-[400] flex items-center justify-between pointer-events-none">
        <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 shadow-md text-xs font-semibold text-slate-700 flex items-center gap-2 pointer-events-auto">
          <Layers className="w-3.5 h-3.5 text-sky-600" />
          <span>Corridor Map: {matchedCameras.length} Cameras Matched</span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={onToggleShowAllCameras}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border shadow-md transition-all cursor-pointer flex items-center gap-1.5 ${
              showAllCameras
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white/95 text-slate-700 hover:bg-slate-50 border-slate-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-sky-500" />
            {showAllCameras ? 'Hide Other Cameras' : 'Show All SG Cameras'}
          </button>
        </div>
      </div>

      {/* Leaflet Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Map Legend */}
      <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200 shadow-md text-[11px] font-medium text-slate-700 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
          <span>Origin</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block" />
          <span>Destination</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-sky-600 inline-block" />
          <span>Journey Camera</span>
        </div>
        {corridorIncidents.length > 0 && (
          <div className="flex items-center gap-1.5 text-amber-700 font-semibold">
            <span>⚠️</span>
            <span>Jam Point ({corridorIncidents.length})</span>
          </div>
        )}
      </div>
    </div>
  );
};
