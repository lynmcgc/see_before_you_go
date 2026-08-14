import React from 'react';
import {
  AlertTriangle,
  Clock,
  MapPin,
  Camera,
  Car,
  Wrench,
  ShieldAlert,
  HelpCircle,
} from 'lucide-react';
import { TrafficIncident, MatchedCamera } from '../types';

interface IncidentListPanelProps {
  corridorIncidents: TrafficIncident[];
  allIncidents: TrafficIncident[];
  matchedCameras: MatchedCamera[];
  onSelectCamera: (cameraId: string) => void;
}

export const IncidentListPanel: React.FC<IncidentListPanelProps> = ({
  corridorIncidents,
  allIncidents,
  matchedCameras,
  onSelectCamera,
}) => {
  const [showAllSG, setShowAllSG] = React.useState(false);

  const incidentsToDisplay = showAllSG ? allIncidents : corridorIncidents;

  const getIncidentIcon = (type: TrafficIncident['type']) => {
    switch (type) {
      case 'Heavy Traffic':
        return <Car className="w-4 h-4 text-amber-600" />;
      case 'Vehicle breakdown':
        return <Wrench className="w-4 h-4 text-rose-600" />;
      case 'Roadwork':
        return <Wrench className="w-4 h-4 text-sky-600" />;
      case 'Accident':
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case 'Roadblock':
        return <ShieldAlert className="w-4 h-4 text-indigo-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
    }
  };

  const getSeverityBadge = (severity: TrafficIncident['severity']) => {
    switch (severity) {
      case 'high':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
            HIGH SEVERITY
          </span>
        );
      case 'medium':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            MEDIUM DELAY
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            MINOR
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            Live Traffic Incidents & Jam Alerts
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified LTA DataMall incidents affecting your route corridor
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAllSG(!showAllSG)}
          className="text-xs font-semibold text-sky-700 hover:text-sky-800 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200 transition-colors cursor-pointer"
        >
          {showAllSG ? 'Show Route Corridor Only' : `View All SG Alerts (${allIncidents.length})`}
        </button>
      </div>

      {incidentsToDisplay.length === 0 ? (
        <div className="text-center py-8 px-4 rounded-xl bg-emerald-50/50 border border-emerald-100 text-emerald-900">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2 font-bold text-base">
            ✓
          </div>
          <div className="text-xs font-bold">No Jam Incidents Detected on Route</div>
          <div className="text-[11px] text-emerald-700/80 mt-0.5">
            Your corridor is currently clear of major accidents, breakdowns, or road closures.
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {incidentsToDisplay.map((inc) => {
            // Check if there's a matched camera for this incident
            const relatedCamera = matchedCameras.find(
              (m) => m.relatedIncident?.id === inc.id || m.camera.roadName === inc.roadName
            );

            return (
              <div
                key={inc.id}
                className="p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/70 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs mt-0.5">
                    {getIncidentIcon(inc.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs text-slate-900">{inc.roadName}</span>
                      {getSeverityBadge(inc.severity)}
                      <span className="text-[11px] text-slate-400 font-mono">
                        {new Date(inc.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 mt-1 leading-relaxed">{inc.message}</p>
                  </div>
                </div>

                {relatedCamera && (
                  <button
                    type="button"
                    onClick={() => onSelectCamera(relatedCamera.camera.cameraId)}
                    className="self-end sm:self-center shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-sky-50 text-sky-700 hover:text-sky-800 border border-slate-200 hover:border-sky-300 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>View Camera #{relatedCamera.camera.cameraId}</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
