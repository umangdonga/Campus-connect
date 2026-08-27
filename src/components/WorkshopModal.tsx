import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CAMPUS_EVENTS } from '../data/campusData';
import { CampusEvent, StudentProfile } from '../types';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Users,
  CheckCircle2,
  Ticket,
  X,
  Sparkles,
  Award,
  ChevronRight,
  Share2,
} from 'lucide-react';

interface WorkshopModalProps {
  student: StudentProfile;
  isOpen: boolean;
  onClose: () => void;
  initialEventId?: string | null;
}

export const WorkshopModal: React.FC<WorkshopModalProps> = ({
  student,
  isOpen,
  onClose,
  initialEventId,
}) => {
  const [eventsList, setEventsList] = useState<CampusEvent[]>(CAMPUS_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState<CampusEvent>(
    CAMPUS_EVENTS.find((e) => e.id === initialEventId) || CAMPUS_EVENTS[0]
  );
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [registeredSuccess, setRegisteredSuccess] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleRegisterEvent = (event: CampusEvent) => {
    setIsRegistering(true);
    setTimeout(() => {
      setEventsList((prev) =>
        prev.map((e) =>
          e.id === event.id
            ? { ...e, isRegistered: true, seatsLeft: Math.max(0, e.seatsLeft - 1) }
            : e
        )
      );
      setSelectedEvent((prev) => ({
        ...prev,
        isRegistered: true,
        seatsLeft: Math.max(0, prev.seatsLeft - 1),
      }));
      setRegisteredSuccess(`Successfully registered for ${event.title}! Ticket emailed to ${student.email}`);
      setIsRegistering(false);
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    }, 700);
  };

  const filteredEvents = eventsList.filter((e) => {
    return activeCategory === 'All' || e.category === activeCategory;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 md:p-6 bg-gradient-to-r from-[#134F73] to-[#263D88] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-2xl backdrop-blur-md">
              <Calendar className="w-6 h-6 text-[#53AADF]" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-bold">Campus Events & Workshop Registration</h2>
              <p className="text-xs text-sky-200">
                Register for workshops, sports fests, hackathons & cultural events
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 p-3 px-4 md:px-6 bg-slate-50 border-b border-slate-200 overflow-x-auto">
          {['All', 'WORKSHOP', 'SPORTS', 'TECH', 'CULTURAL'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-[#134F73] text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Main Content Layout */}
        <div className="p-4 md:p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Events Cards List */}
          <div className="lg:col-span-5 space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Upcoming Programs ({filteredEvents.length})
            </h4>

            <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
              {filteredEvents.map((evt) => {
                const isSelected = selectedEvent.id === evt.id;

                return (
                  <div
                    key={evt.id}
                    onClick={() => {
                      setSelectedEvent(evt);
                      setRegisteredSuccess(null);
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex gap-3 ${
                      isSelected
                        ? 'bg-sky-50/70 border-[#134F73] ring-1 ring-[#134F73] shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img
                      src={evt.image}
                      alt={evt.title}
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold uppercase bg-slate-100 text-[#134F73] px-2 py-0.5 rounded">
                          {evt.category}
                        </span>
                        {evt.isRegistered && (
                          <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                            REGISTERED
                          </span>
                        )}
                      </div>
                      <h5 className="text-xs font-bold text-slate-900 line-clamp-1">{evt.title}</h5>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#53AADF]" /> {evt.date}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Event Details & Registration Box */}
          <div className="lg:col-span-7 space-y-4">
            {/* Banner Image */}
            <div className="relative rounded-2xl overflow-hidden h-44 shadow-sm border border-slate-200">
              <img
                src={selectedEvent.image}
                alt={selectedEvent.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-[#134F73] text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider">
                {selectedEvent.category}
              </div>
            </div>

            {/* Registration Success Banner */}
            {registeredSuccess && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-950 flex items-center justify-between animate-fade-in">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{registeredSuccess}</span>
                </div>
              </div>
            )}

            {/* Event Info */}
            <div className="space-y-3">
              <h3 className="text-base md:text-lg font-bold text-slate-900">{selectedEvent.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{selectedEvent.description}</p>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Date & Time</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{selectedEvent.date}</p>
                  <p className="text-[11px] text-slate-500">{selectedEvent.time}</p>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Campus Venue</span>
                  <p className="font-semibold text-[#134F73] mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#53AADF]" /> {selectedEvent.venue}
                  </p>
                </div>
              </div>

              {selectedEvent.speakerOrHost && (
                <div className="bg-sky-50/70 p-3 rounded-xl border border-sky-200 text-xs flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#134F73] shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#134F73] block">Mentor / Host</span>
                    <span className="font-semibold text-slate-800">{selectedEvent.speakerOrHost}</span>
                  </div>
                </div>
              )}

              {/* Seats meter & Fee */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Registration Fee:</span>
                  <div className="text-sm font-extrabold text-emerald-700">{selectedEvent.fee}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Seats Remaining:</span>
                  <div className="text-xs font-bold text-[#134F73]">
                    {selectedEvent.seatsLeft} of {selectedEvent.seatsTotal} left
                  </div>
                </div>
              </div>

              {/* Action Button */}
              {selectedEvent.isRegistered ? (
                <div className="p-3 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                  <Ticket className="w-4 h-4 text-emerald-700" />
                  <span>You are Registered! E-Pass Active on Student Profile</span>
                </div>
              ) : (
                <button
                  onClick={() => handleRegisterEvent(selectedEvent)}
                  disabled={isRegistering || selectedEvent.seatsLeft === 0}
                  className="w-full bg-[#134F73] hover:bg-[#0e3b56] text-white font-bold text-xs md:text-sm py-3 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Ticket className="w-4 h-4 text-[#53AADF]" />
                  <span>{isRegistering ? 'Processing Registration...' : 'Register for Workshop / Event'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
