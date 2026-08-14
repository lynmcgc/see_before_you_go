import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Navigation,
  ArrowUpDown,
  Car,
  Bus,
  Footprints,
  Search,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { LocationPoint, TravelMode } from '../types';
import { searchLocations } from '../services/routingService';
import { SINGAPORE_PRESET_LOCATIONS } from '../services/singaporeData';

interface JourneyInputPanelProps {
  startLocation: LocationPoint;
  endLocation: LocationPoint;
  travelMode: TravelMode;
  onStartChange: (loc: LocationPoint) => void;
  onEndChange: (loc: LocationPoint) => void;
  onModeChange: (mode: TravelMode) => void;
  onSwapLocations: () => void;
  onPlanTrip: () => void;
  isCalculating: boolean;
}

export const JourneyInputPanel: React.FC<JourneyInputPanelProps> = ({
  startLocation,
  endLocation,
  travelMode,
  onStartChange,
  onEndChange,
  onModeChange,
  onSwapLocations,
  onPlanTrip,
  isCalculating,
}) => {
  const [startQuery, setStartQuery] = useState(startLocation.name);
  const [endQuery, setEndQuery] = useState(endLocation.name);
  const [startSuggestions, setStartSuggestions] = useState<LocationPoint[]>([]);
  const [endSuggestions, setEndSuggestions] = useState<LocationPoint[]>([]);
  const [isStartFocused, setIsStartFocused] = useState(false);
  const [isEndFocused, setIsEndFocused] = useState(false);

  const startRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  // Sync state if prop changes externally (e.g. presets or swap)
  useEffect(() => {
    setStartQuery(startLocation.name);
  }, [startLocation.name]);

  useEffect(() => {
    setEndQuery(endLocation.name);
  }, [endLocation.name]);

  // Debounced search for start query
  useEffect(() => {
    if (!isStartFocused) return;
    const timer = setTimeout(async () => {
      if (startQuery.trim().length > 1) {
        const results = await searchLocations(startQuery);
        setStartSuggestions(results);
      } else {
        setStartSuggestions(SINGAPORE_PRESET_LOCATIONS.slice(0, 5));
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [startQuery, isStartFocused]);

  // Debounced search for end query
  useEffect(() => {
    if (!isEndFocused) return;
    const timer = setTimeout(async () => {
      if (endQuery.trim().length > 1) {
        const results = await searchLocations(endQuery);
        setEndSuggestions(results);
      } else {
        setEndSuggestions(SINGAPORE_PRESET_LOCATIONS.slice(0, 5));
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [endQuery, isEndFocused]);

  // Handle outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (startRef.current && !startRef.current.contains(e.target as Node)) {
        setIsStartFocused(false);
      }
      if (endRef.current && !endRef.current.contains(e.target as Node)) {
        setIsEndFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectPresetPair = (startName: string, endName: string) => {
    const s = SINGAPORE_PRESET_LOCATIONS.find((l) => l.name.includes(startName));
    const e = SINGAPORE_PRESET_LOCATIONS.find((l) => l.name.includes(endName));
    if (s && e) {
      onStartChange(s);
      onEndChange(e);
      setStartQuery(s.name);
      setEndQuery(e.name);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Navigation className="w-4 h-4 text-sky-600" />
          Plan Singapore Journey
        </h2>
        <span className="text-xs text-slate-400 font-medium">OneMap & LTA Integrated</span>
      </div>

      {/* Preset popular commuter routes */}
      <div className="mb-4">
        <div className="text-xs text-slate-500 font-medium mb-1.5 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" />
          Popular Traffic Corridors:
        </div>
        <div className="flex flex-wrap gap-1.5">
          {[
            { label: 'Woodlands Checkpoint → CBD', start: 'Woodlands Checkpoint', end: 'Raffles Place' },
            { label: 'Changi Airport → Orchard', start: 'Changi Airport', end: 'Orchard' },
            { label: 'Tuas Checkpoint → Clementi', start: 'Tuas Checkpoint', end: 'Clementi' },
            { label: 'Jurong East → Marina Bay', start: 'Jurong East', end: 'Marina Bay Sands' },
          ].map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => selectPresetPair(preset.start, preset.end)}
              className="text-xs bg-slate-100 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-200 text-slate-700 font-medium px-2.5 py-1 rounded-lg border border-slate-200 transition-all cursor-pointer"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Origin & Destination Inputs */}
      <div className="space-y-3 relative">
        {/* Start Location Input */}
        <div ref={startRef} className="relative">
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Start Location (Origin)
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3 text-emerald-600">
              <MapPin className="w-4 h-4 fill-emerald-100" />
            </div>
            <input
              id="input-start-location"
              type="text"
              value={startQuery}
              onChange={(e) => setStartQuery(e.target.value)}
              onFocus={() => setIsStartFocused(true)}
              placeholder="Enter start address, postal code, or landmark..."
              className="w-full pl-9 pr-8 py-2.5 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            />
            {startQuery && (
              <button
                type="button"
                onClick={() => setStartQuery('')}
                className="absolute right-2.5 text-xs text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {isStartFocused && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto divide-y divide-slate-100">
              <div className="p-2 text-[11px] font-semibold text-slate-400 bg-slate-50 uppercase tracking-wider">
                Select Origin Location
              </div>
              {startSuggestions.length > 0 ? (
                startSuggestions.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      onStartChange(item);
                      setStartQuery(item.name);
                      setIsStartFocused(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-sky-50 flex items-start gap-2 transition-colors cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-semibold text-slate-800">{item.name}</div>
                      {item.address && (
                        <div className="text-slate-500 text-[11px] truncate">{item.address}</div>
                      )}
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-3 text-xs text-slate-400 text-center">
                  No matching locations found
                </div>
              )}
            </div>
          )}
        </div>

        {/* Swap Button Divider */}
        <div className="flex items-center justify-center my-[-4px] relative z-10">
          <button
            id="btn-swap-locations"
            type="button"
            onClick={onSwapLocations}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-sky-600 rounded-full border border-slate-300/80 shadow-xs transition-all cursor-pointer"
            title="Swap Origin and Destination"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Destination Location Input */}
        <div ref={endRef} className="relative">
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            End Location (Destination)
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3 text-rose-600">
              <MapPin className="w-4 h-4 fill-rose-100" />
            </div>
            <input
              id="input-end-location"
              type="text"
              value={endQuery}
              onChange={(e) => setEndQuery(e.target.value)}
              onFocus={() => setIsEndFocused(true)}
              placeholder="Enter destination address, postal code, or landmark..."
              className="w-full pl-9 pr-8 py-2.5 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            />
            {endQuery && (
              <button
                type="button"
                onClick={() => setEndQuery('')}
                className="absolute right-2.5 text-xs text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {isEndFocused && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto divide-y divide-slate-100">
              <div className="p-2 text-[11px] font-semibold text-slate-400 bg-slate-50 uppercase tracking-wider">
                Select Destination Location
              </div>
              {endSuggestions.length > 0 ? (
                endSuggestions.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      onEndChange(item);
                      setEndQuery(item.name);
                      setIsEndFocused(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-sky-50 flex items-start gap-2 transition-colors cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5 text-rose-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-semibold text-slate-800">{item.name}</div>
                      {item.address && (
                        <div className="text-slate-500 text-[11px] truncate">{item.address}</div>
                      )}
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-3 text-xs text-slate-400 text-center">
                  No matching locations found
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Travel Mode Selector */}
      <div className="mt-4">
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">
          Travel Mode
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            id="mode-driving"
            type="button"
            onClick={() => onModeChange('driving')}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              travelMode === 'driving'
                ? 'bg-sky-600 border-sky-600 text-white shadow-sm'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Car className="w-4 h-4" />
            Driving
          </button>
          <button
            id="mode-transit"
            type="button"
            onClick={() => onModeChange('transit')}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              travelMode === 'transit'
                ? 'bg-sky-600 border-sky-600 text-white shadow-sm'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Bus className="w-4 h-4" />
            Transit
          </button>
          <button
            id="mode-walking"
            type="button"
            onClick={() => onModeChange('walking')}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              travelMode === 'walking'
                ? 'bg-sky-600 border-sky-600 text-white shadow-sm'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Footprints className="w-4 h-4" />
            Walking
          </button>
        </div>
      </div>

      {/* Plan Journey Button */}
      <div className="mt-5">
        <button
          id="btn-calculate-route"
          type="button"
          onClick={onPlanTrip}
          disabled={isCalculating}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-md shadow-sky-600/20 transition-all cursor-pointer disabled:opacity-60"
        >
          {isCalculating ? (
            <div className="flex items-center gap-2 text-sm">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Calculating Corridor & Matching Cameras...
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm">
              <Search className="w-4 h-4" />
              See Route & Live Cameras
            </div>
          )}
        </button>
      </div>
    </div>
  );
};
