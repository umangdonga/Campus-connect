import React from 'react';
import { StudentProfile } from '../types';
import {
  User,
  GraduationCap,
  Mail,
  ShieldCheck,
  QrCode,
  Bus,
  Bed,
  BookOpen,
  Award,
  Calendar,
  X,
  Sparkles,
  Download,
  Share2,
  CheckCircle2,
} from 'lucide-react';

interface StudentProfileModalProps {
  student: StudentProfile;
  isOpen: boolean;
  onClose: () => void;
  onOpenBusService?: () => void;
  onOpenHostel?: () => void;
  onOpenLibrary?: () => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  student,
  isOpen,
  onClose,
  onOpenBusService,
  onOpenHostel,
  onOpenLibrary,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 md:p-5 bg-[#2A2C5C] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold text-base text-white border border-white/20">
              UD
            </div>
            <div>
              <h2 className="text-base font-bold">{student.name}</h2>
              <p className="text-xs text-slate-200">{student.program} • {student.rollNo}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 md:p-6 overflow-y-auto flex-1 space-y-4">
          {/* Digital Student Identity Card */}
          <div className="bg-[#2A2C5C] text-white rounded-2xl p-4 md:p-5 shadow-xs relative overflow-hidden border border-[#2A2C5C]">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-slate-300" />
                <span className="text-[10px] font-bold tracking-widest uppercase text-slate-300">
                  UNIVERSITY STUDENT CARD
                </span>
              </div>
              <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30">
                VALID 2026-2030
              </span>
            </div>

            <div className="my-3.5 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <p className="text-base font-bold">{student.name}</p>
                <p className="text-xs text-slate-300 font-mono">Roll: {student.rollNo}</p>
                <p className="text-xs text-slate-300">{student.department}</p>
                <p className="text-[11px] text-slate-300">{student.email}</p>
              </div>

              {/* Barcode / QR */}
              <div className="bg-white p-2 rounded-xl shadow-xs flex flex-col items-center shrink-0">
                <QrCode className="w-14 h-14 text-slate-900" />
                <span className="text-[8px] font-mono text-slate-600 mt-0.5 font-bold">RFID ACTIVE</span>
              </div>
            </div>

            <div className="pt-2.5 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-slate-300 uppercase block">Semester</span>
                <strong className="font-semibold text-white">Sem 1 (Fresher)</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-300 uppercase block">Attendance</span>
                <strong className="font-semibold text-emerald-300">{student.attendance}%</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-300 uppercase block">Hostel Room</span>
                <strong className="font-semibold text-white">{student.hostelRoom}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-300 uppercase block">Bus Pass #</span>
                <strong className="font-semibold text-white">{student.busPassNumber}</strong>
              </div>
            </div>
          </div>

          {/* Quick Service Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div
              onClick={onOpenBusService}
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-[#2A2C5C]/40 p-3 rounded-xl cursor-pointer transition-all space-y-1"
            >
              <div className="flex items-center justify-between">
                <Bus className="w-4 h-4 text-[#2A2C5C]" />
                <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                  ACTIVE
                </span>
              </div>
              <div className="font-semibold text-slate-900">Transit Pass</div>
              <div className="text-slate-500 text-[11px]">Route #04 (Central Express)</div>
            </div>

            <div
              onClick={onOpenHostel}
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-[#2A2C5C]/40 p-3 rounded-xl cursor-pointer transition-all space-y-1"
            >
              <div className="flex items-center justify-between">
                <Bed className="w-4 h-4 text-[#2A2C5C]" />
                <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                  ACTIVE
                </span>
              </div>
              <div className="font-semibold text-slate-900">Hostel Residency</div>
              <div className="text-slate-500 text-[11px]">Block A • Room 304-B</div>
            </div>

            <div
              onClick={onOpenLibrary}
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-[#2A2C5C]/40 p-3 rounded-xl cursor-pointer transition-all space-y-1"
            >
              <div className="flex items-center justify-between">
                <BookOpen className="w-4 h-4 text-[#2A2C5C]" />
                <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                  1 DUE
                </span>
              </div>
              <div className="font-semibold text-slate-900">Library Account</div>
              <div className="text-slate-500 text-[11px]">ID: {student.libraryCardId}</div>
            </div>
          </div>

          {/* Enrolled Courses */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Enrolled Courses (Semester 1)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800">CS402: Advanced Algorithms</div>
                  <div className="text-slate-500 text-[11px]">Tech Tower • TT-101</div>
                </div>
                <span className="font-semibold text-[#2A2C5C]">4 Credits</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800">CS608: Neural Networks Lab</div>
                  <div className="text-slate-500 text-[11px]">Tech Tower • TT-301</div>
                </div>
                <span className="font-semibold text-[#2A2C5C]">3 Credits</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800">ME201: Workshop Practice</div>
                  <div className="text-slate-500 text-[11px]">Mech Workshop • WS-01</div>
                </div>
                <span className="font-semibold text-[#2A2C5C]">2 Credits</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800">MA101: Engineering Mathematics</div>
                  <div className="text-slate-500 text-[11px]">Admin Block • ADM-101</div>
                </div>
                <span className="font-semibold text-[#2A2C5C]">4 Credits</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
