import React from 'react';
import { 
  BarChart3, 
  Layers, 
  ShieldCheck, 
  TrendingUp, 
  Box, 
  Compass, 
  Activity, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { Mission, SpatialObject } from '../../types';
import { SPATIAL_OBJECTS } from '../../data/mockData';

interface AnalysisViewProps {
  mission: Mission;
  onNavigate: (view: string) => void;
  onSelectObject: (obj: SpatialObject) => void;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({
  mission,
  onNavigate,
  onSelectObject,
}) => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">
              Spatial Intelligence & Confidence Analytics
            </h1>
            <span className="font-mono text-xs text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded">
              {mission.id}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Quantified spatial accuracy, surface observability distribution, and structural inventory derived from a single flight pass.
          </p>
        </div>

        <button
          onClick={() => onNavigate('digital-twin')}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-lg flex items-center gap-2 self-start md:self-auto transition-colors cursor-pointer"
        >
          <Box className="w-4 h-4" />
          <span>Open in 3D Viewer</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Overall Spatial Confidence</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {mission.overallConfidence}%
          </div>
          <p className="text-[11px] text-slate-400">
            Weighted composite of geometry, texture, and GNSS
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Geometry Reconstruction</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-400">
            {mission.geometryConfidence}%
          </div>
          <p className="text-[11px] text-slate-400">
            Multi-view parallax re-projection residual: 0.42px
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Effective Mapped Area</span>
            <Layers className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {mission.mappedAreaKm2} <span className="text-sm font-normal text-slate-400">km²</span>
          </div>
          <p className="text-[11px] text-slate-400">
            184 hectares surveyed in 184 seconds
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>GNSS Trajectory Alignment</span>
            <Compass className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {mission.gpsAlignment}%
          </div>
          <p className="text-[11px] text-slate-400">
            UTM Zone 44N datum residual &lt; 0.85m
          </p>
        </div>
      </div>

      {/* Surface Confidence Distribution Histogram & Single-Pass Explanation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Surface Observability & Confidence Distribution
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Breakdown of 894,000 polygon facets based on single-pass camera line-of-sight ray angles.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Direct Multi-View Observed (High Confidence &gt;90%)</span>
                <span className="font-mono text-emerald-400 font-bold">64% (572,160 facets)</span>
              </div>
              <div className="h-2 bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: '64%' }} />
              </div>
              <span className="text-[10px] text-slate-500">
                Front-facing facades and horizontal rooftops viewed across &gt;12 keyframes.
              </span>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Oblique / Grazing Angles (Medium Confidence 70–89%)</span>
                <span className="font-mono text-amber-400 font-bold">22% (196,680 facets)</span>
              </div>
              <div className="h-2 bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: '22%' }} />
              </div>
              <span className="text-[10px] text-slate-500">
                Side walls viewed with shallow parallax angles (25°–45° incidence).
              </span>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Single-Pass Occluded / Shadow Zones (Low Confidence &lt;70%)</span>
                <span className="font-mono text-rose-400 font-bold">14% (125,160 facets)</span>
              </div>
              <div className="h-2 bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-rose-400 rounded-full" style={{ width: '14%' }} />
              </div>
              <span className="text-[10px] text-slate-500">
                Surfaces facing directly away from the single flight corridor. Interpolated with caution.
              </span>
            </div>
          </div>

          <div className="p-3 bg-cyan-950/20 border border-cyan-800/40 rounded-lg text-[11px] text-cyan-200 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              <strong>Engineering Integrity Notice:</strong> AeroTwin never hallucinates unobserved geometry as 100% accurate. 
              Low-confidence surfaces are explicitly flagged so structural inspectors know where supplementary ground validation is required.
            </span>
          </div>
        </div>

        {/* Flight Corridor Cross-Section */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Flight Corridor Profile
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Altitude MSL vs. Ground Obstacle Clearances
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-lg border border-slate-850 space-y-3 font-mono text-xs">
            <div className="flex justify-between border-b border-slate-800/80 pb-2">
              <span className="text-slate-400">Drone Cruise Altitude:</span>
              <span className="text-cyan-400 font-bold">82.0 m MSL</span>
            </div>
            <div className="flex justify-between border-b border-slate-800/80 pb-2">
              <span className="text-slate-400">Tallest Obstacle (Mast):</span>
              <span className="text-amber-400 font-bold">48.0 m AGL</span>
            </div>
            <div className="flex justify-between border-b border-slate-800/80 pb-2">
              <span className="text-slate-400">Minimum Overhead Clearance:</span>
              <span className="text-emerald-400 font-bold">34.0 m</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Mean Flight Speed:</span>
              <span className="text-slate-200 font-bold">12.4 m/s (44.6 km/h)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detected Spatial Objects Inventory */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl space-y-2">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Extracted Structural Asset Inventory
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Classified structures, measured dimensions, and single-pass observational confidence.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
            {SPATIAL_OBJECTS.length} Key Assets
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-4">Asset ID</th>
                <th className="py-2.5 px-4">Name</th>
                <th className="py-2.5 px-4">Type</th>
                <th className="py-2.5 px-4">Height</th>
                <th className="py-2.5 px-4">Footprint Area</th>
                <th className="py-2.5 px-4">Geom Conf</th>
                <th className="py-2.5 px-4">Coverage</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {SPATIAL_OBJECTS.map((obj) => (
                <tr key={obj.id} className="hover:bg-slate-850/50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-cyan-400">
                    {obj.id}
                  </td>
                  <td className="py-3 px-4 font-semibold text-white">
                    {obj.name}
                  </td>
                  <td className="py-3 px-4 capitalize text-slate-400">
                    {obj.type}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-200">
                    {obj.heightM} m
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-200">
                    {obj.areaM2.toLocaleString()} m²
                  </td>
                  <td className="py-3 px-4 font-mono text-emerald-400 font-bold">
                    {obj.geometryConfidence}%
                  </td>
                  <td className="py-3 px-4 font-mono text-cyan-400">
                    {obj.surfaceCoveragePercent}%
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        onSelectObject(obj);
                        onNavigate('digital-twin');
                      }}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-cyan-600 hover:text-white text-slate-300 rounded text-[11px] font-medium transition-colors"
                    >
                      Inspect in 3D
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
