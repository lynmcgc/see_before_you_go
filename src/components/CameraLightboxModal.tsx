import React, { useEffect } from 'react';
import { X, Clock, MapPin, Compass, Camera, AlertTriangle } from 'lucide-react';
import { MatchedCamera } from '../types';

interface CameraLightboxModalProps {
  matchedCamera: MatchedCamera | null;
  onClose: () => void;
}

export const CameraLightboxModal: React.FC<CameraLightboxModalProps> = ({
  matchedCamera,
  onClose,
}) => {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!matchedCamera) return null;

  const { camera, role, distanceKm, pointLabel, relatedIncident } = matchedCamera;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-slate-900 text-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-700 flex flex-col">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-500/20 text-sky-400 rounded-lg">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">{camera.cameraName}</h3>
              <p className="text-xs text-slate-400">
                {camera.roadName} • LTA Camera #{camera.cameraId}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Live Image */}
        <div className="relative bg-black flex items-center justify-center min-h-[300px] max-h-[520px] overflow-hidden">
          <img
            src={camera.image}
            alt={camera.cameraName}
            referrerPolicy="no-referrer"
            className="w-full h-auto max-h-[500px] object-contain"
            onError={(e) => {
              const img = e.currentTarget;
              if (!img.dataset.fallback) {
                img.dataset.fallback = 'true';
                img.src = `https://images.data.gov.sg/api/traffic-images/cam_${camera.cameraId}.jpg`;
              }
            }}
          />
        </div>

        {/* Modal Footer Info */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Clock className="w-4 h-4 text-sky-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                Captured Time
              </div>
              <div className="font-mono text-slate-200">
                {camera.timestamp
                  ? new Date(camera.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })
                  : 'Live Feed'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-300">
            <Compass className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                Route Distance
              </div>
              <div className="font-medium text-slate-200">
                {distanceKm} km from point
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-300">
            <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                Coordinates
              </div>
              <div className="font-mono text-[11px] text-slate-400">
                {camera.location.latitude.toFixed(4)}, {camera.location.longitude.toFixed(4)}
              </div>
            </div>
          </div>
        </div>

        {relatedIncident && (
          <div className="p-3 bg-amber-950/60 border-t border-amber-800/60 flex items-start gap-2 text-xs text-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Active Corridor Alert: </span>
              {relatedIncident.message}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
