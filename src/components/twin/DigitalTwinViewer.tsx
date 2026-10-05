import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { 
  Compass, 
  Layers, 
  Ruler, 
  Crosshair, 
  RotateCcw, 
  Maximize2, 
  Eye, 
  ShieldCheck, 
  Activity, 
  ChevronDown,
  Navigation,
  Box as BoxIcon
} from 'lucide-react';
import { SpatialObject, FlightWaypoint, Measurement } from '../../types';
import { SPATIAL_OBJECTS, FLIGHT_WAYPOINTS } from '../../data/mockData';
import { ObjectInspectionPanel } from './ObjectInspectionPanel';
import { MeasurementPanel } from './MeasurementPanel';
import { ConfidenceLegend } from './ConfidenceLegend';

interface DigitalTwinViewerProps {
  onSelectObjectFromParent?: (obj: SpatialObject | null) => void;
  selectedObjectFromParent?: SpatialObject | null;
}

export const DigitalTwinViewer: React.FC<DigitalTwinViewerProps> = ({
  onSelectObjectFromParent,
  selectedObjectFromParent,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // UI States
  const [selectedObject, setSelectedObject] = useState<SpatialObject | null>(SPATIAL_OBJECTS[0]);
  const [isMeasuring, setIsMeasuring] = useState<boolean>(false);
  const [measurements, setMeasurements] = useState<Measurement[]>([
    {
      id: 'm-1',
      label: 'Building 07 → Road Clearance',
      type: 'distance',
      p1: { x: -8, y: 0.3, z: 5 },
      p2: { x: 0, y: 0.3, z: 0 },
      distanceM: 24.6,
      heightDeltaM: 0.0,
      createdAt: '10:44',
    },
  ]);
  const [measurementPoints, setMeasurementPoints] = useState<THREE.Vector3[]>([]);

  // Toggles
  const [showFlightPath, setShowFlightPath] = useState<boolean>(true);
  const [confidenceMode, setConfidenceMode] = useState<boolean>(false);
  const [occlusionMode, setOcclusionMode] = useState<boolean>(false);
  const [pointCloudMode, setPointCloudMode] = useState<boolean>(false);
  const [wireframeMode, setWireframeMode] = useState<boolean>(false);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showLayersDropdown, setShowLayersDropdown] = useState<boolean>(false);
  const [activeLayers, setActiveLayers] = useState({
    terrain: true,
    buildings: true,
    infrastructure: true,
    roads: true,
  });

  // Coordinates HUD
  const [cursorCoords, setCursorCoords] = useState<{
    lat: number;
    lon: number;
    alt: number;
    x: number;
    z: number;
  }>({
    lat: 17.6868,
    lon: 83.2185,
    alt: 82.0,
    x: 0,
    z: 0,
  });

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const objectMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const boundingBoxRef = useRef<THREE.BoxHelper | null>(null);
  const flightPathGroupRef = useRef<THREE.Group | null>(null);
  const occlusionGroupRef = useRef<THREE.Group | null>(null);
  const measurementGroupRef = useRef<THREE.Group | null>(null);
  const droneGroupRef = useRef<THREE.Group | null>(null);
  const terrainMeshRef = useRef<THREE.Mesh | null>(null);
  const gridHelperRef = useRef<THREE.GridHelper | null>(null);
  const pointCloudRef = useRef<THREE.Points | null>(null);

  // Sync external selection
  useEffect(() => {
    if (selectedObjectFromParent !== undefined) {
      setSelectedObject(selectedObjectFromParent);
    }
  }, [selectedObjectFromParent]);

  // Main Three.js Scene Setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x090d16);
    scene.fog = new THREE.FogExp2(0x090d16, 0.0035);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 2000);
    camera.position.set(-65, 55, 95);
    camera.lookAt(0, 5, 0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0x94a3b8, 0.85);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffbeb, 1.8);
    sunLight.position.set(-60, 100, -50);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 300;
    const d = 120;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.4);
    fillLight.position.set(80, 40, 80);
    scene.add(fillLight);

    // 5. Grid Helper
    const grid = new THREE.GridHelper(260, 52, 0x0284c7, 0x1e293b);
    grid.position.y = 0.02;
    scene.add(grid);
    gridHelperRef.current = grid;

    // 6. Terrain Base Surface
    const terrainGeo = new THREE.PlaneGeometry(260, 260, 64, 64);
    // Add subtle elevation variance
    const posAttr = terrainGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const vx = posAttr.getX(i);
      const vy = posAttr.getY(i);
      const elevation = Math.sin(vx * 0.04) * Math.cos(vy * 0.04) * 0.6;
      posAttr.setZ(i, elevation);
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x131a26,
      roughness: 0.88,
      metalness: 0.1,
      flatShading: true,
    });
    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.rotation.x = -Math.PI / 2;
    terrainMesh.receiveShadow = true;
    scene.add(terrainMesh);
    terrainMeshRef.current = terrainMesh;

    // 7. Roads / Causeways
    const roadGroup = new THREE.Group();
    const mainRoadGeo = new THREE.PlaneGeometry(280, 14);
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.75,
      metalness: 0.05,
    });
    const mainRoad = new THREE.Mesh(mainRoadGeo, roadMat);
    mainRoad.rotation.x = -Math.PI / 2;
    mainRoad.position.set(0, 0.08, 0);
    mainRoad.receiveShadow = true;
    roadGroup.add(mainRoad);

    // Cross road
    const crossRoadGeo = new THREE.PlaneGeometry(10, 180);
    const crossRoad = new THREE.Mesh(crossRoadGeo, roadMat);
    crossRoad.rotation.x = -Math.PI / 2;
    crossRoad.position.set(12, 0.09, 10);
    crossRoad.receiveShadow = true;
    roadGroup.add(crossRoad);
    scene.add(roadGroup);

    // 8. Reconstruct Spatial Buildings & Infrastructure
    const objectMeshes = new Map<string, THREE.Mesh>();

    SPATIAL_OBJECTS.forEach((obj) => {
      let geo: THREE.BufferGeometry;

      if (obj.type === 'building' && obj.id === 'OBJ-002') {
        // Hangar - curved arched roof
        geo = new THREE.CylinderGeometry(
          obj.dimensions.widthM / 2,
          obj.dimensions.widthM / 2,
          obj.dimensions.lengthM,
          32,
          1,
          false,
          0,
          Math.PI
        );
        geo.rotateZ(Math.PI / 2);
        geo.rotateY(Math.PI / 2);
      } else if (obj.id === 'OBJ-005') {
        // Silo cluster
        geo = new THREE.CylinderGeometry(12, 12, obj.heightM, 32);
      } else if (obj.id === 'OBJ-004') {
        // Lattice mast
        geo = new THREE.CylinderGeometry(1.5, 4.0, obj.heightM, 4);
      } else if (obj.id === 'OBJ-007') {
        // Radar dome
        geo = new THREE.SphereGeometry(obj.dimensions.widthM / 2, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.75);
      } else {
        // Standard Building / Transformer Box
        geo = new THREE.BoxGeometry(obj.dimensions.lengthM, obj.heightM, obj.dimensions.widthM);
      }

      const mat = new THREE.MeshStandardMaterial({
        color: obj.type === 'infrastructure' ? 0x475569 : 0x334155,
        roughness: 0.4,
        metalness: 0.25,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(obj.position.x, obj.position.y, obj.position.z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = { spatialObject: obj };

      // Add architectural rooftop details for Building 07
      if (obj.id === 'OBJ-001') {
        const roofHVAC = new THREE.Mesh(
          new THREE.BoxGeometry(10, 3, 8),
          new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.3 })
        );
        roofHVAC.position.set(0, obj.heightM / 2 + 1.5, 0);
        mesh.add(roofHVAC);
      }

      scene.add(mesh);
      objectMeshes.set(obj.id, mesh);
    });
    objectMeshesRef.current = objectMeshes;

    // 9. Point Cloud Simulation
    const pointCount = 18000;
    const pointPositions = new Float32Array(pointCount * 3);
    const pointColors = new Float32Array(pointCount * 3);

    for (let i = 0; i < pointCount; i++) {
      const px = (Math.random() - 0.5) * 200;
      const pz = (Math.random() - 0.5) * 200;
      const py = Math.random() * 25;

      pointPositions[i * 3] = px;
      pointPositions[i * 3 + 1] = py;
      pointPositions[i * 3 + 2] = pz;

      // Color coding
      pointColors[i * 3] = 0.2 + Math.random() * 0.2;
      pointColors[i * 3 + 1] = 0.7 + Math.random() * 0.3;
      pointColors[i * 3 + 2] = 0.8 + Math.random() * 0.2;
    }

    const pointGeo = new THREE.BufferGeometry();
    pointGeo.setAttribute('position', new THREE.BufferAttribute(pointPositions, 3));
    pointGeo.setAttribute('color', new THREE.BufferAttribute(pointColors, 3));
    const pointMat = new THREE.PointsMaterial({
      size: 1.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });
    const pointCloud = new THREE.Points(pointGeo, pointMat);
    pointCloud.visible = false;
    scene.add(pointCloud);
    pointCloudRef.current = pointCloud;

    // 10. Flight Path Group
    const flightGroup = new THREE.Group();
    const curvePoints = FLIGHT_WAYPOINTS.map((w) => new THREE.Vector3(w.x, w.y, w.z));
    const flightCurve = new THREE.CatmullRomCurve3(curvePoints);
    const tubeGeo = new THREE.TubeGeometry(flightCurve, 64, 0.4, 8, false);
    const tubeMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, wireframe: false });
    const flightTube = new THREE.Mesh(tubeGeo, tubeMat);
    flightGroup.add(flightTube);

    // Waypoint spheres and frustums
    FLIGHT_WAYPOINTS.forEach((wp) => {
      const wpMesh = new THREE.Mesh(
        new THREE.SphereGeometry(wp.isKeyframe ? 1.4 : 0.8, 16, 16),
        new THREE.MeshBasicMaterial({ color: wp.isKeyframe ? 0x38bdf8 : 0x0284c7 })
      );
      wpMesh.position.set(wp.x, wp.y, wp.z);
      flightGroup.add(wpMesh);

      // Frustum cone projecting from drone camera
      if (wp.isKeyframe) {
        const coneGeo = new THREE.ConeGeometry(12, 40, 4, 1, true);
        coneGeo.rotateX(Math.PI);
        const coneMat = new THREE.MeshBasicMaterial({
          color: 0x38bdf8,
          wireframe: true,
          transparent: true,
          opacity: 0.15,
        });
        const cone = new THREE.Mesh(coneGeo, coneMat);
        cone.position.set(wp.x, wp.y - 20, wp.z);
        flightGroup.add(cone);
      }
    });
    scene.add(flightGroup);
    flightPathGroupRef.current = flightGroup;

    // 11. Animated Drone Model
    const droneGroup = new THREE.Group();
    // Central body
    const droneBody = new THREE.Mesh(
      new THREE.BoxGeometry(3, 1, 3),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2, metalness: 0.8 })
    );
    droneGroup.add(droneBody);
    // Camera gimbal
    const gimbal = new THREE.Mesh(
      new THREE.SphereGeometry(0.8, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1 })
    );
    gimbal.position.set(0, -0.7, 0.5);
    droneGroup.add(gimbal);
    // 4 arms and rotor discs
    const rotorDiscs: THREE.Mesh[] = [];
    const armPositions = [
      [2.2, 0.2, 2.2],
      [-2.2, 0.2, 2.2],
      [2.2, 0.2, -2.2],
      [-2.2, 0.2, -2.2],
    ];
    armPositions.forEach(([rx, ry, rz]) => {
      const disc = new THREE.Mesh(
        new THREE.CylinderGeometry(1.8, 1.8, 0.05, 16),
        new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.4 })
      );
      disc.position.set(rx, ry, rz);
      droneGroup.add(disc);
      rotorDiscs.push(disc);
    });
    droneGroup.position.copy(curvePoints[0]);
    scene.add(droneGroup);
    droneGroupRef.current = droneGroup;

    // 12. Occlusion Shadows Group
    const occlusionGroup = new THREE.Group();
    // Create shadow cones behind Building 07 and North Hangar
    const shadowGeo1 = new THREE.BoxGeometry(45, 18, 35);
    shadowGeo1.rotateY(-0.35);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      transparent: true,
      opacity: 0.22,
      wireframe: true,
    });
    const shadowBox1 = new THREE.Mesh(shadowGeo1, shadowMat);
    shadowBox1.position.set(-8, 9, 32);
    occlusionGroup.add(shadowBox1);

    const shadowGeo2 = new THREE.BoxGeometry(70, 22, 45);
    const shadowBox2 = new THREE.Mesh(shadowGeo2, shadowMat);
    shadowBox2.position.set(28, 11, 20);
    occlusionGroup.add(shadowBox2);

    occlusionGroup.visible = false;
    scene.add(occlusionGroup);
    occlusionGroupRef.current = occlusionGroup;

    // 13. Measurement Group
    const measurementGroup = new THREE.Group();
    scene.add(measurementGroup);
    measurementGroupRef.current = measurementGroup;

    // 14. Bounding Box Highlight
    const initialMesh = objectMeshes.get('OBJ-001');
    if (initialMesh) {
      const box = new THREE.BoxHelper(initialMesh, 0x22d3ee);
      scene.add(box);
      boundingBoxRef.current = box;
    }

    // 15. Animation Loop
    let animationFrameId: number;
    let flightProgress = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Animate drone along flight curve
      if (droneGroupRef.current) {
        flightProgress = (flightProgress + 0.0008) % 1;
        const currentPos = flightCurve.getPointAt(flightProgress);
        const tangent = flightCurve.getTangentAt(flightProgress);
        droneGroupRef.current.position.copy(currentPos);
        droneGroupRef.current.lookAt(currentPos.clone().add(tangent));

        // Spin rotors
        rotorDiscs.forEach((d) => (d.rotation.y += 0.35));
      }

      // Update Bounding Box
      if (boundingBoxRef.current) {
        boundingBoxRef.current.update();
      }

      renderer.render(scene, camera);
    };
    animate();

    // 16. Window Resize Listener
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      container.innerHTML = '';
    };
  }, []);

  // Update Confidence Mode Materials
  useEffect(() => {
    objectMeshesRef.current.forEach((mesh, id) => {
      const obj = mesh.userData.spatialObject as SpatialObject;
      if (!obj) return;

      if (confidenceMode) {
        let confColor = 0x10b981; // High (Emerald)
        if (obj.geometryConfidence < 85) confColor = 0xf59e0b; // Amber
        if (obj.geometryConfidence < 75) confColor = 0xf43f5e; // Rose

        mesh.material = new THREE.MeshStandardMaterial({
          color: confColor,
          roughness: 0.35,
          metalness: 0.1,
          wireframe: wireframeMode,
        });
      } else {
        mesh.material = new THREE.MeshStandardMaterial({
          color: obj.type === 'infrastructure' ? 0x475569 : 0x334155,
          roughness: 0.4,
          metalness: 0.25,
          wireframe: wireframeMode,
        });
      }
    });
  }, [confidenceMode, wireframeMode]);

  // Update Flight Path Visibility
  useEffect(() => {
    if (flightPathGroupRef.current) {
      flightPathGroupRef.current.visible = showFlightPath;
    }
  }, [showFlightPath]);

  // Update Occlusion Shadows
  useEffect(() => {
    if (occlusionGroupRef.current) {
      occlusionGroupRef.current.visible = occlusionMode;
    }
  }, [occlusionMode]);

  // Update Point Cloud Visibility
  useEffect(() => {
    if (pointCloudRef.current) {
      pointCloudRef.current.visible = pointCloudMode;
    }
    // Dim surfaces if in point cloud mode
    objectMeshesRef.current.forEach((mesh) => {
      mesh.visible = !pointCloudMode;
    });
  }, [pointCloudMode]);

  // Update Grid
  useEffect(() => {
    if (gridHelperRef.current) {
      gridHelperRef.current.visible = showGrid;
    }
  }, [showGrid]);

  // Render Measurement Visuals
  const renderMeasurementVisuals = useCallback(() => {
    if (!measurementGroupRef.current || !sceneRef.current) return;
    measurementGroupRef.current.clear();

    measurements.forEach((m) => {
      const v1 = new THREE.Vector3(m.p1.x, m.p1.y, m.p1.z);
      const v2 = new THREE.Vector3(m.p2.x, m.p2.y, m.p2.z);

      // Line
      const lineGeo = new THREE.BufferGeometry().setFromPoints([v1, v2]);
      const lineMat = new THREE.LineBasicMaterial({ color: 0x22d3ee, linewidth: 2 });
      const line = new THREE.Line(lineGeo, lineMat);
      measurementGroupRef.current?.add(line);

      // Spheres at endpoints
      const s1 = new THREE.Mesh(
        new THREE.SphereGeometry(0.6, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
      );
      s1.position.copy(v1);
      measurementGroupRef.current?.add(s1);

      const s2 = new THREE.Mesh(
        new THREE.SphereGeometry(0.6, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
      );
      s2.position.copy(v2);
      measurementGroupRef.current?.add(s2);
    });
  }, [measurements]);

  useEffect(() => {
    renderMeasurementVisuals();
  }, [measurements, renderMeasurementVisuals]);

  // Mouse Orbit & Interaction Controls
  useEffect(() => {
    const container = mountRef.current;
    if (!container || !cameraRef.current || !sceneRef.current) return;

    let isDragging = false;
    let isPanning = false;
    let previousMousePosition = { x: 0, y: 0 };
    const camera = cameraRef.current;
    const target = new THREE.Vector3(0, 5, 0);

    const onMouseDown = (e: MouseEvent) => {
      if (e.button === 0) isDragging = true;
      if (e.button === 2 || e.button === 1) isPanning = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      // Update Cursor Real-World Coordinate Telemetry
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
      const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const intersection = new THREE.Vector3();
      raycaster.ray.intersectPlane(groundPlane, intersection);

      if (intersection) {
        setCursorCoords({
          x: Math.round(intersection.x * 10) / 10,
          z: Math.round(intersection.z * 10) / 10,
          lat: 17.6868 + intersection.z * 0.00001,
          lon: 83.2185 + intersection.x * 0.00001,
          alt: 82.0 + Math.abs(intersection.y),
        });
      }

      if (!isDragging && !isPanning) return;

      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      if (isDragging) {
        // Orbit
        const offset = camera.position.clone().sub(target);
        let spherical = new THREE.Spherical().setFromVector3(offset);

        spherical.theta -= deltaX * 0.008;
        spherical.phi -= deltaY * 0.008;
        spherical.phi = Math.max(0.1, Math.min(Math.PI / 2 - 0.05, spherical.phi));

        offset.setFromSpherical(spherical);
        camera.position.copy(target).add(offset);
        camera.lookAt(target);
      } else if (isPanning) {
        // Pan
        const panSpeed = 0.08;
        const forward = new THREE.Vector3();
        camera.getWorldDirection(forward);
        const right = new THREE.Vector3().crossVectors(forward, camera.up).normalize();

        const move = right.clone().multiplyScalar(-deltaX * panSpeed).add(camera.up.clone().multiplyScalar(deltaY * panSpeed));
        camera.position.add(move);
        target.add(move);
      }

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
      isPanning = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY * 0.05;
      const offset = camera.position.clone().sub(target);
      offset.multiplyScalar(1 + zoomFactor * 0.01);
      if (offset.length() > 10 && offset.length() < 300) {
        camera.position.copy(target).add(offset);
      }
    };

    // Object Selection & Measurement Click
    const onClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      // If measuring mode is on
      if (isMeasuring) {
        const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        const intersection = new THREE.Vector3();
        raycaster.ray.intersectPlane(groundPlane, intersection);

        if (intersection) {
          const newPts = [...measurementPoints, intersection];
          if (newPts.length === 2) {
            const dist = newPts[0].distanceTo(newPts[1]);
            const newM: Measurement = {
              id: `m-${Date.now()}`,
              label: `Laser Point A → B`,
              type: 'distance',
              p1: { x: newPts[0].x, y: newPts[0].y, z: newPts[0].z },
              p2: { x: newPts[1].x, y: newPts[1].y, z: newPts[1].z },
              distanceM: dist,
              heightDeltaM: Math.abs(newPts[0].y - newPts[1].y),
              createdAt: '10:45',
            };
            setMeasurements((prev) => [...prev, newM]);
            setMeasurementPoints([]);
            setIsMeasuring(false);
          } else {
            setMeasurementPoints(newPts);
          }
        }
        return;
      }

      // Raycast objects
      const meshes = Array.from(objectMeshesRef.current.values());
      const intersects = raycaster.intersectObjects(meshes, true);

      if (intersects.length > 0) {
        let hitMesh: THREE.Object3D | null = intersects[0].object;
        while (hitMesh && !hitMesh.userData.spatialObject && hitMesh.parent) {
          hitMesh = hitMesh.parent;
        }

        if (hitMesh && hitMesh.userData.spatialObject) {
          const obj = hitMesh.userData.spatialObject as SpatialObject;
          setSelectedObject(obj);
          if (onSelectObjectFromParent) onSelectObjectFromParent(obj);

          // Update Bounding Box
          if (sceneRef.current) {
            if (boundingBoxRef.current) {
              sceneRef.current.remove(boundingBoxRef.current);
            }
            const box = new THREE.BoxHelper(hitMesh, 0x22d3ee);
            sceneRef.current.add(box);
            boundingBoxRef.current = box;
          }
        }
      }
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: false });
    container.addEventListener('click', onClick);
    container.addEventListener('contextmenu', (e) => e.preventDefault());

    return () => {
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('wheel', onWheel);
      container.removeEventListener('click', onClick);
    };
  }, [isMeasuring, measurementPoints, onSelectObjectFromParent]);

  // Reset Camera View
  const handleResetCamera = () => {
    if (!cameraRef.current) return;
    cameraRef.current.position.set(-65, 55, 95);
    cameraRef.current.lookAt(0, 5, 0);
  };

  // Focus on selected object
  const handleFocusObject = (obj: SpatialObject) => {
    if (!cameraRef.current) return;
    const mesh = objectMeshesRef.current.get(obj.id);
    if (!mesh) return;

    const targetPos = mesh.position.clone();
    cameraRef.current.position.set(targetPos.x - 30, targetPos.y + 25, targetPos.z + 35);
    cameraRef.current.lookAt(targetPos);
  };

  // Apply measurement preset
  const handleApplyPreset = (label: string, dist: number, hDelta: number) => {
    const newM: Measurement = {
      id: `m-${Date.now()}`,
      label,
      type: 'distance',
      p1: { x: 0, y: 0, z: 0 },
      p2: { x: dist, y: hDelta, z: 0 },
      distanceM: dist,
      heightDeltaM: hDelta,
      createdAt: '10:46',
    };
    setMeasurements((prev) => [...prev, newM]);
  };

  const handleToggleFullscreen = () => {
    if (!mountRef.current) return;
    if (!document.fullscreenElement) {
      mountRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-3.5rem)] bg-slate-950 overflow-hidden select-none">
      {/* Three.js Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Toolbar (Top Center) */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 p-1.5 rounded-xl bg-slate-950/90 border border-slate-800 shadow-2xl backdrop-blur-md">
        <button
          onClick={() => setIsMeasuring(!isMeasuring)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            isMeasuring
              ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-400/40'
              : 'text-slate-300 hover:text-white hover:bg-slate-900'
          }`}
          title="3D Laser Measurement Caliper"
        >
          <Ruler className="w-3.5 h-3.5" />
          <span>Measure</span>
        </button>

        <button
          onClick={() => setShowFlightPath(!showFlightPath)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            showFlightPath
              ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/60'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
          title="Toggle Drone Flight Trajectory"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Flight Path</span>
        </button>

        <button
          onClick={() => setConfidenceMode(!confidenceMode)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            confidenceMode
              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 ring-1 ring-emerald-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
          title="Toggle Single-Pass Confidence Heatmap"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Confidence</span>
        </button>

        <button
          onClick={() => setOcclusionMode(!occlusionMode)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            occlusionMode
              ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 ring-1 ring-indigo-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
          title="Visualize Single-Pass Line-of-Sight Occlusion Cones"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Occlusion</span>
        </button>

        {/* Layers Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowLayersDropdown(!showLayersDropdown)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 flex items-center gap-1 transition-all"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Layers</span>
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </button>

          {showLayersDropdown && (
            <div className="absolute top-full mt-2 left-0 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 space-y-1 text-xs text-slate-300 z-30">
              <label className="flex items-center justify-between p-1.5 hover:bg-slate-800 rounded cursor-pointer">
                <span>Point Cloud Mode</span>
                <input
                  type="checkbox"
                  checked={pointCloudMode}
                  onChange={(e) => setPointCloudMode(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-0"
                />
              </label>
              <label className="flex items-center justify-between p-1.5 hover:bg-slate-800 rounded cursor-pointer">
                <span>Wireframe Mesh</span>
                <input
                  type="checkbox"
                  checked={wireframeMode}
                  onChange={(e) => setWireframeMode(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-0"
                />
              </label>
              <label className="flex items-center justify-between p-1.5 hover:bg-slate-800 rounded cursor-pointer">
                <span>Ground Grid</span>
                <input
                  type="checkbox"
                  checked={showGrid}
                  onChange={(e) => setShowGrid(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-0"
                />
              </label>
            </div>
          )}
        </div>

        <div className="h-4 w-px bg-slate-800 mx-1" />

        <button
          onClick={handleResetCamera}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          title="Reset Camera View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={handleToggleFullscreen}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          title="Toggle Fullscreen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Measurement Panel (Left Drawer) */}
      <MeasurementPanel
        measurements={measurements}
        isMeasuring={isMeasuring}
        onToggleMeasuring={() => setIsMeasuring(!isMeasuring)}
        onClearMeasurements={() => setMeasurements([])}
        onApplyPreset={handleApplyPreset}
      />

      {/* Object Inspection Panel (Right Drawer) */}
      <ObjectInspectionPanel
        object={selectedObject}
        onClose={() => setSelectedObject(null)}
        onFocusObject={handleFocusObject}
      />

      {/* Confidence Legend (Bottom Right) */}
      <ConfidenceLegend
        confidenceMode={confidenceMode}
        occlusionMode={occlusionMode}
      />

      {/* Bottom Telemetry HUD Bar */}
      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-3 px-3.5 py-2 rounded-xl bg-slate-950/85 border border-slate-800 text-[11px] font-mono text-slate-400 backdrop-blur-md">
        <div className="flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-200">
            {cursorCoords.lat.toFixed(5)}°N, {cursorCoords.lon.toFixed(5)}°E
          </span>
        </div>
        <span className="text-slate-600">·</span>
        <div>
          <span className="text-slate-500">Alt: </span>
          <span className="text-slate-200">{cursorCoords.alt.toFixed(1)}m MSL</span>
        </div>
        <span className="text-slate-600">·</span>
        <div>
          <span className="text-slate-500">UTM: </span>
          <span className="text-cyan-400">44N ({cursorCoords.x}m, {cursorCoords.z}m)</span>
        </div>
        <span className="text-slate-600">·</span>
        <div className="text-[10px] text-emerald-400 font-sans font-medium flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>WGS 84 Calibrated</span>
        </div>
      </div>
    </div>
  );
};
