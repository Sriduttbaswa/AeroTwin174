import React, { useState, useEffect } from 'react';
import { 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Box, 
  Cpu, 
  Activity, 
  Radio, 
  Film, 
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Info
} from 'lucide-react';
import { Mission, FrameQualityMetric, TechnicalLog } from '../../types';
import { FRAME_QUALITY_DATA, SAMPLE_LOGS } from '../../data/mockData';

interface ReconstructionWorkspaceProps {
  mission: Mission;
  onNavigate: (view: string) => void;
}

interface StageItem {
  id: string;
  name: string;
  desc: string;
  completedAtStep: number;
}

const STAGES: StageItem[] = [
  { id: '1', name: 'Video Ingestion & Validation', desc: '4K 60fps HEVC stream integrity verified', completedAtStep: 1 },
  { id: '2', name: 'Frame Extraction & Laplacian Blur Filter', desc: '2,481 frames parsed · 386 sharp frames kept', completedAtStep: 2 },
  { id: '3', name: 'Motion Analysis & Optical Flow', desc: 'Forward camera velocity vector estimated', completedAtStep: 3 },
  { id: '4', name: 'Adaptive Keyframe Selection', desc: '74 spatial baselines selected (3-5° separation)', completedAtStep: 4 },
  { id: '5', name: 'GPS Telemetry Synchronization', desc: 'Locked 10Hz GNSS track with visual odometry', completedAtStep: 5 },
  { id: '6', name: 'Spatial Feature Extraction & Matching', desc: 'Robust correspondence across consecutive frames', completedAtStep: 6 },
  { id: '7', name: 'Dense Depth Estimation', desc: 'Foundation monocular depth regression', completedAtStep: 7 },
  { id: '8', name: 'Point Cloud Generation', desc: '4,280,000 spatial points with surface normals', completedAtStep: 8 },
  { id: '9', name: 'Screened Poisson Mesh Reconstruction', desc: '894,000 watertight polygon facets generated', completedAtStep: 9 },
  { id: '10', name: 'Texture Projection & Color Balancing', desc: 'Multi-view radiometric blending & unwrapping', completedAtStep: 10 },
  { id: '11', name: 'Georeferencing & Scale Rectification', desc: 'EPSG:32644 (WGS 84 / UTM 44N) datum applied', completedAtStep: 11 },
  { id: '12', name: '3D Digital Twin Bundling', desc: 'Confidence maps, occlusion bounds & metadata', completedAtStep: 12 },
];

