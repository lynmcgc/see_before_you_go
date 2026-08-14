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
  Crown,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { CalculatedRoute, MatchedCamera, TrafficIncident, MembershipTier } from '../types';

interface RouteSummaryCardProps {
  route: CalculatedRoute;
  matchedCameras: MatchedCamera[];
  incidents: TrafficIncident[];
  membershipTier: MembershipTier;
  onOpenMembership: () => void;
}

export const RouteSummaryCard: React.FC<RouteSummaryCardProps> = ({
  route,
  matchedCameras,
  incidents,
  membershipTier,
  onOpenMembership,
}) => {
  const [showSteps, setShowSteps] = useState(false);

  const getCongestionBadge = () => {
    switch (route.congestionLevel) {
      case 'heavy':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            Heavy Traffic Detected
          </span>
        );
      case 'moderate':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Moderate Delays
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            Flowing Smoothly
          </span>
        );
    }
  };

  const jamCameraCount = matchedCameras.filter((m) => m.role === 'jam').length;
  const freeCameraCount = matchedCameras.filter((m) => m.role === 'start' || m.role === 'end').length;
  const proCameraCount = matchedCameras.length - freeCameraCount;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80">
      {/* Top row: Route title & Congestion badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-sky-100 text-sky-700 rounded-xl shrink-0">
            {route.mode === 'driving' && <Car className="w-5 h-5" />}
            {route.mode === 'transit' && <Bus className="w-5 h-5" />}
            {route.mode === 'walking' && <Footprints className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-900 text-base">
                {route.startLocation.name}
              </h3>
              <span className="text-slate-400 font-bold">→</span>
              <h3 className="font-extrabold text-slate-900 text-base">
                {route.endLocation.name}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live corridor analysis via Singapore OSRM & LTA DataMall
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {getCongestionBadge()}
        </div>
      </div>

      {/* Horizontal Metrics Grid - 4 Columns */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-4">
        {/* Metric 1: Est. Duration */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/70 flex flex-col justify-between">
          <div className="text-xs text-slate-500 font-medium flex items-center gap-1 mb-1">
            <Clock className="w-3.5 h-3.5 text-sky-600" />
            Est. Travel Time
          </div>
          <div className="text-xl font-black text-slate-900">
            {route.durationMin} <span className="text-xs font-semibold text-slate-500">mins</span>
          </div>
        </div>

        {/* Metric 2: Distance */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/70 flex flex-col justify-between">
          <div className="text-xs text-slate-500 font-medium flex items-center gap-1 mb-1">
            <Navigation2 className="w-3.5 h-3.5 text-indigo-600" />
            Total Distance
          </div>
          <div className="text-xl font-black text-slate-900">
            {route.distanceKm} <span className="text-xs font-semibold text-slate-500">km</span>
          </div>
        </div>

        {/* Metric 3: Free Cameras */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/70 flex flex-col justify-between">
          <div className="text-xs text-slate-500 font-medium flex items-center gap-1 mb-1">
            <Camera className="w-3.5 h-3.5 text-emerald-600" />
            Free Cameras
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-black text-emerald-700">{freeCameraCount}</span>
            <span className="text-[11px] font-semibold text-slate-500">Origin & Dest</span>
          </div>
        </div>

        {/* Metric 4: Corridor & Jam Cameras (Pro) */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/70 flex flex-col justify-between">
          <div className="text-xs text-slate-500 font-medium flex items-center gap-1 mb-1">
            <Crown className="w-3.5 h-3.5 text-amber-500" />
            Corridor & Jam Feeds
          </div>
          <div className="flex items-center justify-between">
            <div className="text-xl font-black text-slate-900">
              {matchedCameras.length}{' '}
              <span className="text-xs font-semibold text-slate-500">total</span>
            </div>
            {membershipTier === 'free' ? (
              <button
                type="button"
                onClick={onOpenMembership}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
              >
                Unlock Pro
              </button>
            ) : (
              <span className="text-[10px] font-extrabold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                PRO ACTIVE
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Visual Verification Info Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-700 mb-3">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4 text-sky-600 shrink-0" />
          <span>
            <strong>Visual Check:</strong> {matchedCameras.length} LTA live cameras positioned along this route.
            {jamCameraCount > 0 && (
              <span className="text-rose-700 font-bold ml-1">
                ({jamCameraCount} camera{jamCameraCount === 1 ? '' : 's'} near active traffic incidents).
              </span>
            )}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setShowSteps(!showSteps)}
          className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <span>{showSteps ? 'Hide' : 'View'} Directions ({route.steps.length} steps)</span>
          {showSteps ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Turn-by-Turn Steps Accordion */}
      {showSteps && (
        <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
          <div className="text-xs font-bold text-slate-800 mb-2">Step-by-step route guidance:</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {route.steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-2 bg-slate-50/70 rounded-lg text-xs border border-slate-100">
                <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
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
        </div>
      )}
    </div>
  );
};

