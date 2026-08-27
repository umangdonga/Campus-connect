import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { BUS_ROUTES } from '../data/campusData';
import { BusRoute, StudentProfile } from '../types';
import {
  Bus,
  Clock,
  MapPin,
  Phone,
  Users,
  ShieldCheck,
  QrCode,
  Calendar,
  CheckCircle2,
  AlertCircle,
  X,
  CreditCard,
  Download,
  Share2,
  Sparkles,
} from 'lucide-react';

interface BusServiceModalProps {
  student: StudentProfile;
  isOpen: boolean;
  onClose: () => void;
  onRegisteredPass?: (passNumber: string) => void;
}

export const BusServiceModal: React.FC<BusServiceModalProps> = ({
  student,
  isOpen,
  onClose,
  onRegisteredPass,
}) => {
  const [activeTab, setActiveTab] = useState<'routes' | 'register' | 'mypas'>('routes');
  const [selectedRoute, setSelectedRoute] = useState<BusRoute>(BUS_ROUTES[0]);
  const [pickupStop, setPickupStop] = useState<string>(BUS_ROUTES[0].via[0]);
  const [passType, setPassType] = useState<'Semester' | 'Annual'>('Semester');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [registeredPass, setRegisteredPass] = useState<{
    passId: string;
    route: string;
    stop: string;
    validUntil: string;
    qrData: string;
  } | null>({
    passId: student.busPassNumber || 'BP-2026-CS-892',
    route: 'Route #04 (Central Railway Station Express)',
    stop: 'Nehru Circle Gate',
    validUntil: 'June 30, 2027',
    qrData: `CAMPUS-PASS:${student.rollNo}:${student.busPassNumber}`,
  });

  if (!isOpen) return null;

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const newPassId = `BP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const passInfo = {
        passId: newPassId,
        route: `${selectedRoute.routeNumber} (${selectedRoute.name})`,
        stop: pickupStop,
        validUntil: passType === 'Semester' ? 'Dec 31, 2026' : 'June 30, 2027',
        qrData: `CAMPUS-PASS:${student.rollNo}:${newPassId}`,
      };
      setRegisteredPass(passInfo);
      setIsSubmitting(false);
      setActiveTab('mypas');
      onRegisteredPass?.(newPassId);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 md:p-5 bg-[#2A2C5C] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <Bus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-bold">Campus Bus Transit & Registration</h2>
              <p className="text-xs text-slate-200">
                Live bus schedules, route tracking & digital transport pass
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs Bar */}
        <div className="flex border-b border-slate-200 px-4 md:px-6 bg-slate-50 gap-3 text-xs md:text-sm font-semibold">
          <button
            onClick={() => setActiveTab('routes')}
            className={`py-3 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'routes'
                ? 'border-[#2A2C5C] text-[#2A2C5C]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Bus Routes & Timings</span>
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`py-3 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'register'
                ? 'border-[#2A2C5C] text-[#2A2C5C]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Apply / Register Pass</span>
          </button>
          <button
            onClick={() => setActiveTab('mypas')}
            className={`py-3 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'mypas'
                ? 'border-[#2A2C5C] text-[#2A2C5C]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>Digital ID Card</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 md:p-6 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: ROUTES & TIMINGS */}
          {activeTab === 'routes' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {BUS_ROUTES.map((route) => {
                  const isBoarding = route.status === 'Boarding';
                  const isDelayed = route.status.includes('Delayed');

                  return (
                    <div
                      key={route.id}
                      className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-[#2A2C5C]/40 transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#2A2C5C] bg-[#2A2C5C]/10 px-2 py-0.5 rounded-md">
                            {route.routeNumber}
                          </span>
                          <h4 className="text-sm font-semibold text-slate-900 mt-1">{route.name}</h4>
                        </div>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                            isBoarding
                              ? 'bg-emerald-100 text-emerald-800 animate-pulse'
                              : isDelayed
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {route.status}
                        </span>
                      </div>

                      {/* Stops list */}
                      <div className="bg-slate-50 p-2.5 rounded-lg text-xs space-y-1">
                        <div className="text-[10px] font-semibold text-slate-500 uppercase">Key Stops & Via:</div>
                        <p className="text-slate-700 font-medium">{route.via.join(' ➔ ')}</p>
                      </div>

                      {/* Timings */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-amber-50/70 p-2 rounded-lg border border-amber-100">
                          <span className="text-[10px] font-bold uppercase text-amber-800 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Morning Pickup
                          </span>
                          <p className="font-semibold text-slate-800 mt-0.5">{route.morningTimings.join(', ')}</p>
                        </div>
                        <div className="bg-indigo-50/70 p-2 rounded-lg border border-indigo-100">
                          <span className="text-[10px] font-bold uppercase text-indigo-800 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Evening Return
                          </span>
                          <p className="font-semibold text-slate-800 mt-0.5">{route.eveningTimings.join(', ')}</p>
                        </div>
                      </div>

                      {/* Driver info & Occupancy */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-[#2A2C5C]" /> {route.driverName} ({route.driverPhone})
                        </span>
                        <span className="font-medium text-slate-700">
                          {route.occupiedSeats}/{route.capacity} Seats
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-[#2A2C5C]" />
                  <div>
                    <h4 className="text-xs md:text-sm font-semibold text-slate-900">Freshers Transport Assistance</h4>
                    <p className="text-xs text-slate-600">
                      Need a temporary bus token before ID card verification? Stop by Terminal Bay 1 kiosk.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('register')}
                  className="bg-[#2A2C5C] text-white px-3.5 py-2 rounded-lg text-xs font-semibold hover:bg-[#1E2045] transition-colors shrink-0 shadow-xs cursor-pointer"
                >
                  Apply Pass
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: BUS PASS REGISTRATION */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4 max-w-xl mx-auto">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <h4 className="text-sm font-semibold text-[#2A2C5C]">Student Details (Auto-filled)</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[10px] uppercase font-semibold text-slate-400">Student Name</label>
                    <input
                      type="text"
                      disabled
                      value={student.name}
                      className="w-full mt-1 p-2 bg-white border border-slate-200 rounded-lg font-medium text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-semibold text-slate-400">Roll Number</label>
                    <input
                      type="text"
                      disabled
                      value={student.rollNo}
                      className="w-full mt-1 p-2 bg-white border border-slate-200 rounded-lg font-medium text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Route selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Select Transit Route</label>
                <select
                  value={selectedRoute.id}
                  onChange={(e) => {
                    const r = BUS_ROUTES.find((x) => x.id === e.target.value);
                    if (r) {
                      setSelectedRoute(r);
                      setPickupStop(r.via[0]);
                    }
                  }}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs md:text-sm font-medium text-slate-800 outline-none focus:border-[#2A2C5C]"
                >
                  {BUS_ROUTES.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.routeNumber} - {r.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pickup Stop */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Select Pickup & Drop Stop</label>
                <select
                  value={pickupStop}
                  onChange={(e) => setPickupStop(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs md:text-sm font-medium text-slate-800 outline-none focus:border-[#2A2C5C]"
                >
                  {selectedRoute.via.map((st, i) => (
                    <option key={i} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pass Validity Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Pass Duration</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPassType('Semester')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      passType === 'Semester'
                        ? 'border-[#2A2C5C] bg-[#2A2C5C]/5 text-[#2A2C5C] ring-1 ring-[#2A2C5C]'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    <div className="text-xs font-semibold">Semester Pass (6 Months)</div>
                    <div className="text-sm font-bold text-[#2A2C5C] mt-1">₹4,200</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPassType('Annual')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      passType === 'Annual'
                        ? 'border-[#2A2C5C] bg-[#2A2C5C]/5 text-[#2A2C5C] ring-1 ring-[#2A2C5C]'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    <div className="text-xs font-semibold">Annual Pass (1 Year)</div>
                    <div className="text-sm font-bold text-[#2A2C5C] mt-1">₹7,500 <span className="text-[10px] text-emerald-700 font-semibold">Save 10%</span></div>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#2A2C5C] hover:bg-[#1E2045] text-white font-semibold text-xs md:text-sm py-2.5 rounded-xl shadow-xs transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Generating Digital Pass...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Confirm & Generate Digital Bus Pass</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 3: DIGITAL BUS PASS CARD */}
          {activeTab === 'mypas' && registeredPass && (
            <div className="max-w-md mx-auto space-y-4">
              {/* Card */}
              <div className="bg-[#2A2C5C] text-white rounded-2xl p-5 shadow-sm relative overflow-hidden border border-[#2A2C5C]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                      <Bus className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-300">CAMPUS TRANSIT</span>
                      <h4 className="text-xs font-bold">Official Student Bus Pass</h4>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30">
                    ACTIVE
                  </span>
                </div>

                <div className="my-5 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-[11px] text-slate-300">Cardholder Name</p>
                    <p className="text-sm font-bold text-white">{student.name}</p>
                    <p className="text-xs text-slate-300 font-mono">Roll: {student.rollNo}</p>
                  </div>
                  {/* Digital QR Graphic */}
                  <div className="bg-white p-2 rounded-xl shadow-xs flex flex-col items-center">
                    <QrCode className="w-14 h-14 text-slate-900" />
                    <span className="text-[8px] font-mono text-slate-600 mt-0.5 font-bold">SCAN AT GATE</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-300">Route & Boarding Stop</span>
                    <p className="font-semibold text-white truncate">{registeredPass.stop}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-300">Pass Number / Expiry</span>
                    <p className="font-semibold text-white">{registeredPass.passId}</p>
                    <p className="text-[10px] text-emerald-300">{registeredPass.validUntil}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
