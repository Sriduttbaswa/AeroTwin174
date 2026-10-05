import React from 'react';
import { 
  Play, 
  ArrowUpRight, 
  Layers, 
  Box, 
  Crosshair, 
  ShieldCheck, 
  Clock, 
  TrendingUp, 
  MapPin, 
  Cpu, 
  ArrowRight,
  Sparkles,
  Maximize2
} from 'lucide-react';
import { Mission, DigitalTwin } from '../../types';

interface DashboardViewProps {
  missions: Mission[];
  twins: DigitalTwin[];
  onSelectMission: (mission: Mission) => void;
  onNavigate: (view: string) => void;
  onLaunchDemo: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  missions,
  twins,
  onSelectMission,
  onNavigate,
  onLaunchDemo,
}) => {
  const readyMissions = missions.filter((m) => m.status === 'Ready');
  const avgConfidence = Math.round(
    readyMissions.reduce((acc, m) => acc + m.overallConfidence, 0) / (readyMissions.length || 1)
  );
  const totalArea = readyMissions.reduce((acc, m) => acc + m.mappedAreaKm2, 0).toFixed(2);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto text-slate-100">
      {/* Top Banner / Hero */}
      <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 border border-slate-800 p-6 md:p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>SIH 26158 · National Technical Research Organisation</span>
          </div>

          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
            One Flight. One Video.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">
              One Measurable 3D World.
            </span>
          </h1>

          <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl">
            AeroTwin transforms a single drone pass into an inspectable, laser-measurable, georeferenced, 
            and confidence-aware 3D digital twin. Designed for strategic reconnaissance, rapid infrastructure 
            inspection, and disaster response where multiple overlapping flights are impossible.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onLaunchDemo}
              className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Launch Demo Mission (AT-024)</span>
            </button>
            <button
              onClick={() => onNavigate('digital-twin')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-750 text-white font-semibold text-xs rounded-lg border border-slate-700 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Box className="w-4 h-4 text-cyan-400" />
              <span>Explore 3D Digital Twin Viewer</span>
            </button>
            <button
              onClick={() => onNavigate('reconstruction')}
              className="px-4 py-2.5 bg-slate-900/80 hover:bg-slate-850 text-slate-300 hover:text-white font-medium text-xs rounded-lg border border-slate-800 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Cpu className="w-4 h-4 text-amber-400" />
              <span>Inspect Pipeline Stages</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        {/* Card 1: Total Missions */}
        <div 
          onClick={() => onNavigate('missions')}
          className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Total Missions</span>
            <Crosshair className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{missions.length}</div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>+25% this month</span>
          </div>
        </div>

        {/* Card 2: Processed */}
        <div 
          onClick={() => onNavigate('missions')}
          className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Processed</span>
            <ShieldCheck className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{readyMissions.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">
            <span>100% telemetry synced</span>
          </div>
        </div>

        {/* Card 3: Digital Twins */}
        <div 
          onClick={() => onNavigate('digital-twin')}
          className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Digital Twins</span>
            <Box className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-400">{twins.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">
            <span>7.3M fused points</span>
          </div>
        </div>

        {/* Card 4: Avg Confidence */}
        <div 
          onClick={() => onNavigate('analysis')}
          className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Avg Confidence</span>
            <ShieldCheck className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{avgConfidence}%</div>
          <div className="text-[11px] text-cyan-400 mt-1">
            <span>High spatial grade</span>
          </div>
        </div>

        {/* Card 5: Mapped Area */}
        <div 
          onClick={() => onNavigate('analysis')}
          className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Mapped Area</span>
            <Layers className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{totalArea} <span className="text-xs font-normal text-slate-400">km²</span></div>
          <div className="text-[11px] text-slate-400 mt-1">
            <span>Corridor coverage</span>
          </div>
        </div>

        {/* Card 6: Queue */}
        <div 
          onClick={() => onNavigate('missions')}
          className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>In Queue</span>
            <Clock className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition-colors" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400">1</div>
          <div className="text-[11px] text-slate-400 mt-1">
            <span>Next: AT-025</span>
          </div>
        </div>
      </div>

      {/* The Single-Pass Pipeline Flow Schematic */}
      <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Single-Pass Ingestion & Reconstruction Pipeline
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Strictly designed around the constraint of extracting metric 3D models from a single forward trajectory.
            </p>
          </div>
          <button 
            onClick={() => onNavigate('reconstruction')}
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
          >
            <span>View Execution Engine</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 pt-2">
          {[
            { step: '01', title: 'Single Flight', desc: '1 forward video pass' },
            { step: '02', title: 'Blur Filter', desc: 'Laplacian variance' },
            { step: '03', title: 'GPS Sync', desc: '10Hz timecode lock' },
            { step: '04', title: 'Keyframes', desc: '74 spatial baselines' },
            { step: '05', title: 'Poisson Mesh', desc: 'Metric scale recovery' },
            { step: '06', title: '3D Twin', desc: 'Measurable & verified' },
          ].map((item, idx) => (
            <div key={idx} className="p-3 bg-slate-950/60 rounded border border-slate-850 space-y-1">
              <span className="text-[10px] font-mono text-cyan-400 font-semibold">{item.step}</span>
              <div className="text-xs font-semibold text-slate-200">{item.title}</div>
              <div className="text-[11px] text-slate-500">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column: Recent Missions & Digital Twin Assets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Missions Feed (2 cols) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Recent Flight Missions
            </h3>
            <button 
              onClick={() => onNavigate('missions')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium"
            >
              View All ({missions.length})
            </button>
          </div>

          <div className="space-y-2">
            {missions.map((m) => (
              <div
                key={m.id}
                onClick={() => {
                  onSelectMission(m);
                  if (m.status === 'Ready') onNavigate('digital-twin');
                  else onNavigate('reconstruction');
                }}
                className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all cursor-pointer group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-1.5 py-0.5 rounded">
                      {m.id}
                    </span>
                    <h4 className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors">
                      {m.name}
                    </h4>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    <span>{m.location}</span>
                    <span>·</span>
                    <span>{m.captureDate}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div className="text-right">
                    <div className="font-mono font-medium text-slate-200">{m.flightDistanceKm} km</div>
                    <div className="text-[10px] text-slate-500">Flight Distance</div>
                  </div>

                  <div className="text-right">
                    <div className={`font-mono font-bold ${
                      m.overallConfidence >= 85 ? 'text-emerald-400' : m.overallConfidence > 0 ? 'text-amber-400' : 'text-slate-500'
                    }`}>
                      {m.overallConfidence > 0 ? `${m.overallConfidence}%` : 'Pending'}
                    </div>
                    <div className="text-[10px] text-slate-500">Confidence</div>
                  </div>

                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${
                    m.status === 'Ready' 
                      ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/50' 
                      : m.status === 'Processing'
                      ? 'bg-amber-950/60 text-amber-300 border-amber-800/50 animate-pulse'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {m.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Digital Twins Spotlight (1 col) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              3D Digital Twins
            </h3>
            <button 
              onClick={() => onNavigate('digital-twin')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium"
            >
              Open Viewer
            </button>
          </div>

          <div className="space-y-3">
            {twins.map((t) => (
              <div
                key={t.id}
                onClick={() => onNavigate('digital-twin')}
                className="rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 overflow-hidden transition-all cursor-pointer group"
              >
                <div className="relative h-28 bg-slate-950 overflow-hidden">
                  <img
                    src={t.thumbnailUrl}
                    alt={t.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded border border-slate-800 text-[10px] text-cyan-300 font-mono">
                    <Box className="w-3 h-3 text-cyan-400" />
                    <span>{t.version}</span>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-white font-medium">
                    <span className="truncate">{t.name}</span>
                    <span className="text-emerald-400 font-mono text-[10px] bg-slate-950/80 px-1.5 py-0.5 rounded border border-emerald-800/40">
                      {t.overallConfidence}%
                    </span>
                  </div>
                </div>

                <div className="p-3 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>{t.polyCount.toLocaleString()} Polys</span>
                  <span>·</span>
                  <span>{t.objectsCount} Spatial Assets</span>
                  <span>·</span>
                  <span className="text-cyan-400 font-mono">WGS 84</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
