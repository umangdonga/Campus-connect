import React from 'react';
import { StudentProfile } from '../types';
import { useAuth } from '../context/AuthContext';
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
  LogIn,
  LogOut,
} from 'lucide-react';

interface StudentProfileModalProps {
  student: StudentProfile;
  isOpen: boolean;
  onClose: () => void;
  onOpenBusService?: () => void;
  onOpenHostel?: () => void;
  onOpenLibrary?: () => void;
  onOpenAuth?: () => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  student,
  isOpen,
  onClose,
  onOpenBusService,
  onOpenHostel,
  onOpenLibrary,
  onOpenAuth,
}) => {
  const { user, signInWithGoogle, signOutUser } = useAuth();

  if (!isOpen) return null;

  const initials = student.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 md:p-5 bg-[#2A2C5C] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={student.name}
                className="w-10 h-10 rounded-xl object-cover border border-white/30 shadow-xs"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold text-base text-white border border-white/20">
                {initials || 'ST'}
              </div>
            )}
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-bold">{student.name}</h2>
                {user && (
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold px-1.5 py-0.2 rounded border border-emerald-400/30">
                    Google SSO
                  </span>
                )}
              </div>
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
          {/* Google SSO Status Banner */}
          {!user ? (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-800">Authenticate with Google ID</h4>
                  <p className="text-[11px] text-slate-500">Sync digital transit cards & academic pass records</p>
                </div>
              </div>
              <button
                onClick={() => {
                  if (onOpenAuth) onOpenAuth();
                  else signInWithGoogle();
                }}
                className="bg-[#2A2C5C] hover:bg-[#1E2045] text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all shadow-xs cursor-pointer shrink-0"
              >
                Sign In with Google
              </button>
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between gap-2 text-xs text-emerald-950">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="truncate">
                  Authenticated as <strong>{user.email}</strong>
                </span>
              </div>
              <button
                onClick={signOutUser}
                className="text-slate-500 hover:text-rose-600 font-semibold px-2 py-0.5 text-xs rounded hover:bg-white/80 transition-colors cursor-pointer shrink-0"
              >
                Sign Out
              </button>
            </div>
          )}

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
                <strong className="font-semibold text-white">{student.hostelRoom || '304-B'}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-300 uppercase block">Bus Pass #</span>
                <strong className="font-semibold text-white">{student.busPassNumber || 'BP-2026'}</strong>
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
              <div className="text-slate-500 text-[11px]">Block A • Room {student.hostelRoom || '304-B'}</div>
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

