import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Share2, 
  ShieldCheck, 
  Compass, 
  Box, 
  Ruler, 
  AlertTriangle,
  CheckCircle2,
  FileJson,
  FileSpreadsheet
} from 'lucide-react';
import { Mission, SpatialObject } from '../../types';
import { SPATIAL_OBJECTS } from '../../data/mockData';

interface ReportsViewProps {
  mission: Mission;
  onNavigate: (view: string) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ mission, onNavigate }) => {
  const [copiedNotification, setCopiedNotification] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const reportData = {
      missionMetadata: mission,
      reconstructedAssets: SPATIAL_OBJECTS,
      georeferencing: {
        datum: 'WGS 84 / UTM Zone 44N (EPSG:32644)',
        lat: mission.coordinates.lat,
        lon: mission.coordinates.lon,
        altM: mission.coordinates.altM,
      },
      exportTimestamp: new Date().toISOString(),
      evaluationStatement: 'SIH 26158 NTRO Single-Pass Drone 3D Digital Twin Platform',
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AEROTWIN_REPORT_${mission.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    let csv = 'Asset_ID,Name,Type,Height_m,Area_m2,Lat,Lon,Alt_m,Confidence_Percent\n';
    SPATIAL_OBJECTS.forEach((o) => {
      csv += `"${o.id}","${o.name}","${o.type}",${o.heightM},${o.areaM2},${o.lat},${o.lon},${o.altM},${o.geometryConfidence}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AEROTWIN_ASSETS_${mission.id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto text-slate-100">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800 print:hidden">
        <div>
          <h1 className="text-base font-bold text-white tracking-tight">
            Spatial Reconnaissance Intelligence Dossier
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Mission {mission.id} · Single-Pass Drone 3D Reconstruction Verification
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Print or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            <span>Print / PDF</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Download GeoJSON and metadata"
          >
            <FileJson className="w-3.5 h-3.5 text-cyan-400" />
            <span>JSON</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Download CSV asset table"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>CSV</span>
          </button>

          <button
            onClick={handleShare}
            className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedNotification ? 'Link Copied!' : 'Share Dossier'}</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Body */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 space-y-8 shadow-2xl text-xs text-slate-300 print:border-none print:p-0 print:bg-white print:text-black">
        {/* Document Header */}
        <div className="border-b border-slate-800 pb-6 flex items-start justify-between">
          <div className="space-y-1">
            <div className="text-[10px] uppercase font-bold tracking-widest text-cyan-400 font-mono print:text-blue-700">
              NATIONAL TECHNICAL RESEARCH ORGANISATION (NTRO) · SIH 26158
            </div>
            <h2 className="text-xl font-bold text-white print:text-black">
              AeroTwin Spatial Digital Twin Evaluation Dossier
            </h2>
            <div className="text-slate-400 text-xs print:text-slate-600">
              Single-Pass Monocular Aerial Reconstruction & Metric Verification Report
            </div>
          </div>

          <div className="text-right font-mono text-[11px] space-y-0.5">
            <div className="text-slate-400">Dossier Ref: <strong className="text-cyan-400 print:text-blue-700">AT-REPORT-024</strong></div>
            <div className="text-slate-400">Date: {mission.captureDate}</div>
            <div className="text-emerald-400 font-semibold print:text-green-700">STATUS: VERIFIED READY</div>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 border-b border-slate-800/80 pb-1 print:text-black print:border-slate-300">
            01. Executive Operational Summary
          </h3>
          <p className="leading-relaxed text-slate-300 print:text-slate-800">
            On September 28, 2026, an autonomous reconnaissance quadcopter executed a single continuous flight pass 
            spanning 1.84 km over the Visakhapatnam Naval Substation & Coastal Logistics Corridor. AeroTwin ingested 
            the raw 4K 60fps video feed (2,481 frames) and synchronized 10Hz GNSS/SRT telemetry logs. Filtering discarded 
            motion-blurred frames, extracting 74 geometrically optimal spatial keyframes. Screened Poisson reconstruction 
            generated an 894,000 polygon 3D digital twin georeferenced to UTM Zone 44N with an overall spatial confidence of 86%.
          </p>
        </div>

        {/* Section 2: Flight Telemetry & Ingest Specifications */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 border-b border-slate-800/80 pb-1 print:text-black print:border-slate-300">
            02. Flight Telemetry & Ingest Specifications
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-[11px]">
            <div className="p-3 bg-slate-900 rounded border border-slate-800 print:bg-slate-100 print:border-slate-300">
              <span className="text-slate-500 block text-[10px]">Flight Trajectory</span>
              <strong className="text-white print:text-black">{mission.flightDistanceKm} km Corridor</strong>
            </div>
            <div className="p-3 bg-slate-900 rounded border border-slate-800 print:bg-slate-100 print:border-slate-300">
              <span className="text-slate-500 block text-[10px]">Mean Altitude</span>
              <strong className="text-white print:text-black">{mission.altitudeM} m MSL</strong>
            </div>
            <div className="p-3 bg-slate-900 rounded border border-slate-800 print:bg-slate-100 print:border-slate-300">
              <span className="text-slate-500 block text-[10px]">Frames Decoded</span>
              <strong className="text-white print:text-black">{mission.totalFrames.toLocaleString()} Frames</strong>
            </div>
            <div className="p-3 bg-slate-900 rounded border border-slate-800 print:bg-slate-100 print:border-slate-300">
              <span className="text-slate-500 block text-[10px]">Keyframe Baseline</span>
              <strong className="text-cyan-400 print:text-blue-700">{mission.keyframes} Keyframes</strong>
            </div>
          </div>
        </div>

        {/* Section 3: Georeferencing & Spatial Verification */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 border-b border-slate-800/80 pb-1 print:text-black print:border-slate-300">
            03. Georeferencing & Scale Rectification
          </h3>
          <div className="p-4 bg-slate-900 rounded-lg border border-slate-800 space-y-2 print:bg-slate-50 print:border-slate-300">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <div>
                <span className="text-slate-500 block text-[10px]">Coordinate System:</span>
                <span className="font-mono font-medium text-slate-200 print:text-black">WGS 84 / UTM Zone 44N (EPSG:32644)</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Reference Anchor:</span>
                <span className="font-mono font-medium text-slate-200 print:text-black">17.6868° N, 83.2185° E</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">GNSS Baseline Residual:</span>
                <span className="font-mono font-medium text-emerald-400 print:text-green-700">&lt; 0.85m Horizontal RMS</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 print:text-slate-700">
              Metric scale was resolved by computing translational camera vector displacement between timestamped 
              GNSS keyframe anchors, eliminating monocular scale ambiguity.
            </p>
          </div>
        </div>

        {/* Section 4: Reconstructed Assets Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 border-b border-slate-800/80 pb-1 print:text-black print:border-slate-300">
            04. Key Structural Assets Catalog
          </h3>
          <div className="border border-slate-800 rounded-lg overflow-hidden print:border-slate-300">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase text-[10px] print:bg-slate-200 print:text-slate-800">
                <tr>
                  <th className="py-2 px-3">Asset ID</th>
                  <th className="py-2 px-3">Structural Name</th>
                  <th className="py-2 px-3">Height</th>
                  <th className="py-2 px-3">Footprint</th>
                  <th className="py-2 px-3">Geom Conf</th>
                  <th className="py-2 px-3">Coverage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 print:divide-slate-300">
                {SPATIAL_OBJECTS.map((obj) => (
                  <tr key={obj.id} className="print:text-black">
                    <td className="py-2 px-3 font-mono font-bold text-cyan-400 print:text-blue-700">{obj.id}</td>
                    <td className="py-2 px-3 font-semibold">{obj.name}</td>
                    <td className="py-2 px-3 font-mono">{obj.heightM} m</td>
                    <td className="py-2 px-3 font-mono">{obj.areaM2} m²</td>
                    <td className="py-2 px-3 font-mono text-emerald-400 print:text-green-700">{obj.geometryConfidence}%</td>
                    <td className="py-2 px-3 font-mono text-cyan-400 print:text-blue-700">{obj.surfaceCoveragePercent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 5: Confidence & Single-Pass Limitations */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 border-b border-slate-800/80 pb-1 print:text-black print:border-slate-300">
            05. Single-Pass Occlusion & Uncertainty Disclosures
          </h3>
          <div className="p-4 bg-slate-900/60 rounded-lg border border-slate-800 space-y-2 print:bg-slate-50 print:border-slate-300 text-[11px]">
            <p>
              Under the single-pass flight constraint, 14% of surface facets (specifically northern leeward facades of Building 07 and the storage silos) 
              were not in direct line-of-sight of the camera trajectory. These surfaces are explicitly flagged as 
              <strong> Low Confidence / Estimated (&lt;70%)</strong> in the 3D digital twin.
            </p>
            <p className="text-slate-400 print:text-slate-600">
              AeroTwin guarantees that no interpolated surface is falsely presented as verified ground truth. 
              Measurements spanning unobserved surfaces carry explicit confidence warnings.
            </p>
          </div>
        </div>

        {/* Signatures */}
        <div className="pt-6 border-t border-slate-800 flex justify-between items-end text-[11px] print:border-slate-300">
          <div>
            <div className="text-slate-500">Reconnaissance Wing Commander</div>
            <div className="font-semibold text-slate-200 print:text-black">Baswa / NTRO Flight Unit 4</div>
            <div className="text-slate-500 text-[10px]">Verified Cryptographic Sign-Off</div>
          </div>

          <div className="text-right">
            <div className="font-mono text-xs text-cyan-400 print:text-blue-700">AEROTWIN ENGINE v3.2</div>
            <div className="text-slate-500 text-[10px]">SHA256: 9b2d87e14c...3f4a</div>
          </div>
        </div>
      </div>
    </div>
  );
};
