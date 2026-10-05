import React, { useState } from 'react';
import { X, Layers, Cpu, Compass, Eye, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'questions' | 'production'>('pipeline');

  if (!isOpen) return null;

  const judgeQuestions = [
    {
      q: '1. Why Single-Pass instead of multi-pass photogrammetry?',
      a: 'Traditional SfM requires 70–80% lateral flight overlap across serpentine grid passes, demanding significant battery, operational dwell time, and airspace clearance. In emergency disaster response, tactical reconnaissance (NTRO), and rapid highway surveying, an operator often only has one flight pass over the corridor. AeroTwin extracts calibrated 3D twins from this single forward video trajectory by fusing optical flow, monocular depth estimation (DUSt3R/foundation models), and GNSS/IMU trajectory synchronization.',
    },
    {
      q: '2. What minimum data is required for reconstruction?',
      a: 'A single high-definition video track (1080p/4K @ 30–60fps) synchronized with timestamped GNSS/SRT telemetry (latitude, longitude, ellipsoidal/barometric altitude). Optional inputs: IMU attitude quaternions and RTK/PPK base corrections which upgrade baseline georeferencing accuracy from decimeters to centimeters.',
    },
    {
      q: '3. How are keyframes selected from thousands of video frames?',
      a: 'A 3-minute 4K 60fps video produces >10,800 frames, most of which are geometrically redundant or motion-blurred. AeroTwin uses a 2-stage filter: first, a Laplacian variance filter discards blur frames (< threshold); second, an adaptive spatial baseline selector picks frames only when the drone camera traverses a minimum parallax angle (typically 3–5° or >2.5m displacement) ensuring sufficient stereoscopic baseline.',
    },
    {
      q: '4. How is scale established without physical ground control points (GCPs)?',
      a: 'Monocular video suffers from projective scale ambiguity (up-to-scale reconstruction). AeroTwin resolves metric scale by tightly coupling the camera translation vectors with the absolute GNSS displacement between keyframe timestamp deltas, verified by barometric altimeter readings.',
    },
    {
      q: '5. How are occluded surfaces handled under the single-pass constraint?',
      a: 'Crucial Honesty Principle: In a single pass, surfaces facing directly away from the flight path cannot be directly photographed. Rather than hallucinating false detail, AeroTwin explicitly computes a Line-of-Sight Visibility Matrix. Surfaces with multi-angle coverage are flagged as High Confidence (90%+); unobserved surfaces are flagged as Low Confidence / Estimated, preventing hazardous structural misinterpretations.',
    },
    {
      q: '6. How are dynamic objects (moving cars, pedestrians) handled?',
      a: 'Moving objects violate the epipolar static-scene assumption and produce "ghosting" artifacts. AeroTwin uses optical flow inconsistency and semantic mask segmentation to exclude dynamic pixels from the dense point cloud fusion step.',
    },
    {
      q: '7. How does the system measure and report quality?',
      a: 'Confidence is treated as a 4-dimensional vector: Geometry Confidence (re-projection residual error and parallax coverage), Texture Confidence (radiometric consistency across views), GPS Alignment (GNSS covariance residual), and Scene Coverage (total mapped footprint vs visible polygon area).',
    },
    {
      q: '8. How does the architecture scale to GPU/cloud production?',
      a: 'The prototype web frontend connects via gRPC/REST to a FastAPI / PyTorch worker pool running TensorRT-optimized depth models (DUSt3R/Depth-Anything) and Open3D / CUDA Poisson meshing, backed by PostgreSQL/PostGIS and Cesium/3D Tiles streaming for multi-gigabyte spatial digital twins.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
      <div 
        className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <h2 className="text-base font-bold text-white tracking-tight">
                AeroTwin Technical Architecture & Engineering Specifications
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              SIH Problem Statement 26158 · National Technical Research Organisation (NTRO)
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-800 bg-slate-950/30 px-6 gap-2 pt-2">
          {[
            { id: 'pipeline', label: 'Single-Pass Pipeline' },
            { id: 'questions', label: 'NTRO Judge Questions (11 Topics)' },
            { id: 'production', label: 'Production vs. Prototype' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-cyan-400 text-cyan-400 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          {activeTab === 'pipeline' && (
            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-xs font-semibold text-slate-200 mb-2 uppercase tracking-wider">
                  The End-to-End Single-Pass Mathematical Flow
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-[11px]">
                  <div className="p-3 bg-slate-900 rounded border border-slate-800 space-y-1">
                    <div className="text-cyan-400 font-mono font-semibold">01. INGESTION</div>
                    <div className="text-slate-300 font-medium">Single 4K Video + SRT</div>
                    <div className="text-slate-500">Laplacian blur filter, timecode alignment with GNSS 10Hz log.</div>
                  </div>
                  <div className="p-3 bg-slate-900 rounded border border-slate-800 space-y-1">
                    <div className="text-cyan-400 font-mono font-semibold">02. KEYFRAMES</div>
                    <div className="text-slate-300 font-medium">Adaptive Parallax Filter</div>
                    <div className="text-slate-500">Extracts 74 keyframes with 3-5° baseline separation.</div>
                  </div>
                  <div className="p-3 bg-slate-900 rounded border border-slate-800 space-y-1">
                    <div className="text-cyan-400 font-mono font-semibold">03. 3D RECON</div>
                    <div className="text-slate-300 font-medium">DUSt3R + Poisson Mesh</div>
                    <div className="text-slate-500">Dense pairwise point cloud fusion with metric scale recovery.</div>
                  </div>
                  <div className="p-3 bg-slate-900 rounded border border-slate-800 space-y-1">
                    <div className="text-cyan-400 font-mono font-semibold">04. GEO-TWIN</div>
                    <div className="text-slate-300 font-medium">Confidence Map & EPSG</div>
                    <div className="text-slate-500">Georeferencing to UTM 44N with explicit visibility heatmaps.</div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-cyan-950/20 border border-cyan-900/40">
                <h4 className="font-semibold text-cyan-300 text-xs mb-1">
                  Core Innovation: Confidence-Aware Occlusion Modeling
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  Unlike traditional software that blindly interpolates unobserved surfaces, AeroTwin computes a
                  <strong> Line-of-Sight Visibility Matrix</strong> for every triangular facet. When the user measures
                  or inspects an asset, the system explicitly warns if a measurement spans an occluded back face
                  (low confidence) versus a well-observed front face (high confidence).
                </p>
              </div>
            </div>
          )}

          {activeTab === 'questions' && (
            <div className="space-y-4">
              {judgeQuestions.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1.5">
                  <h4 className="text-xs font-semibold text-cyan-300">{item.q}</h4>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'production' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Current SIH Prototype Architecture</span>
                  </div>
                  <ul className="space-y-1.5 text-[11px] text-slate-300 list-disc list-inside">
                    <li>Fully interactive Three.js 3D WebGL Spatial Viewer with OrbitControls</li>
                    <li>Interactive 3D laser measurement engine (Point-to-point, height, footprint)</li>
                    <li>Dynamic confidence heatmap shader & single-pass occlusion shadow cones</li>
                    <li>Telemetry playback and drone flight trajectory visualization</li>
                    <li>End-to-end simulated processing workflow with honest demo metrics</li>
                    <li>Spatial analytics dashboard & mission report generator (PDF/GeoJSON)</li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg bg-slate-950 border border-cyan-900/50 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider">
                    <Cpu className="w-4 h-4" />
                    <span>Production GPU Engine Roadmap</span>
                  </div>
                  <ul className="space-y-1.5 text-[11px] text-slate-300 list-disc list-inside">
                    <li>FastAPI backend orchestrating distributed PyTorch GPU worker nodes</li>
                    <li>Foundation 3D vision models (DUSt3R / VGGSfM) for uncalibrated depth</li>
                    <li>CUDA-accelerated Screened Poisson Surface Reconstruction (Open3D)</li>
                    <li>PostgreSQL / PostGIS for multi-terabyte georeferenced spatial point clouds</li>
                    <li>3D Tiles / OGC streaming for kilometer-scale city digital twins</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-[11px] text-slate-400">
          <span>AeroTwin · Designed for NTRO SIH 26158</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-medium transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
