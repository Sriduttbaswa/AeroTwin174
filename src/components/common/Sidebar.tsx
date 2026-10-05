import React from 'react';
import { 
  LayoutDashboard, 
  Crosshair, 
  Cpu, 
  Box, 
  BarChart3, 
  FileText, 
  Database, 
  PlayCircle,
  Activity,
  Layers,
  ChevronRight,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { Mission } from '../../types';

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
  onLaunchDemo: () => void;
  currentMission: Mission;
  isProcessing: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onNavigate,
  onLaunchDemo,
  currentMission,
  isProcessing,
}) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, badge: null },
    { id: 'missions', label: 'Missions', icon: Crosshair, badge: '4' },
    { 
      id: 'reconstruction', 
      label: 'Reconstruction', 
      icon: Cpu, 
      badge: isProcessing ? 'ACTIVE' : null,
      pulse: isProcessing 
    },
    { id: 'digital-twin', label: 'Digital Twin', icon: Box, highlight: true },
    { id: 'analysis', label: 'Spatial Analysis', icon: BarChart3, badge: null },
    { id: 'reports', label: 'Mission Reports', icon: FileText, badge: null },
    { id: 'data', label: 'Data & Assets', icon: Database, badge: null },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950 flex flex-col justify-between shrink-0 h-[calc(100vh-3.5rem)] select-none">
      {/* Top Section */}
      <div className="p-3 space-y-4">
        {/* Quick Demo CTA Card */}
        <div className="p-3 rounded-lg bg-gradient-to-b from-slate-900 to-slate-950 border border-cyan-900/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-cyan-400 font-semibold tracking-wider text-[10px] uppercase">NTRO SIH Demo</span>
            <span className="font-mono text-[10px] text-slate-400">AT-024</span>
          </div>
          <p className="text-xs text-slate-300 font-medium mb-2.5">
            Single-Pass Naval Substation & Coastal Recon Twin
          </p>
          <button
            onClick={onLaunchDemo}
            className="w-full flex items-center justify-center gap-2 py-1.5 px-3 bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 text-white text-xs font-semibold rounded shadow-sm transition-all"
          >
            <PlayCircle className="w-4 h-4 text-cyan-200" />
            <span>Launch Demo Mission</span>
          </button>
        </div>

        {/* Primary Navigation */}
        <div className="space-y-1">
          <div className="px-3 py-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Spatial Workspace
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-slate-900 text-cyan-400 border border-slate-800 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    item.pulse 
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse' 
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {item.highlight && !isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Section: System Telemetry & Organization */}
      <div className="p-3 border-t border-slate-900 space-y-3 bg-slate-950">
        {/* Hardware & Spatial Sync Status */}
        <div className="p-2.5 rounded bg-slate-900/80 border border-slate-850 space-y-1.5 text-[11px]">
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>GNSS RTK Engine</span>
            </span>
            <span className="font-mono text-emerald-400">3D_FIX (0.85m)</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5">
              <Compass className="w-3 h-3 text-cyan-400" />
              <span>Geodetic Datum</span>
            </span>
            <span className="font-mono text-slate-300">UTM 44N</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-cyan-400" />
              <span>Offline Cache</span>
            </span>
            <span className="font-mono text-cyan-400">100% Ready</span>
          </div>
        </div>

        {/* Organization / Evaluator Profile */}
        <div className="flex items-center justify-between px-2 pt-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-cyan-400 font-mono">
              NT
            </div>
            <div>
              <div className="text-slate-200 font-medium leading-none text-xs">NTRO Evaluator</div>
              <div className="text-[10px] text-slate-500 mt-0.5">SIH-26158 Console</div>
            </div>
          </div>
          <ShieldCheck className="w-4 h-4 text-cyan-500/80" />
        </div>
      </div>
    </aside>
  );
};
