import React, { useState } from 'react';
import { 
  Database, 
  Film, 
  FileText, 
  Box, 
  MapPin, 
  Download, 
  Search, 
  HardDrive, 
  ArrowUpRight,
  ShieldCheck,
  Radio
} from 'lucide-react';
import { Mission } from '../../types';

interface DataAssetsViewProps {
  mission: Mission;
  onNavigate: (view: string) => void;
}

interface AssetFile {
  id: string;
  name: string;
  category: 'Video' | 'Telemetry' | 'Mesh3D' | 'Pointcloud' | 'Report';
  size: string;
  format: string;
  status: 'Ready' | 'Processing';
  updatedAt: string;
}

export const DataAssetsView: React.FC<DataAssetsViewProps> = ({ mission, onNavigate }) => {
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const files: AssetFile[] = [
    {
      id: 'f-1',
      name: 'NTRO_FLIGHT_AT024_PASS_4K.MP4',
      category: 'Video',
      size: '1.42 GB',
      format: 'HEVC / H.265 (4K 60fps)',
      status: 'Ready',
      updatedAt: '2026-09-28 10:42',
    },
    {
      id: 'f-2',
      name: 'FLIGHT_AT024_GNSS_IMU_10HZ.SRT',
      category: 'Telemetry',
      size: '4.8 MB',
      format: 'SubRip Embedded Telemetry',
      status: 'Ready',
      updatedAt: '2026-09-28 10:42',
    },
    {
      id: 'f-3',
      name: 'TWIN_AT024_POISSON_SURFACE.GLB',
      category: 'Mesh3D',
      size: '64.2 MB',
      format: 'Binary glTF / 894k Polygons',
      status: 'Ready',
      updatedAt: '2026-09-28 10:55',
    },
    {
      id: 'f-4',
      name: 'TWIN_AT024_DENSE_FUSED.PLY',
      category: 'Pointcloud',
      size: '182.0 MB',
      format: 'Stanford Polygon PLY / 4.28M pts',
      status: 'Ready',
      updatedAt: '2026-09-28 10:52',
    },
    {
      id: 'f-5',
      name: 'ORTHOMOSAIC_NADIR_UTM44N.TIF',
      category: 'Mesh3D',
      size: '310.5 MB',
      format: 'GeoTIFF (2.1 cm/px GSD)',
      status: 'Ready',
      updatedAt: '2026-09-28 10:58',
    },
    {
      id: 'f-6',
      name: 'NTRO_DOSSIER_REPORT_AT024.PDF',
      category: 'Report',
      size: '2.4 MB',
      format: 'PDF / Verified Sign-Off',
      status: 'Ready',
      updatedAt: '2026-09-28 11:02',
    },
  ];

  const filtered = files.filter((f) => {
    const matchesFilter = filter === 'ALL' || f.category === filter;
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Data & Spatial Assets Vault</h1>
            <span className="font-mono text-xs text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded">
              {mission.id}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Raw aerial sensor recordings, synchronized telemetry logs, reconstructed 3D point clouds, and export bundles.
          </p>
        </div>

        <button
          onClick={() => onNavigate('digital-twin')}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-lg flex items-center gap-2 self-start sm:self-auto transition-colors cursor-pointer"
        >
          <Box className="w-4 h-4" />
          <span>Launch in 3D Viewer</span>
        </button>
      </div>

      {/* Storage Breakdown Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">Total Vault Storage</div>
          <div className="text-2xl font-bold font-mono text-white">1.98 GB</div>
          <div className="text-[11px] text-slate-500 mt-1">6 Artifacts stored</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">Raw Video Archive</div>
          <div className="text-2xl font-bold font-mono text-cyan-400">1.42 GB</div>
          <div className="text-[11px] text-slate-500 mt-1">HEVC 4K 60fps</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">3D Assets (Mesh + PLY)</div>
          <div className="text-2xl font-bold font-mono text-emerald-400">246 MB</div>
          <div className="text-[11px] text-slate-500 mt-1">894k polys · 4.28M pts</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">Geodetic Registration</div>
          <div className="text-2xl font-bold font-mono text-indigo-400">UTM 44N</div>
          <div className="text-[11px] text-slate-500 mt-1">WGS 84 Datum locked</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-slate-900 rounded-xl border border-slate-800">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search filenames..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 text-xs">
          {['ALL', 'Video', 'Telemetry', 'Mesh3D', 'Pointcloud', 'Report'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap font-medium ${
                filter === cat
                  ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/60 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Files Table */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Artifact Name</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Format / Specification</th>
              <th className="py-3 px-4">File Size</th>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.map((file) => (
              <tr key={file.id} className="hover:bg-slate-850/50 transition-colors">
                <td className="py-3 px-4 font-mono font-medium text-white flex items-center gap-2">
                  <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{file.name}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-[10px] font-mono uppercase bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
                    {file.category}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-300">
                  {file.format}
                </td>
                <td className="py-3 px-4 font-mono text-cyan-400 font-semibold">
                  {file.size}
                </td>
                <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                  {file.updatedAt}
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => {
                      alert(`Initiating download for ${file.name}`);
                    }}
                    className="p-1.5 rounded bg-slate-800 hover:bg-cyan-600 hover:text-white text-slate-300 transition-colors inline-flex items-center gap-1 text-[11px] px-2.5"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
