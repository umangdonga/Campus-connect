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
        <div className="p-4 md:p-6 bg-gradient-to-r from-[#134F73] via-[#263D88] to-[#1e3a8a] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center font-bold text-lg text-white border border-white/30 backdrop-blur-md">
              UD
            </div>
            <div>
              <h2 className="text-base md:text-lg font-bold">{student.name}</h2>
              <p className="text-xs text-sky-200">{student.program} • {student.rollNo}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 md:p-6 overflow-y-auto flex-1 space-y-5">
          {/* Digital Student Identity Card */}
          <div className="bg-gradient-to-br from-[#134F73] via-[#103b56] to-[#0f172a] text-white rounded-3xl p-5 md:p-6 shadow-xl relative overflow-hidden border border-sky-400/30">
            {/* Watermark shape */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#53AADF]/20 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-sky-300" />
                <span className="text-xs font-black tracking-widest uppercase text-sky-300">
                  UNIVERSITY STUDENT CARD
                </span>
              </div>
              <span className="text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                VALID 2026-2030
              </span>
            </div>

            <div className="my-4 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-base md:text-lg font-bold">{student.name}</p>
                <p className="text-xs text-sky-200 font-mono">Roll: {student.rollNo}</p>
                <p className="text-xs text-slate-300">{student.department}</p>
                <p className="text-[11px] text-sky-300">{student.email}</p>
              </div>

              {/* Barcode / QR */}
              <div className="bg-white p-2 rounded-2xl shadow-lg flex flex-col items-center shrink-0">
                <QrCode className="w-16 h-16 text-slate-900" />
                <span className="text-[8px] font-mono text-slate-600 mt-0.5 font-bold">RFID ACTIVE</span>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-sky-300 uppercase block">Semester</span>
                <strong className="font-semibold text-white">Sem 1 (Fresher)</strong>
              </div>
              <div>
                <span className="text-[10px] text-sky-300 uppercase block">Attendance</span>
                <strong className="font-semibold text-emerald-300">{student.attendance}%</strong>
              </div>
              <div>
                <span className="text-[10px] text-sky-300 uppercase block">Hostel Room</span>
                <strong className="font-semibold text-white">{student.hostelRoom}</strong>
              </div>
              <div>
                <span className="text-[10px] text-sky-300 uppercase block">Bus Pass #</span>
                <strong className="font-semibold text-white">{student.busPassNumber}</strong>
              </div>
            </div>
          </div>

          {/* Quick Service Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div
              onClick={onOpenBusService}
              className="bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-[#53AADF] p-3.5 rounded-2xl cursor-pointer transition-all space-y-1"
            >
              <div className="flex items-center justify-between">
                <Bus className="w-4 h-4 text-[#134F73]" />
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                  ACTIVE
                </span>
              </div>
              <div className="font-bold text-slate-900">Transit Pass</div>
              <div className="text-slate-500 text-[11px]">Route #04 (Central Express)</div>
            </div>

            <div
              onClick={onOpenHostel}
              className="bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-[#53AADF] p-3.5 rounded-2xl cursor-pointer transition-all space-y-1"
            >
              <div className="flex items-center justify-between">
                <Bed className="w-4 h-4 text-[#475A9A]" />
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                  ACTIVE
                </span>
              </div>
              <div className="font-bold text-slate-900">Hostel Residency</div>
              <div className="text-slate-500 text-[11px]">Block A • Room 304-B</div>
            </div>

            <div
              onClick={onOpenLibrary}
              className="bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-[#53AADF] p-3.5 rounded-2xl cursor-pointer transition-all space-y-1"
            >
              <div className="flex items-center justify-between">
                <BookOpen className="w-4 h-4 text-[#14B8A6]" />
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                  1 DUE
                </span>
              </div>
              <div className="font-bold text-slate-900">Library Account</div>
              <div className="text-slate-500 text-[11px]">ID: {student.libraryCardId}</div>
            </div>
          </div>

          {/* Enrolled Courses */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Enrolled Courses (Semester 1)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">CS402: Advanced Algorithms</div>
                  <div className="text-slate-500 text-[11px]">Tech Tower • TT-101</div>
                </div>
                <span className="font-bold text-[#134F73]">4 Credits</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">CS608: Neural Networks Lab</div>
                  <div className="text-slate-500 text-[11px]">Tech Tower • TT-301</div>
                </div>
                <span className="font-bold text-[#134F73]">3 Credits</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">ME201: Workshop Practice</div>
                  <div className="text-slate-500 text-[11px]">Mech Workshop • WS-01</div>
                </div>
                <span className="font-bold text-[#134F73]">2 Credits</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">MA101: Engineering Mathematics</div>
                  <div className="text-slate-500 text-[11px]">Admin Block • ADM-101</div>
                </div>
                <span className="font-bold text-[#134F73]">4 Credits</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
