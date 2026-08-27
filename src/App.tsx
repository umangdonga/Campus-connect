import React, { useState } from 'react';
import {
  INITIAL_STUDENT,
  CAMPUS_BUILDINGS,
  CANTEENS_DATA,
  LATEST_NEWS,
  CAMPUS_EVENTS,
  NOTIFICATIONS_DATA,
} from './data/campusData';
import { TabType, MapMode, Building, Classroom, Canteen, CampusEvent, NewsItem } from './types';
import { SplashOnboarding } from './components/SplashOnboarding';
import { CampusMap3D } from './components/CampusMap3D';
import { CampusMap2D } from './components/CampusMap2D';
import { ClassroomFinder } from './components/ClassroomFinder';
import { BusServiceModal } from './components/BusServiceModal';
import { CanteenModal } from './components/CanteenModal';
import { HostelModal } from './components/HostelModal';
import { LibraryModal } from './components/LibraryModal';
import { WorkshopModal } from './components/WorkshopModal';
import { NewsModal } from './components/NewsModal';
import { NotificationsModal } from './components/NotificationsModal';
import { HelpSupportModal } from './components/HelpSupportModal';
import { StudentProfileModal } from './components/StudentProfileModal';
import { BottomNav } from './components/BottomNav';
import {
  Bell,
  Search,
  Map as MapIcon,
  Compass,
  Bus,
  GraduationCap,
  Bed,
  BookOpen,
  Utensils,
  Calendar,
  Newspaper,
  LifeBuoy,
  Sparkles,
  ChevronRight,
  Layers,
  Phone,
  Clock,
  ShieldCheck,
  Maximize2,
  Smartphone,
  Monitor,
  CheckCircle2,
  X,
  Footprints,
} from 'lucide-react';

