import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { CAMPUS_BUILDINGS } from '../data/campusData';
import { Building, Classroom } from '../types';
import {
  Maximize2,
  Minimize2,
  Compass,
  Layers,
  MapPin,
  Search,
  Navigation,
  Sparkles,
  Info,
  Sun,
  Moon,
  ChevronRight,
  X,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface CampusMap3DProps {
  selectedBuildingId?: string | null;
  onSelectBuilding: (bld: Building) => void;
  targetClassroom?: Classroom | null;
  onNavigateToRoom?: (room: Classroom) => void;
}

export const CampusMap3D: React.FC<CampusMap3DProps> = ({
  selectedBuildingId,
  onSelectBuilding,
  targetClassroom,
  onNavigateToRoom,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const buildingMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const animationFrameRef = useRef<number | null>(null);
  const pathLineRef = useRef<THREE.Line | null>(null);

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(
    CAMPUS_BUILDINGS.find((b) => b.id === selectedBuildingId) || CAMPUS_BUILDINGS[0]
  );
  const [activeFloor, setActiveFloor] = useState<number>(1);
  const [nightMode, setNightMode] = useState<boolean>(false);
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const [navRoute, setNavRoute] = useState<string>('Tech Tower to Central Library');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hoveredBuilding, setHoveredBuilding] = useState<Building | null>(null);
  const [audioCue, setAudioCue] = useState<boolean>(true);

  // Sync prop changes
  useEffect(() => {
    if (selectedBuildingId) {
      const bld = CAMPUS_BUILDINGS.find((b) => b.id === selectedBuildingId);
      if (bld) {
        setSelectedBuilding(bld);
        focusOnBuilding(bld.position);
      }
    }
  }, [selectedBuildingId]);

  // Focus Camera helper
  const focusOnBuilding = (pos: [number, number, number]) => {
    if (!cameraRef.current) return;
    const camera = cameraRef.current;
    const targetX = pos[0];
    const targetZ = pos[2] + 16;
    const targetY = 14;

    const startX = camera.position.x;
    const startY = camera.position.y;
    const startZ = camera.position.z;

    let progress = 0;
    const animateCamera = () => {
      progress += 0.05;
      if (progress <= 1) {
        camera.position.x = startX + (targetX - startX) * progress;
        camera.position.y = startY + (targetY - startY) * progress;
        camera.position.z = startZ + (targetZ - startZ) * progress;
        camera.lookAt(pos[0], 0, pos[2]);
        requestAnimationFrame(animateCamera);
      }
    };
    animateCamera();
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(nightMode ? 0x0f172a : 0xe0f2fe);
    scene.fog = new THREE.FogExp2(nightMode ? 0x0f172a : 0xe0f2fe, 0.015);

    // Camera
    const aspect = container.clientWidth / container.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    camera.position.set(0, 26, 36);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(
      nightMode ? 0x334155 : 0xffffff,
      nightMode ? 0.9 : 0.85
    );
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(
      nightMode ? 0x60a5fa : 0xfffaed,
      nightMode ? 0.8 : 1.4
    );
    dirLight.position.set(30, 45, 20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 150;
    const d = 40;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    scene.add(dirLight);

    // Campus Main Ground
    const groundGeo = new THREE.PlaneGeometry(120, 120);
    const groundMat = new THREE.MeshStandardMaterial({
      color: nightMode ? 0x1e293b : 0xdcfce7, // lush campus lawn
      roughness: 0.8,
      metalness: 0.1,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Campus Roads / Pathways
    const roadMat = new THREE.MeshStandardMaterial({
      color: nightMode ? 0x334155 : 0xf1f5f9,
      roughness: 0.5,
    });
    
    // Main avenue road
    const roadGeo1 = new THREE.PlaneGeometry(8, 100);
    const road1 = new THREE.Mesh(roadGeo1, roadMat);
    road1.rotation.x = -Math.PI / 2;
    road1.position.y = 0.02;
    scene.add(road1);

    // Cross avenue road
    const roadGeo2 = new THREE.PlaneGeometry(100, 7);
    const road2 = new THREE.Mesh(roadGeo2, roadMat);
    road2.rotation.x = -Math.PI / 2;
    road2.position.y = 0.02;
    scene.add(road2);

    // Campus Roundabout Plaza in center
    const circleGeo = new THREE.CircleGeometry(9, 32);
    const circleMat = new THREE.MeshStandardMaterial({
      color: nightMode ? 0x1e293b : 0xe2e8f0,
    });
    const circle = new THREE.Mesh(circleGeo, circleMat);
    circle.rotation.x = -Math.PI / 2;
    circle.position.y = 0.03;
    scene.add(circle);

    // Water fountain in roundabout
    const fountainGeo = new THREE.CylinderGeometry(3, 3, 0.4, 32);
    const fountainMat = new THREE.MeshStandardMaterial({
      color: 0x53aadf,
      roughness: 0.1,
      metalness: 0.6,
    });
    const fountain = new THREE.Mesh(fountainGeo, fountainMat);
    fountain.position.set(0, 0.2, 0);
    scene.add(fountain);

    // Trees Generator
    const treeTrunkGeo = new THREE.CylinderGeometry(0.2, 0.3, 1.2, 8);
    const treeTrunkMat = new THREE.MeshStandardMaterial({ color: 0x854d0e });
    const treeFoliageGeo = new THREE.ConeGeometry(1.2, 2.4, 8);
    const treeFoliageMat = new THREE.MeshStandardMaterial({
      color: nightMode ? 0x064e3b : 0x16a34a,
      roughness: 0.6,
    });

    const treePositions: [number, number][] = [
      [-5, -4], [-5, 4], [5, -4], [5, 4],
      [-16, 0], [16, 0], [0, -18], [0, 18],
      [-8, -12], [8, -12], [-8, 12], [8, 12],
      [-18, -10], [18, 10], [-18, 10], [18, -10],
    ];

    treePositions.forEach(([tx, tz]) => {
      const trunk = new THREE.Mesh(treeTrunkGeo, treeTrunkMat);
      trunk.position.set(tx, 0.6, tz);
      trunk.castShadow = true;
      scene.add(trunk);

      const foliage = new THREE.Mesh(treeFoliageGeo, treeFoliageMat);
      foliage.position.set(tx, 2, tz);
      foliage.castShadow = true;
      scene.add(foliage);
    });

    // Campus Buildings
    const meshesMap = new Map<string, THREE.Mesh>();

    CAMPUS_BUILDINGS.forEach((bld) => {
      const [w, h, d] = bld.dimensions;
      const bldGeo = new THREE.BoxGeometry(w, h, d);
      
      const isSelected = selectedBuilding?.id === bld.id;
      const bldColor = new THREE.Color(bld.color);

      const bldMat = new THREE.MeshStandardMaterial({
        color: bldColor,
        roughness: 0.35,
        metalness: 0.15,
      });

      const mesh = new THREE.Mesh(bldGeo, bldMat);
      mesh.position.set(bld.position[0], h / 2, bld.position[2]);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = { building: bld };
      scene.add(mesh);
      meshesMap.set(bld.id, mesh);

      // Add architectural roof trim / glass windows layer
      const roofGeo = new THREE.BoxGeometry(w + 0.3, 0.4, d + 0.3);
      const roofMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.2,
      });
      const roof = new THREE.Mesh(roofGeo, roofMat);
      roof.position.set(bld.position[0], h + 0.2, bld.position[2]);
      scene.add(roof);

      // Floor glass stripes
      for (let f = 1; f < bld.floors; f++) {
        const stripeY = (h / bld.floors) * f;
        const stripeGeo = new THREE.BoxGeometry(w + 0.05, 0.3, d + 0.05);
        const stripeMat = new THREE.MeshStandardMaterial({
          color: nightMode ? 0xfef08a : 0x53aadf,
          emissive: nightMode ? new THREE.Color(0xfef08a) : new THREE.Color(0x134f73),
          emissiveIntensity: nightMode ? 0.6 : 0.1,
          roughness: 0.1,
        });
        const stripe = new THREE.Mesh(stripeGeo, stripeMat);
        stripe.position.set(bld.position[0], stripeY, bld.position[2]);
        scene.add(stripe);
      }

      // Add a floating pin over the building
      const pinGeo = new THREE.SphereGeometry(0.5, 16, 16);
      const pinMat = new THREE.MeshStandardMaterial({
        color: isSelected ? 0xf59e0b : 0x134f73,
        emissive: isSelected ? new THREE.Color(0xf59e0b) : new THREE.Color(0x53aadf),
        emissiveIntensity: 0.5,
      });
      const pin = new THREE.Mesh(pinGeo, pinMat);
      pin.position.set(bld.position[0], h + 1.6, bld.position[2]);
      scene.add(pin);
    });

    buildingMeshesRef.current = meshesMap;

    // Raycaster for mouse click and hover
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(Array.from(meshesMap.values()));

      if (intersects.length > 0) {
        const hitBuilding = intersects[0].object.userData.building as Building;
        if (hitBuilding) {
          setSelectedBuilding(hitBuilding);
          onSelectBuilding(hitBuilding);
          focusOnBuilding(hitBuilding.position);
        }
      }
    };

    const handlePointerMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(Array.from(meshesMap.values()));

      if (intersects.length > 0) {
        const hitBuilding = intersects[0].object.userData.building as Building;
        setHoveredBuilding(hitBuilding);
        container.style.cursor = 'pointer';
      } else {
        setHoveredBuilding(null);
        container.style.cursor = 'grab';
      }
    };

    // Orbit Controls Simulation via pointer dragging
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      handlePointerMove(e);
      if (!isDragging) return;

      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      // Rotate camera around center
      const radius = Math.sqrt(
        camera.position.x * camera.position.x + camera.position.z * camera.position.z
      );
      let angle = Math.atan2(camera.position.z, camera.position.x);
      angle -= deltaX * 0.005;

      camera.position.x = radius * Math.cos(angle);
      camera.position.z = radius * Math.sin(angle);
      camera.position.y = Math.max(6, Math.min(45, camera.position.y + deltaY * 0.05));
      camera.lookAt(0, 0, 0);

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY * 0.02;
      camera.position.multiplyScalar(1 + zoomFactor * 0.05);
      camera.position.clampLength(12, 70);
      camera.lookAt(0, 0, 0);
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('click', handlePointerDown);
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domElement.addEventListener('wheel', onWheel, { passive: false });

    // Touch events for mobile
    let touchStartDist = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        touchStartDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && isDragging) {
        const deltaX = e.touches[0].clientX - previousMousePosition.x;
        const deltaY = e.touches[0].clientY - previousMousePosition.y;

        const radius = Math.sqrt(
          camera.position.x * camera.position.x + camera.position.z * camera.position.z
        );
        let angle = Math.atan2(camera.position.z, camera.position.x);
        angle -= deltaX * 0.006;

        camera.position.x = radius * Math.cos(angle);
        camera.position.z = radius * Math.sin(angle);
        camera.position.y = Math.max(6, Math.min(45, camera.position.y + deltaY * 0.06));
        camera.lookAt(0, 0, 0);

        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const factor = touchStartDist / dist;
        camera.position.multiplyScalar(factor > 1 ? 1.02 : 0.98);
        camera.position.clampLength(12, 70);
        camera.lookAt(0, 0, 0);
        touchStartDist = dist;
      }
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    domElement.addEventListener('touchstart', onTouchStart);
    domElement.addEventListener('touchmove', onTouchMove);
    domElement.addEventListener('touchend', onTouchEnd);

    // Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Subtle pulse to selected building
      if (selectedBuilding && meshesMap.has(selectedBuilding.id)) {
        const mesh = meshesMap.get(selectedBuilding.id);
        if (mesh) {
          mesh.scale.set(
            1 + Math.sin(elapsedTime * 3) * 0.015,
            1 + Math.sin(elapsedTime * 3) * 0.015,
            1 + Math.sin(elapsedTime * 3) * 0.015
          );
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    // Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
        }
      }
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      domElement.removeEventListener('click', handlePointerDown);
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElement.removeEventListener('wheel', onWheel);
      domElement.removeEventListener('touchstart', onTouchStart);
      domElement.removeEventListener('touchmove', onTouchMove);
      domElement.removeEventListener('touchend', onTouchEnd);
      renderer.dispose();
    };
  }, [nightMode]);

  // Start Navigation Path Simulation
  const handleStartNavigation = (targetBld: Building) => {
    setIsNavigating(true);
    setNavRoute(`Main Entrance Gate → ${targetBld.name}`);
    focusOnBuilding(targetBld.position);
  };

  const filteredBuildings = CAMPUS_BUILDINGS.filter((bld) => {
    const matchesCategory = activeCategory === 'All' || bld.category === activeCategory;
    const matchesSearch =
      bld.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bld.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bld.classrooms.some((c) =>
        c.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="relative w-full h-[620px] md:h-[680px] bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 shadow-xl select-none">
      {/* 3D Canvas Viewport */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Floating Control Bar */}
      <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Search in map */}
        <div className="pointer-events-auto flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-lg border border-slate-100 w-full sm:w-auto max-w-sm">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            id="map-search-input"
            type="text"
            placeholder="Find building, lab, classroom..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs md:text-sm bg-transparent outline-none text-slate-800 placeholder:text-slate-400 font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* View Controls & Toggles */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-xl shadow-lg border border-slate-100">
          <button
            id="btn-day-night-toggle"
            onClick={() => setNightMode(!nightMode)}
            className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              nightMode
                ? 'bg-indigo-900 text-amber-300'
                : 'bg-amber-100 text-amber-800'
            }`}
            title="Toggle Day/Night Mode"
          >
            {nightMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            <span className="hidden sm:inline">{nightMode ? 'Night Glow' : 'Day View'}</span>
          </button>

          <button
            onClick={() => {
              if (cameraRef.current) {
                cameraRef.current.position.set(0, 26, 36);
                cameraRef.current.lookAt(0, 0, 0);
              }
            }}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            title="Reset Campus View"
          >
            <Compass className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Categories Filter Pills */}
      <div className="absolute top-16 left-3 right-3 flex items-center gap-1.5 overflow-x-auto pb-1 pointer-events-auto scrollbar-none">
        {['All', 'Academic', 'Library', 'Dining', 'Hostel', 'Sports', 'Administrative'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shadow-md transition-all ${
              activeCategory === cat
                ? 'bg-[#134F73] text-white ring-2 ring-[#53AADF]'
                : 'bg-white/90 text-slate-700 hover:bg-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Hover Tooltip */}
      {hoveredBuilding && (
        <div className="absolute bottom-40 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white text-xs px-3.5 py-1.5 rounded-full shadow-lg backdrop-blur-md pointer-events-none flex items-center gap-2 border border-slate-700 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-[#53AADF] animate-ping" />
          <span className="font-semibold">{hoveredBuilding.name}</span>
          <span className="text-slate-400">({hoveredBuilding.code})</span>
        </div>
      )}

      {/* Active Navigation Banner */}
      {isNavigating && (
        <div className="absolute top-28 left-4 right-4 bg-emerald-600/95 text-white px-4 py-2.5 rounded-xl shadow-xl backdrop-blur-md flex items-center justify-between animate-bounce-short z-20">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-emerald-500 rounded-lg">
              <Navigation className="w-4 h-4 animate-spin text-white" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-200">Active Live Navigation</p>
              <p className="text-xs font-medium">{navRoute}</p>
            </div>
          </div>
          <button
            onClick={() => setIsNavigating(false)}
            className="text-xs bg-emerald-700 hover:bg-emerald-800 px-2.5 py-1 rounded-lg transition-colors"
          >
            Stop
          </button>
        </div>
      )}

      {/* Bottom Selected Building Card */}
      {selectedBuilding && (
        <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-lg rounded-2xl p-4 shadow-2xl border border-slate-100 max-h-56 overflow-y-auto z-10">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md"
                style={{ backgroundColor: selectedBuilding.color }}
              >
                {selectedBuilding.code}
              </div>
              <div>
                <h4 className="text-sm md:text-base font-bold text-[#134F73] flex items-center gap-1.5">
                  {selectedBuilding.name}
                  <span className="text-[10px] font-semibold bg-sky-100 text-[#134F73] px-2 py-0.5 rounded-full">
                    {selectedBuilding.category}
                  </span>
                </h4>
                <p className="text-xs text-slate-500 line-clamp-1">{selectedBuilding.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                id="btn-start-3d-nav"
                onClick={() => handleStartNavigation(selectedBuilding)}
                className="bg-[#134F73] hover:bg-[#0e3b56] text-white text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-md active:scale-95"
              >
                <Navigation className="w-3.5 h-3.5 text-[#53AADF]" />
                <span>Navigate</span>
              </button>
            </div>
          </div>

          {/* Quick Classroom / Popular spots on this building */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Floors & Rooms ({selectedBuilding.floors} Floors)
              </p>
              <div className="flex flex-wrap gap-1">
                {selectedBuilding.classrooms.length > 0 ? (
                  selectedBuilding.classrooms.map((room) => (
                    <button
                      key={room.id}
                      onClick={() => onNavigateToRoom?.(room)}
                      className={`px-2 py-1 rounded-lg text-[11px] font-medium border transition-colors flex items-center gap-1 ${
                        room.currentStatus === 'Available'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                      }`}
                    >
                      <span>{room.roomNumber}</span>
                      <span className="text-[9px] opacity-75">({room.type})</span>
                    </button>
                  ))
                ) : (
                  <span className="text-slate-400 text-[11px]">Open facility / common zone</span>
                )}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Key Highlights
              </p>
              <div className="flex flex-wrap gap-1 text-[11px] text-slate-600">
                {selectedBuilding.popularSpots.slice(0, 2).map((spot, i) => (
                  <span key={i} className="bg-slate-100 px-2 py-0.5 rounded-md">
                    • {spot}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3D Hint overlay */}
      <div className="absolute bottom-2 left-4 text-[10px] text-white/60 pointer-events-none hidden md:block">
        💡 Drag to rotate campus • Scroll to zoom • Click any building to inspect
      </div>
    </div>
  );
};
