import React from 'react';
import { Ruler, Trash2, Crosshair, ArrowRight, Check } from 'lucide-react';
import { Measurement } from '../../types';

interface MeasurementPanelProps {
  measurements: Measurement[];
  isMeasuring: boolean;
  onToggleMeasuring: () => void;
  onClearMeasurements: () => void;
  onApplyPreset: (label: string, dist: number, hDelta: number) => void;
}

export const MeasurementPanel: React.FC<MeasurementPanelProps> = ({
  measurements,
  isMeasuring,
  onToggleMeasuring,
  onClearMeasurements,
  onApplyPreset,
}) => {
  return (
    <div className="absolute top-4 left-4 z-20 w-80 bg-slate-900/95 border border-slate-800 rounded-xl shadow-2xl backdrop-blur-md overflow-hidden text-xs text-slate-200 select-none animate-in fade-in slide-in-from-left-4">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Ruler className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-white uppercase tracking-wider text-[11px]">
            3D Laser Measurement Engine
          </span>
        </div>
        {measurements.length > 0 && (
          <button
            onClick={onClearMeasurements}
            className="text-slate-400 hover:text-rose-400 p-1 rounded hover:bg-slate-800 transition-colors"
            title="Clear all measurements"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        {/* Toggle Laser Tool Button */}
        <button
          onClick={onToggleMeasuring}
          className={`w-full py-2 px-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            isMeasuring
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 ring-2 ring-amber-400/50'
              : 'bg-cyan-600 hover:bg-cyan-500 text-white'
          }`}
        >
          <Crosshair className="w-4 h-4" />
          <span>{isMeasuring ? 'Click Two Points in 3D Scene...' : 'Enable 3D Laser Caliper'}</span>
        </button>

        <p className="text-[11px] text-slate-400 leading-relaxed">
          {isMeasuring
            ? 'Point 1 anchors the laser origin. Point 2 calculates metric Euclidean distance and vertical height delta.'
            : 'Metric scale is derived directly from camera GNSS baseline deltas and optical disparity.'}
        </p>

        {/* Preset Verification Distances */}
        <div className="pt-2 border-t border-slate-800/80">
          <div className="text-[10px] uppercase font-semibold text-slate-500 mb-1.5">
            Quick Structural Verification Presets
          </div>
          <div className="space-y-1">
            {[
              { label: 'Building 07 → Road Clearance', dist: 24.6, hDelta: 0.4 },
              { label: 'North Hangar Main Span Width', dist: 50.0, hDelta: 0.0 },
              { label: 'Substation Transformer Height', dist: 6.2, hDelta: 6.2 },
            ].map((p, idx) => (
              <button
                key={idx}
                onClick={() => onApplyPreset(p.label, p.dist, p.hDelta)}
                className="w-full text-left p-2 rounded bg-slate-950 hover:bg-slate-850 border border-slate-850 hover:border-slate-700 flex items-center justify-between text-[11px] transition-colors"
              >
                <span className="text-slate-300 truncate">{p.label}</span>
                <span className="font-mono text-cyan-400 font-bold ml-2 shrink-0">{p.dist}m</span>
              </button>
            ))}
          </div>
        </div>

        {/* Active Measurements List */}
        {measurements.length > 0 && (
          <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
            <div className="text-[10px] uppercase font-semibold text-slate-500">
              Active Scene Dimensions ({measurements.length})
            </div>
            <div className="max-h-36 overflow-y-auto space-y-1">
              {measurements.map((m) => (
                <div
                  key={m.id}
                  className="p-2 rounded bg-slate-950 border border-slate-850 flex items-center justify-between text-[11px]"
                >
                  <span className="text-slate-300 truncate">{m.label}</span>
                  <div className="text-right shrink-0">
                    <span className="font-mono text-emerald-400 font-bold">{m.distanceM.toFixed(1)} m</span>
                    {m.heightDeltaM > 0 && (
                      <span className="text-[10px] text-slate-500 font-mono ml-1.5">
                        (Δh: {m.heightDeltaM.toFixed(1)}m)
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
