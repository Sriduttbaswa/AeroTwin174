import React from 'react';
import { 
  Sparkles, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Eye, 
  Box, 
  Ruler, 
  ShieldCheck, 
  FileText,
  Play
} from 'lucide-react';

interface JudgeModeGuideProps {
  isOpen: boolean;
  onClose: () => void;
  currentStep: number;
  onSetStep: (step: number) => void;
  onExecuteStepAction: (actionKey: string) => void;
}

export const JUDGE_STEPS = [
  {
    index: 0,
    title: '1. Ingest Single-Pass Drone Video',
    narrative: 'Traditional SfM requires hours of criss-cross grid flights. AeroTwin starts with a SINGLE drone pass along the coastal corridor.',
    actionLabel: 'View Mission AT-024',
    actionKey: 'view_mission',
    targetView: 'missions',
  },
  {
    index: 1,
    title: '2. Synchronize Telemetry & Keyframes',
    narrative: 'AeroTwin filters out motion blur, extracts 74 spatial keyframes, and locks GNSS trajectory with visual odometry.',
    actionLabel: 'Inspect Pipeline Stages',
    actionKey: 'view_reconstruction',
    targetView: 'reconstruction',
  },
  {
    index: 2,
    title: '3. Launch 3D Digital Twin',
    narrative: 'A fully georeferenced, textured 3D digital twin generated from one flight pass. Orbit, pan, and inspect the complex.',
    actionLabel: 'Open 3D Viewer',
    actionKey: 'open_twin',
    targetView: 'digital-twin',
  },
  {
    index: 3,
    title: '4. Select & Inspect Spatial Assets',
    narrative: 'Click Building 07 (Operations Control Hub). Notice the extracted height (18.6m), area (1,284m²), and precise WGS84 coordinates.',
    actionLabel: 'Select Building 07',
    actionKey: 'select_building_07',
    targetView: 'digital-twin',
  },
  {
    index: 4,
    title: '5. Accurate Laser Measurement',
    narrative: 'Metric scale is established by fusing GNSS displacement with optical depth. Measure distances and clearances directly in 3D.',
    actionLabel: 'Apply Demo Measurement',
    actionKey: 'apply_measurement',
    targetView: 'digital-twin',
  },
  {
    index: 5,
    title: '6. Explicit Confidence & Occlusion',
    narrative: 'Single-pass cannot see everything. We color-code geometry: Green for observed surfaces, Red/Amber for single-pass occluded back faces.',
    actionLabel: 'Toggle Confidence Heatmap',
    actionKey: 'toggle_confidence',
    targetView: 'digital-twin',
  },
  {
    index: 6,
    title: '7. Drone Trajectory Proof',
    narrative: 'Enable the flight path line and camera frustums to visually prove that the entire model was created from one single trajectory.',
    actionLabel: 'Show Flight Path',
    actionKey: 'show_flight_path',
    targetView: 'digital-twin',
  },
  {
    index: 7,
    title: '8. Spatial Analysis & Report Export',
    narrative: 'Export the complete NTRO intelligence dossier with verified dimensions, coverage statistics, and uncertainty disclosures.',
    actionLabel: 'View Intelligence Report',
    actionKey: 'view_report',
    targetView: 'reports',
  },
];

export const JudgeModeGuide: React.FC<JudgeModeGuideProps> = ({
  isOpen,
  onClose,
  currentStep,
  onSetStep,
  onExecuteStepAction,
}) => {
  if (!isOpen) return null;

  const step = JUDGE_STEPS[currentStep] || JUDGE_STEPS[0];

  const handleNext = () => {
    if (currentStep < JUDGE_STEPS.length - 1) {
      const nextIndex = currentStep + 1;
      onSetStep(nextIndex);
      onExecuteStepAction(JUDGE_STEPS[nextIndex].actionKey);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      const prevIndex = currentStep - 1;
      onSetStep(prevIndex);
      onExecuteStepAction(JUDGE_STEPS[prevIndex].actionKey);
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-2xl bg-slate-900/95 border border-cyan-500/40 rounded-xl shadow-2xl backdrop-blur-md overflow-hidden select-none animate-in fade-in slide-in-from-bottom-4">
      {/* Top Header */}
      <div className="px-4 py-2.5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            SIH Judge Pitch Mode · Step {currentStep + 1} of {JUDGE_STEPS.length}
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
          title="Exit pitch mode"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content Area */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>{step.title}</span>
          </h3>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            "{step.narrative}"
          </p>
        </div>

        {/* Stepper Progress bar */}
        <div className="grid grid-cols-8 gap-1 pt-1">
          {JUDGE_STEPS.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                onSetStep(idx);
                onExecuteStepAction(s.actionKey);
              }}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentStep
                  ? 'bg-amber-400'
                  : idx < currentStep
                  ? 'bg-cyan-500'
                  : 'bg-slate-800 hover:bg-slate-700'
              }`}
              title={s.title}
            />
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="p-1.5 rounded text-xs text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onExecuteStepAction(step.actionKey)}
              className="px-3 py-1.5 rounded text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{step.actionLabel}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {currentStep < JUDGE_STEPS.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-3 py-1.5 rounded text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1 shadow-sm transition-all"
              >
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-3 py-1.5 rounded text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1 shadow-sm transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Pitch Complete</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
