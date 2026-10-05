import React from 'react';
import { X, Box, Compass, Layers, ShieldCheck, Ruler, ArrowRight, AlertTriangle } from 'lucide-react';
import { SpatialObject } from '../../types';

interface ObjectInspectionPanelProps {
  object: SpatialObject | null;
  onClose: () => void;
  onFocusObject: (obj: SpatialObject) => void;
}

export const ObjectInspectionPanel: React.FC<ObjectInspectionPanelProps> = ({
  object,
  onClose,
  onFocusObject,
}) => {
  if (!object) return null;

  return (
    <div className="absolute top-4 right-4 z-20 w-80 bg-slate-900/95 border border-slate-800 rounded-xl shadow-2xl backdrop-blur-md overflow-hidden text-xs text-slate-200 select-none animate-in fade-in slide-in-from-right-4">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span className="font-bold text-white uppercase tracking-wider text-[11px]">
            Spatial Asset Inspector
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body Content */}
      <div className="p-4 space-y-4">
        {/* Title and ID */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-cyan-400 text-[10px] bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40">
              {object.id}
            </span>
            <span className="text-[10px] uppercase font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
              {object.type}
            </span>
          </div>
          <h3 className="font-bold text-white text-sm">
            {object.name}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
            {object.description}
          </p>
        </div>

        {/* Dimension Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-950 rounded-lg border border-slate-850">
          <div>
            <div className="text-[10px] text-slate-500">Height (Z-Axis)</div>
            <div className="font-mono text-sm font-bold text-white">{object.heightM} m</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500">Footprint Area</div>
            <div className="font-mono text-sm font-bold text-white">{object.areaM2.toLocaleString()} m²</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500">Length x Width</div>
            <div className="font-mono text-xs text-slate-300">
              {object.dimensions.lengthM}m × {object.dimensions.widthM}m
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500">Altitude MSL</div>
            <div className="font-mono text-xs text-slate-300">{object.altM} m</div>
          </div>
        </div>

        {/* Geospatial WGS 84 Coordinates */}
        <div className="space-y-1.5 p-2.5 bg-slate-950/80 rounded-lg border border-slate-850">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-semibold uppercase tracking-wider">
            <Compass className="w-3 h-3 text-cyan-400" />
            <span>Georeferenced Anchor</span>
          </div>
          <div className="grid grid-cols-2 gap-2 font-mono text-[11px] text-slate-300">
            <div>
              <span className="text-slate-500 text-[10px]">Latitude: </span>
              {object.lat.toFixed(5)}° N
            </div>
            <div>
              <span className="text-slate-500 text-[10px]">Longitude: </span>
              {object.lon.toFixed(5)}° E
            </div>
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            Datum: WGS 84 / UTM 44N (EPSG:32644)
          </div>
        </div>

        {/* Single-Pass Visibility & Confidence */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Geometry Confidence</span>
            <span className="font-mono text-emerald-400 font-bold">{object.geometryConfidence}%</span>
          </div>
          <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-400 rounded-full"
              style={{ width: `${object.geometryConfidence}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Surface Coverage (Single-Pass)</span>
            <span className="font-mono text-cyan-400 font-bold">{object.surfaceCoveragePercent}%</span>
          </div>
          <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-400 rounded-full"
              style={{ width: `${object.surfaceCoveragePercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
            <span>Observed Keyframes:</span>
            <span className="font-mono text-slate-200">{object.singlePassObservations} frames</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onFocusObject(object)}
          className="w-full py-2 px-3 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Box className="w-3.5 h-3.5" />
          <span>Focus Camera on Asset</span>
        </button>
      </div>
    </div>
  );
};
