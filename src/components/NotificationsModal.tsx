import React, { useState } from 'react';
import { NOTIFICATIONS_DATA } from '../data/campusData';
import { NotificationItem } from '../types';
import {
  ArrowLeft,
  GraduationCap,
  Clock,
  Club,
  Music,
  Bus,
  CheckCheck,
  Bell,
  Sparkles,
  Calendar,
} from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLibrary?: () => void;
  onOpenEvents?: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  onOpenLibrary,
  onOpenEvents,
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(NOTIFICATIONS_DATA);
  const [activeFilter, setActiveFilter] = useState<'All' | 'ACADEMIC UPDATES' | 'SOCIAL UPDATES'>('All');

  if (!isOpen) return null;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));
  };

  const getIcon = (type: NotificationItem['iconType']) => {
    switch (type) {
      case 'grade':
        return (
          <div className="w-10 h-10 rounded-2xl bg-[#DCFCE7] flex items-center justify-center text-[#15803D] shrink-0">
            <Clock className="w-5 h-5 fill-[#15803D] text-[#DCFCE7]" />
          </div>
        );
      case 'clock':
        return (
          <div className="w-10 h-10 rounded-2xl bg-[#FFEDD5] flex items-center justify-center text-[#C2410C] shrink-0">
            <Clock className="w-5 h-5 fill-[#EA580C] text-[#FFEDD5]" />
          </div>
        );
      case 'club':
        return (
          <div className="w-10 h-10 rounded-2xl bg-[#DBEAFE] flex items-center justify-center text-[#1D4ED8] shrink-0">
            <Club className="w-5 h-5 fill-[#2563EB] text-[#DBEAFE]" />
          </div>
        );
      case 'music':
        return (
          <div className="w-10 h-10 rounded-2xl bg-[#F3E8FF] flex items-center justify-center text-[#7E22CE] shrink-0">
            <Music className="w-5 h-5 fill-[#9333EA] text-[#F3E8FF]" />
          </div>
        );
      case 'bus':
      default:
        return (
          <div className="w-10 h-10 rounded-2xl bg-[#E0F2FE] flex items-center justify-center text-[#0369A1] shrink-0">
            <Bus className="w-5 h-5 text-[#0284C7]" />
          </div>
        );
    }
  };

  const academicList = notifications.filter(
    (n) => n.category === 'ACADEMIC UPDATES' && (activeFilter === 'All' || activeFilter === 'ACADEMIC UPDATES')
  );
  const socialList = notifications.filter(
    (n) => n.category === 'SOCIAL UPDATES' && (activeFilter === 'All' || activeFilter === 'SOCIAL UPDATES')
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header - Matching iPhone 14 & 15 Pro - 19.jpg */}
        <div className="p-4 md:p-5 flex items-center justify-between border-b border-slate-100 bg-white">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-[#134F73] text-white flex items-center justify-center hover:bg-[#0e3b56] transition-colors shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg md:text-xl font-bold text-slate-900">Notifications</h2>
          </div>

          <button
            onClick={markAllRead}
            className="text-xs font-semibold text-[#134F73] hover:text-[#53AADF] flex items-center gap-1 transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark all read</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-2 text-xs">
          {(['All', 'ACADEMIC UPDATES', 'SOCIAL UPDATES'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1 rounded-full font-bold transition-all ${
                activeFilter === filter
                  ? 'bg-[#134F73] text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {filter === 'All' ? 'All' : filter === 'ACADEMIC UPDATES' ? 'Academic' : 'Social & Events'}
            </button>
          ))}
        </div>

        {/* List Content */}
        <div className="p-4 md:p-5 overflow-y-auto flex-1 space-y-6">
          {/* Section 1: Academic Updates */}
          {academicList.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
                ACADEMIC UPDATES
              </h3>

              <div className="space-y-3">
                {academicList.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-4 border border-slate-100 hover:border-slate-300 shadow-sm transition-all flex items-start gap-3.5 relative group"
                  >
                    {getIcon(item.iconType)}

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-600">
                          {item.type}
                        </span>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                          <span>{item.timeAgo}</span>
                          {item.isUnread && (
                            <span className="w-2 h-2 rounded-full bg-[#53AADF] shrink-0" />
                          )}
                        </div>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 leading-snug">{item.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 2: Social Updates */}
          {socialList.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
                SOCIAL UPDATES
              </h3>

              <div className="space-y-3">
                {socialList.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-4 border border-slate-100 hover:border-slate-300 shadow-sm transition-all flex items-start gap-3.5 relative group"
                  >
                    {getIcon(item.iconType)}

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold tracking-wider uppercase text-blue-600">
                          {item.type}
                        </span>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                          <span>{item.timeAgo}</span>
                          {item.isUnread && (
                            <span className="w-2 h-2 rounded-full bg-[#53AADF] shrink-0" />
                          )}
                        </div>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 leading-snug">{item.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