export default function App() {
  // State
  const [showSplash, setShowSplash] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [mapMode, setMapMode] = useState<MapMode>('3d');
  const [student, setStudent] = useState(INITIAL_STUDENT);
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(false);

  // Global Search State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);

  // Modals
  const [isNotifOpen, setIsNotifOpen] = useState<boolean>(false);
  const [isBusOpen, setIsBusOpen] = useState<boolean>(false);
  const [isCanteenOpen, setIsCanteenOpen] = useState<boolean>(false);
  const [selectedCanteenId, setSelectedCanteenId] = useState<string | null>(null);
  const [isHostelOpen, setIsHostelOpen] = useState<boolean>(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(false);
  const [isWorkshopOpen, setIsWorkshopOpen] = useState<boolean>(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isNewsOpen, setIsNewsOpen] = useState<boolean>(false);
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  // Map Focus / Navigation State
  const [focusedBuildingId, setFocusedBuildingId] = useState<string | null>(null);
  const [navTargetRoom, setNavTargetRoom] = useState<Classroom | null>(null);

  // Handlers
  const handleNavigateToRoom = (room: Classroom, building?: Building) => {
    setNavTargetRoom(room);
    if (building) {
      setFocusedBuildingId(building.id);
    }
    setActiveTab('map');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCanteen = (canteenId: string) => {
    setSelectedCanteenId(canteenId);
    setIsCanteenOpen(true);
  };

  const handleOpenEvent = (eventId: string) => {
    setSelectedEventId(eventId);
    setIsWorkshopOpen(true);
  };

  const handleOpenNews = (newsId: string) => {
    setSelectedNewsId(newsId);
    setIsNewsOpen(true);
  };

  // Search Results Generator
  const searchResults = {
    buildings: CAMPUS_BUILDINGS.filter(
      (b) =>
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.code.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    classrooms: CAMPUS_BUILDINGS.flatMap((b) =>
      b.classrooms.filter(
        (c) =>
          c.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (c.currentClass && c.currentClass.toLowerCase().includes(searchQuery.toLowerCase()))
      ).map((c) => ({ classroom: c, building: b }))
    ),
    canteens: CANTEENS_DATA.filter((c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    events: CAMPUS_EVENTS.filter((e) =>
      e.title.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  };

  const unreadNotifCount = NOTIFICATIONS_DATA.filter((n) => n.isUnread).length;

  if (showSplash) {
    return <SplashOnboarding onEnterApp={() => setShowSplash(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row antialiased text-slate-800 font-sans selection:bg-[#2A2C5C]/10 selection:text-[#2A2C5C]">
      {/* High Density Desktop Navigation Rail (Hidden in Phone Frame or on Mobile) */}
      {!isPhoneFrame && (
        <nav className="hidden md:flex w-20 bg-[#2A2C5C] flex-col items-center py-6 gap-7 shrink-0 select-none text-slate-300 min-h-screen sticky top-0 z-30 shadow-xs">
          {/* Brand Logo */}
          <div
            onClick={() => setActiveTab('home')}
            className="w-11 h-11 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-white font-bold text-lg cursor-pointer transition-all border border-white/10 active:scale-95 shadow-xs"
            title="Campus Connect Home"
          >
            CC
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-5 text-slate-300 w-full items-center">
            {/* MAPS */}
            <button
              onClick={() => {
                setMapMode('2d');
                setActiveTab('map');
              }}
              className={`flex flex-col items-center gap-1 cursor-pointer transition-colors group ${
                activeTab === 'map' ? 'text-white' : 'hover:text-white text-slate-400'
              }`}
            >
              <div
                className={`w-7 h-7 border rounded-lg flex items-center justify-center transition-all ${
                  activeTab === 'map'
                    ? 'border-white bg-white/20 text-white'
                    : 'border-slate-500/50 group-hover:border-slate-300'
                }`}
              >
                <Compass className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold tracking-wider uppercase">MAPS</span>
            </button>

            {/* BUS */}
            <button
              onClick={() => setIsBusOpen(true)}
              className="flex flex-col items-center gap-1 cursor-pointer text-slate-400 hover:text-white transition-colors group"
            >
              <div className="w-7 h-7 border border-slate-500/50 rounded-lg flex items-center justify-center group-hover:border-slate-300 transition-all">
                <Bus className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold tracking-wider uppercase">BUS</span>
            </button>

            {/* SERVICES */}
            <button
              onClick={() => setActiveTab('services')}
              className={`flex flex-col items-center gap-1 cursor-pointer transition-colors group ${
                activeTab === 'services' ? 'text-white' : 'hover:text-white text-slate-400'
              }`}
            >
              <div
                className={`w-7 h-7 border rounded-lg flex items-center justify-center transition-all ${
                  activeTab === 'services'
                    ? 'border-white bg-white/20 text-white'
                    : 'border-slate-500/50 group-hover:border-slate-300'
                }`}
              >
                <Layers className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold tracking-wider uppercase">SERVICES</span>
            </button>

            {/* EVENTS */}
            <button
              onClick={() => setActiveTab('events')}
              className={`flex flex-col items-center gap-1 cursor-pointer transition-colors group ${
                activeTab === 'events' ? 'text-white' : 'hover:text-white text-slate-400'
              }`}
            >
              <div
                className={`w-7 h-7 border rounded-lg flex items-center justify-center transition-all ${
                  activeTab === 'events'
                    ? 'border-white bg-white/20 text-white'
                    : 'border-slate-500/50 group-hover:border-slate-300'
                }`}
              >
                <Calendar className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold tracking-wider uppercase">EVENTS</span>
            </button>

            {/* HOME */}
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center gap-1 cursor-pointer transition-colors group ${
                activeTab === 'home' ? 'text-white' : 'hover:text-white text-slate-400'
              }`}
            >
              <div
                className={`w-7 h-7 border rounded-lg flex items-center justify-center transition-all ${
                  activeTab === 'home'
                    ? 'border-white bg-white/20 text-white'
                    : 'border-slate-500/50 group-hover:border-slate-300'
                }`}
              >
                <Footprints className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold tracking-wider uppercase">HOME</span>
            </button>
          </div>

          {/* Student Profile Avatar at Bottom */}
          <div
            onClick={() => setIsProfileOpen(true)}
            className="mt-auto pb-4 cursor-pointer group flex flex-col items-center gap-1"
            title="Student Profile & ID"
          >
            <div className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white text-xs font-semibold transition-colors">
              UD
            </div>
            <span className="text-[9px] font-medium text-slate-400 group-hover:text-slate-200">
              Profile
            </span>
          </div>
        </nav>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50 min-h-screen">
        {/* High Density Top Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 shrink-0 sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3 md:gap-4 flex-1">
            {/* Brand Logo in Mobile or Phone Frame View */}
            {(isPhoneFrame || true) && (
              <div
                onClick={() => setActiveTab('home')}
                className="md:hidden w-8 h-8 rounded-lg bg-[#2A2C5C] flex items-center justify-center font-bold text-white text-xs cursor-pointer shadow-xs"
              >
                CC
              </div>
            )}

            {/* High Density Search Input */}
            <div className="relative w-full max-w-xs sm:max-w-sm lg:max-w-md">
              <input
                id="global-home-search"
                type="text"
                placeholder="Find Classroom, Lab, or Faculty..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchActive(e.target.value.length > 0);
                }}
                onFocus={() => {
                  if (searchQuery.length > 0) setIsSearchActive(true);
                }}
                className="w-full bg-slate-100/80 border border-slate-200/60 rounded-xl py-2 pl-9 pr-8 text-xs sm:text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-[#2A2C5C]/20 focus:border-[#2A2C5C] outline-none transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setIsSearchActive(false);
                  }}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Search Results Dropdown */}
              {isSearchActive && searchQuery.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 p-3 max-h-80 overflow-y-auto z-50 text-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase">
                    <span>Results for &ldquo;{searchQuery}&rdquo;</span>
                    <button
                      onClick={() => setIsSearchActive(false)}
                      className="text-[#2A2C5C] hover:underline text-[10px]"
                    >
                      Close
                    </button>
                  </div>

                  {/* Classrooms */}
                  {searchResults.classrooms.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-[#2A2C5C] uppercase tracking-wider block">
                        Classrooms & Labs
                      </span>
                      {searchResults.classrooms.map(({ classroom, building }) => (
                        <div
                          key={classroom.id}
                          onClick={() => {
                            setIsSearchActive(false);
                            handleNavigateToRoom(classroom, building);
                          }}
                          className="p-2 bg-slate-50 hover:bg-[#2A2C5C]/5 rounded-lg cursor-pointer flex items-center justify-between text-xs transition-colors"
                        >
                          <div>
                            <span className="font-bold text-[#2A2C5C]">{classroom.roomNumber}</span>
                            <span className="text-slate-600 font-medium ml-2">{classroom.name}</span>
                            <span className="text-slate-400 text-[10px] block">
                              {building.name} • Floor {classroom.floor}
                            </span>
                          </div>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                            {classroom.currentStatus}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Buildings */}
                  {searchResults.buildings.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Campus Buildings
                      </span>
                      {searchResults.buildings.map((bld) => (
                        <div
                          key={bld.id}
                          onClick={() => {
                            setIsSearchActive(false);
                            setFocusedBuildingId(bld.id);
                            setActiveTab('map');
                          }}
                          className="p-2 bg-slate-50 hover:bg-[#2A2C5C]/5 rounded-lg cursor-pointer flex items-center justify-between text-xs transition-colors"
                        >
                          <span className="font-bold text-slate-800">
                            {bld.name} ({bld.code})
                          </span>
                          <span className="text-xs text-[#2A2C5C] font-semibold">View Map →</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Canteens */}
                  {searchResults.canteens.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
                        Dining & Canteens
                      </span>
                      {searchResults.canteens.map((c) => (
                        <div
                          key={c.id}
                          onClick={() => {
                            setIsSearchActive(false);
                            handleOpenCanteen(c.id);
                          }}
                          className="p-2 bg-slate-50 hover:bg-amber-50 rounded-lg cursor-pointer flex items-center justify-between text-xs transition-colors"
                        >
                          <span className="font-bold text-slate-800">{c.name}</span>
                          <span className="text-xs text-amber-700 font-semibold">View Menu</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick 2D / 3D View Buttons */}
            <div className="hidden sm:flex gap-1.5 shrink-0">
              <button
                onClick={() => {
                  setMapMode('2d');
                  setActiveTab('map');
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                  activeTab === 'map' && mapMode === '2d'
                    ? 'bg-[#2A2C5C] text-white border-[#2A2C5C]'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                2D Plan
              </button>
              <button
                onClick={() => {
                  setMapMode('3d');
                  setActiveTab('map');
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                  activeTab === 'map' && mapMode === '3d'
                    ? 'bg-[#2A2C5C] text-white border-[#2A2C5C]'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                3D View
              </button>
            </div>
          </div>

          {/* Right Status Indicators & Action Buttons */}
          <div className="flex items-center gap-3 sm:gap-4 text-sm font-medium">
            {/* Campus Status Indicator */}
            <div className="hidden lg:flex flex-col items-end">
              <span className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold">
                Campus Status
              </span>
              <span className="text-emerald-700 flex items-center gap-1 font-semibold text-xs">
                ● Normal Operations
              </span>
            </div>

            {/* Help Desk Button */}
            <button
              onClick={() => setIsHelpOpen(true)}
              className="bg-[#2A2C5C] hover:bg-[#1E2045] text-white px-3 sm:px-4 py-2 rounded-xl text-xs font-medium transition-all active:scale-95 shadow-xs shrink-0"
            >
              Help Desk
            </button>

            {/* Notification Bell */}
            <button
              id="btn-open-notifications"
              onClick={() => setIsNotifOpen(true)}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center transition-all relative text-slate-700 shrink-0"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#2A2C5C] ring-2 ring-white" />
              )}
            </button>

            {/* Phone Mockup Frame Switcher */}
            <button
              onClick={() => setIsPhoneFrame(!isPhoneFrame)}
              className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 transition-colors shrink-0"
              title="Toggle between Mobile Frame and High Density View"
            >
              {isPhoneFrame ? (
                <>
                  <Monitor className="w-3.5 h-3.5 text-[#2A2C5C]" />
                  <span className="hidden xl:inline">Full Screen</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-[#2A2C5C]" />
                  <span className="hidden xl:inline">Mobile Frame</span>
                </>
              )}
            </button>

            {/* Splash Tour button */}
            <button
              onClick={() => setShowSplash(true)}
              className="text-xs font-medium text-[#2A2C5C] hover:text-[#1E2045] px-2.5 py-1.5 rounded-xl bg-[#2A2C5C]/5 hover:bg-[#2A2C5C]/10 transition-colors hidden sm:inline"
            >
              Tour
            </button>
          </div>
        </header>

        {/* Content Wrapper (Adaptable to Phone Mockup Frame or High Density Fluid Grid) */}
        <div
          className={`w-full transition-all duration-300 ${
            isPhoneFrame
              ? 'max-w-[430px] mx-auto my-6 bg-white rounded-[44px] shadow-2xl border-[8px] border-slate-900 overflow-hidden relative min-h-[880px]'
              : 'w-full'
          }`}
        >
          {/* Dynamic Island for Mobile Mockup Frame */}
          {isPhoneFrame && (
            <div className="w-full flex justify-center pt-2 pb-1 bg-white relative z-40">
              <div className="w-28 h-5 bg-black rounded-full shadow-inner flex items-center justify-end px-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 1: HIGH DENSITY HOME DASHBOARD                                        */}
          {/* ========================================================================= */}
          {activeTab === 'home' && (
            <div className="p-4 sm:p-5 lg:p-6 flex flex-col xl:flex-row gap-5 pb-24 md:pb-6 animate-fade-in">
              {/* Left & Center Main Dashboard Area (2-Column Flex) */}
              <div className="flex-[2] flex flex-col gap-4 min-w-0">
                {/* High Density Interactive Campus Blueprint Overview Card */}
                <div className="bg-slate-100 rounded-2xl relative border border-slate-200 shadow-xs overflow-hidden min-h-[240px] max-h-[340px] flex flex-col justify-between p-4 group">
                  {/* Subtle Grid Dot Matrix Background */}
                  <div
                    className="absolute inset-0 opacity-5 pointer-events-none"
                    style={{
                      backgroundImage: 'radial-gradient(#2A2C5C 1px, transparent 1px)',
                      backgroundSize: '20px 20px',
                    }}
                  />

                  {/* Campus Blueprint Markers */}
                  <div
                    onClick={() => {
                      setFocusedBuildingId('bld-science');
                      setActiveTab('map');
                    }}
                    className="absolute top-8 left-12 sm:left-20 px-3 py-1.5 bg-white/90 hover:bg-white border border-slate-200 rounded-lg flex items-center justify-center font-medium text-xs text-slate-700 transform -rotate-6 shadow-xs hover:scale-105 transition-all cursor-pointer z-10"
                  >
                    Science Block
                  </div>

                  <div
                    onClick={() => {
                      setFocusedBuildingId('bld-library');
                      setActiveTab('map');
                    }}
                    className="absolute top-24 sm:top-14 right-10 sm:right-24 px-3 py-1.5 bg-[#2A2C5C]/10 hover:bg-[#2A2C5C]/20 border border-[#2A2C5C]/30 rounded-lg flex items-center justify-center font-medium text-xs text-[#2A2C5C] transform rotate-3 shadow-xs hover:scale-105 transition-all cursor-pointer z-10"
                  >
                    Main Library
                  </div>

                  <div
                    onClick={() => {
                      setFocusedBuildingId('bld-eng');
                      setActiveTab('map');
                    }}
                    className="absolute bottom-12 left-1/3 px-3 py-1.5 bg-white/90 hover:bg-white border border-slate-200 rounded-lg flex items-center justify-center font-medium text-xs text-slate-800 shadow-xs hover:scale-105 transition-all cursor-pointer z-10"
                  >
                    Engineering Wing C
                  </div>

                  {/* Top-Left Legend Overlay */}
                  <div className="bg-white/90 backdrop-blur-xs p-2 rounded-lg text-[10px] font-medium space-y-1 z-10 w-fit border border-slate-200 shadow-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#2A2C5C] rounded-xs" />
                      <span>My Location (Fresher Hub)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-amber-400 rounded-xs" />
                      <span>Next Class: Room 204</span>
                    </div>
                  </div>

                  {/* Bottom Controls Overlay */}
                  <div className="flex items-center justify-between z-10 pt-8">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setMapMode('3d');
                          setActiveTab('map');
                        }}
                        className="bg-[#2A2C5C] hover:bg-[#1E2045] text-white font-medium text-xs px-3.5 py-1.5 rounded-lg shadow-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Explore 3D Orbit Map</span>
                      </button>
                      <button
                        onClick={() => {
                          setMapMode('2d');
                          setActiveTab('map');
                        }}
                        className="bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                      >
                        <Layers className="w-3.5 h-3.5 text-slate-500" />
                        <span>2D Floor Plans</span>
                      </button>
                    </div>

                    {/* Zoom Buttons */}
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setActiveTab('map')}
                        className="w-7 h-7 bg-white hover:bg-slate-100 rounded-lg flex items-center justify-center font-bold text-xs text-slate-700 border border-slate-200 active:scale-95 shadow-xs cursor-pointer"
                        title="Zoom In / Open Map"
                      >
                        +
                      </button>
                      <button
                        onClick={() => setActiveTab('map')}
                        className="w-7 h-7 bg-white hover:bg-slate-100 rounded-lg flex items-center justify-center font-bold text-xs text-slate-700 border border-slate-200 active:scale-95 shadow-xs cursor-pointer"
                        title="Zoom Out / Open Map"
                      >
                        -
                      </button>
                    </div>
                  </div>
                </div>

                {/* Split Row: Event Schedule & Services & Onboarding */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Event Schedule Card */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-xs uppercase tracking-wider text-slate-400">
                        Event Schedule
                      </h3>
                      <button
                        onClick={() => setActiveTab('events')}
                        className="text-[10px] text-[#2A2C5C] font-semibold hover:underline cursor-pointer"
                      >
                        VIEW ALL
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {/* Event 1 */}
                      <div
                        onClick={() => {
                          setSelectedEventId(CAMPUS_EVENTS[0]?.id || null);
                          setIsWorkshopOpen(true);
                        }}
                        className="flex items-center gap-3 p-1.5 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
                      >
                        <div className="w-10 h-10 bg-[#2A2C5C]/10 text-[#2A2C5C] rounded-lg flex flex-col items-center justify-center shrink-0 font-sans">
                          <span className="text-[9px] font-bold leading-none">SEP</span>
                          <span className="text-sm font-black leading-none mt-0.5">24</span>
                        </div>
                        <div className="overflow-hidden flex-1">
                          <p className="text-xs font-semibold text-slate-800 truncate">
                            AI Ethics Workshop - Auditorium A
                          </p>
                          <p className="text-[10px] text-slate-500 font-medium">
                            02:00 PM • Registration Open
                          </p>
                        </div>
                      </div>

                      {/* Event 2 */}
                      <div
                        onClick={() => {
                          setSelectedEventId(CAMPUS_EVENTS[1]?.id || null);
                          setIsWorkshopOpen(true);
                        }}
                        className="flex items-center gap-3 p-1.5 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
                      >
                        <div className="w-10 h-10 bg-slate-100 text-slate-700 rounded-lg flex flex-col items-center justify-center shrink-0 font-sans">
                          <span className="text-[9px] font-bold leading-none">SEP</span>
                          <span className="text-sm font-black leading-none mt-0.5">25</span>
                        </div>
                        <div className="overflow-hidden flex-1">
                          <p className="text-xs font-semibold text-slate-800 truncate">
                            Fresher Networking Night
                          </p>
                          <p className="text-[10px] text-slate-500 font-medium">
                            06:30 PM • Student Union
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Services & Onboarding 4-box Card */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-xs uppercase tracking-wider text-slate-400">
                        Services & Onboarding
                      </h3>
                      <button
                        onClick={() => setActiveTab('services')}
                        className="text-[10px] text-[#2A2C5C] font-semibold hover:underline cursor-pointer"
                      >
                        HUB
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div
                        onClick={() => setIsHostelOpen(true)}
                        className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex flex-col items-center gap-1 cursor-pointer hover:bg-[#2A2C5C]/5 hover:border-[#2A2C5C]/20 transition-all group"
                      >
                        <span className="text-base group-hover:scale-105 transition-transform">🏠</span>
                        <span className="text-[10px] font-medium text-slate-700 group-hover:text-[#2A2C5C]">
                          Hostel
                        </span>
                      </div>
                      <div
                        onClick={() => setIsBusOpen(true)}
                        className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex flex-col items-center gap-1 cursor-pointer hover:bg-[#2A2C5C]/5 hover:border-[#2A2C5C]/20 transition-all group"
                      >
                        <span className="text-base group-hover:scale-105 transition-transform">🚌</span>
                        <span className="text-[10px] font-medium text-slate-700 group-hover:text-[#2A2C5C]">
                          Bus Reg
                        </span>
                      </div>
                      <div
                        onClick={() => setIsWorkshopOpen(true)}
                        className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex flex-col items-center gap-1 cursor-pointer hover:bg-[#2A2C5C]/5 hover:border-[#2A2C5C]/20 transition-all group"
                      >
                        <span className="text-base group-hover:scale-105 transition-transform">💼</span>
                        <span className="text-[10px] font-medium text-slate-700 group-hover:text-[#2A2C5C]">
                          Workshop
                        </span>
                      </div>
                      <div
                        onClick={() => setIsHelpOpen(true)}
                        className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex flex-col items-center gap-1 cursor-pointer hover:bg-[#2A2C5C]/5 hover:border-[#2A2C5C]/20 transition-all group"
                      >
                        <span className="text-base group-hover:scale-105 transition-transform">📄</span>
                        <span className="text-[10px] font-medium text-slate-700 group-hover:text-[#2A2C5C]">
                          Forms
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Action Bar */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-xs uppercase tracking-wider text-slate-400">
                      Quick Action Shortcuts
                    </h3>
                    <button
                      onClick={() => setIsHelpOpen(true)}
                      className="text-[10px] text-[#2A2C5C] font-semibold hover:underline"
                    >
                      See All
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {/* Bus Service */}
                    <button
                      id="quick-action-bus"
                      onClick={() => setIsBusOpen(true)}
                      className="bg-[#2A2C5C] hover:bg-[#1E2045] text-white p-3 rounded-xl shadow-xs transition-all active:scale-95 flex flex-col items-center justify-center text-center space-y-1.5 group cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Bus className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold">Bus Service</h4>
                        <p className="text-[10px] text-slate-300">Pass & Routes</p>
                      </div>
                    </button>

                    {/* Admission */}
                    <button
                      id="quick-action-admission"
                      onClick={() => setIsProfileOpen(true)}
                      className="bg-slate-800 hover:bg-slate-900 text-white p-3 rounded-xl shadow-xs transition-all active:scale-95 flex flex-col items-center justify-center text-center space-y-1.5 group cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <GraduationCap className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold">Admission</h4>
                        <p className="text-[10px] text-slate-300">ID & Status</p>
                      </div>
                    </button>

                    {/* Hostel */}
                    <button
                      id="quick-action-hostel"
                      onClick={() => setIsHostelOpen(true)}
                      className="bg-slate-800 hover:bg-slate-900 text-white p-3 rounded-xl shadow-xs transition-all active:scale-95 flex flex-col items-center justify-center text-center space-y-1.5 group cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Bed className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold">Hostel</h4>
                        <p className="text-[10px] text-slate-300">Room Info</p>
                      </div>
                    </button>

                    {/* Library */}
                    <button
                      id="quick-action-library"
                      onClick={() => setIsLibraryOpen(true)}
                      className="bg-slate-800 hover:bg-slate-900 text-white p-3 rounded-xl shadow-xs transition-all active:scale-95 flex flex-col items-center justify-center text-center space-y-1.5 group cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <BookOpen className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold">Library</h4>
                        <p className="text-[10px] text-slate-300">Book Search</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Canteens & Dining Cards */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-xs uppercase tracking-wider text-slate-400">
                      Campus Dining & Cafes
                    </h3>
                    <button
                      onClick={() => {
                        setSelectedCanteenId(null);
                        setIsCanteenOpen(true);
                      }}
                      className="text-[10px] text-[#2A2C5C] font-semibold hover:underline"
                    >
                      See All Menus
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {CANTEENS_DATA.slice(0, 2).map((canteen) => (
                      <div
                        key={canteen.id}
                        onClick={() => handleOpenCanteen(canteen.id)}
                        className="relative rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer h-28 border border-slate-200 group"
                      >
                        <img
                          src={canteen.image}
                          alt={canteen.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-3 text-white">
                          <h4 className="text-xs sm:text-sm font-bold tracking-wide">
                            {canteen.name}
                          </h4>
                          <div className="flex items-center justify-between text-[10px] text-slate-200 mt-0.5">
                            <span>{canteen.location}</span>
                            <span className="font-bold text-amber-300">★ {canteen.rating}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Aside Sidebar Area (Live Bus Timings & Canteen Status) */}
              <aside className="w-full xl:w-72 2xl:w-80 flex flex-col gap-4 shrink-0">
                {/* Live Bus Timings Widget */}
                <div className="bg-[#2A2C5C] text-white p-4 rounded-2xl shadow-xs border border-[#2A2C5C] shrink-0">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Live Bus Timings
                    </h3>
                    <button
                      onClick={() => setIsBusOpen(true)}
                      className="text-[10px] text-slate-300 hover:text-white font-medium underline"
                    >
                      All Routes
                    </button>
                  </div>
                  <div className="space-y-2.5">
                    <div
                      onClick={() => setIsBusOpen(true)}
                      className="flex items-center justify-between border-b border-white/10 pb-2.5 cursor-pointer hover:bg-white/5 p-1 rounded-lg transition-colors"
                    >
                      <div>
                        <p className="text-xs font-semibold">Route 101 - North Campus</p>
                        <p className="text-[10px] text-slate-300">Arriving at Central Station</p>
                      </div>
                      <span className="bg-emerald-600 text-[10px] px-2 py-0.5 rounded-md font-bold text-white shrink-0">
                        3 MIN
                      </span>
                    </div>

                    <div
                      onClick={() => setIsBusOpen(true)}
                      className="flex items-center justify-between border-b border-white/10 pb-2.5 cursor-pointer hover:bg-white/5 p-1 rounded-lg transition-colors"
                    >
                      <div>
                        <p className="text-xs font-semibold">Route 404 - Hostel Block</p>
                        <p className="text-[10px] text-slate-300">Leaving from South Gate</p>
                      </div>
                      <span className="bg-amber-600 text-[10px] px-2 py-0.5 rounded-md font-bold text-white shrink-0">
                        12 MIN
                      </span>
                    </div>

                    <div
                      onClick={() => setIsBusOpen(true)}
                      className="flex items-center justify-between cursor-pointer hover:bg-white/5 p-1 rounded-lg transition-colors"
                    >
                      <div>
                        <p className="text-xs font-semibold">Route 002 - City Shuttle</p>
                        <p className="text-[10px] text-slate-300">Express Service</p>
                      </div>
                      <span className="bg-slate-600 text-[10px] px-2 py-0.5 rounded-md font-bold text-white shrink-0">
                        DELAY
                      </span>
                    </div>
                  </div>
                </div>

                {/* Canteen Status Widget */}
                <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col shadow-xs gap-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Canteen Status
                    </h3>
                    <button
                      onClick={() => {
                        setSelectedCanteenId(null);
                        setIsCanteenOpen(true);
                      }}
                      className="text-[10px] text-[#2A2C5C] font-semibold hover:underline"
                    >
                      View
                    </button>
                  </div>

                  <div className="space-y-3">
                    {/* North Hall Canteen */}
                    <div
                      onClick={() => handleOpenCanteen('canteen-unique')}
                      className="p-3 bg-slate-50 hover:bg-[#2A2C5C]/5 rounded-xl border border-slate-100 cursor-pointer transition-colors"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-semibold text-slate-800">North Hall Canteen</span>
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          OPEN
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 mb-2">Wait time: ~5 mins</p>
                      <div className="flex gap-1.5 flex-wrap">
                        <span className="bg-white px-2 py-0.5 rounded text-[9px] border border-slate-200 font-medium text-slate-700">
                          Today: Pasta Bar
                        </span>
                        <span className="bg-white px-2 py-0.5 rounded text-[9px] border border-slate-200 font-bold text-emerald-700">
                          $4.50
                        </span>
                      </div>
                    </div>

                    {/* The Brew Station */}
                    <div
                      onClick={() => handleOpenCanteen('canteen-sky')}
                      className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-100 cursor-pointer transition-colors"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-semibold text-slate-800">The Brew Station</span>
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                          CLOSED
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500">Opens at 04:00 PM</p>
                    </div>

                    {/* Campus News Banner */}
                    <div
                      onClick={() => setIsNewsOpen(true)}
                      className="bg-[#2A2C5C] hover:bg-[#1E2045] text-white p-3 rounded-xl shadow-xs cursor-pointer transition-colors mt-2"
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-tight text-slate-300 mb-1 flex items-center gap-1">
                        <Newspaper className="w-3 h-3" />
                        <span>Campus News</span>
                      </p>
                      <p className="text-xs font-medium italic leading-snug">
                        &ldquo;New Wi-Fi infrastructure rollout in Library Wing B starting tomorrow.&rdquo;
                      </p>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: INTERACTIVE 3D & 2D CAMPUS MAP & CLASSROOM DISCOVERY               */}
          {/* ========================================================================= */}
          {activeTab === 'map' && (
            <div className="p-4 sm:p-5 lg:p-6 space-y-5 pb-24 md:pb-6 animate-fade-in">
              {/* Header with 3D/2D toggle */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base md:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Compass className="w-5 h-5 text-[#2A2C5C]" />
                    Campus Interactive Navigation
                  </h2>
                  <p className="text-xs text-slate-500">
                    Switch between 3D Spatial Orbit & 2D Architectural Floor Blueprints
                  </p>
                </div>

                {/* Mode Toggle Pills */}
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                  <button
                    id="btn-switch-3d"
                    onClick={() => setMapMode('3d')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                      mapMode === '3d'
                        ? 'bg-[#2A2C5C] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>3D Orbit Map</span>
                  </button>
                  <button
                    id="btn-switch-2d"
                    onClick={() => setMapMode('2d')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                      mapMode === '2d'
                        ? 'bg-[#2A2C5C] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>2D Blueprint</span>
                  </button>
                </div>
              </div>

              {/* Render 3D or 2D Map */}
              {mapMode === '3d' ? (
                <CampusMap3D
                  selectedBuildingId={focusedBuildingId}
                  onSelectBuilding={(bld) => setFocusedBuildingId(bld.id)}
                  targetClassroom={navTargetRoom}
                  onNavigateToRoom={(room) => handleNavigateToRoom(room)}
                />
              ) : (
                <CampusMap2D
                  onSelectBuilding={(bld) => setFocusedBuildingId(bld.id)}
                  onNavigateToRoom={(room) => handleNavigateToRoom(room)}
                />
              )}

              {/* Embedded Live Classroom Finder */}
              <ClassroomFinder
                onNavigateToRoom={(room, bld) => handleNavigateToRoom(room, bld)}
              />
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: SERVICES HUB (Bus, Hostel, Library, Canteen, Admission, Help Desk) */}
          {/* ========================================================================= */}
          {activeTab === 'services' && (
            <div className="p-4 sm:p-5 lg:p-6 space-y-5 pb-24 md:pb-6 animate-fade-in">
              <div className="bg-[#2A2C5C] text-white rounded-2xl p-5 shadow-xs border border-[#2A2C5C]">
                <h2 className="text-base md:text-lg font-bold">Campus Services & Onboarding</h2>
                <p className="text-xs text-slate-300 mt-1">
                  One-stop access to transport, accommodation, books, dining & administrative support
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* Bus Card */}
                <div
                  onClick={() => setIsBusOpen(true)}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-[#2A2C5C]/40 p-4 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-3 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#2A2C5C]/10 text-[#2A2C5C] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Bus className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Bus Transit & Pass</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Live timings, 24 routes, driver tracker & digital transport ID
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-[#2A2C5C] flex items-center gap-1">
                    Manage Transport →
                  </span>
                </div>

                {/* Hostel Card */}
                <div
                  onClick={() => setIsHostelOpen(true)}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-[#2A2C5C]/40 p-4 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-3 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#2A2C5C]/10 text-[#2A2C5C] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Bed className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Hostel & Housing</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Room allotment, warden hotline, maintenance & e-gate pass
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-[#2A2C5C] flex items-center gap-1">
                    Hostel Services →
                  </span>
                </div>

                {/* Library Card */}
                <div
                  onClick={() => setIsLibraryOpen(true)}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-[#2A2C5C]/40 p-4 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-3 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#2A2C5C]/10 text-[#2A2C5C] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Central Library</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Book catalog, digital borrowing, quiet study pods & IEEE papers
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-[#2A2C5C] flex items-center gap-1">
                    Search Catalog →
                  </span>
                </div>

                {/* Canteens Card */}
                <div
                  onClick={() => setIsCanteenOpen(true)}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-[#2A2C5C]/40 p-4 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-3 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Utensils className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Canteens & Menus</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      UNIQUE Canteen, SKY Cafe, crowd meter & quick order tokens
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-[#2A2C5C] flex items-center gap-1">
                    View Menus →
                  </span>
                </div>

                {/* Workshops & Events */}
                <div
                  onClick={() => setIsWorkshopOpen(true)}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-[#2A2C5C]/40 p-4 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-3 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#2A2C5C]/10 text-[#2A2C5C] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Workshops & Events</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Sports meet registration, coding bootcamps & art workshops
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-[#2A2C5C] flex items-center gap-1">
                    Register Events →
                  </span>
                </div>

                {/* Help & Support */}
                <div
                  onClick={() => setIsHelpOpen(true)}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-[#2A2C5C]/40 p-4 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-3 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <LifeBuoy className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Help Desk & SOS</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Fresher induction checklist, 24/7 security & WiFi setup
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-[#2A2C5C] flex items-center gap-1">
                    Get Support →
                  </span>
                </div>
              </div>

              {/* Quick Classroom Lookup inside services */}
              <ClassroomFinder
                onNavigateToRoom={(room, bld) => handleNavigateToRoom(room, bld)}
              />
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: EVENTS & WORKSHOPS                                                 */}
          {/* ========================================================================= */}
          {activeTab === 'events' && (
            <div className="p-4 sm:p-5 lg:p-6 space-y-5 pb-24 md:pb-6 animate-fade-in">
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <h2 className="text-base md:text-lg font-bold text-slate-900">
                    Campus Events & Workshops
                  </h2>
                  <p className="text-xs text-slate-500">
                    Register for hackathons, sports meet, and cultural nights
                  </p>
                </div>
                <button
                  onClick={() => setIsWorkshopOpen(true)}
                  className="bg-[#2A2C5C] text-white px-3.5 py-2 rounded-xl text-xs font-semibold hover:bg-[#1E2045] transition-colors shadow-xs cursor-pointer"
                >
                  Open Registration
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CAMPUS_EVENTS.map((evt) => (
                  <div
                    key={evt.id}
                    onClick={() => handleOpenEvent(evt.id)}
                    className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden cursor-pointer flex flex-col justify-between group"
                  >
                    <div className="relative h-44">
                      <img
                        src={evt.image}
                        alt={evt.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-3 left-3 bg-[#2A2C5C] text-white text-[10px] font-semibold uppercase px-2.5 py-1 rounded-md shadow-xs">
                        {evt.category}
                      </span>
                    </div>

                    <div className="p-4 space-y-2">
                      <h3 className="text-sm font-semibold text-slate-900 group-hover:text-[#2A2C5C] transition-colors">
                        {evt.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2">{evt.description}</p>
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                        <span className="font-medium">{evt.date}</span>
                        <strong className="text-emerald-700 font-semibold">{evt.fee}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: PROFILE & DIGITAL IDENTITY                                         */}
          {/* ========================================================================= */}
          {activeTab === 'profile' && (
            <div className="p-4 sm:p-5 lg:p-6 space-y-5 pb-24 md:pb-6 animate-fade-in">
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#2A2C5C] text-white flex items-center justify-center font-bold text-lg shadow-xs">
                    UD
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{student.name}</h3>
                    <p className="text-xs text-slate-500">
                      {student.program} • {student.rollNo}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsProfileOpen(true)}
                  className="bg-[#2A2C5C]/10 text-[#2A2C5C] border border-[#2A2C5C]/20 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#2A2C5C]/15 transition-colors cursor-pointer"
                >
                  Digital Card View
                </button>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                    Attendance
                  </span>
                  <span className="text-base font-bold text-emerald-700">{student.attendance}%</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                    Hostel Room
                  </span>
                  <span className="text-base font-bold text-slate-900">{student.hostelRoom}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                    Bus Pass
                  </span>
                  <span className="text-base font-bold text-[#2A2C5C]">Active</span>
                </div>
              </div>

              {/* Profile Action List */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs divide-y divide-slate-100 text-xs md:text-sm">
                <button
                  onClick={() => setIsBusOpen(true)}
                  className="w-full p-4 text-left flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Bus className="w-4 h-4 text-[#2A2C5C]" />
                    <span className="font-semibold text-slate-800">
                      My Bus Pass & Transit Route
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
                <button
                  onClick={() => setIsHostelOpen(true)}
                  className="w-full p-4 text-left flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Bed className="w-4 h-4 text-[#2A2C5C]" />
                    <span className="font-semibold text-slate-800">
                      Hostel Residency & Gate Pass
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
                <button
                  onClick={() => setIsLibraryOpen(true)}
                  className="w-full p-4 text-left flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4 text-[#2A2C5C]" />
                    <span className="font-semibold text-slate-800">
                      Library Due Books & Borrowings
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
                <button
                  onClick={() => setIsHelpOpen(true)}
                  className="w-full p-4 text-left flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <LifeBuoy className="w-4 h-4 text-[#2A2C5C]" />
                    <span className="font-semibold text-slate-800">
                      Fresher Induction Checklist
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
          )}

          {/* Bottom Navigation Bar (Visible on mobile screens or in Phone Frame mockup mode) */}
          <div className={isPhoneFrame ? 'block' : 'md:hidden'}>
            <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* GLOBAL POPUP MODALS                                                       */}
      {/* ========================================================================= */}
      <NotificationsModal
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        onOpenLibrary={() => {
          setIsNotifOpen(false);
          setIsLibraryOpen(true);
        }}
        onOpenEvents={() => {
          setIsNotifOpen(false);
          setIsWorkshopOpen(true);
        }}
      />

      <BusServiceModal
        student={student}
        isOpen={isBusOpen}
        onClose={() => setIsBusOpen(false)}
        onRegisteredPass={(newPass) => {
          setStudent((s) => ({ ...s, busPassNumber: newPass }));
        }}
      />

      <CanteenModal
        isOpen={isCanteenOpen}
        onClose={() => setIsCanteenOpen(false)}
        selectedCanteenId={selectedCanteenId}
      />

      <HostelModal
        student={student}
        isOpen={isHostelOpen}
        onClose={() => setIsHostelOpen(false)}
      />

      <LibraryModal
        student={student}
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
      />

      <WorkshopModal
        student={student}
        isOpen={isWorkshopOpen}
        onClose={() => setIsWorkshopOpen(false)}
        initialEventId={selectedEventId}
      />

      <NewsModal
        isOpen={isNewsOpen}
        onClose={() => setIsNewsOpen(false)}
        initialNewsId={selectedNewsId}
      />

      <HelpSupportModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        onOpenBusService={() => {
          setIsHelpOpen(false);
          setIsBusOpen(true);
        }}
      />

      <StudentProfileModal
        student={student}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onOpenBusService={() => {
          setIsProfileOpen(false);
          setIsBusOpen(true);
        }}
        onOpenHostel={() => {
          setIsProfileOpen(false);
          setIsHostelOpen(true);
        }}
        onOpenLibrary={() => {
          setIsProfileOpen(false);
          setIsLibraryOpen(true);
        }}
      />
    </div>
  );
}
