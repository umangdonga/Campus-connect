import React, { useState } from 'react';
import { CAMPUS_BUILDINGS } from '../data/campusData';
import { Classroom, Building } from '../types';
import {
  Search,
  MapPin,
  Clock,
  User,
  Users,
  CheckCircle,
  Navigation,
  Layers,
} from 'lucide-react';

interface ClassroomFinderProps {
  onNavigateToRoom: (room: Classroom, building: Building) => void;
}

export const ClassroomFinder: React.FC<ClassroomFinderProps> = ({ onNavigateToRoom }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBuildingFilter, setSelectedBuildingFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Available' | 'Occupied'>('All');

  // Collect all classrooms across all buildings
  const allRooms: { room: Classroom; building: Building }[] = [];
  CAMPUS_BUILDINGS.forEach((bld) => {
    bld.classrooms.forEach((room) => {
      allRooms.push({ room, building: bld });
    });
  });

  const filteredRooms = allRooms.filter(({ room, building }) => {
    const matchesSearch =
      room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      building.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (room.currentClass && room.currentClass.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (room.instructor && room.instructor.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesBuilding =
      selectedBuildingFilter === 'All' || building.id === selectedBuildingFilter;

    const matchesStatus =
      statusFilter === 'All' || room.currentStatus === statusFilter;

    return matchesSearch && matchesBuilding && matchesStatus;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-[#2A2C5C] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#2A2C5C]" />
            Classroom & Lab Directory
          </h3>
          <p className="text-xs text-slate-500">
            Real-time live occupancy, lecture schedules, and navigation
          </p>
        </div>

        <div className="flex items-center gap-1 text-xs bg-slate-100 p-1 rounded-xl w-fit">
          {(['All', 'Available', 'Occupied'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg text-xs transition-all ${
                statusFilter === st
                  ? 'bg-white text-[#2A2C5C] shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Search & Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search room # (e.g. TT-101), course, or faculty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:border-[#2A2C5C] focus:ring-1 focus:ring-[#2A2C5C] outline-none transition-all"
          />
        </div>

        <div>
          <select
            value={selectedBuildingFilter}
            onChange={(e) => setSelectedBuildingFilter(e.target.value)}
            className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 outline-none focus:border-[#2A2C5C]"
          >
            <option value="All">All Campus Buildings</option>
            {CAMPUS_BUILDINGS.filter((b) => b.classrooms.length > 0).map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Classrooms List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        {filteredRooms.length > 0 ? (
          filteredRooms.map(({ room, building }) => {
            const isAvailable = room.currentStatus === 'Available';
            const isReserved = room.currentStatus === 'Reserved';

            return (
              <div
                key={room.id}
                className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 p-4 transition-all flex flex-col justify-between group hover:shadow-xs"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-11 h-11 rounded-xl bg-[#2A2C5C]/5 text-[#2A2C5C] flex flex-col items-center justify-center font-bold text-xs border border-[#2A2C5C]/15 shrink-0">
                        <span>{room.roomNumber}</span>
                        <span className="text-[9px] font-normal text-slate-500">L{room.floor}</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 group-hover:text-[#2A2C5C] transition-colors">
                          {room.name}
                        </h4>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <Layers className="w-3 h-3 text-[#2A2C5C]" />
                          {building.name}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0 ${
                        isAvailable
                          ? 'bg-emerald-50 text-emerald-700'
                          : isReserved
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isAvailable ? 'bg-emerald-500' : isReserved ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                      />
                      {room.currentStatus}
                    </span>
                  </div>

                  {/* Current Session / Class details */}
                  <div className="mt-3 bg-slate-50 rounded-lg p-2.5 text-xs space-y-1">
                    {room.currentClass ? (
                      <>
                        <div className="font-medium text-slate-800 flex items-center justify-between">
                          <span>{room.currentClass}</span>
                          <span className="text-[10px] text-slate-400">{room.timeSlot}</span>
                        </div>
                        {room.instructor && (
                          <p className="text-slate-600 flex items-center gap-1 text-[11px]">
                            <User className="w-3 h-3 text-[#2A2C5C]" /> {room.instructor}
                          </p>
                        )}
                      </>
                    ) : (
                      <div className="flex items-center justify-between text-emerald-700">
                        <span className="font-medium flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Available for study
                        </span>
                        <span className="text-[10px] text-slate-500">{room.timeSlot}</span>
                      </div>
                    )}
                  </div>

                  {/* Amenities Tags */}
                  <div className="mt-2.5 flex flex-wrap items-center gap-1">
                    <span className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded flex items-center gap-1">
                      <Users className="w-2.5 h-2.5" /> Cap: {room.capacity}
                    </span>
                    {room.amenities.map((am, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-[#2A2C5C]/5 text-[#2A2C5C] px-1.5 py-0.5 rounded font-medium"
                      >
                        {am}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action button */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Type: <strong className="text-slate-700 font-medium">{room.type}</strong>
                  </span>
                  <button
                    onClick={() => onNavigateToRoom(room, building)}
                    className="bg-[#2A2C5C] hover:bg-[#1E2045] text-white text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all active:scale-95 shadow-xs"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Navigate</span>
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-2 py-8 text-center text-slate-400">
            <p className="text-sm font-medium">No classrooms or labs found matching your filter.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedBuildingFilter('All');
                setStatusFilter('All');
              }}
              className="mt-2 text-xs text-[#2A2C5C] hover:underline font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

