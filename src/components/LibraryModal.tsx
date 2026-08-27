import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { LIBRARY_BOOKS } from '../data/campusData';
import { LibraryBook, StudentProfile } from '../types';
import {
  BookOpen,
  Search,
  Bookmark,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  QrCode,
  Layers,
  BookMarked,
} from 'lucide-react';

interface LibraryModalProps {
  student: StudentProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const LibraryModal: React.FC<LibraryModalProps> = ({ student, isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [booksList, setBooksList] = useState<LibraryBook[]>(LIBRARY_BOOKS);
  const [reservedSuccess, setReservedSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleReserve = (book: LibraryBook) => {
    setBooksList((prev) =>
      prev.map((b) =>
        b.id === book.id
          ? {
              ...b,
              availableCopies: Math.max(0, b.availableCopies - 1),
              status: b.availableCopies - 1 === 0 ? 'Issued' : 'Available',
            }
          : b
      )
    );
    setReservedSuccess(`Reserved '${book.title}'. Pick up at Central Library Counter 2 within 24 hours.`);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
  };

  const filteredBooks = booksList.filter((b) => {
    const matchSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.shelfLocation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedCategory === 'All' || b.category === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 md:p-6 bg-gradient-to-r from-[#134F73] to-[#14B8A6] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-2xl backdrop-blur-md">
              <BookOpen className="w-6 h-6 text-teal-200" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-bold">Central Library & Learning Resources</h2>
              <p className="text-xs text-teal-100">
                Book catalog search, quiet study pods, e-journals & digital library card
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

        {/* Digital Library Card & Due Alert */}
        <div className="p-4 md:p-6 bg-slate-50 border-b border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Due Reminder Alert */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs">
              <div className="font-bold text-amber-900 flex items-center gap-1.5">
                <span>Book Return Due Tomorrow!</span>
                <span className="bg-amber-200 text-amber-800 text-[9px] px-1.5 py-0.2 rounded font-extrabold">
                  DUE OCT 25
                </span>
              </div>
              <p className="text-amber-800 mt-0.5">
                Design Patterns: Elements of Reusable Object-Oriented Software (ID: #BK-1)
              </p>
            </div>
          </div>

          {/* Digital Member Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-3.5 flex items-center justify-between shadow-sm text-xs">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Library Pass</div>
              <div className="font-bold text-slate-900">{student.name}</div>
              <div className="text-slate-500 font-mono text-[11px]">{student.libraryCardId}</div>
            </div>
            <div className="text-right">
              <span className="bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded text-[10px]">
                3/5 Books Borrowed
              </span>
              <div className="text-[10px] text-slate-400 mt-1">Status: Active Member</div>
            </div>
          </div>
        </div>

        {/* Body & Catalog */}
        <div className="p-4 md:p-6 overflow-y-auto flex-1 space-y-4">
          {/* Reservation Toast */}
          {reservedSuccess && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between animate-fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{reservedSuccess}</span>
              </div>
              <button
                onClick={() => setReservedSuccess(null)}
                className="text-emerald-700 hover:text-emerald-900 font-bold"
              >
                ✕
              </button>
            </div>
          )}

          {/* Search bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by title, author, ISBN, or shelf location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs md:text-sm font-medium text-slate-800 focus:bg-white focus:border-[#14B8A6] outline-none transition-all"
              />
            </div>
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs md:text-sm font-medium text-slate-700 outline-none"
              >
                <option value="All">All Categories</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Software Engineering">Software Engineering</option>
                <option value="Machine Learning">Machine Learning & AI</option>
              </select>
            </div>
          </div>

          {/* Books List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBooks.map((book) => {
              const isAvailable = book.availableCopies > 0;

              return (
                <div
                  key={book.id}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-teal-400 p-4 shadow-sm transition-all flex gap-3.5 group"
                >
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-20 h-28 object-cover rounded-xl shadow-sm shrink-0 border border-slate-200"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                          {book.category}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {isAvailable ? `${book.availableCopies} Available` : 'All Issued'}
                        </span>
                      </div>
                      <h4 className="text-xs md:text-sm font-bold text-slate-900 mt-1 line-clamp-2">
                        {book.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{book.author}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[11px] font-medium text-slate-600 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#14B8A6]" /> {book.shelfLocation}
                      </span>
                      <button
                        onClick={() => handleReserve(book)}
                        disabled={!isAvailable}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all shadow-sm ${
                          isAvailable
                            ? 'bg-[#134F73] hover:bg-[#0e3b56] text-white active:scale-95'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        {isAvailable ? 'Reserve Book' : 'Join Waitlist'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
