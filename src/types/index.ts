export type MissionStatus = 
  | 'Draft' 
  | 'Uploaded' 
  | 'Queued' 
  | 'Processing' 
  | 'Review' 
  | 'Ready' 
  | 'Failed' 
  | 'Archived';

export interface VideoMetadata {
  filename: string;
  fileSizeMb: number;
  resolution: string;
  fps: number;
  durationSeconds: number;
  codec: string;
  totalFrames: number;
  bitrateMbps: number;
  sampleVideoUrl?: string;
}

export interface FlightMetadata {
  sourceType: 'GPS_SRT' | 'MAVLINK_LOG' | 'RTK_PPK' | 'VISUAL_INERTIAL';
  flightDistanceKm: number;
  averageAltitudeM: number;
  maxSpeedMps: number;
  headingDeg: number;
  gpsLock: '3D_FIX' | 'RTK_FIXED' | 'DGPS';
  horizontalAccuracyM: number;
  verticalAccuracyM: number;
  datum: string;
  hasImu: boolean;
}

export interface ReconstructionConfig {
  preset: 'standard' | 'high_fidelity' | 'rapid_recon';
  keyframeDensity: 'sparse' | 'balanced' | 'dense';
  georeferencingMode: 'gnss_fusion' | 'visual_odometry' | 'rtk_strict';
  confidenceThresholdPercent: number;
  enableDynamicObjectFiltering: boolean;
  poissonMeshDepth: number;
}

export interface Mission {
  id: string;
  name: string;
  location: string;
  coordinates: {
    lat: number;
    lon: number;
    altM: number;
  };
  captureDate: string;
  operator: string;
  project: string;
  status: MissionStatus;
  flightDistanceKm: number;
  altitudeM: number;
  totalFrames: number;
  usableFrames: number;
  keyframes: number;
  coveragePercent: number;
  geometryConfidence: number;
  textureConfidence: number;
  gpsAlignment: number;
  overallConfidence: number;
  mappedAreaKm2: number;
  videoMetadata: VideoMetadata;
  flightMetadata: FlightMetadata;
  reconstructionConfig: ReconstructionConfig;
  twinId?: string;
  isDemo?: boolean;
}

export interface SpatialObject {
  id: string;
  name: string;
  type: 'building' | 'infrastructure' | 'road' | 'vegetation' | 'hazard';
  heightM: number;
  areaM2: number;
  dimensions: {
    lengthM: number;
    widthM: number;
    heightM: number;
  };
  position: {
    x: number;
    y: number;
    z: number;
  };
  lat: number;
  lon: number;
  altM: number;
  geometryConfidence: number;
  surfaceCoveragePercent: number;
  singlePassObservations: number;
  detectionStatus: 'Verified' | 'Estimated' | 'Low_Coverage';
  description: string;
}

export interface FlightWaypoint {
  seq: number;
  x: number;
  y: number;
  z: number;
  lat: number;
  lon: number;
  altM: number;
  speedMps: number;
  headingDeg: number;
  timestamp: string;
  isKeyframe: boolean;
}

export interface Measurement {
  id: string;
  label: string;
  type: 'distance' | 'height' | 'area';
  p1: { x: number; y: number; z: number };
  p2: { x: number; y: number; z: number };
  distanceM: number;
  heightDeltaM: number;
  createdAt: string;
}

export interface FrameQualityMetric {
  frameIndex: number;
  timestampSec: number;
  sharpness: number;
  exposure: number;
  motionBlur: number;
  compression: number;
  isKeyframe: boolean;
  coverageContribution: number;
}

export interface ProcessingStage {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  durationMs?: number;
}

export interface TechnicalLog {
  id: string;
  timestamp: string;
  level: 'info' | 'success' | 'warn' | 'debug';
  message: string;
}

export interface DigitalTwin {
  id: string;
  missionId: string;
  version: string;
  name: string;
  location: string;
  createdAt: string;
  coverageAreaM2: number;
  overallConfidence: number;
  pointCount: number;
  polyCount: number;
  objectsCount: number;
  georeferencedDatum: string;
  thumbnailUrl: string;
  status: 'Ready' | 'Optimizing' | 'Archived';
}
