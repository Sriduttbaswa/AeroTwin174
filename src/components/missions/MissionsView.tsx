import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Crosshair, 
  Box, 
  Cpu, 
  FileText, 
  MapPin, 
  ArrowUpRight,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { Mission, MissionStatus } from '../../types';

interface MissionsViewProps {
  missions: Mission[];
  onSelectMission: (mission: Mission) => void;
  onOpenCreateMission: () => void;
  onNavigate: (view: string) => void;
}

export const MissionsView: React.FC<MissionsViewProps> = ({
  missions,
  onSelectMission,
  onOpenCreateMission,
  onNavigate,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredMissions = missions.filter((m) => {
    const matchesSearch =
      m.id.toLowerCase().includes(search.toLowerCase()) ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.location.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto text-slate-100">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Mission Operations Center</h1>
            <span className="text-xs bg-slate-800 text-slate-400 font-mono px-2 py-0.5 rounded border border-slate-700">
              {missions.length} Missions
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage single-pass drone reconnaissance sorties, flight telemetry data, and 3D digital twin states.
          </p>
        </div>

        <button
          onClick={onOpenCreateMission}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-lg flex items-center gap-2 shadow-sm transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Flight Mission</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-slate-900/90 rounded-xl border border-slate-800">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by mission ID, name, or coordinates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'Ready', 'Review', 'Processing', 'Queued'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/60 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Missions Table */}
      <div className="rounded-xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Mission ID</th>
                <th className="py-3 px-4">Name & Location</th>
                <th className="py-3 px-4">Flight Distance</th>
                <th className="py-3 px-4">Altitude</th>
                <th className="py-3 px-4">Frames / Keyframes</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredMissions.map((m) => (
                <tr 
                  key={m.id}
                  className="hover:bg-slate-850/50 transition-colors group cursor-pointer"
                  onClick={() => {
                    onSelectMission(m);
                    if (m.status === 'Ready') onNavigate('digital-twin');
                    else onNavigate('reconstruction');
                  }}
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">
                    {m.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                      {m.name}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      <span>{m.location}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-200">
                    {m.flightDistanceKm} km
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-200">
                    {m.altitudeM} m MSL
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">
                    <span>{m.usableFrames.toLocaleString()}</span>
                    <span className="text-slate-500"> / </span>
                    <span className="text-cyan-400 font-semibold">{m.keyframes} key</span>
                  </td>
                  <td className="py-3.5 px-4">
                    {m.overallConfidence > 0 ? (
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              m.overallConfidence >= 85 ? 'bg-emerald-400' : 'bg-amber-400'
                            }`}
                            style={{ width: `${m.overallConfidence}%` }}
                          />
                        </div>
                        <span className="font-mono text-emerald-400 font-bold">
                          {m.overallConfidence}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-500 italic">Unprocessed</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${
                      m.status === 'Ready'
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/50'
                        : m.status === 'Review'
                        ? 'bg-sky-950/60 text-sky-300 border-sky-800/50'
                        : m.status === 'Processing'
                        ? 'bg-amber-950/60 text-amber-300 border-amber-800/50 animate-pulse'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      {m.status === 'Ready' && (
                        <button
                          onClick={() => {
                            onSelectMission(m);
                            onNavigate('digital-twin');
                          }}
                          className="p-1.5 rounded bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-800/50 text-cyan-300 hover:text-white transition-colors"
                          title="Open 3D Digital Twin Viewer"
                        >
                          <Box className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          onSelectMission(m);
                          onNavigate('reconstruction');
                        }}
                        className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="View Reconstruction Pipeline"
                      >
                        <Cpu className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          onSelectMission(m);
                          onNavigate('reports');
                        }}
                        className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="View Intelligence Report"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
