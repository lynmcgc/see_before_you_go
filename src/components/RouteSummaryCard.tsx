import React, { useState } from 'react';
import {
  Clock,
  Navigation2,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Car,
  Bus,
  Footprints,
  Camera,
  ShieldAlert,
} from 'lucide-react';
import { CalculatedRoute, MatchedCamera, TrafficIncident } from '../types';

interface RouteSummaryCardProps {
  route: CalculatedRoute;
  matchedCameras: MatchedCamera[];
  incidents: TrafficIncident[];
}

export const RouteSummaryCard: React.FC<RouteSummaryCardProps> = ({
  route,
  matchedCameras,
  incidents,
}) => {
  const [showSteps, setShowSteps] = useState(false);

  const getCongestionBadge = () => {
    switch (route.congestionLevel) {
      case 'heavy':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            Heavy Traffic Detected
          </span>
        );
      case 'moderate':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Moderate Delays
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            Flowing Smoothly
          </span>
        );
    }
  };

  const jamCameraCount = matchedCameras.filter((m) => m.role === 'jam').length;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-sky-100 text-sky-700 rounded-xl">
            {route.mode === 'driving' && <Car className="w-5 h-5" />}
            {route.mode === 'transit' && <Bus className="w-5 h-5" />}
            {route.mode === 'walking' && <Footprints className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base">Route Summary</h3>
            <p className="text-xs text-slate-500">
              {route.startLocation.name} → {route.endLocation.name}
            </p>
          </div>
        </div>

        <div>{getCongestionBadge()}</div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-3 my-4 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
        <div className="text-center">
          <div className="text-xs text-slate-500 font-medium flex items-center justify-center gap-1 mb-0.5">
            <Clock className="w-3.5 h-3.5 text-sky-600" />
            Est. Duration
          </div>
          <div className="text-lg font-extrabold text-slate-800">
            {route.durationMin} <span className="text-xs font-semibold text-slate-500">mins</span>
          </div>
        </div>

        <div className="text-center border-x border-slate-200">
          <div className="text-xs text-slate-500 font-medium flex items-center justify-center gap-1 mb-0.5">
            <Navigation2 className="w-3.5 h-3.5 text-indigo-600" />
            Total Distance
          </div>
          <div className="text-lg font-extrabold text-slate-800">
            {route.distanceKm} <span className="text-xs font-semibold text-slate-500">km</span>
          </div>
        </div>

        <div className="text-center">
          <div className="text-xs text-slate-500 font-medium flex items-center justify-center gap-1 mb-0.5">
            <Camera className="w-3.5 h-3.5 text-emerald-600" />
            Live Cameras
          </div>
          <div className="text-lg font-extrabold text-slate-800">
            {matchedCameras.length} <span className="text-xs font-semibold text-slate-500">feeds</span>
          </div>
        </div>
      </div>

      {/* Visual Proof Notice */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-sky-50/70 border border-sky-100 text-xs text-sky-950 mb-3">
        <Camera className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold">Live Visual Verification: </span>
          Surfaced {matchedCameras.length} official LTA traffic camera snapshot{matchedCameras.length === 1 ? '' : 's'} at your origin, destination, and key expressway checkpoints.
          {jamCameraCount > 0 && (
            <span className="text-rose-700 font-bold ml-1">
              ({jamCameraCount} camera{jamCameraCount === 1 ? '' : 's'} capturing active congestion points).
            </span>
          )}
        </div>
      </div>

      {/* Turn-by-Turn Steps Accordion */}
      <div>
        <button
          type="button"
          onClick={() => setShowSteps(!showSteps)}
          className="w-full flex items-center justify-between text-xs font-bold text-slate-600 hover:text-slate-900 py-1.5 transition-colors cursor-pointer"
        >
          <span>Turn-by-Turn Directions ({route.steps.length} steps)</span>
          {showSteps ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showSteps && (
          <div className="mt-2 space-y-2 border-t border-slate-100 pt-3">
            {route.steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <div className="flex-1">
                  <div className="font-medium text-slate-800">{step.instruction}</div>
                  <div className="text-[11px] text-slate-400">
                    {step.distanceKm} km • ~{step.durationMin} mins
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
