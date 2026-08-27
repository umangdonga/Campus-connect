import React from 'react';
import { Sparkles, Compass, MapPin, Bus, Utensils, BookOpen, ChevronRight, ShieldCheck } from 'lucide-react';

interface SplashOnboardingProps {
  onEnterApp: () => void;
}

export const SplashOnboarding: React.FC<SplashOnboardingProps> = ({ onEnterApp }) => {
  return (
    <div className="min-h-screen w-full bg-white flex flex-col justify-between items-center px-6 py-12 relative overflow-hidden select-none">
      {/* Top Floating Abstract Geometric Tiles (Matching iPhone 14 & 15 Pro - 62.png) */}
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-[#134F73] rounded-3xl transform -rotate-12 shadow-xl opacity-95 pointer-events-none" />
      <div className="absolute -top-10 right-0 w-52 h-52 bg-[#53AADF] rounded-3xl transform rotate-45 shadow-lg opacity-90 pointer-events-none" />

      {/* Center Hero Content */}
      <div className="my-auto flex flex-col items-center text-center max-w-sm z-10 space-y-6 pt-16">
        {/* Stylized Hexagon Shield Emblem */}
        <div className="relative w-36 h-36 flex items-center justify-center">
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
            <defs>
              <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#134F73" />
                <stop offset="100%" stopColor="#53AADF" />
              </linearGradient>
            </defs>

            {/* Geometric Cube / Shield Structure */}
            <polygon points="100,20 170,60 170,140 100,180 30,140 30,60" fill="#134F73" />
            <polygon points="100,20 170,60 100,100 30,60" fill="#53AADF" />
            <polygon points="100,100 170,60 170,140 100,180" fill="#37C3B3" opacity="0.9" />

            {/* Stylized "CC" lines */}
            <path
              d="M 60,65 L 95,95 L 140,55"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 65,85 L 95,115 L 135,75"
              fill="none"
              stroke="#E0F2FE"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Circular nodes */}
            <circle cx="65" cy="140" r="8" fill="#FFFFFF" />
            <circle cx="135" cy="140" r="8" fill="#FFFFFF" />
          </svg>
        </div>

        {/* Brand Name Typography */}
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-black text-[#134F73] tracking-widest uppercase">
            CAMPUS<span className="text-[#53AADF]">CONNECT</span>
          </h1>
          <p className="text-[11px] font-bold text-slate-400 tracking-[0.35em] uppercase">
            C O N N E C T
          </p>
        </div>

        {/* Taglines */}
        <div className="space-y-1 text-slate-700">
          <p className="text-base md:text-lg font-bold">Navigate your campus</p>
          <p className="text-sm text-slate-500 font-medium">Access everything in one place</p>
        </div>

        {/* Value Prop Chips */}
        <div className="grid grid-cols-2 gap-2 pt-2 text-left w-full">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#134F73] shrink-0" />
            <span className="text-xs font-semibold text-slate-700">3D/2D Navigation</span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-2">
            <Bus className="w-4 h-4 text-[#53AADF] shrink-0" />
            <span className="text-xs font-semibold text-slate-700">Bus Timings & Pass</span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-2">
            <Utensils className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="text-xs font-semibold text-slate-700">Canteens & Menus</span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-teal-600 shrink-0" />
            <span className="text-xs font-semibold text-slate-700">Classrooms & Library</span>
          </div>
        </div>

        {/* CTA Button */}
        <button
          id="btn-enter-campus-app"
          onClick={onEnterApp}
          className="w-full bg-[#134F73] hover:bg-[#0e3b56] text-white font-bold py-3.5 px-6 rounded-2xl shadow-xl shadow-[#134F73]/25 flex items-center justify-center gap-2 transition-all transform active:scale-95 group"
        >
          <span>Explore Campus</span>
          <ChevronRight className="w-5 h-5 text-[#53AADF] group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Bottom Floating Abstract Tiles (Matching iPhone 14 & 15 Pro - 62.png) */}
      <div className="absolute -bottom-14 -left-10 w-52 h-52 bg-[#53AADF] rounded-3xl transform rotate-45 shadow-lg opacity-90 pointer-events-none" />
      <div className="absolute -bottom-12 left-28 w-44 h-44 bg-[#134F73] rounded-3xl transform -rotate-12 shadow-xl opacity-95 pointer-events-none" />

      {/* Footer Text */}
      <div className="z-10 text-center pb-2 text-[11px] text-slate-400 font-medium">
        Designed for University Freshers & Students • 2026 Academic Year
      </div>
    </div>
  );
};
