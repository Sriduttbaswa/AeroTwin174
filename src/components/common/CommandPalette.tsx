import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Crosshair, Box, FileText, MapPin, ChevronRight, CornerDownLeft } from 'lucide-react';
import { Mission, SpatialObject } from '../../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  missions: Mission[];
  objects: SpatialObject[];
  onSelectMission: (mission: Mission) => void;
  onSelectObject: (obj: SpatialObject) => void;
  onNavigate: (view: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  missions,
  objects,
  onSelectMission,
  onSelectObject,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredMissions = missions.filter(
    (m) =>
      m.id.toLowerCase().includes(query.toLowerCase()) ||
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.location.toLowerCase().includes(query.toLowerCase())
  );

  const filteredObjects = objects.filter(
    (o) =>
      o.name.toLowerCase().includes(query.toLowerCase()) ||
      o.id.toLowerCase().includes(query.toLowerCase()) ||
      o.type.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-slate-950/80 backdrop-blur-sm p-4">
      <div 
        className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[70vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-slate-800 gap-3">
          <Search className="w-4 h-4 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search missions, digital twins, objects, or locations..."
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-500 hover:text-slate-300">
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">ESC</span>
        </div>

        {/* Results List */}
        <div className="p-2 overflow-y-auto space-y-4">
          {/* Quick Actions */}
          {!query && (
            <div>
              <div className="text-[11px] font-semibold text-slate-500 px-3 py-1 uppercase tracking-wider">
                Quick Navigation
              </div>
              <div className="space-y-0.5">
                {[
                  { view: 'digital-twin', label: 'Open 3D Digital Twin Viewer', icon: Box },
                  { view: 'reconstruction', label: 'View Single-Pass Reconstruction Pipeline', icon: Crosshair },
                  { view: 'analysis', label: 'Inspect Spatial Coverage & Confidence Analytics', icon: FileText },
                  { view: 'reports', label: 'Generate SIH Intelligence Report', icon: FileText },
                ].map((action) => (
                  <button
                    key={action.view}
                    onClick={() => {
                      onNavigate(action.view);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded text-xs text-slate-300 hover:bg-slate-800 hover:text-cyan-400 text-left transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <action.icon className="w-3.5 h-3.5 text-slate-500" />
                      <span>{action.label}</span>
                    </div>
                    <CornerDownLeft className="w-3 h-3 text-slate-600" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Missions Results */}
          {filteredMissions.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-500 px-3 py-1 uppercase tracking-wider">
                Missions
              </div>
              <div className="space-y-0.5">
                {filteredMissions.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      onSelectMission(m);
                      onNavigate('digital-twin');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded text-xs text-slate-300 hover:bg-slate-800 hover:text-white text-left transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
                      <div>
                        <div className="font-medium text-slate-200 flex items-center gap-2">
                          <span className="font-mono text-cyan-400">{m.id}</span>
                          <span>{m.name}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-600" />
                          <span>{m.location}</span>
                          <span>·</span>
                          <span>{m.flightDistanceKm} km flight</span>
                          <span>·</span>
                          <span className="text-emerald-400 font-mono">{m.overallConfidence}% conf</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Objects Results */}
          {filteredObjects.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-500 px-3 py-1 uppercase tracking-wider">
                Reconstructed Spatial Objects
              </div>
              <div className="space-y-0.5">
                {filteredObjects.map((obj) => (
                  <button
                    key={obj.id}
                    onClick={() => {
                      onSelectObject(obj);
                      onNavigate('digital-twin');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded text-xs text-slate-300 hover:bg-slate-800 hover:text-white text-left transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Box className="w-3.5 h-3.5 text-amber-400" />
                      <div>
                        <div className="font-medium text-slate-200">
                          {obj.name}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span className="capitalize">{obj.type}</span>
                          <span>·</span>
                          <span className="font-mono">H: {obj.heightM}m</span>
                          <span>·</span>
                          <span className="font-mono">Area: {obj.areaM2} m²</span>
                          <span>·</span>
                          <span className="text-cyan-400 font-mono">{obj.geometryConfidence}% geom conf</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredMissions.length === 0 && filteredObjects.length === 0 && (
            <div className="text-center py-8 text-xs text-slate-500">
              No matching missions or spatial objects found for "{query}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
