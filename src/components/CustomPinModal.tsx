import React, { useState, useEffect } from 'react';
import { useMapStore, CustomPin } from '../store/useMapStore';
import {
  X,
  MapPin,
  Trash2,
  Save,
  Swords,
  Shield,
  Target,
  Sparkles,
  Skull,
  Gem,
  Leaf,
  Flame,
  Check,
} from 'lucide-react';

const PIN_ICONS: { id: CustomPin['icon']; label: string; icon: React.ReactNode }[] = [
  { id: 'pin', label: 'Marker', icon: <MapPin className="w-4 h-4" /> },
  { id: 'sword', label: 'Combat / Weapon', icon: <Swords className="w-4 h-4" /> },
  { id: 'shield', label: 'Armor / Shield', icon: <Shield className="w-4 h-4" /> },
  { id: 'bow', label: 'Archery / Spot', icon: <Target className="w-4 h-4" /> },
  { id: 'star', label: 'Favorite / Important', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'skull', label: 'Boss / Danger', icon: <Skull className="w-4 h-4" /> },
  { id: 'ore', label: 'Zonaite / Ore', icon: <Gem className="w-4 h-4" /> },
  { id: 'leaf', label: 'Korok / Plant', icon: <Leaf className="w-4 h-4" /> },
  { id: 'pot', label: 'Cooking / Camp', icon: <Flame className="w-4 h-4" /> },
];

const PIN_COLORS: { id: CustomPin['color']; label: string; hex: string; bgClass: string; borderClass: string }[] = [
  { id: 'cyan', label: 'Zonai Cyan', hex: '#38bdf8', bgClass: 'bg-sky-400', borderClass: 'border-sky-300' },
  { id: 'red', label: 'Gloom Coral', hex: '#f87171', bgClass: 'bg-red-400', borderClass: 'border-red-300' },
  { id: 'green', label: 'Forest Sage', hex: '#34d399', bgClass: 'bg-emerald-400', borderClass: 'border-emerald-300' },
  { id: 'yellow', label: 'Topaz Amber', hex: '#fbbf24', bgClass: 'bg-amber-400', borderClass: 'border-amber-300' },
  { id: 'blue', label: 'Sapphire Sky', hex: '#60a5fa', bgClass: 'bg-blue-400', borderClass: 'border-blue-300' },
  { id: 'purple', label: 'Abyss Lavender', hex: '#c084fc', bgClass: 'bg-purple-400', borderClass: 'border-purple-300' },
];

export const CustomPinModal: React.FC = () => {
  const { pinModalTarget, closePinModal, addCustomPin, updateCustomPin, deleteCustomPin } = useMapStore();

  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [icon, setIcon] = useState<CustomPin['icon']>('pin');
  const [color, setColor] = useState<CustomPin['color']>('cyan');

  const existingPin = pinModalTarget?.existingPin;

  useEffect(() => {
    if (existingPin) {
      setTitle(existingPin.title);
      setNote(existingPin.note || '');
      setIcon(existingPin.icon);
      setColor(existingPin.color);
    } else {
      setTitle('');
      setNote('');
      setIcon('pin');
      setColor('cyan');
    }
  }, [existingPin, pinModalTarget]);

  if (!pinModalTarget) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (existingPin) {
      updateCustomPin(existingPin.id, {
        title: title.trim(),
        note: note.trim(),
        icon,
        color,
      });
    } else {
      addCustomPin({
        title: title.trim(),
        note: note.trim(),
        icon,
        color,
        layer: pinModalTarget.layer,
        lat: pinModalTarget.lat,
        lng: pinModalTarget.lng,
      });
    }
    closePinModal();
  };

  const handleDelete = () => {
    if (existingPin) {
      deleteCustomPin(existingPin.id);
      closePinModal();
    }
  };

  const activeColorObj = PIN_COLORS.find((c) => c.id === color) || PIN_COLORS[0];

  return (
    <div className="fixed inset-0 z-[2500] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#161311] border border-[#3b322a] rounded-2xl shadow-2xl overflow-hidden flex flex-col text-gray-200">
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#2e2620] bg-[#120f0e]">
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-black font-bold shadow-md"
              style={{ backgroundColor: activeColorObj.hex }}
            >
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-wide text-white">
                {existingPin ? 'Edit Custom Pin' : 'Place Custom Pin'}
              </h3>
              <p className="text-[10px] text-gray-400 capitalize">
                Layer: <strong className="text-amber-300">{pinModalTarget.layer}</strong> • ({Math.round(pinModalTarget.lng)}, {Math.round(pinModalTarget.lat)})
              </p>
            </div>
          </div>
          <button
            onClick={closePinModal}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSave} className="p-5 space-y-4">
          {/* Title Input */}
          <div>
            <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5">
              Pin Title <span className="text-amber-400">*</span>
            </label>
            <input
              type="text"
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Lynel Weapon Stash, Bomb Flower Cave..."
              className="w-full px-3.5 py-2.5 bg-[#0e0c0b] border border-[#362c25] rounded-xl text-white text-xs placeholder:text-gray-500 focus:outline-none focus:border-totk-zonai focus:ring-1 focus:ring-totk-zonai transition"
              required
            />
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5">
              Beacon Color
            </label>
            <div className="grid grid-cols-6 gap-2">
              {PIN_COLORS.map((c) => {
                const isSelected = color === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setColor(c.id)}
                    className={`h-8 rounded-lg flex items-center justify-center transition-all ${c.bgClass} ${
                      isSelected ? 'ring-2 ring-white scale-105 shadow-md' : 'opacity-70 hover:opacity-100'
                    }`}
                    title={c.label}
                  >
                    {isSelected && <Check className="w-4 h-4 text-black stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Icon/Stamp Selection */}
          <div>
            <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5">
              Purah Stamp Icon
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {PIN_ICONS.map((i) => {
                const isSelected = icon === i.id;
                return (
                  <button
                    key={i.id}
                    type="button"
                    onClick={() => setIcon(i.id)}
                    className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition ${
                      isSelected
                        ? 'bg-totk-zonai/20 border-totk-zonai text-totk-zonai shadow-sm'
                        : 'bg-[#120f0e] border-[#2b241e] text-gray-400 hover:text-white hover:bg-[#1a1613]'
                    }`}
                    title={i.label}
                  >
                    {i.icon}
                    <span className="text-[9px] font-medium truncate max-w-full">
                      {i.label.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Note Input */}
          <div>
            <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5">
              Personal Notes (Optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Respawns every Blood Moon, bring Hammer or Fire Arrows..."
              rows={2}
              className="w-full px-3.5 py-2 bg-[#0e0c0b] border border-[#362c25] rounded-xl text-white text-xs placeholder:text-gray-500 focus:outline-none focus:border-totk-zonai focus:ring-1 focus:ring-totk-zonai transition resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-[#2e2620]">
            {existingPin ? (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/40 text-xs font-semibold transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={closePinModal}
                className="px-4 py-2 rounded-xl bg-[#201c19] hover:bg-[#2b2622] text-gray-300 text-xs font-semibold transition border border-[#352c25]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-totk-zonai hover:bg-totk-zonai/90 text-black text-xs font-bold transition shadow-lg shadow-totk-zonai/30 active:scale-95"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{existingPin ? 'Save Changes' : 'Place Pin'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
