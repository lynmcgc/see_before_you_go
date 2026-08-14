import React, { useState } from 'react';
import {
  Camera,
  Maximize2,
  Clock,
  MapPin,
  AlertTriangle,
  Compass,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { MatchedCamera, CameraRole } from '../types';

interface CameraGalleryPanelProps {
  matchedCameras: MatchedCamera[];
  selectedCameraId: string | null;
  onSelectCamera: (cameraId: string) => void;
  onOpenLightbox: (camera: MatchedCamera) => void;
}

export const CameraGalleryPanel: React.FC<CameraGalleryPanelProps> = ({
  matchedCameras,
  selectedCameraId,
  onSelectCamera,
  onOpenLightbox,
}) => {
  const [filterRole, setFilterRole] = useState<'all' | CameraRole>('all');

  const filteredCameras = matchedCameras.filter((item) => {
    if (filterRole === 'all') return true;
    return item.role === filterRole;
  });

  const getRoleBadge = (role: CameraRole) => {
    switch (role) {
      case 'start':
        return (
          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-600 text-white uppercase tracking-wider">
            Origin Camera
          </span>
        );
      case 'end':
        return (
          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-rose-600 text-white uppercase tracking-wider">
            Destination Camera
          </span>
        );
      case 'jam':
        return (
          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-600 text-white uppercase tracking-wider flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Jam Point Camera
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-sky-600 text-white uppercase tracking-wider">
            En-Route Expressway
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Camera className="w-5 h-5 text-sky-600" />
            Live Traffic Camera Gallery
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {matchedCameras.length} Matched Feeds
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time snapshots from official LTA DataMall cameras nearest to your route points
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setFilterRole('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              filterRole === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({matchedCameras.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterRole('start')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              filterRole === 'start'
                ? 'bg-emerald-700 text-white'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            Origin
          </button>
          <button
            type="button"
            onClick={() => setFilterRole('jam')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              filterRole === 'jam'
                ? 'bg-amber-700 text-white'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            Jam Points
          </button>
          <button
            type="button"
            onClick={() => setFilterRole('end')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              filterRole === 'end'
                ? 'bg-rose-700 text-white'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            Destination
          </button>
        </div>
      </div>

      {/* Camera Grid */}
      {filteredCameras.length === 0 ? (
        <div className="text-center py-10 text-slate-400 text-xs">
          No cameras match the selected filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCameras.map((item, idx) => {
            const isSelected = selectedCameraId === item.camera.cameraId;

            return (
              <div
                key={`${item.camera.cameraId}-${idx}`}
                id={`camera-card-${item.camera.cameraId}`}
                onClick={() => onSelectCamera(item.camera.cameraId)}
                className={`group rounded-xl border bg-slate-50/50 overflow-hidden hover:shadow-md transition-all cursor-pointer flex flex-col ${
                  isSelected
                    ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/30'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Image Container */}
                <div className="relative aspect-video bg-slate-900 overflow-hidden">
                  <img
                    src={item.camera.image}
                    alt={item.camera.cameraName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      // Fallback image handling
                      (e.target as HTMLElement).setAttribute(
                        'src',
                        `https://images.data.gov.sg/api/traffic-images/cam_${item.camera.cameraId}.jpg`
                      );
                    }}
                  />

                  {/* Top Badge: Role */}
                  <div className="absolute top-2 left-2 z-10">
                    {getRoleBadge(item.role)}
                  </div>

                  {/* Expand Lightbox Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenLightbox(item);
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs transition-colors cursor-pointer"
                    title="Enlarge Image"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Bottom Image Overlay Bar */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 flex items-center justify-between text-[11px] text-white">
                    <div className="flex items-center gap-1 font-mono text-[10px]">
                      <Clock className="w-3 h-3 text-sky-400" />
                      {item.camera.timestamp ? (
                        <span>
                          {new Date(item.camera.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}
                        </span>
                      ) : (
                        'Live Feed'
                      )}
                    </div>
                    <span className="text-[10px] text-slate-300 font-mono">
                      ID #{item.camera.cameraId}
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                      {item.camera.cameraName}
                    </div>
                    <div className="text-[11px] font-medium text-slate-500 mt-0.5">
                      {item.camera.roadName}
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1 text-slate-600">
                      <Compass className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold text-slate-800">{item.distanceKm} km</span>
                      <span className="text-slate-400">from point</span>
                    </div>

                    <span className="text-[11px] text-sky-600 font-semibold group-hover:underline flex items-center gap-0.5">
                      Locate <MapPin className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
