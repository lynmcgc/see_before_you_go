import React, { useState } from 'react';
import {
  Camera,
  Maximize2,
  Clock,
  MapPin,
  AlertTriangle,
  Compass,
  Lock,
  Crown,
  Sparkles,
  Zap,
} from 'lucide-react';
import { MatchedCamera, CameraRole, MembershipTier } from '../types';
import { handleImageLoadError } from '../services/trafficService';

interface CameraGalleryPanelProps {
  matchedCameras: MatchedCamera[];
  selectedCameraId: string | null;
  membershipTier: MembershipTier;
  onSelectCamera: (cameraId: string) => void;
  onOpenLightbox: (camera: MatchedCamera) => void;
  onOpenMembership: () => void;
}

export const CameraGalleryPanel: React.FC<CameraGalleryPanelProps> = ({
  matchedCameras,
  selectedCameraId,
  membershipTier,
  onSelectCamera,
  onOpenLightbox,
  onOpenMembership,
}) => {
  const [filterRole, setFilterRole] = useState<'all' | CameraRole>('all');

  // Limit to maximum of 6 cameras
  const displayCameras = matchedCameras.slice(0, 6);

  const filteredCameras = displayCameras.filter((item) => {
    if (filterRole === 'all') return true;
    return item.role === filterRole;
  });

  const getRoleBadge = (role: CameraRole, isFree: boolean) => {
    switch (role) {
      case 'start':
        return (
          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-600 text-white uppercase tracking-wider shadow-xs flex items-center gap-1">
            <span>Free</span> • Origin Camera
          </span>
        );
      case 'end':
        return (
          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-rose-600 text-white uppercase tracking-wider shadow-xs flex items-center gap-1">
            <span>Free</span> • Destination Camera
          </span>
        );
      case 'jam':
        return (
          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-600 text-white uppercase tracking-wider shadow-xs flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            <span>Pro</span> • Jam Point Camera
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-indigo-600 text-white uppercase tracking-wider shadow-xs flex items-center gap-1">
            <Crown className="w-3 h-3" />
            <span>Pro</span> • En-Route Expressway
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Camera className="w-5 h-5 text-sky-600" />
              Live Traffic Camera Views
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {displayCameras.length} Matched Feeds (Max 6)
              </span>
            </h2>

            {membershipTier === 'free' ? (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                Home & Destination Free
              </span>
            ) : (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                <Crown className="w-3 h-3 text-amber-600" />
                Pro Active: All Feeds Unlocked
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Origin and destination cameras are free. Up to 6 cameras matched along your journey based on expressway corridor & traffic jams.
          </p>
        </div>

        {/* Filters and Upgrade Callout */}
        <div className="flex items-center gap-2">
          {membershipTier === 'free' && (
            <button
              type="button"
              onClick={onOpenMembership}
              className="px-3 py-1 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Crown className="w-3 h-3 text-amber-300" />
              <span>Unlock All ($4.99/mo)</span>
            </button>
          )}

          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setFilterRole('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                filterRole === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({displayCameras.length})
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
            const isFreeCamera = item.role === 'start' || item.role === 'end';
            const isLocked = !isFreeCamera && membershipTier === 'free';

            return (
              <div
                key={`${item.camera.cameraId}-${idx}`}
                id={`camera-card-${item.camera.cameraId}`}
                onClick={() => {
                  if (isLocked) {
                    onOpenMembership();
                  } else {
                    onSelectCamera(item.camera.cameraId);
                  }
                }}
                className={`group rounded-xl border bg-slate-50/50 overflow-hidden hover:shadow-md transition-all cursor-pointer flex flex-col relative ${
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
                    referrerPolicy="no-referrer"
                    className={`w-full h-full object-cover transition-transform duration-300 ${
                      isLocked ? 'blur-md scale-105 opacity-60' : 'group-hover:scale-105'
                    }`}
                    loading="lazy"
                    onError={(e) => {
                      handleImageLoadError(e.currentTarget, item.camera);
                    }}
                  />

                  {/* Top Badge: Role & Tier */}
                  <div className="absolute top-2 left-2 z-10">
                    {getRoleBadge(item.role, isFreeCamera)}
                  </div>

                  {/* Locked Overlay for Pro Feeds in Free Mode */}
                  {isLocked ? (
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-3 text-center text-white z-20">
                      <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center mb-1.5 shadow-md">
                        <Lock className="w-4 h-4" />
                      </div>
                      <div className="text-xs font-bold text-white flex items-center gap-1">
                        <Crown className="w-3.5 h-3.5 text-amber-400" />
                        Pro Corridor Feed
                      </div>
                      <p className="text-[10px] text-slate-300 mt-0.5 max-w-[200px] leading-tight">
                        Multiple en-route & live jam cameras require Pro ($4.99/mo)
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenMembership();
                        }}
                        className="mt-2 px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg text-[11px] font-bold shadow-sm flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Zap className="w-3 h-3" />
                        Unlock for $4.99/mo
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Expand Lightbox Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenLightbox(item);
                        }}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs transition-colors cursor-pointer z-10"
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
                    </>
                  )}
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

                    {isLocked ? (
                      <span className="text-[11px] text-amber-600 font-bold flex items-center gap-0.5">
                        <Lock className="w-3 h-3" /> Pro Only
                      </span>
                    ) : (
                      <span className="text-[11px] text-sky-600 font-semibold group-hover:underline flex items-center gap-0.5">
                        Locate <MapPin className="w-3 h-3" />
                      </span>
                    )}
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

