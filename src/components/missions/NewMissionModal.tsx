import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  Film, 
  Compass, 
  Sliders, 
  Check, 
  ArrowRight, 
  ChevronLeft, 
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { Mission } from '../../types';

interface NewMissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateMission: (newMission: Mission) => void;
}

export const NewMissionModal: React.FC<NewMissionModalProps> = ({
  isOpen,
  onClose,
  onCreateMission,
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Details
  const [missionId, setMissionId] = useState('AT-026');
  const [missionName, setMissionName] = useState('Border Outpost Coastal Radar Recon');
  const [location, setLocation] = useState('Machilipatnam Sector, Andhra Pradesh');
  const [operator, setOperator] = useState('Capt. S. Varma / NTRO Squadron 2');
  const [project, setProject] = useState('SIH Strategic Corridor Rapid Twin');

  // Step 2: Video
  const [selectedVideoName, setSelectedVideoName] = useState('COASTAL_RADAR_SORTIE_4K.MP4');
  const [videoFps, setVideoFps] = useState('59.94');
  const [videoRes, setVideoRes] = useState('3840 x 2160 (4K UHD)');
  const [estimatedFrames, setEstimatedFrames] = useState(2140);

  // Step 3: Telemetry
  const [telemetryType, setTelemetryType] = useState<'GPS_SRT' | 'MAVLINK_LOG' | 'RTK_PPK'>('GPS_SRT');
  const [flightDistanceKm, setFlightDistanceKm] = useState('1.65');
  const [altitudeM, setAltitudeM] = useState('85.0');
  const [hasImu, setHasImu] = useState(true);

  // Step 4: Reconstruction settings
  const [preset, setPreset] = useState<'standard' | 'high_fidelity' | 'rapid_recon'>('high_fidelity');
  const [keyframeDensity, setKeyframeDensity] = useState<'sparse' | 'balanced' | 'dense'>('balanced');
  const [georeferencingMode, setGeoreferencingMode] = useState<'gnss_fusion' | 'visual_odometry' | 'rtk_strict'>('gnss_fusion');
  const [confidenceThreshold, setConfidenceThreshold] = useState(70);
  const [enableDynamicFilter, setEnableDynamicFilter] = useState(true);

  if (!isOpen) return null;

  const handleCreate = () => {
    const newMission: Mission = {
      id: missionId,
      name: missionName,
      location,
      coordinates: {
        lat: 16.1875,
        lon: 81.1389,
        altM: parseFloat(altitudeM),
      },
      captureDate: '2026-10-01 · 11:30 IST',
      operator,
      project,
      status: 'Processing',
      flightDistanceKm: parseFloat(flightDistanceKm),
      altitudeM: parseFloat(altitudeM),
      totalFrames: estimatedFrames,
      usableFrames: Math.round(estimatedFrames * 0.16),
      keyframes: 68,
      coveragePercent: 84,
      geometryConfidence: 89,
      textureConfidence: 82,
      gpsAlignment: 92,
      overallConfidence: 85,
      mappedAreaKm2: 1.45,
      videoMetadata: {
        filename: selectedVideoName,
        fileSizeMb: 1180,
        resolution: videoRes,
        fps: parseFloat(videoFps),
        durationSeconds: 155,
        codec: 'HEVC / H.265',
        totalFrames: estimatedFrames,
        bitrateMbps: 62.0,
      },
      flightMetadata: {
        sourceType: telemetryType,
        flightDistanceKm: parseFloat(flightDistanceKm),
        averageAltitudeM: parseFloat(altitudeM),
        maxSpeedMps: 11.5,
        headingDeg: 78.0,
        gpsLock: '3D_FIX',
        horizontalAccuracyM: 0.9,
        verticalAccuracyM: 1.3,
        datum: 'WGS 84 / UTM Zone 44N',
        hasImu,
      },
      reconstructionConfig: {
        preset,
        keyframeDensity,
        georeferencingMode,
        confidenceThresholdPercent: confidenceThreshold,
        enableDynamicObjectFiltering: enableDynamicFilter,
        poissonMeshDepth: 10,
      },
      twinId: `TWIN-${missionId}-V1`,
    };

    onCreateMission(newMission);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Create Single-Pass Mission</h2>
            <p className="text-xs text-slate-400">Step {currentStep} of 5 · Ingestion & Reconstruction Setup</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Indicators */}
        <div className="grid grid-cols-5 border-b border-slate-800 bg-slate-950/30 text-center text-[10px] font-semibold">
          {[
            { num: 1, label: 'Details' },
            { num: 2, label: 'Drone Video' },
            { num: 3, label: 'Telemetry' },
            { num: 4, label: 'Config' },
            { num: 5, label: 'Review' },
          ].map((s) => (
            <div
              key={s.num}
              className={`py-2 border-b-2 transition-colors ${
                currentStep === s.num
                  ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
                  : currentStep > s.num
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-500'
              }`}
            >
              <span>{s.num}. {s.label}</span>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-200">
          {/* STEP 1: Details */}
          {currentStep === 1 && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Mission ID</label>
                  <input
                    type="text"
                    value={missionId}
                    onChange={(e) => setMissionId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded font-mono text-cyan-400 text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Project / Operation</label>
                  <input
                    type="text"
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Mission Name</label>
                <input
                  type="text"
                  value={missionName}
                  onChange={(e) => setMissionName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Geographic Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Flight Operator & Squadron</label>
                <input
                  type="text"
                  value={operator}
                  onChange={(e) => setOperator(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Drone Video Ingestion */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-700 hover:border-cyan-500/60 rounded-xl p-6 text-center space-y-3 bg-slate-950/40 transition-colors">
                <Upload className="w-8 h-8 text-cyan-400 mx-auto" />
                <div>
                  <p className="font-semibold text-white">Drag & drop raw drone video pass</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Supports MP4, MOV, MKV (HEVC / H.265 or H.264 up to 4K 60fps)</p>
                </div>
                <div className="pt-2">
                  <span className="text-[11px] bg-slate-800 text-cyan-300 font-mono px-3 py-1 rounded-full border border-slate-700">
                    Active: {selectedVideoName}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px]">
                <div>
                  <span className="text-slate-500">Resolution:</span>
                  <span className="ml-2 font-mono text-slate-200">{videoRes}</span>
                </div>
                <div>
                  <span className="text-slate-500">Framerate:</span>
                  <span className="ml-2 font-mono text-slate-200">{videoFps} FPS</span>
                </div>
                <div>
                  <span className="text-slate-500">Estimated Frames:</span>
                  <span className="ml-2 font-mono text-cyan-400">{estimatedFrames.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-500">Codec:</span>
                  <span className="ml-2 font-mono text-slate-200">HEVC Main 10</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Flight Telemetry Data */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1.5">
                  Telemetry Synchronization Format
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'GPS_SRT', title: 'Embedded Subtitle (SRT)' },
                    { id: 'MAVLINK_LOG', title: 'MAVLink Binary Log (.bin)' },
                    { id: 'RTK_PPK', title: 'RTK/PPK Base Station CSV' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTelemetryType(t.id as any)}
                      className={`p-2.5 rounded text-left border transition-all ${
                        telemetryType === t.id
                          ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-semibold text-[11px]">{t.title}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Estimated Flight Distance (km)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={flightDistanceKm}
                    onChange={(e) => setFlightDistanceKm(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded font-mono text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Average Flight Altitude (m MSL)</label>
                  <input
                    type="number"
                    value={altitudeM}
                    onChange={(e) => setAltitudeM(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded font-mono text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="imu"
                  checked={hasImu}
                  onChange={(e) => setHasImu(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-0"
                />
                <label htmlFor="imu" className="text-xs text-slate-300">
                  Include 3-axis IMU pitch/roll/yaw attitude logs for tight visual odometry fusion
                </label>
              </div>
            </div>
          )}

          {/* STEP 4: Configuration */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1.5">Reconstruction Quality</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'rapid_recon', label: 'Rapid Recon', sub: 'Low latency, 50 keyframes' },
                    { id: 'standard', label: 'Standard Balance', sub: '65 keyframes, balanced mesh' },
                    { id: 'high_fidelity', label: 'High Fidelity', sub: '74 keyframes, Poisson lvl 10' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPreset(p.id as any)}
                      className={`p-2.5 rounded text-left border transition-all ${
                        preset === p.id
                          ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-semibold text-xs text-slate-200">{p.label}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{p.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Confidence Cutoff Threshold:</span>
                  <span className="font-mono text-cyan-400 font-bold">{confidenceThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="90"
                  value={confidenceThreshold}
                  onChange={(e) => setConfidenceThreshold(parseInt(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <p className="text-[11px] text-slate-500">
                  Surfaces with multi-view confidence below {confidenceThreshold}% will be flagged as Estimated/Occluded.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="dyn"
                  checked={enableDynamicFilter}
                  onChange={(e) => setEnableDynamicFilter(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-0"
                />
                <label htmlFor="dyn" className="text-xs text-slate-300">
                  Enable dynamic object filtering (vehicles, temporary equipment) to prevent ghosting
                </label>
              </div>
            </div>
          )}

          {/* STEP 5: Review */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="font-bold text-white text-xs">Ready for Single-Pass Reconstruction</span>
                  <span className="font-mono text-cyan-400 text-xs">{missionId}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500">Target Area:</span>
                    <div className="font-medium text-slate-200">{missionName}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Video Ingestion:</span>
                    <div className="font-mono text-slate-200">{selectedVideoName} (4K 60fps)</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Flight Distance:</span>
                    <div className="font-mono text-slate-200">{flightDistanceKm} km @ {altitudeM}m MSL</div>
                  </div>
                  <div>
                    <span className="text-slate-500">GNSS Fusion:</span>
                    <div className="font-medium text-emerald-400">{telemetryType} + Visual Odometry</div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-cyan-950/20 border border-cyan-800/40 rounded-lg text-[11px] text-cyan-200 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  The single-pass reconstruction will compute metric scale, extract ~68 keyframes, and output a 3D digital twin with explicit visibility confidence.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-3 py-1.5 rounded text-xs text-slate-400 hover:text-white hover:bg-slate-800 flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 5 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="px-4 py-2 rounded text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-1.5 shadow-sm transition-all"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleCreate}
              className="px-5 py-2 rounded text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <FileCheck className="w-4 h-4" />
              <span>Start Reconstruction</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
