import React, { useMemo, useState } from 'react';
import { ARMOR_SETS, ArmorPiece, ArmorSet } from '../data/armorSets';
import { useMapStore } from '../store/useMapStore';
import {
  X,
  Shield,
  Check,
  MapPin,
  Sparkles,
  Search,
  ChevronDown,
  ChevronUp,
  Star,
} from 'lucide-react';

export const ArmorPlannerModal: React.FC = () => {
  const {
    isArmorModalOpen,
    closeArmorModal,
    completedItems,
    toggleCompleted,
    setActiveLayer,
    flyToLocation,
  } = useMapStore();

  const [query, setQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'incomplete' | 'completed'>('all');
  const [expandedUpgrades, setExpandedUpgrades] = useState<Record<string, boolean>>({});

  const totalPieces = useMemo(
    () => ARMOR_SETS.reduce((acc, s) => acc + s.pieces.length, 0),
    []
  );

  const collectedPieces = useMemo(
    () =>
      ARMOR_SETS.reduce(
        (acc, s) => acc + s.pieces.filter((p) => completedItems[p.id]).length,
        0
      ),
    [completedItems]
  );

  const filteredSets = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ARMOR_SETS.filter((set) => {
      const doneCount = set.pieces.filter((p) => completedItems[p.id]).length;
      const isComplete = doneCount === set.pieces.length;

      if (filterTab === 'incomplete' && isComplete) return false;
      if (filterTab === 'completed' && !isComplete) return false;

      if (!q) return true;
      return (
        set.name.toLowerCase().includes(q) ||
        set.effect.toLowerCase().includes(q) ||
        set.setBonus.toLowerCase().includes(q) ||
        set.pieces.some(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.locationHint.toLowerCase().includes(q)
        ) ||
        set.upgrades?.some((u) =>
          u.materials.some((m) => m.toLowerCase().includes(q))
        )
      );
    });
  }, [query, filterTab, completedItems]);

  if (!isArmorModalOpen) return null;

  const handleLocatePiece = (piece: ArmorPiece) => {
    if (!piece.coords) return;
    setActiveLayer(piece.coords.layer);
    flyToLocation(piece.coords.lat, piece.coords.lng, 6);
    closeArmorModal();
  };

  const toggleUpgradePanel = (setId: string) => {
    setExpandedUpgrades((prev) => ({ ...prev, [setId]: !prev[setId] }));
  };

  const getUpgradeLevel = (set: ArmorSet) => {
    if (!set.upgrades) return 0;
    let maxLvl = 0;
    for (const u of set.upgrades) {
      if (completedItems[`armor-upg-${set.id}-${u.level}`]) {
        maxLvl = u.level;
      }
    }
    return maxLvl;
  };

  return (
    <div
      className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/75 backdrop-blur-sm p-3 sm:p-6"
      onClick={closeArmorModal}
    >
      <div
        className="w-full max-w-3xl max-h-[88vh] bg-[#141210] border border-[#3a3129] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#2b241e] bg-[#1a1613] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                Armor Sets & Great Fairy Planner
              </h2>
              <p className="text-[11px] text-gray-400">
                Track armor locations & upgrade materials •{' '}
                <span className="text-amber-300 font-semibold">
                  {collectedPieces}/{totalPieces} Pieces Collected
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={closeArmorModal}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search + Filter Controls */}
        <div className="px-4 py-3 border-b border-[#26201b] bg-[#12100e] flex flex-col sm:flex-row gap-2.5 sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search armor, bonus, or material (e.g. Glide, Lynel, Zonaite)..."
              className="w-full bg-[#0b0a09] border border-[#2f2822] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400/60"
            />
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {(
              [
                { id: 'all', label: 'All Sets' },
                { id: 'incomplete', label: 'Incomplete' },
                { id: 'completed', label: 'Completed' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterTab(tab.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition ${
                  filterTab === tab.id
                    ? 'bg-amber-500/20 border-amber-400/60 text-amber-300'
                    : 'bg-[#181512] border-[#2d2620] text-gray-400 hover:text-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Armor Sets List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {filteredSets.length === 0 ? (
            <div className="text-center py-10 text-sm text-gray-500">
              No armor sets match your filter.
            </div>
          ) : (
            filteredSets.map((set) => {
              const doneCount = set.pieces.filter((p) => completedItems[p.id]).length;
              const isSetDone = doneCount === set.pieces.length;
              const isExpanded = Boolean(expandedUpgrades[set.id]);
              const currentStars = getUpgradeLevel(set);

              return (
                <div
                  key={set.id}
                  className={`rounded-xl border transition overflow-hidden ${
                    isSetDone
                      ? 'bg-emerald-950/15 border-emerald-500/35'
                      : 'bg-[#191613] border-[#2e2721]'
                  }`}
                >
                  {/* Set Title Row */}
                  <div className="p-3.5 flex flex-wrap items-start justify-between gap-2 border-b border-[#26201b]">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-white">{set.name}</h3>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold">
                          {set.effect}
                        </span>
                        {currentStars > 0 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-mono">
                            {'★'.repeat(currentStars)}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-amber-300/85 mt-0.5 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 shrink-0" />
                        <span>Set Bonus: {set.setBonus}</span>
                      </div>
                      {set.note && (
                        <div className="text-[10.5px] text-gray-400 mt-1">{set.note}</div>
                      )}
                    </div>
                    <div className="text-xs font-mono font-bold px-2 py-1 rounded bg-black/30 border border-white/5 text-gray-300">
                      {doneCount}/{set.pieces.length}
                    </div>
                  </div>

                  {/* Pieces Grid */}
                  <div className="p-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {set.pieces.map((piece) => {
                      const isCollected = Boolean(completedItems[piece.id]);
                      return (
                        <div
                          key={piece.id}
                          className={`rounded-lg border p-2.5 flex flex-col justify-between gap-2 transition ${
                            isCollected
                              ? 'bg-emerald-950/30 border-emerald-500/40'
                              : 'bg-[#12100e] border-[#29231d]'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => toggleCompleted(piece.id)}
                            className="flex items-start gap-2 text-left group"
                          >
                            <div
                              className={`w-4 h-4 rounded flex items-center justify-center shrink-0 mt-0.5 border transition ${
                                isCollected
                                  ? 'bg-emerald-500 border-emerald-400 text-black'
                                  : 'bg-black/40 border-gray-600 group-hover:border-gray-400'
                              }`}
                            >
                              {isCollected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-white leading-tight">
                                {piece.name}
                              </div>
                              <div className="text-[10px] text-gray-400 mt-0.5 leading-snug">
                                {piece.locationHint}
                              </div>
                            </div>
                          </button>

                          {piece.coords && (
                            <button
                              type="button"
                              onClick={() => handleLocatePiece(piece)}
                              className="w-full py-1 px-2 rounded bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-[10px] font-semibold flex items-center justify-center gap-1 transition"
                            >
                              <MapPin className="w-3 h-3" />
                              <span>Locate ({piece.coords.layer.toUpperCase()})</span>
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Great Fairy Upgrade Section Toggle */}
                  {set.upgrades && set.upgrades.length > 0 && (
                    <div className="border-t border-[#26201b]">
                      <button
                        type="button"
                        onClick={() => toggleUpgradePanel(set.id)}
                        className="w-full px-3.5 py-2 bg-[#141210] hover:bg-[#1a1714] flex items-center justify-between text-[11px] font-semibold text-amber-300/90 transition"
                      >
                        <span className="flex items-center gap-1.5">
                          <Star className="w-3.5 h-3.5 fill-amber-400/30" />
                          <span>Great Fairy Upgrade Materials (★1 – ★4)</span>
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>

                      {isExpanded && (
                        <div className="p-3 bg-[#100e0c] grid grid-cols-1 sm:grid-cols-2 gap-2 border-t border-[#241f1a]">
                          {set.upgrades.map((tier) => {
                            const upgId = `armor-upg-${set.id}-${tier.level}`;
                            const isUpgDone = Boolean(completedItems[upgId]);
                            return (
                              <button
                                key={tier.level}
                                type="button"
                                onClick={() => toggleCompleted(upgId)}
                                className={`text-left p-2.5 rounded-lg border transition flex items-start gap-2 ${
                                  isUpgDone
                                    ? 'bg-amber-950/25 border-amber-500/40'
                                    : 'bg-[#171412] border-[#2c251f] hover:border-[#3e342c]'
                                }`}
                              >
                                <div
                                  className={`w-4 h-4 rounded flex items-center justify-center shrink-0 mt-0.5 border ${
                                    isUpgDone
                                      ? 'bg-amber-500 border-amber-400 text-black'
                                      : 'bg-black/40 border-gray-600'
                                  }`}
                                >
                                  {isUpgDone && <Check className="w-3 h-3 stroke-[3]" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between text-[11px] font-bold">
                                    <span className="text-amber-300">
                                      {'★'.repeat(tier.level)} Tier {tier.level}
                                    </span>
                                    <span className="text-gray-400 font-mono text-[10px]">
                                      Def {tier.defensePerPiece} • {tier.rupeesPerPiece}R/pc
                                    </span>
                                  </div>
                                  <div className="text-[10.5px] text-gray-300 mt-1 space-y-0.5">
                                    {tier.materials.map((mat, i) => (
                                      <div key={i}>• {mat} (per piece)</div>
                                    ))}
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
