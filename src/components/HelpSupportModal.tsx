import React, { useState } from 'react';
import { FRESHER_CHECKLIST } from '../data/campusData';
import {
  LifeBuoy,
  ShieldCheck,
  Phone,
  Wifi,
  CheckCircle2,
  AlertOctagon,
  HelpCircle,
  X,
  FileQuestion,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';

interface HelpSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBusService?: () => void;
}

export const HelpSupportModal: React.FC<HelpSupportModalProps> = ({
  isOpen,
  onClose,
  onOpenBusService,
}) => {
  const [checklist, setChecklist] = useState(FRESHER_CHECKLIST);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [sosTriggered, setSosTriggered] = useState<boolean>(false);

  if (!isOpen) return null;

  const toggleCheck = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const completedCount = checklist.filter((i) => i.done).length;
  const progressPercent = Math.round((completedCount / checklist.length) * 100);

  const faqs = [
    {
      q: 'Where do freshers collect their biometric physical ID Card and RFID chip?',
      a: 'Visit the Administrative Block (ADM-01), Counter #4 between 10:00 AM and 4:30 PM with your admission fee receipt and 2 passport photos.',
    },
    {
      q: 'How do I connect to Campus High-Speed 5GHz WiFi?',
      a: 'Select "CAMPUS-STUDENT-5G" on your device. Enter your Roll Number as the Identity and your initial student portal password.',
    },
    {
      q: 'Where is the Lost & Found section located?',
      a: 'The central Lost & Found desk is situated at the Security Control Room near Campus Main Gate 1 (24/7).',
    },
    {
      q: 'Can I apply for hostel room changes after admission?',
      a: 'Yes, submit a room change request via the Hostel section on Campus Connect app during the 2nd week of semester.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 md:p-5 bg-[#2A2C5C] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <LifeBuoy className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-bold">Fresher Onboarding & Student Help Desk</h2>
              <p className="text-xs text-slate-200">
                Checklist, emergency security hotlines, WiFi configuration & FAQs
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

        {/* Modal Body */}
        <div className="p-4 md:p-6 overflow-y-auto flex-1 space-y-5">
          {/* Emergency SOS Hotlines */}
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-600 text-white rounded-lg">
                <AlertOctagon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs md:text-sm font-semibold text-rose-950">
                  24/7 Campus Emergency SOS & Security Desk
                </h4>
                <p className="text-xs text-rose-700">
                  Main Security: <strong>+91 94290 99999</strong> • Anti-Ragging: <strong>1800-180-5522</strong>
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setSosTriggered(true);
                alert('Campus Security Control Room alerted with your location GPS beacon.');
              }}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-all shadow-xs active:scale-98 shrink-0 cursor-pointer"
            >
              {sosTriggered ? 'SOS Alert Active' : 'Trigger SOS Alert'}
            </button>
          </div>

          {/* Fresher Induction Checklist */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#2A2C5C]" />
                <h4 className="text-xs md:text-sm font-semibold text-[#2A2C5C]">Fresher 2026 Onboarding Checklist</h4>
              </div>
              <span className="text-xs font-semibold text-[#2A2C5C]">
                {completedCount} of {checklist.length} Completed ({progressPercent}%)
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#2A2C5C] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="space-y-1.5 pt-1">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`p-2.5 rounded-lg border flex items-center gap-2.5 cursor-pointer transition-all ${
                    item.done
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                      item.done
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {item.done && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <span className={`text-xs font-medium ${item.done ? 'line-through opacity-70' : ''}`}>
                    {item.task}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Helplines Grid */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Student Welfare Contacts
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                <div className="font-semibold text-slate-900">Student Affairs Dean</div>
                <div className="text-slate-500">Dr. M. S. Rathore</div>
                <div className="text-[#2A2C5C] font-semibold flex items-center gap-1">
                  <Phone className="w-3 h-3" /> +91 94291 10022
                </div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                <div className="font-semibold text-slate-900">Campus Medical Center</div>
                <div className="text-slate-500">Dr. Ananya Joshi (24/7)</div>
                <div className="text-[#2A2C5C] font-semibold flex items-center gap-1">
                  <Phone className="w-3 h-3" /> +91 94291 10033
                </div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                <div className="font-semibold text-slate-900">IT & WiFi Help Desk</div>
                <div className="text-slate-500">Tech Tower Room 104</div>
                <div className="text-[#2A2C5C] font-semibold flex items-center gap-1">
                  <Wifi className="w-3 h-3" /> wifi-support@campus.edu
                </div>
              </div>
            </div>
          </div>

          {/* Frequently Asked Questions */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Frequently Asked Questions (Freshers)
            </h4>
            <div className="space-y-1.5">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-3 text-left flex items-center justify-between text-xs md:text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-[#2A2C5C] shrink-0" />
                        {faq.q}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="p-3 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
