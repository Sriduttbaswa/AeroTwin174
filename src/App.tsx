import React, { useState } from 'react';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { CommandPalette } from './components/common/CommandPalette';
import { ArchitectureModal } from './components/common/ArchitectureModal';
import { JudgeModeGuide, JUDGE_STEPS } from './components/common/JudgeModeGuide';
import { DashboardView } from './components/dashboard/DashboardView';
import { MissionsView } from './components/missions/MissionsView';
import { NewMissionModal } from './components/missions/NewMissionModal';
import { ReconstructionWorkspace } from './components/reconstruction/ReconstructionWorkspace';
import { DigitalTwinViewer } from './components/twin/DigitalTwinViewer';
import { AnalysisView } from './components/analysis/AnalysisView';
import { ReportsView } from './components/reports/ReportsView';
import { DataAssetsView } from './components/data/DataAssetsView';

import { 
  DEMO_MISSION, 
  INITIAL_MISSIONS, 
  DIGITAL_TWINS, 
  SPATIAL_OBJECTS 
} from './data/mockData';
import { Mission, SpatialObject, DigitalTwin } from './types';

export function App() {
  const [activeView, setActiveView] = useState<string>('overview');
  const [missions, setMissions] = useState<Mission[]>(INITIAL_MISSIONS);
  const [currentMission, setCurrentMission] = useState<Mission>(DEMO_MISSION);
  const [twins, setTwins] = useState<DigitalTwin[]>(DIGITAL_TWINS);
  const [selectedSpatialObject, setSelectedSpatialObject] = useState<SpatialObject | null>(SPATIAL_OBJECTS[0]);

  // Modals & Panels
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState<boolean>(false);
  const [isNewMissionOpen, setIsNewMissionOpen] = useState<boolean>(false);
  const [isJudgeMode, setIsJudgeMode] = useState<boolean>(false);
  const [judgeStep, setJudgeStep] = useState<number>(0);

  // Fast-start Demo Mission
  const handleLaunchDemo = () => {
    setCurrentMission(DEMO_MISSION);
    setSelectedSpatialObject(SPATIAL_OBJECTS[0]);
    setActiveView('digital-twin');
  };

  // Add new mission from creation modal
  const handleCreateMission = (newMission: Mission) => {
    setMissions((prev) => [newMission, ...prev]);
    setCurrentMission(newMission);
    setActiveView('reconstruction');
  };

  // Execute step action from Judge Pitch Guide
  const handleExecuteJudgeAction = (actionKey: string) => {
    switch (actionKey) {
      case 'view_mission':
        setCurrentMission(DEMO_MISSION);
        setActiveView('missions');
        break;
      case 'view_reconstruction':
        setCurrentMission(DEMO_MISSION);
        setActiveView('reconstruction');
        break;
      case 'open_twin':
        setCurrentMission(DEMO_MISSION);
        setActiveView('digital-twin');
        break;
      case 'select_building_07':
        setCurrentMission(DEMO_MISSION);
        setSelectedSpatialObject(SPATIAL_OBJECTS[0]);
        setActiveView('digital-twin');
        break;
      case 'apply_measurement':
        setActiveView('digital-twin');
        break;
      case 'toggle_confidence':
        setActiveView('digital-twin');
        break;
      case 'show_flight_path':
        setActiveView('digital-twin');
        break;
      case 'view_report':
        setCurrentMission(DEMO_MISSION);
        setActiveView('reports');
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar Contract (3 Zones) */}
      <Header
        currentMission={currentMission}
        activeView={activeView}
        onNavigate={setActiveView}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        onOpenJudgeMode={() => setIsJudgeMode(!isJudgeMode)}
        isJudgeMode={isJudgeMode}
      />

      {/* Main Workspace Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          activeView={activeView}
          onNavigate={setActiveView}
          onLaunchDemo={handleLaunchDemo}
          currentMission={currentMission}
          isProcessing={currentMission.status === 'Processing'}
        />

        {/* Viewport Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-950">
          {activeView === 'overview' && (
            <DashboardView
              missions={missions}
              twins={twins}
              onSelectMission={(m) => {
                setCurrentMission(m);
                if (m.status === 'Ready') setActiveView('digital-twin');
                else setActiveView('reconstruction');
              }}
              onNavigate={setActiveView}
              onLaunchDemo={handleLaunchDemo}
            />
          )}

          {activeView === 'missions' && (
            <MissionsView
              missions={missions}
              onSelectMission={(m) => {
                setCurrentMission(m);
                if (m.status === 'Ready') setActiveView('digital-twin');
                else setActiveView('reconstruction');
              }}
              onOpenCreateMission={() => setIsNewMissionOpen(true)}
              onNavigate={setActiveView}
            />
          )}

          {activeView === 'reconstruction' && (
            <ReconstructionWorkspace
              mission={currentMission}
              onNavigate={setActiveView}
            />
          )}

          {activeView === 'digital-twin' && (
            <DigitalTwinViewer
              selectedObjectFromParent={selectedSpatialObject}
              onSelectObjectFromParent={setSelectedSpatialObject}
            />
          )}

          {activeView === 'analysis' && (
            <AnalysisView
              mission={currentMission}
              onNavigate={setActiveView}
              onSelectObject={(obj) => {
                setSelectedSpatialObject(obj);
                setActiveView('digital-twin');
              }}
            />
          )}

          {activeView === 'reports' && (
            <ReportsView
              mission={currentMission}
              onNavigate={setActiveView}
            />
          )}

          {activeView === 'data' && (
            <DataAssetsView
              mission={currentMission}
              onNavigate={setActiveView}
            />
          )}
        </main>
      </div>

      {/* Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        missions={missions}
        objects={SPATIAL_OBJECTS}
        onSelectMission={(m) => {
          setCurrentMission(m);
          setActiveView(m.status === 'Ready' ? 'digital-twin' : 'reconstruction');
        }}
        onSelectObject={(obj) => {
          setSelectedSpatialObject(obj);
          setActiveView('digital-twin');
        }}
        onNavigate={setActiveView}
      />

      {/* Architecture & Evaluation Guide Modal */}
      <ArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />

      {/* Create New Mission Wizard Modal */}
      <NewMissionModal
        isOpen={isNewMissionOpen}
        onClose={() => setIsNewMissionOpen(false)}
        onCreateMission={handleCreateMission}
      />

      {/* Guided 90-Second Judge Pitch Mode Bar */}
      <JudgeModeGuide
        isOpen={isJudgeMode}
        onClose={() => setIsJudgeMode(false)}
        currentStep={judgeStep}
        onSetStep={setJudgeStep}
        onExecuteStepAction={handleExecuteJudgeAction}
      />
    </div>
  );
}
export default App;
