import React, { useState } from 'react';
import { CAMPUS_BUILDINGS } from '../data/campusData';
import { Building, Classroom } from '../types';
import {
  MapPin,
  Navigation,
  Layers,
  ZoomIn,
  ZoomOut,
  Footprints,
} from 'lucide-react';

interface CampusMap2DProps {
  onSelectBuilding: (bld: Building) => void;
  onNavigateToRoom?: (room: Classroom) => void;
}

export const CampusMap2D: React.FC<CampusMap2DProps> = ({
  onSelectBuilding,
  onNavigateToRoom,
}) => {
  const [selectedZone, setSelectedZone] = useState<Building | null>(CAMPUS_BUILDINGS[0]);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [activeFloorFilter, setActiveFloorFilter] = useState<number>(1);
  const [activeLayer, setActiveLayer] = useState<'all' | 'classrooms' | 'amenities' | 'safety'>('all');
  const [startPoint, setStartPoint] = useState<string>('Campus Main Gate');
  const [endPoint, setEndPoint] = useState<string>('Tech Tower (TT-101)');
  const [routeCalculated, setRouteCalculated] = useState<boolean>(false);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
      {/* 2D Map Controls Top Header */}
      <div className="p-3.5 sm:p-4 bg-slate-50 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-[#2A2C5C] text-white rounded-xl">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#2A2C5C]">2D Interactive Blueprint</h3>
            <p className="text-[11px] text-slate-500">Floor plans, rooms, walking paths & emergency zones</p>
          </div>
        </div>

        {/* Floor selector & Zoom */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
            <span className="text-[11px] font-medium text-slate-400 px-1.5">Floor:</span>
            {[1, 2, 3, 4].map((fl) => (
              <button
                key={fl}
                onClick={() => setActiveFloorFilter(fl)}
                className={`w-6 h-6 rounded-lg text-xs font-semibold transition-all ${
                  activeFloorFilter === fl
                    ? 'bg-[#2A2C5C] text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                L{fl}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.5, z + 0.15))}
              className="p-1.5 bg-white rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.75, z - 0.15))}
              className="p-1.5 bg-white rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="px-2 py-1 bg-white rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Layer Filters */}
      <div className="px-4 py-2 bg-slate-50/50 border-b border-slate-200/80 flex items-center gap-1.5 overflow-x-auto text-xs">
        <span className="text-slate-400 font-medium text-[11px]">Layers:</span>
        <button
          onClick={() => setActiveLayer('all')}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
            activeLayer === 'all' ? 'bg-[#2A2C5C] text-white' : 'bg-white text-slate-700 border border-slate-200'
          }`}
        >
          All Buildings
        </button>
        <button
          onClick={() => setActiveLayer('classrooms')}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
            activeLayer === 'classrooms' ? 'bg-[#2A2C5C] text-white' : 'bg-white text-slate-700 border border-slate-200'
          }`}
        >
          Classrooms & Labs
        </button>
        <button
          onClick={() => setActiveLayer('amenities')}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
            activeLayer === 'amenities' ? 'bg-[#2A2C5C] text-white' : 'bg-white text-slate-700 border border-slate-200'
          }`}
        >
          Amenities & Restrooms
        </button>
        <button
          onClick={() => setActiveLayer('safety')}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
            activeLayer === 'safety' ? 'bg-rose-600 text-white' : 'bg-white text-rose-700 border border-rose-200'
          }`}
        >
          Safety & Exits
        </button>
      </div>

      {/* SVG Canvas Map */}
      <div className="relative w-full h-[380px] sm:h-[420px] bg-slate-50 overflow-hidden flex items-center justify-center p-3">
        <div
          className="transition-transform duration-200 ease-out origin-center w-full max-w-2xl"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <svg
            viewBox="0 0 800 500"
            className="w-full h-full drop-shadow-xs select-none rounded-xl"
            style={{ backgroundColor: '#F8FAFC' }}
          >
            {/* Campus Outline / Boundary */}
            <rect x="20" y="20" width="760" height="460" rx="16" fill="#F1F5F9" stroke="#E2E8F0" strokeWidth="1.5" />

            {/* Lush Gardens / Lawns */}
            <rect x="40" y="40" width="180" height="120" rx="12" fill="#ECFDF5" stroke="#A7F3D0" strokeWidth="1" />
            <text x="130" y="105" textAnchor="middle" fill="#047857" fontSize="12" fontWeight="600">
              🌿 Central Green Lawn
            </text>

            <rect x="580" y="40" width="180" height="120" rx="12" fill="#ECFDF5" stroke="#A7F3D0" strokeWidth="1" />
            <text x="670" y="105" textAnchor="middle" fill="#047857" fontSize="12" fontWeight="600">
              🌳 Botanical Park
            </text>

            {/* Paved Walkways */}
            <path
              d="M 400,30 L 400,470 M 30,250 L 770,250"
              stroke="#E2E8F0"
              strokeWidth="24"
              strokeLinecap="round"
            />
            <path
              d="M 400,30 L 400,470 M 30,250 L 770,250"
              stroke="#CBD5E1"
              strokeWidth="1.5"
              strokeDasharray="6 6"
            />

            {/* Campus Roundabout */}
            <circle cx="400" cy="250" r="40" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1.5" />
            <circle cx="400" cy="250" r="18" fill="#2A2C5C" />
            <text x="400" y="254" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold">
              PLAZA
            </text>

            {/* Animated Path Route if calculated */}
            {routeCalculated && (
              <path
                d="M 400,460 L 400,250 L 400,160"
                stroke="#10B981"
                strokeWidth="4"
                strokeDasharray="6 4"
                strokeLinecap="round"
                className="animate-pulse"
              />
            )}

            {/* Building 1: Tech Tower (Center Top) */}
            <g
              onClick={() => {
                const b = CAMPUS_BUILDINGS.find((x) => x.id === 'bld-tech-tower')!;
                setSelectedZone(b);
                onSelectBuilding(b);
              }}
              className="cursor-pointer group"
            >
              <rect
                x="310"
                y="50"
                width="180"
                height="110"
                rx="10"
                fill={selectedZone?.id === 'bld-tech-tower' ? '#2A2C5C' : '#3E427B'}
                stroke="#2A2C5C"
                strokeWidth={selectedZone?.id === 'bld-tech-tower' ? '3' : '1'}
              />
              <text x="400" y="90" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="bold">
                Tech Tower (TT)
              </text>
              <text x="400" y="110" textAnchor="middle" fill="#D5D8ED" fontSize="10">
                CS & AI Labs • TT-101 • TT-201
              </text>
              <text x="400" y="130" textAnchor="middle" fill="#FEF08A" fontSize="9" fontWeight="bold">
                ⚡ 5 Floors (Elevator A/B)
              </text>
            </g>

            {/* Building 2: Amphitheater (Left Top) */}
            <g
              onClick={() => {
                const b = CAMPUS_BUILDINGS.find((x) => x.id === 'bld-amp')!;
                setSelectedZone(b);
                onSelectBuilding(b);
              }}
              className="cursor-pointer"
            >
              <rect
                x="50"
                y="180"
                width="140"
                height="100"
                rx="10"
                fill="#4E5399"
                stroke="#2A2C5C"
                strokeWidth={selectedZone?.id === 'bld-amp' ? '3' : '1'}
              />
              <text x="120" y="225" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">
                Amphitheater (AMP)
              </text>
              <text x="120" y="245" textAnchor="middle" fill="#E6E8F5" fontSize="10">
                Acoustic Stage • 1500 Cap
              </text>
            </g>

            {/* Building 3: Central Library (Right Top) */}
            <g
              onClick={() => {
                const b = CAMPUS_BUILDINGS.find((x) => x.id === 'bld-library')!;
                setSelectedZone(b);
                onSelectBuilding(b);
              }}
              className="cursor-pointer"
            >
              <rect
                x="610"
                y="180"
                width="140"
                height="100"
                rx="10"
                fill="#14B8A6"
                stroke="#0F766E"
                strokeWidth={selectedZone?.id === 'bld-library' ? '3' : '1'}
              />
              <text x="680" y="225" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">
                Central Library (LIB)
              </text>
              <text x="680" y="245" textAnchor="middle" fill="#CCFBF1" fontSize="10">
                Quiet Study • 300K Books
              </text>
            </g>

            {/* Building 4: Administration Block (Left Bottom) */}
            <g
              onClick={() => {
                const b = CAMPUS_BUILDINGS.find((x) => x.id === 'bld-admin')!;
                setSelectedZone(b);
                onSelectBuilding(b);
              }}
              className="cursor-pointer"
            >
              <rect
                x="50"
                y="320"
                width="150"
                height="110"
                rx="10"
                fill="#2A2C5C"
                stroke="#5A5E9E"
                strokeWidth={selectedZone?.id === 'bld-admin' ? '3' : '1'}
              />
              <text x="125" y="365" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">
                Admin Block (ADM)
              </text>
              <text x="125" y="385" textAnchor="middle" fill="#D5D8ED" fontSize="10">
                Admissions • Student Desk
              </text>
            </g>

            {/* Building 5: Food Court & Canteen (Right Bottom) */}
            <g
              onClick={() => {
                const b = CAMPUS_BUILDINGS.find((x) => x.id === 'bld-canteen-hub')!;
                setSelectedZone(b);
                onSelectBuilding(b);
              }}
              className="cursor-pointer"
            >
              <rect
                x="600"
                y="320"
                width="160"
                height="110"
                rx="10"
                fill="#EA580C"
                stroke="#C2410C"
                strokeWidth={selectedZone?.id === 'bld-canteen-hub' ? '3' : '1'}
              />
              <text x="680" y="365" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">
                Food Court & Canteen
              </text>
              <text x="680" y="385" textAnchor="middle" fill="#FFEDD5" fontSize="10">
                UNIQUE Canteen • SKY Cafe
              </text>
            </g>

            {/* Building 6: Sports Complex & Gym */}
            <g
              onClick={() => {
                const b = CAMPUS_BUILDINGS.find((x) => x.id === 'bld-sports')!;
                setSelectedZone(b);
                onSelectBuilding(b);
              }}
              className="cursor-pointer"
            >
              <rect
                x="240"
                y="330"
                width="120"
                height="90"
                rx="10"
                fill="#0D9488"
                stroke="#115E59"
                strokeWidth={selectedZone?.id === 'bld-sports' ? '3' : '1'}
              />
              <text x="300" y="375" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">
                Sports Arena
              </text>
              <text x="300" y="392" textAnchor="middle" fill="#CCFBF1" fontSize="9">
                Gym • Badminton
              </text>
            </g>

            {/* Building 7: Bus Terminal */}
            <g
              onClick={() => {
                const b = CAMPUS_BUILDINGS.find((x) => x.id === 'bld-bus-terminal')!;
                setSelectedZone(b);
                onSelectBuilding(b);
              }}
              className="cursor-pointer"
            >
              <rect
                x="440"
                y="330"
                width="130"
                height="90"
                rx="10"
                fill="#373B75"
                stroke="#2A2C5C"
                strokeWidth={selectedZone?.id === 'bld-bus-terminal' ? '3' : '1'}
              />
              <text x="505" y="375" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">
                Bus Terminus
              </text>
              <text x="505" y="392" textAnchor="middle" fill="#E6E8F5" fontSize="9">
                Routes 1-24 • Bays 1-6
              </text>
            </g>

            {/* Campus Main Gate Entrance Marker */}
            <g>
              <rect x="340" y="460" width="120" height="25" rx="6" fill="#1E293B" />
              <text x="400" y="477" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">
                🚪 CAMPUS MAIN GATE
              </text>
            </g>
          </svg>
        </div>
      </div>

      {/* Path Routing Bar & Selected Detail */}
      <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200/80">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-center">
          {/* Quick Route Generator */}
          <div className="bg-white p-3 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#2A2C5C] flex items-center gap-1.5">
                <Footprints className="w-3.5 h-3.5 text-emerald-600" />
                Walking Route Planner
              </span>
              {routeCalculated && (
                <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  ~3 mins walking (220 m)
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="w-full">
                <label className="text-[9px] uppercase font-semibold text-slate-400">From</label>
                <select
                  value={startPoint}
                  onChange={(e) => setStartPoint(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-slate-700 outline-none"
                >
                  <option value="Campus Main Gate">Campus Main Gate</option>
                  <option value="Hostel Block A">Hostel Block A</option>
                  <option value="UNIQUE Canteen">UNIQUE Canteen</option>
                  <option value="Bus Terminal">Bus Terminal</option>
                </select>
              </div>

              <div className="w-full">
                <label className="text-[9px] uppercase font-semibold text-slate-400">Destination</label>
                <select
                  value={endPoint}
                  onChange={(e) => setEndPoint(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-slate-700 outline-none"
                >
                  <option value="Tech Tower (TT-101)">Tech Tower (Alan Turing Hall)</option>
                  <option value="Central Library (Floor 2)">Central Library (Reading Pod)</option>
                  <option value="Amphitheater">Amphitheater Open Stage</option>
                  <option value="Admin Block">Admin Block Desk 4</option>
                  <option value="Food Court">Food Court / SKY Cafe</option>
                </select>
              </div>

              <div className="sm:self-end w-full sm:w-auto">
                <button
                  onClick={() => setRouteCalculated(true)}
                  className="w-full sm:w-auto bg-[#2A2C5C] hover:bg-[#1E2045] text-white text-xs font-medium px-3.5 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 shadow-xs"
                >
                  <Navigation className="w-3 h-3" />
                  <span>Route</span>
                </button>
              </div>
            </div>
          </div>

          {/* Selected Building Quick Rooms List */}
          {selectedZone && (
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: selectedZone.color }}
                  />
                  <h4 className="text-xs font-bold text-[#2A2C5C]">{selectedZone.name}</h4>
                </div>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                  {selectedZone.openingHours}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-2">
                {selectedZone.classrooms.length > 0 ? (
                  selectedZone.classrooms.map((rm) => (
                    <button
                      key={rm.id}
                      onClick={() => onNavigateToRoom?.(rm)}
                      className="px-2 py-1 bg-[#2A2C5C]/5 hover:bg-[#2A2C5C]/10 text-[#2A2C5C] border border-[#2A2C5C]/15 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                    >
                      <MapPin className="w-3 h-3" />
                      <span>{rm.roomNumber}</span>
                      <span className="text-[10px] text-slate-500">({rm.currentStatus})</span>
                    </button>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">
                    Highlights: {selectedZone.popularSpots.join(', ')}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

