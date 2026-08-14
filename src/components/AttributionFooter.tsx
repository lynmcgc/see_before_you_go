import React, { useState } from 'react';
import { Info, ExternalLink, ShieldCheck, ChevronDown, ChevronUp, Cpu } from 'lucide-react';

export const AttributionFooter: React.FC = () => {
  const [showArch, setShowArch] = useState(false);

  return (
    <footer className="mt-8 pt-6 pb-10 border-t border-slate-200 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Architecture & Flow disclosure */}
        <div className="bg-slate-100/80 rounded-xl p-4 border border-slate-200">
          <button
            type="button"
            onClick={() => setShowArch(!showArch)}
            className="w-full flex items-center justify-between font-bold text-slate-800 hover:text-sky-700 transition-colors cursor-pointer text-xs"
          >
            <span className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-sky-600" />
              App Architecture & Data Flow Overview
            </span>
            {showArch ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showArch && (
            <div className="mt-3 pt-3 border-t border-slate-200 space-y-2.5 text-slate-600 leading-relaxed text-xs">
              <p>
                <strong>1. Geocoding & Search:</strong> Origin and destination locations are resolved into Singapore SVY21/WGS84 coordinates via SLA OneMap Search API.
              </p>
              <p>
                <strong>2. Multimodal Routing:</strong> The route polyline is computed across Singapore arterial roads and expressways with duration and distance estimations.
              </p>
              <p>
                <strong>3. Real-Time Overlay:</strong> Live Traffic Images (~20s refresh) and Traffic Incidents from LTA DataMall / data.gov.sg are layered over the route.
              </p>
              <p>
                <strong>4. Camera-Matching Engine:</strong> Great-circle Haversine spatial calculations match the start point, end point, and route corridor congestion nodes to their closest active expressway cameras.
              </p>
              <p>
                <strong>5. Visual Confirmation:</strong> Visual proof of actual physical road conditions is rendered instantly so commuters can see before they leave.
              </p>
            </div>
          )}
        </div>

        {/* Official Open Data Attribution */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Powered by Singapore Open Government Data: <strong>Land Transport Authority (LTA DataMall / data.gov.sg)</strong> & <strong>Singapore Land Authority (OneMap SLA)</strong>.
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span>Singapore Open Data License</span>
            <span>•</span>
            <a
              href="https://datamall.lta.gov.sg"
              target="_blank"
              rel="noreferrer"
              className="hover:text-sky-600 flex items-center gap-0.5"
            >
              LTA DataMall <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <a
              href="https://www.onemap.gov.sg"
              target="_blank"
              rel="noreferrer"
              className="hover:text-sky-600 flex items-center gap-0.5"
            >
              OneMap <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
