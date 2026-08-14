import React, { useState } from 'react';
import {
  X,
  Check,
  Crown,
  Sparkles,
  ShieldCheck,
  Camera,
  AlertTriangle,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { MembershipTier } from '../types';

interface MembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier: MembershipTier;
  onUpgrade: () => void;
  onCancelSubscription: () => void;
}

export const MembershipModal: React.FC<MembershipModalProps> = ({
  isOpen,
  onClose,
  currentTier,
  onUpgrade,
  onCancelSubscription,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  if (!isOpen) return null;

  const handleSubscribe = () => {
    setIsProcessing(true);
    setTimeout(() => {
      onUpgrade();
      setIsProcessing(false);
      setShowSuccessToast(true);
      setTimeout(() => {
        setShowSuccessToast(false);
        onClose();
      }, 1500);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white text-slate-900 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors z-10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 text-center relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-wider mb-3">
            <Crown className="w-3.5 h-3.5" />
            See Before You Go Pro Membership
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Unlock Full Corridor Traffic Feeds
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-lg mx-auto leading-relaxed">
            Home & Destination cameras are always <strong className="text-emerald-400">100% Free</strong>.
            Subscribe to Pro to inspect multiple live jam cameras along your expressway journey.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-5 bg-slate-50">
          {/* Free Tier Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-slate-900 text-base">Standard Plan</h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                  Free Forever
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900 mb-4">
                $0 <span className="text-xs font-medium text-slate-400">/month</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>Home / Start</strong> camera view</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>Destination</strong> camera view</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Singapore Road routing & turn steps</span>
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <X className="w-4 h-4 text-slate-300 shrink-0" />
                  <span>Multiple en-route expressway cameras</span>
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <X className="w-4 h-4 text-slate-300 shrink-0" />
                  <span>Live jam point spotter feeds</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              {currentTier === 'free' ? (
                <div className="text-center py-2 text-xs font-semibold text-slate-500 bg-slate-100 rounded-xl">
                  Current Active Plan
                </div>
              ) : (
                <button
                  type="button"
                  onClick={onCancelSubscription}
                  className="w-full text-center py-2 text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                >
                  Downgrade to Free
                </button>
              )}
            </div>
          </div>

          {/* Pro Tier Card */}
          <div className="bg-white rounded-2xl p-5 border-2 border-indigo-600 shadow-md relative flex flex-col justify-between ring-4 ring-indigo-500/10">
            <div className="absolute -top-3 right-4 bg-indigo-600 text-white text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Recommended
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-indigo-950 text-base flex items-center gap-1.5">
                  <Crown className="w-4 h-4 text-amber-500" />
                  Pro Corridor Pass
                </h3>
              </div>
              <div className="text-2xl font-black text-indigo-950 mb-4">
                $4.99 <span className="text-xs font-medium text-slate-500">/month</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span><strong>Up to 6 live cameras</strong> matched along trip</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span><strong>All En-Route Expressways</strong> (PIE, CTE, AYE, etc.)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span><strong>Active Jam Point Feeds</strong> (Accidents & Congestion)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Full HD Lightbox & instant 30s live sync</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Cancel anytime with 1 click</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              {currentTier === 'pro' ? (
                <div className="text-center py-2.5 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Pro Membership Active ($4.99/mo)
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleSubscribe}
                  disabled={isProcessing}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  {isProcessing ? 'Activating Pro...' : 'Subscribe for $4.99 / month'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Security & Guarantee Note */}
        <div className="p-4 bg-white border-t border-slate-200/80 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Real-time LTA DataMall Singapore camera feeds • Safe & secure monthly subscription</span>
        </div>

        {/* Toast Notification */}
        {showSuccessToast && (
          <div className="absolute bottom-6 inset-x-6 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-xl flex items-center justify-center gap-2 text-xs font-bold animate-in slide-in-from-bottom-2">
            <CheckCircle2 className="w-4 h-4" />
            Welcome to Pro! All corridor and live jam cameras unlocked.
          </div>
        )}
      </div>
    </div>
  );
};
