import React from 'react';
import { TabType } from '../types';
import { Home, Compass, Grid, User, Calendar, Sparkles } from 'lucide-react';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home' as TabType, label: 'Home', icon: Home },
    { id: 'map' as TabType, label: 'Explore Map', icon: Compass },
    { id: 'services' as TabType, label: 'Services', icon: Grid },
    { id: 'events' as TabType, label: 'Events & Workshops', icon: Calendar },
    { id: 'profile' as TabType, label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 shadow-lg select-none">
      <div className="max-w-md md:max-w-xl mx-auto px-4 py-2 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

            return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all relative ${
                isActive
                  ? 'text-blue-600 font-bold'
                  : 'text-slate-400 hover:text-slate-600 font-medium'
              }`}
            >
              {isActive && (
                <span className="absolute -top-2 w-8 h-1 bg-blue-600 rounded-full shadow-sm" />
              )}
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive ? 'bg-blue-50 text-blue-600 scale-110' : ''
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight font-semibold">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
