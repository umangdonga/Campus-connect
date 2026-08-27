import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CANTEENS_DATA } from '../data/campusData';
import { Canteen } from '../types';
import {
  Utensils,
  Clock,
  MapPin,
  Star,
  Users,
  Plus,
  Minus,
  ShoppingBag,
  CheckCircle2,
  X,
  Sparkles,
  Flame,
  Leaf,
  Coffee,
} from 'lucide-react';

interface CanteenModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCanteenId?: string | null;
}

export const CanteenModal: React.FC<CanteenModalProps> = ({
  isOpen,
  onClose,
  selectedCanteenId,
}) => {
  const [activeCanteen, setActiveCanteen] = useState<Canteen>(
    CANTEENS_DATA.find((c) => c.id === selectedCanteenId) || CANTEENS_DATA[0]
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [cart, setCart] = useState<{ [itemId: string]: number }>({});
  const [orderToken, setOrderToken] = useState<{ token: string; total: number } | null>(null);

  if (!isOpen) return null;

  const handleAddToCart = (itemId: string) => {
    setCart((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart((prev) => {
      const updated = { ...prev };
      if (updated[itemId] > 1) {
        updated[itemId] -= 1;
      } else {
        delete updated[itemId];
      }
      return updated;
    });
  };

  // Calculate cart total
  let totalAmount = 0;
  let totalItemsCount = 0;
  activeCanteen.menu.forEach((cat) => {
    cat.items.forEach((item) => {
      if (cart[item.id]) {
        totalAmount += item.price * cart[item.id];
        totalItemsCount += cart[item.id];
      }
    });
  });

  const handleGenerateToken = () => {
    const token = `TKN-${Math.floor(100 + Math.random() * 900)}`;
    setOrderToken({ token, total: totalAmount });
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 md:p-6 bg-gradient-to-r from-[#134F73] to-[#0D9488] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-2xl backdrop-blur-md">
              <Utensils className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-bold">Campus Canteens & Menus</h2>
              <p className="text-xs text-emerald-100">
                Live crowd meter, full digital menus & skip-the-line pickup tokens
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

        {/* Canteen Selector Pills */}
        <div className="flex items-center gap-2 p-3 px-4 md:px-6 bg-slate-50 border-b border-slate-200 overflow-x-auto scrollbar-none">
          {CANTEENS_DATA.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setActiveCanteen(c);
                setCart({});
                setOrderToken(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeCanteen.id === c.id
                  ? 'bg-[#134F73] text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{c.name}</span>
              <span
                className={`w-2 h-2 rounded-full ${
                  c.crowdLevel === 'Low'
                    ? 'bg-emerald-400'
                    : c.crowdLevel === 'Moderate'
                    ? 'bg-amber-400'
                    : 'bg-rose-400'
                }`}
              />
            </button>
          ))}
        </div>

        {/* Canteen Hero & Details */}
        <div className="p-4 md:p-6 overflow-y-auto flex-1 space-y-5">
          <div className="relative rounded-2xl overflow-hidden shadow-sm border border-slate-200 h-44 md:h-52">
            <img
              src={activeCanteen.image}
              alt={activeCanteen.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-4 md:p-5 text-white">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg md:text-xl font-black">{activeCanteen.name}</h3>
                  <p className="text-xs text-slate-200 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#53AADF]" /> {activeCanteen.location}
                  </p>
                </div>

                {/* Crowd Level Meter */}
                <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-300" />
                  <div className="text-right">
                    <div className="text-[10px] uppercase font-bold text-slate-200">Live Crowd</div>
                    <div className="text-xs font-bold text-white">
                      {activeCanteen.crowdLevel} ({activeCanteen.crowdPercentage}%)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Tags & Info */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {activeCanteen.rating} / 5.0
              </span>
              <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#134F73]" /> {activeCanteen.timings}
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {activeCanteen.tags.map((t, idx) => (
                <span key={idx} className="bg-sky-50 text-[#134F73] text-[11px] font-semibold px-2 py-0.5 rounded-md">
                  #{t}
                </span>
              ))}
            </div>
          </div>

          {/* Menu Sections */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#134F73]" /> Full Food & Drink Menu
            </h4>

            {activeCanteen.menu.map((categoryGroup, catIdx) => (
              <div key={catIdx} className="space-y-2">
                <h5 className="text-xs font-bold text-[#134F73] bg-slate-100 px-3 py-1.5 rounded-lg">
                  {categoryGroup.category}
                </h5>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {categoryGroup.items.map((item) => {
                    const count = cart[item.id] || 0;

                    return (
                      <div
                        key={item.id}
                        className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-3 flex items-center justify-between gap-3 shadow-sm transition-all"
                      >
                        <div className="space-y-0.5 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="w-3 h-3 border border-emerald-600 flex items-center justify-center p-0.5 rounded-sm">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                            </span>
                            <h6 className="text-xs font-bold text-slate-800">{item.name}</h6>
                            {item.isSpecial && (
                              <span className="bg-amber-100 text-amber-800 text-[9px] font-extrabold px-1.5 py-0.2 rounded">
                                POPULAR
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500">
                            <span className="font-bold text-slate-900 text-xs">₹{item.price}</span>
                            {item.calories && <span>• {item.calories}</span>}
                          </div>
                        </div>

                        {/* Add / Counter Controls */}
                        <div className="flex items-center gap-1.5">
                          {count > 0 ? (
                            <div className="flex items-center gap-1.5 bg-[#134F73] text-white px-2 py-1 rounded-lg">
                              <button
                                onClick={() => handleRemoveFromCart(item.id)}
                                className="hover:text-amber-300 p-0.5"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-bold px-1">{count}</span>
                              <button
                                onClick={() => handleAddToCart(item.id)}
                                className="hover:text-amber-300 p-0.5"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleAddToCart(item.id)}
                              className="bg-slate-100 hover:bg-[#134F73] text-slate-700 hover:text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors border border-slate-200"
                            >
                              Add
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Generated Token Alert */}
          {orderToken && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-3 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-600 text-white rounded-xl font-mono font-bold text-sm">
                  {orderToken.token}
                </div>
                <div>
                  <h5 className="text-xs font-bold text-emerald-900">Pre-Order Token Ready!</h5>
                  <p className="text-xs text-emerald-700">
                    Show token at {activeCanteen.name} Express Counter. Total: ₹{orderToken.total}
                  </p>
                </div>
              </div>
              <button
                onClick={() => alert(`Token ${orderToken.token} confirmed!`)}
                className="bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-emerald-800"
              >
                Saved
              </button>
            </div>
          )}
        </div>

        {/* Footer Cart Bar */}
        {totalItemsCount > 0 && !orderToken && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-500 font-medium">{totalItemsCount} items selected</span>
              <div className="text-base font-extrabold text-[#134F73]">₹{totalAmount}</div>
            </div>
            <button
              onClick={handleGenerateToken}
              className="bg-[#134F73] hover:bg-[#0e3b56] text-white font-bold text-xs md:text-sm px-6 py-2.5 rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4 text-[#53AADF]" />
              <span>Generate Quick Pickup Token</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
