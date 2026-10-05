import React from 'react';
import { 
  Sparkles, 
  Search, 
  HelpCircle, 
  Cpu, 
  Radio
} from 'lucide-react';
import { Mission } from '../../types';

interface HeaderProps {
  currentMission: Mission;
  activeView: string;
  onNavigate: (view: string) => void;
  onOpenSearch: () => void;
  onOpenArchitecture: () => void;
  onOpenJudgeMode: () => void;
  isJudgeMode: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentMission,
  activeView,
  onNavigate,
  onOpenSearch,
  onOpenArchitecture,
  onOpenJudgeMode,
  isJudgeMode,
}) => {
  return (
    <header className="h-14 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-4 flex items-center justify-between z-30 select-none">
      {/* Zone 1: Brand title & mission context */}
      <div className="flex items-center gap-3">
        <a 
          href="#overview" 
          onClick={(e) => { e.preventDefault(); onNavigate('overview'); }}
          className="text-base font-bold tracking-tight text-white flex items-center gap-2 group"
        >
          <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400 rotate-45 inline-block group-hover:bg-cyan-300 transition-colors" />
          <span>AeroTwin</span>
        </a>
        <div className="h-4 w-px bg-slate-800 hidden sm:block" />
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
          <span className="text-slate-500">Active Flight:</span>
          <button 
            onClick={() => onNavigate('missions')}
            className="font-mono text-cyan-400 hover:text-cyan-300 transition-colors bg-slate-900/80 hover:bg-slate-800 px-2 py-0.5 rounded border border-slate-800 flex items-center gap-1.5"
            title="Change active mission"
          >
            <span>{currentMission.id}</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-300 max-w-[150px] truncate">{currentMission.name}</span>
          </button>
        </div>
      </div>

      {/* Zone 2: Navigation Links */}
      <nav className="hidden lg:flex items-center gap-1 text-xs font-medium text-slate-400">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'missions', label: 'Missions' },
          { id: 'reconstruction', label: 'Reconstruction' },
          { id: 'digital-twin', label: 'Digital Twin' },
          { id: 'analysis', label: 'Analysis' },
          { id: 'reports', label: 'Reports' },
          { id: 'data', label: 'Data' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`px-3 py-1.5 rounded transition-all ${
              activeView === item.id 
                ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 font-semibold' 
                : 'hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Zone 3: Primary Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-400 bg-slate-900 hover:bg-slate-850 hover:text-slate-200 border border-slate-800 rounded transition-colors"
          title="Search missions, digital twins and objects (Ctrl+K)"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden md:inline">Search</span>
          <kbd className="hidden md:inline text-[10px] bg-slate-800 text-slate-400 px-1 py-0.5 rounded border border-slate-700">⌘K</kbd>
        </button>

        <button
          onClick={onOpenArchitecture}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded transition-colors"
          title="Technical Architecture & SIH Evaluation Guide"
        >
          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">Architecture</span>
        </button>

        <button
          onClick={onOpenJudgeMode}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-all whitespace-nowrap shadow-sm ${
            isJudgeMode 
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold ring-2 ring-amber-400/40' 
              : 'bg-cyan-600 hover:bg-cyan-500 text-white'
          }`}
          title="Start guided 90-second SIH / NTRO evaluation story"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isJudgeMode ? 'Pitch Mode Active' : 'Judge Mode (90s)'}</span>
        </button>
      </div>
    </header>
  );
};