export const ReconstructionWorkspace: React.FC<ReconstructionWorkspaceProps> = ({
  mission,
  onNavigate,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(12); // completed by default for demo
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [logs, setLogs] = useState<TechnicalLog[]>(SAMPLE_LOGS);
  const [selectedFrame, setSelectedFrame] = useState<FrameQualityMetric>(FRAME_QUALITY_DATA[0]);

  const handleRerun = () => {
    setCurrentStep(1);
    setIsRunning(true);
    setLogs([SAMPLE_LOGS[0]]);
  };

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= 12) {
          setIsRunning(false);
          return 12;
        }
        const next = prev + 1;
        if (SAMPLE_LOGS[next - 1]) {
          setLogs((prevLogs) => [...prevLogs, SAMPLE_LOGS[next - 1]]);
        }
        return next;
      });
    }, 1200);
    return () => clearInterval(interval);
  }, [isRunning]);

  const progressPercent = Math.round((currentStep / 12) * 100);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto text-slate-100">
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/70 border border-cyan-800/40 px-2 py-0.5 rounded">
              MISSION {mission.id}
            </span>
            <span className="text-xs text-slate-400">· Single-Pass 3D Reconstruction Engine</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            {mission.name}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
            <span>Flight: <strong className="text-slate-200 font-mono">{mission.flightDistanceKm} km</strong></span>
            <span>·</span>
            <span>Altitude: <strong className="text-slate-200 font-mono">{mission.altitudeM} m</strong></span>
            <span>·</span>
            <span>Frames: <strong className="text-slate-200 font-mono">{mission.totalFrames.toLocaleString()}</strong></span>
            <span>·</span>
            <span>Keyframes: <strong className="text-cyan-400 font-mono">{mission.keyframes}</strong></span>
            <span>·</span>
            <span>Coverage: <strong className="text-emerald-400 font-mono">{mission.coveragePercent}%</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRerun}
            disabled={isRunning}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Simulate reconstruction pipeline from step 1"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Processing...' : 'Re-Run Pipeline'}</span>
          </button>

          <button
            onClick={() => onNavigate('digital-twin')}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <Box className="w-4 h-4 fill-current" />
            <span>Inspect 3D Digital Twin</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Progress Status Bar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-semibold text-slate-200">
              {progressPercent === 100 ? 'Reconstruction Complete · Digital Twin Ready' : `Executing Stage ${currentStep} of 12...`}
            </span>
          </div>
          <span className="font-mono text-cyan-400 font-bold text-sm">{progressPercent}%</span>
        </div>
        <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-sky-400 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Two-Column Layout: Pipeline Stages & Quality Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stages Checklist (2 cols) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Single-Pass Processing Stages
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">12 Discrete Operations</span>
          </div>

          <div className="space-y-2">
            {STAGES.map((stage, idx) => {
              const isDone = currentStep >= stage.completedAtStep;
              const isCurrent = currentStep === stage.completedAtStep - 1 && isRunning;

              return (
                <div
                  key={stage.id}
                  className={`p-3 rounded-lg border transition-all flex items-start gap-3 ${
                    isDone
                      ? 'bg-slate-900/80 border-slate-800/80'
                      : isCurrent
                      ? 'bg-cyan-950/30 border-cyan-800/60 shadow-sm'
                      : 'bg-slate-950/40 border-slate-900 opacity-60'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : isCurrent ? (
                      <div className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-700 bg-slate-900 text-[10px] text-slate-500 flex items-center justify-center font-mono">
                        {stage.id}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-xs font-semibold ${isDone ? 'text-slate-200' : isCurrent ? 'text-cyan-300' : 'text-slate-400'}`}>
                        {stage.name}
                      </h4>
                      <span className="text-[10px] font-mono text-slate-500">
                        {isDone ? 'Done' : isCurrent ? 'Active' : 'Queued'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                      {stage.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quality Analysis & Log Stream (1 col) */}
        <div className="space-y-6">
          {/* Frame Quality Intelligence Card */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Frame Quality Intelligence
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Motion blur and redundant frames are filtered out before 3D fusion.
              </p>
            </div>

            <div className="space-y-2.5">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Sharpness (Laplacian)</span>
                  <span className="font-mono text-cyan-400 font-bold">92%</span>
                </div>
                <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 rounded-full" style={{ width: '92%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Radiometric Exposure</span>
                  <span className="font-mono text-cyan-400 font-bold">88%</span>
                </div>
                <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 rounded-full" style={{ width: '88%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Motion Blur Index</span>
                  <span className="font-mono text-emerald-400 font-bold">7% <span className="text-[10px] font-normal text-slate-500">(Low blur)</span></span>
                </div>
                <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: '7%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">HEVC Compression Fidelity</span>
                  <span className="font-mono text-cyan-400 font-bold">94%</span>
                </div>
                <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 rounded-full" style={{ width: '94%' }} />
                </div>
              </div>
            </div>

            {/* Frame Filmstrip Preview */}
            <div className="pt-2 border-t border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Extracted Keyframe Strip</span>
                <span className="font-mono text-cyan-400">{FRAME_QUALITY_DATA.length} Sample Keys</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {FRAME_QUALITY_DATA.slice(0, 5).map((f) => (
                  <button
                    key={f.frameIndex}
                    onClick={() => setSelectedFrame(f)}
                    className={`p-1 rounded text-center border transition-all ${
                      selectedFrame.frameIndex === f.frameIndex
                        ? 'border-cyan-400 bg-cyan-950/60'
                        : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-mono text-[9px] text-slate-400">#{f.frameIndex}</div>
                    <div className="font-mono text-[10px] font-bold text-cyan-300">{f.sharpness}%</div>
                  </button>
                ))}
              </div>
              <div className="p-2 bg-slate-950 rounded border border-slate-850 text-[10px] text-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>Selected Frame:</span>
                  <span className="font-mono text-slate-200">#{selectedFrame.frameIndex} ({selectedFrame.timestampSec}s)</span>
                </div>
                <div className="flex justify-between">
                  <span>Coverage Contribution:</span>
                  <span className="font-mono text-emerald-400 font-bold">+{selectedFrame.coverageContribution}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Processing Log */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Execution Log
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <div className="h-44 overflow-y-auto space-y-1 font-mono text-[10px] p-2 bg-slate-950 rounded border border-slate-850">
              {logs.map((log) => (
                <div key={log.id} className="flex items-start gap-2">
                  <span className="text-slate-500 shrink-0">{log.timestamp}</span>
                  <span className={log.level === 'success' ? 'text-emerald-400' : 'text-slate-300'}>
                    {log.message}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
