import React from 'react';
import { ShieldCheck, AlertCircle, Info, EyeOff } from 'lucide-react';

interface ConfidenceLegendProps {
  confidenceMode: boolean;
  occlusionMode: boolean;
}

export const ConfidenceLegend: React.FC<ConfidenceLegendProps> = ({
  confidenceMode,
  occlusionMode,
}) => {
  if (!confidenceMode && !occlusionMode) return null;

  return (
    <div className="absolute bottom-16 right-4 z-20 w-72 bg-slate-900/95 border border-slate-800 rounded-xl shadow-2xl backdrop-blur-md p-3 text-xs text-slate-200 select-none animate-in fade-in slide-in-from-bottom-2">
      <div className="flex items-center gap-1.5 font-bold text-white text-[11px] mb-2 uppercase tracking-wider">
        <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
        <span>Single-Pass Uncertainty Heatmap</span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-emerald-500 shrink-0" />
            <span className="text-slate-300">Observed (High Conf)</span>
          </div>
          <span className="font-mono text-emerald-400 font-bold">90%–100%</span>
        </div>

        <div className="flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-amber-500 shrink-0" />
            <span className="text-slate-300">Oblique Angle (Med Conf)</span>
          </div>
          <span className="font-mono text-amber-400 font-bold">70%–89%</span>
        </div>

        <div className="flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-rose-500 shrink-0" />
            <span className="text-slate-300">Occluded Back Face</span>
          </div>
          <span className="font-mono text-rose-400 font-bold">&lt; 70%</span>
        </div>

        {occlusionMode && (
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-indigo-500/60 border border-indigo-400 shrink-0" />
              <span className="text-indigo-200">Line-of-Sight Shadow Cone</span>
            </div>
            <span className="font-mono text-indigo-300 font-bold">Blind Zone</span>
          </div>
        )}

        <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 leading-tight">
          <p>
            <strong>Single-Pass Honesty:</strong> Surfaces facing directly opposite to the drone’s flight corridor 
            cannot be directly seen and are explicitly marked as low-confidence.
          </p>
        </div>
      </div>
    </div>
  );
};
