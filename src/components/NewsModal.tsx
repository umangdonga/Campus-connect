import React, { useState } from 'react';
import { LATEST_NEWS } from '../data/campusData';
import { NewsItem } from '../types';
import {
  Newspaper,
  Calendar,
  Clock,
  User,
  Share2,
  Bookmark,
  X,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

interface NewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialNewsId?: string | null;
}

export const NewsModal: React.FC<NewsModalProps> = ({ isOpen, onClose, initialNewsId }) => {
  const [selectedNews, setSelectedNews] = useState<NewsItem>(
    LATEST_NEWS.find((n) => n.id === initialNewsId) || LATEST_NEWS[0]
  );
  const [activeTag, setActiveTag] = useState<string>('All');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  if (!isOpen) return null;

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const filteredNews = LATEST_NEWS.filter(
    (n) => activeTag === 'All' || n.tag === activeTag
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 md:p-5 bg-[#2A2C5C] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <Newspaper className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-bold">Campus News & Circulars</h2>
              <p className="text-xs text-slate-200">
                Official notices, scholarships, event highlights & press releases
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

        {/* Tags Bar */}
        <div className="flex items-center gap-2 p-3 px-4 md:px-6 bg-slate-50 border-b border-slate-200 overflow-x-auto">
          {['All', 'ON CAMPUS', 'SCHOLARSHIP', 'ACADEMIC'].map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTag === tag
                  ? 'bg-[#2A2C5C] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Content Layout */}
        <div className="p-4 md:p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Articles List */}
          <div className="lg:col-span-5 space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
            {filteredNews.map((item) => {
              const isSelected = selectedNews.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedNews(item)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex gap-3 ${
                    isSelected
                      ? 'bg-[#2A2C5C]/5 border-[#2A2C5C] ring-1 ring-[#2A2C5C] shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-semibold text-[#2A2C5C] bg-[#2A2C5C]/10 px-2 py-0.5 rounded">
                        {item.tag}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">{item.timeAgo}</span>
                    </div>
                    <h5 className="text-xs font-semibold text-slate-800 line-clamp-2">{item.title}</h5>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Selected Article Reader */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative rounded-xl overflow-hidden h-52 shadow-xs border border-slate-200">
              <img
                src={selectedNews.image}
                alt={selectedNews.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 flex items-center gap-1.5">
                <button
                  onClick={() => toggleBookmark(selectedNews.id)}
                  className="p-2 bg-slate-900/60 hover:bg-slate-900/80 backdrop-blur-xs rounded-lg text-white transition-colors cursor-pointer"
                >
                  <Bookmark
                    className={`w-4 h-4 ${
                      bookmarkedIds.includes(selectedNews.id)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-white'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="bg-[#2A2C5C]/10 text-[#2A2C5C] font-semibold px-2 py-0.5 rounded">
                  {selectedNews.category}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {selectedNews.date}
                </span>
              </div>

              <h3 className="text-base md:text-lg font-bold text-slate-900 leading-snug">
                {selectedNews.title}
              </h3>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs font-medium text-slate-700 italic">
                &ldquo;{selectedNews.summary}&rdquo;
              </div>

              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                {selectedNews.fullText}
              </p>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>
                  Published by: <strong>{selectedNews.author}</strong>
                </span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Verified Campus Bulletin
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
