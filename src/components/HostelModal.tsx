import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { HOSTEL_DATA } from '../data/campusData';
import { HostelRoom, StudentProfile } from '../types';
import {
  Bed,
  ShieldCheck,
  Phone,
  Clock,
  Key,
  Wrench,
  Utensils,
  CheckCircle2,
  AlertTriangle,
  X,
  FileText,
  Send,
  Sparkles,
} from 'lucide-react';

interface HostelModalProps {
  student: StudentProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const HostelModal: React.FC<HostelModalProps> = ({ student, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'maintenance' | 'gatepass'>('info');
  const [grievanceType, setGrievanceType] = useState('WiFi / Internet connectivity');
  const [roomDesc, setRoomDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);
  const [gatePassReason, setGatePassReason] = useState('Weekend Home Visit');
  const [gatePassGenerated, setGatePassGenerated] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleMaintenanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      const ticketId = `TKT-HST-${Math.floor(1000 + Math.random() * 9000)}`;
      setSubmittedTicket(ticketId);
      setIsSubmitting(false);
    }, 700);
  };

  const handleGatePassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      const passId = `GP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setGatePassGenerated(passId);
      setIsSubmitting(false);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 md:p-5 bg-[#2A2C5C] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <Bed className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-bold">Campus Hostel & Residence Hub</h2>
              <p className="text-xs text-slate-200">
                Room allotment, warden directory, maintenance helpdesk & e-gate pass
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

        {/* Tabs */}
        <div className="flex border-b border-slate-200 px-4 md:px-6 bg-slate-50 gap-3 text-xs md:text-sm font-semibold">
          <button
            onClick={() => setActiveTab('info')}
            className={`py-3 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'info'
                ? 'border-[#2A2C5C] text-[#2A2C5C]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Bed className="w-4 h-4" />
            <span>My Room & Blocks</span>
          </button>
          <button
            onClick={() => setActiveTab('maintenance')}
            className={`py-3 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'maintenance'
                ? 'border-[#2A2C5C] text-[#2A2C5C]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Room Maintenance Desk</span>
          </button>
          <button
            onClick={() => setActiveTab('gatepass')}
            className={`py-3 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'gatepass'
                ? 'border-[#2A2C5C] text-[#2A2C5C]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Digital Outing Gate Pass</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 md:p-6 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: ALLOTMENT & HOSTEL BLOCKS */}
          {activeTab === 'info' && (
            <div className="space-y-4">
              {/* Student's Current Room Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-[#2A2C5C] bg-[#2A2C5C]/10 px-2 py-0.5 rounded-md">
                    Active Allotment 2026-27
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    {student.hostelBlock} • Room {student.hostelRoom}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Bed 2 • North Wing 3rd Floor • High-Speed LAN Port #304-2
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right text-xs">
                    <span className="text-slate-500 text-[10px] block">Night Curfew</span>
                    <strong className="text-slate-800 font-bold">10:30 PM</strong>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                </div>
              </div>

              {/* All Hostel Blocks Info */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Campus Residence Blocks
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {HOSTEL_DATA.map((h, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-xs hover:border-[#2A2C5C]/40 transition-all"
                    >
                      <div>
                        <h5 className="text-xs font-semibold text-[#2A2C5C]">{h.block}</h5>
                        <p className="text-[11px] font-medium text-slate-600 mt-0.5">{h.roomType}</p>
                        <span className="text-[11px] text-emerald-700 font-semibold">
                          ₹{h.feePerSemester.toLocaleString()} / sem
                        </span>
                      </div>

                      {/* Amenities */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase">Features:</span>
                        <ul className="text-[11px] text-slate-600 space-y-0.5">
                          {h.amenities.slice(0, 3).map((am, idx) => (
                            <li key={idx} className="flex items-center gap-1">
                              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-700 shrink-0" />
                              <span className="line-clamp-1">{am}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Warden Contact */}
                      <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                        <p className="font-semibold text-slate-700">{h.wardenName}</p>
                        <p className="flex items-center gap-1 text-[#2A2C5C] font-mono">
                          <Phone className="w-3 h-3" /> {h.wardenContact}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mess Schedule Highlight */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span className="flex items-center gap-1.5 text-[#2A2C5C]">
                    <Utensils className="w-4 h-4" /> Today&apos;s Hostel Mess Menu
                  </span>
                  <span className="text-slate-500 text-[11px]">Breakfast: 7:30-9:00 AM • Lunch: 12:30-2:30 PM • Dinner: 7:30-9:30 PM</span>
                </div>
                <p className="text-slate-600">
                  <strong>Dinner (Today):</strong> Shahi Paneer, Dal Tadka, Jeera Rice, Butter Rotis, Gulab Jamun & Salad.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: MAINTENANCE DESK */}
          {activeTab === 'maintenance' && (
            <form onSubmit={handleMaintenanceSubmit} className="space-y-4 max-w-xl mx-auto">
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-700" />
                <span>
                  Hostel maintenance tickets are usually attended to within 2-4 hours by the floor supervisor.
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Issue Category</label>
                <select
                  value={grievanceType}
                  onChange={(e) => setGrievanceType(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs md:text-sm font-medium text-slate-800 outline-none"
                >
                  <option>WiFi / Internet connectivity issue</option>
                  <option>Electrical / Tube-light / Fan malfunction</option>
                  <option>Plumbing / RO Water Dispenser</option>
                  <option>Carpentry / Door Lock / Study Table repair</option>
                  <option>Room Cleaning / Housekeeping request</option>
                  <option>Room Change Inquiry</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Specific Details / Room Notes</label>
                <textarea
                  rows={3}
                  placeholder="Describe the issue (e.g. WiFi router signal dropping on 3rd floor wing A)..."
                  value={roomDesc}
                  onChange={(e) => setRoomDesc(e.target.value)}
                  required
                  className="w-full p-3 bg-white border border-slate-200 rounded-lg text-xs md:text-sm font-medium text-slate-800 outline-none focus:border-[#2A2C5C]"
                />
              </div>

              {submittedTicket ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs flex items-center justify-between">
                  <div>
                    <h5 className="font-bold">Ticket Logged: {submittedTicket}</h5>
                    <p className="text-emerald-700">Warden & Maintenance notified. Track status in app.</p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#2A2C5C] hover:bg-[#1E2045] text-white font-semibold text-xs md:text-sm py-2.5 rounded-xl shadow-xs transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-white" />
                  <span>{isSubmitting ? 'Logging Ticket...' : 'Submit Maintenance Request'}</span>
                </button>
              )}
            </form>
          )}

          {/* TAB 3: DIGITAL GATE PASS */}
          {activeTab === 'gatepass' && (
            <form onSubmit={handleGatePassSubmit} className="space-y-4 max-w-xl mx-auto">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
                <div className="flex items-center justify-between font-bold text-[#2A2C5C]">
                  <span>Night Outing / Weekend Gate Pass</span>
                  <span className="text-emerald-700">Biometric Verified</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-400 font-semibold uppercase">Outing Date</label>
                    <input
                      type="date"
                      defaultValue="2026-10-24"
                      className="w-full mt-1 p-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-semibold uppercase">Expected Return Time</label>
                    <input
                      type="time"
                      defaultValue="20:30"
                      className="w-full mt-1 p-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Reason for Leave</label>
                <select
                  value={gatePassReason}
                  onChange={(e) => setGatePassReason(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs md:text-sm font-medium text-slate-800 outline-none"
                >
                  <option>Weekend Home Visit</option>
                  <option>Medical Appointment / Clinic</option>
                  <option>Project Work / External Hackathon</option>
                  <option>Personal Outing / Shopping</option>
                </select>
              </div>

              {gatePassGenerated ? (
                <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-950 text-xs space-y-2">
                  <div className="flex items-center justify-between font-bold">
                    <span>Approved E-Gate Pass ID: {gatePassGenerated}</span>
                    <span className="bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded text-[10px]">
                      VALID FOR EXIT
                    </span>
                  </div>
                  <p className="text-emerald-800">
                    Scan biometric or QR at Main Campus Gate Turnstile before 10:30 PM.
                  </p>
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#2A2C5C] hover:bg-[#1E2045] text-white font-semibold text-xs md:text-sm py-2.5 rounded-xl shadow-xs transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Key className="w-4 h-4 text-white" />
                  <span>{isSubmitting ? 'Approving...' : 'Generate E-Gate Pass'}</span>
                </button>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
