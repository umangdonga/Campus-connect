import React from 'react';
import { Compass, Bus, Utensils, BookOpen, ChevronRight } from 'lucide-react';

interface SplashOnboardingProps {
  onEnterApp: () => void;
}

export const SplashOnboarding: React.FC<SplashOnboardingProps> = ({ onEnterApp }) => {
  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col justify-between items-center px-6 py-10 relative overflow-hidden select-none">
      {/* Subtle geometric background accents */}
      <div className="absolute -top-16 -left-16 w-44 h-44 bg-[#2A2C5C]/5 rounded-3xl transform -rotate-12 pointer-events-none" />
      <div className="absolute -top-12 right-0 w-48 h-48 bg-[#2A2C5C]/5 rounded-3xl transform rotate-45 pointer-events-none" />

      {/* Center Hero Content */}
      <div className="my-auto flex flex-col items-center text-center max-w-sm z-10 space-y-6 pt-8">
        {/* Minimal Brand Monogram Emblem */}
        <div className="w-20 h-20 rounded-2xl bg-[#2A2C5C] text-white flex items-center justify-center font-bold text-3xl shadow-sm tracking-tight">
          CC
        </div>

        {/* Brand Name Typography */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2A2C5C] tracking-tight">
            Campus Connect
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Smart Campus Navigation & Student Services
          </p>
        </div>

        {/* Taglines */}
        <p className="text-xs text-slate-600 max-w-xs leading-relaxed">
          Navigate 2D & 3D buildings, live classroom availability, bus passes, hostel requests, and canteen menus in one unified portal.
        </p>

        {/* Value Prop Chips */}
        <div className="grid grid-cols-2 gap-2 pt-1 text-left w-full">
          <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 flex items-center gap-2 shadow-xs">
            <Compass className="w-4 h-4 text-[#2A2C5C] shrink-0" />
            <span className="text-xs font-medium text-slate-700">3D/2D Maps</span>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 flex items-center gap-2 shadow-xs">
            <Bus className="w-4 h-4 text-[#2A2C5C] shrink-0" />
            <span className="text-xs font-medium text-slate-700">Bus Timings</span>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 flex items-center gap-2 shadow-xs">
            <Utensils className="w-4 h-4 text-[#2A2C5C] shrink-0" />
            <span className="text-xs font-medium text-slate-700">Dining Menus</span>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 flex items-center gap-2 shadow-xs">
            <BookOpen className="w-4 h-4 text-[#2A2C5C] shrink-0" />
            <span className="text-xs font-medium text-slate-700">Rooms & Library</span>
          </div>
        </div>

        {/* CTA Button */}
        <button
          id="btn-enter-campus-app"
          onClick={onEnterApp}
          className="w-full bg-[#2A2C5C] hover:bg-[#1E2045] text-white font-medium py-3 px-6 rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all active:scale-98 group cursor-pointer"
        >
          <span>Enter Campus Hub</span>
          <ChevronRight className="w-4 h-4 text-white/80 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Footer minimal info */}
      <div className="text-[11px] text-slate-400 text-center font-medium">
        Designed for University Freshers & Students • 2026 Academic Year
      </div>
    </div>
  );
};
