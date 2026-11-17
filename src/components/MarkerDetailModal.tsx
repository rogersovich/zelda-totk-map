import React, { useState } from 'react';
import { useMapStore } from '../store/useMapStore';
import { X, CheckCircle2, Circle, Copy, Check, ExternalLink, Sparkles, Navigation } from 'lucide-react';
import confetti from 'canvas-confetti';

export const MarkerDetailModal: React.FC = () => {
  const {
    selectedMarker,
    setSelectedMarker,
    completedItems,
    toggleCompleted,
    jumpToTwin,
    flyToLocation,
  } = useMapStore();

  const [copied, setCopied] = useState(false);

  if (!selectedMarker) return null;

  const isDone = completedItems[selectedMarker.id] || false;

  const handleCopyCoords = () => {
    const text = `${Math.round(selectedMarker.position.x)}, ${Math.round(
      selectedMarker.position.y
    )}, ${Math.round(selectedMarker.position.z)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggle = () => {
    toggleCompleted(selectedMarker.id);
    if (!isDone) {
      // Trigger mini celebration confetti!
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#00f0ff', '#e5c158', '#10b981'],
      });
    }
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 md:left-auto md:right-6 md:translate-x-0 z-30 w-[92vw] max-w-md bg-totk-card/95 border border-totk-border rounded-2xl shadow-2xl backdrop-blur-xl p-5 text-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-totk-bg border border-totk-border flex items-center justify-center p-2 shadow-inner">
            <img
              src={selectedMarker.icon}
              alt={selectedMarker.name}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-totk-zonai/15 text-totk-zonai border border-totk-zonai/30">
                {selectedMarker.category}
              </span>
              <span className="text-[10px] uppercase font-semibold text-gray-400">
                Layer: <span className="text-white capitalize">{selectedMarker.layer}</span>
              </span>
            </div>
            <h3 className="text-base font-bold text-white mt-0.5 leading-tight">
              {selectedMarker.name}
            </h3>
          </div>
        </div>

        <button
          onClick={() => setSelectedMarker(null)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-totk-hover transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* In-Game Coordinates Readout */}
      <div className="mt-3.5 flex items-center justify-between bg-totk-bg/80 border border-totk-border/70 rounded-xl px-3 py-2 text-xs font-mono">
        <div className="flex items-center space-x-2">
          <Navigation className="w-3.5 h-3.5 text-totk-gold" />
          <span className="text-gray-400">In-Game Coordinates:</span>
          <span className="text-totk-zonai font-semibold">
            {Math.round(selectedMarker.position.x)}, {Math.round(selectedMarker.position.y)},{' '}
            {Math.round(selectedMarker.position.z)}
          </span>
        </div>
        <button
          onClick={handleCopyCoords}
          className="flex items-center space-x-1 text-[11px] text-gray-300 hover:text-white bg-totk-hover px-2 py-1 rounded transition"
          title="Copy XYZ"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Description */}
      {selectedMarker.description && (
        <p className="mt-3 text-xs text-gray-300 leading-relaxed">
          {selectedMarker.description}
        </p>
      )}

      {/* Korok Puzzle Tutorial Card */}
      {selectedMarker.tutorial && (
        <div className="mt-3.5 bg-gradient-to-br from-lime-950/40 to-totk-bg border border-lime-500/30 rounded-xl p-3 text-xs">
          <div className="flex items-center space-x-2 text-lime-400 font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Puzzle Guide: {selectedMarker.tutorial.title}</span>
          </div>
          <p className="text-gray-200 mt-1 leading-relaxed">
            {selectedMarker.tutorial.instruction}
          </p>
          <div className="mt-2 text-[10px] text-lime-300/80 font-mono">
            Reward: <strong>{selectedMarker.tutorial.reward}</strong>
          </div>
        </div>
      )}

      {/* Zonai Dispenser Capsule List */}
      {selectedMarker.items && selectedMarker.items.length > 0 && (
        <div className="mt-3.5">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-gray-400 mb-1.5">
            Available Zonai Capsules:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {selectedMarker.items.map((item) => (
              <span
                key={item}
                className="text-xs px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Twin Mirror Link (Shrine <-> Lightroot) */}
      {selectedMarker.twin && (
        <div className="mt-3.5 p-3 rounded-xl bg-gradient-to-r from-totk-zonai/10 via-totk-card to-totk-gold/10 border border-totk-zonai/40 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold text-totk-zonai tracking-wider">
              Mirrored Twin Found!
            </div>
            <div className="text-xs font-semibold text-white mt-0.5">
              {selectedMarker.twin.name} ({selectedMarker.twin.layer === 'depths' ? 'Depths' : 'Surface'})
            </div>
          </div>
          <button
            onClick={() => jumpToTwin(selectedMarker.twin)}
            className="flex items-center space-x-1.5 bg-totk-zonai text-totk-bg font-bold text-xs px-3 py-1.5 rounded-lg hover:bg-cyan-300 transition shadow-lg shadow-totk-zonai/20"
          >
            <span>Jump</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Action Buttons: Mark Completed */}
      <div className="mt-4 pt-3 border-t border-totk-border flex items-center space-x-2">
        <button
          onClick={handleToggle}
          className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-200 border ${
            isDone
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30'
              : 'bg-totk-zonai/20 text-totk-zonai border-totk-zonai/40 hover:bg-totk-zonai/30'
          }`}
        >
          {isDone ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Collected / Found (Click to Undo)</span>
            </>
          ) : (
            <>
              <Circle className="w-4 h-4 text-totk-zonai" />
              <span>Mark as Completed</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
