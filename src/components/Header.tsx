import React from 'react';
import { Camera, RefreshCw, Crown, Sparkles, ShieldCheck } from 'lucide-react';
import { MembershipTier } from '../types';

interface HeaderProps {
  cameraCount: number;
  lastUpdated: Date | null;
  isLoading: boolean;
  onRefresh: () => void;
  membershipTier: MembershipTier;
  onOpenMembership: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cameraCount,
  lastUpdated,
  isLoading,
  onRefresh,
  membershipTier,
  onOpenMembership,
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-inner text-white font-bold shrink-0">
            <Camera className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                See Before You Go
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-950 text-sky-300 border border-sky-800/80">
                  Singapore LTA
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400">
              Live expressway traffic cameras matched to your journey corridor
            </p>
          </div>
        </div>

        {/* Status, Membership & Refresh Actions */}
        <div className="flex flex-wrap items-center gap-2.5 self-end sm:self-auto">
          {/* Membership Tier Button */}
          <button
            type="button"
            onClick={onOpenMembership}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer shadow-sm ${
              membershipTier === 'pro'
                ? 'bg-amber-400 text-slate-950 hover:bg-amber-300 ring-2 ring-amber-400/30'
                : 'bg-indigo-600 text-white hover:bg-indigo-500 ring-1 ring-indigo-400/40'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            {membershipTier === 'pro' ? (
              <span>Pro Active ($4.99/mo)</span>
            ) : (
              <span>Upgrade to Pro ($4.99/mo)</span>
            )}
          </button>

          {/* Online Counter */}
          <div className="flex items-center gap-2 text-xs bg-slate-800/90 px-3 py-1.5 rounded-lg border border-slate-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300 font-medium">
              {cameraCount > 0 ? `${cameraCount} Cameras` : 'Connecting...'}
            </span>
            {lastUpdated && (
              <span className="text-slate-500 hidden md:inline border-l border-slate-700 pl-2">
                {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            )}
          </div>

          {/* Refresh Feeds Button */}
          <button
            id="btn-refresh-cameras"
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 border border-slate-700 rounded-lg transition-colors shadow-sm cursor-pointer"
            title="Refresh live camera feeds and traffic incidents"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>
    </header>
  );
};

