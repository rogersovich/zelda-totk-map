import React, { useMemo, useState } from 'react';
import { useMapStore } from '../store/useMapStore';
import { MarkerPoint, SECTION_THEMES } from '../data';
import { FARMING_ROUTES } from '../data/farmingRoutes';
import { ALL_ZONAI_PARTS, DEVICE_DISPENSERS } from '../data/dispensers';
import {
  CATEGORY_SECTIONS,
  CategoryItem,
  CategorySection,
} from '../data/categoryDefinitions';
import {
  Search,
  X,
  Eye,
  EyeOff,
  RotateCcw,
  Menu,
  ChevronLeft,
  Compass,
  Sparkles,
  ChevronDown,
  ChevronUp,
  MapPin,
  Route,
  Cloud,
  Plus,
  Trash2,
  Edit3,
} from 'lucide-react';

interface SidebarProps {
  markers: MarkerPoint[];
}

export const Sidebar: React.FC<SidebarProps> = ({ markers }) => {
  const {
    activeLayer,
    setActiveLayer,
    flyToLocation,
    searchQuery,
    setSearchQuery,
    activeCategories,
    toggleCategory,
    enableAllCategories,
    disableAllCategories,
    showDragons,
    toggleDragons,
    selectedZonaiPart,
    setSelectedZonaiPart,
    completedItems,
    hideCompleted,
    toggleHideCompleted,
    sidebarOpen,
    setSidebarOpen,
    resetAllProgress,
    customPins,
    isAddingPinMode,
    setIsAddingPinMode,
    openPinModal,
    deleteCustomPin,
    activeFarmingRouteId,
    setActiveFarmingRoute,
    currentUser,
    openAuthModal,
    isSyncing,
  } = useMapStore();

  const [zonaiFinderOpen, setZonaiFinderOpen] = useState(false);
  const [customPinsOpen, setCustomPinsOpen] = useState(false);
  const [farmingRoutesOpen, setFarmingRoutesOpen] = useState(false);

  // Matching dispensers for the active Zonai part
  const matchingDispensers = useMemo(() => {
    if (!selectedZonaiPart) return [];
    const query = selectedZonaiPart.toLowerCase().replace('big ', '').trim();
    return DEVICE_DISPENSERS.filter((d) =>
      d.items.some(
        (it) => it.toLowerCase().includes(query) || selectedZonaiPart.toLowerCase().includes(it.toLowerCase())
      )
    );
  }, [selectedZonaiPart]);

  const handleSelectZonaiPart = (part: string) => {
    if (selectedZonaiPart === part) {
      setSelectedZonaiPart(null);
      return;
    }

    setSelectedZonaiPart(part);

    const query = part.toLowerCase().replace('big ', '').trim();
    const matches = DEVICE_DISPENSERS.filter((d) =>
      d.items.some(
        (it) => it.toLowerCase().includes(query) || part.toLowerCase().includes(it.toLowerCase())
      )
    );

    if (matches.length > 0) {
      const hasOnCurrentLayer = matches.some((d) => d.layer === activeLayer);
      const target = hasOnCurrentLayer
        ? matches.find((d) => d.layer === activeLayer)!
        : matches[0];

      if (target.layer !== activeLayer) {
        setActiveLayer(target.layer);
      }

      flyToLocation(target.position.z, target.position.x, 6);
    }
  };

  // Calculate Progress Stats
  const stats = useMemo(() => {
    const totalShrines = 152;
    const totalLightroots = 120;
    const totalTowers = 15;
    const totalKoroks = 1000;

    let doneShrines = 0;
    let doneLightroots = 0;
    let doneTowers = 0;
    let doneKoroks = 0;

    Object.keys(completedItems).forEach((id) => {
      if (id.startsWith('shrine-')) doneShrines++;
      else if (id.startsWith('lightroot-')) doneLightroots++;
      else if (id.startsWith('tower-')) doneTowers++;
      else if (id.startsWith('korok-')) doneKoroks++;
    });

    const totalCollected = Object.keys(completedItems).length;

    return {
      shrines: { done: doneShrines, total: totalShrines },
      lightroots: { done: doneLightroots, total: totalLightroots },
      towers: { done: doneTowers, total: totalTowers },
      koroks: { done: doneKoroks, total: totalKoroks },
      totalCollected,
    };
  }, [completedItems]);

  // Render Single Item in 2-column layout
  const renderItem = (item: CategoryItem) => {
    const isActive = activeCategories.has(item.id);

    return (
      <button
        key={item.id}
        onClick={() => toggleCategory(item.id)}
        className={`w-full flex items-center justify-between py-1.5 px-2 rounded transition-all text-left select-none group cursor-pointer active:scale-[0.98] touch-manipulation min-h-[32px] ${
          isActive
            ? 'text-white font-bold bg-white/[0.06] hover:bg-white/10'
            : 'text-[#A8A096] hover:bg-white/5'
        }`}
        title={`${item.name} (${item.count}) - Click to toggle visibility`}
      >
        <div className="flex items-center space-x-1.5 min-w-0 pr-1">
          <img
            src={item.icon}
            alt={item.name}
            className={`w-4 h-4 object-contain shrink-0 transition-opacity ${
              isActive ? 'opacity-100 brightness-110' : 'opacity-70 group-hover:opacity-100'
            }`}
          />
          <span
            className={`text-[11px] uppercase tracking-tight truncate leading-tight transition-all ${
              isActive
                ? 'no-underline text-white font-bold'
                : 'line-through decoration-[#8A8073]/90 text-[#A8A096] group-hover:text-white'
            }`}
          >
            {item.name}
          </span>
        </div>
        <span
          className={`text-[11px] font-mono shrink-0 ml-1 transition-colors ${
            isActive ? 'text-[#E2DACB] font-bold' : 'text-[#877F74] group-hover:text-[#C5BDB0]'
          }`}
        >
          {item.count}
        </span>
      </button>
    );
  };

  return (
    <>
      {/* Floating Toggle Button when Sidebar is closed */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 flex items-center justify-center space-x-1.5 sm:space-x-2 bg-[#1C1A18]/95 border border-[#3A332C] px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-xl shadow-2xl text-totk-zonai hover:bg-[#282420] transition backdrop-blur-md active:scale-95 touch-manipulation"
          aria-label="Open Tracker Menu"
          title="Open Tracker Menu"
        >
          <Menu className="w-4 h-4" />
          <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">Tracker Menu</span>
        </button>
      )}

      {/* Mobile Backdrop Overlay - closes drawer when tapping map */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-25 md:hidden transition-opacity"
        />
      )}

      {/* Main Sidebar Drawer (Solid Opaque Dark Background - Never Translucent) */}
      <aside
        className={`fixed md:absolute top-0 left-0 h-full h-[100dvh] w-[88vw] max-w-[340px] sm:max-w-[380px] bg-[#141211] border-r border-[#2E2824] z-30 shadow-[0_0_40px_rgba(0,0,0,0.85)] flex flex-col transition-transform duration-300 ease-in-out select-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ backgroundColor: '#141211' }}
      >
        {/* Header */}
        <div className="p-3 sm:p-3.5 border-b border-[#2E2824] flex items-center justify-between bg-[#141211]">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-totk-zonai to-totk-gold p-0.5 shadow-lg shadow-totk-zonai/20">
              <div className="w-full h-full bg-[#171514] rounded-[6px] flex items-center justify-center">
                <Compass className="w-3.5 h-3.5 text-totk-zonai" />
              </div>
            </div>
            <div>
              <h1 className="font-['Cinzel',serif] text-sm font-black tracking-wider text-[#E8E1D5]">
                HYRULE COMPANION
              </h1>
              <p className="text-[10px] text-gray-400 font-mono">Tears of the Kingdom</p>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 active:scale-95 transition touch-manipulation"
            title="Collapse Sidebar"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content (Solid Dark Opaque Background) */}
        <div
          className="flex-1 overflow-y-auto px-3.5 py-3 space-y-3 custom-scrollbar bg-[#141211]"
          style={{ backgroundColor: '#141211' }}
        >
          {/* Cloudflare D1 Account & Sync Banner */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#0f141d] border border-[#1f2b3e] text-xs shadow-sm">
            <div className="flex items-center gap-2 min-w-0">
              <div
                className={`p-1.5 rounded-lg shrink-0 ${
                  currentUser
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'bg-gray-800 text-gray-400 border border-gray-700'
                }`}
              >
                <Cloud className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-white truncate flex items-center gap-1.5">
                  <span className="truncate">{currentUser ? currentUser.username : 'Guest Mode'}</span>
                  {currentUser && (
                    <span className="text-[8.5px] px-1 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
                      D1
                    </span>
                  )}
                </div>
                <div className="text-[9.5px] text-gray-400 truncate">
                  {currentUser
                    ? isSyncing
                      ? 'Menyinkronkan...'
                      : 'Tersimpan Selamanya'
                    : 'Simpan ke Cloud'}
                </div>
              </div>
            </div>
            <button
              onClick={openAuthModal}
              className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold border transition shrink-0 ${
                currentUser
                  ? 'bg-[#182332] border-cyan-500/40 text-cyan-300 hover:bg-[#202f43]'
                  : 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30'
              }`}
            >
              {currentUser ? 'Akun' : 'Login'}
            </button>
          </div>

          {/* Instant Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Shrines, Caves, Bosses..."
              className="w-full bg-[#100E0D] border border-[#2E2824] rounded-lg pl-9 pr-9 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-totk-zonai transition font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Progress Tracker Card */}
          <div className="bg-[#12100F] border border-[#2A2420] rounded-lg p-2.5 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-gray-300">Completion Tracker</span>
              <span className="text-totk-gold font-mono text-[11px] font-bold">
                {stats.totalCollected} Found
              </span>
            </div>

            {/* Quick mini stats */}
            <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono">
              <div className="bg-[#1A1816] border border-[#2E2824] rounded px-2 py-1 flex justify-between items-center">
                <span className="text-cyan-400">Shrines</span>
                <span>
                  {stats.shrines.done}/{stats.shrines.total}
                </span>
              </div>
              <div className="bg-[#1A1816] border border-[#2E2824] rounded px-2 py-1 flex justify-between items-center">
                <span className="text-emerald-400">Lightroots</span>
                <span>
                  {stats.lightroots.done}/{stats.lightroots.total}
                </span>
              </div>
              <div className="bg-[#1A1816] border border-[#2E2824] rounded px-2 py-1 flex justify-between items-center">
                <span className="text-blue-400">Towers</span>
                <span>
                  {stats.towers.done}/{stats.towers.total}
                </span>
              </div>
              <div className="bg-[#1A1816] border border-[#2E2824] rounded px-2 py-1 flex justify-between items-center">
                <span className="text-lime-400">Koroks</span>
                <span>
                  {stats.koroks.done}/{stats.koroks.total}
                </span>
              </div>
            </div>
          </div>

          {/* Action Filter Controls */}
          <div className="flex items-center justify-between gap-1.5 text-xs">
            <button
              onClick={enableAllCategories}
              className="flex-1 py-1.5 px-2 rounded bg-[#201C1A] hover:bg-[#2C2622] text-[#D0C7B8] font-semibold transition text-center text-[11px] border border-[#352E28]"
            >
              Show All
            </button>
            <button
              onClick={disableAllCategories}
              className="flex-1 py-1.5 px-2 rounded bg-[#201C1A] hover:bg-[#2C2622] text-[#D0C7B8] font-semibold transition text-center text-[11px] border border-[#352E28]"
            >
              Hide All
            </button>
            <button
              onClick={toggleHideCompleted}
              className={`flex items-center justify-center space-x-1.5 py-1.5 px-2.5 rounded text-[11px] font-semibold transition border ${
                hideCompleted
                  ? 'bg-totk-zonai/20 border-totk-zonai text-totk-zonai'
                  : 'bg-[#201C1A] border-[#352E28] text-gray-400 hover:text-white'
              }`}
              title="Hide marked items"
            >
              {hideCompleted ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              <span>Hide Done</span>
            </button>
          </div>

          {/* Dragon Flight Paths Toggle */}
          <div className="bg-[#131110] border border-[#2A2420] rounded-lg p-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-[#EAE2D5]">Dragon Flight Paths</div>
                <div className="text-[9px] text-gray-400">Light Dragon, Naydra, Dinraal, Farosh</div>
              </div>
            </div>
            <button
              onClick={toggleDragons}
              className={`w-8 h-4 rounded-full p-0.5 transition-colors duration-200 ease-in-out ${
                showDragons ? 'bg-totk-zonai' : 'bg-gray-700'
              }`}
            >
              <div
                className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                  showDragons ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* My Custom Pins Collapsible */}
          <div className="bg-[#131110] border border-[#2A2420] rounded-lg p-2 space-y-1.5">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCustomPinsOpen(!customPinsOpen)}
                className="flex-1 flex items-center justify-between text-xs font-bold text-[#EAE2D5] text-left pr-2"
              >
                <span className="flex items-center space-x-1.5 text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>My Custom Pins</span>
                  <span className="text-[10px] text-amber-400 font-mono font-bold">({customPins.length})</span>
                </span>
                {customPinsOpen ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
              </button>
              <button
                onClick={() => setIsAddingPinMode(!isAddingPinMode)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition flex items-center gap-1 border ${
                  isAddingPinMode
                    ? 'bg-amber-500/30 border-amber-400 text-amber-300 animate-pulse'
                    : 'bg-[#201c19] border-[#362e26] text-amber-300 hover:bg-[#2c2621]'
                }`}
                title="Drop a pin on the map"
              >
                <Plus className="w-3 h-3" />
                <span>{isAddingPinMode ? 'Click Map' : 'Add'}</span>
              </button>
            </div>

            {customPinsOpen && (
              <div className="pt-1.5 space-y-1.5 border-t border-[#2A2420] max-h-52 overflow-y-auto custom-scrollbar">
                {customPins.length === 0 ? (
                  <div className="p-2.5 text-center text-[10.5px] text-gray-400 bg-[#0e0c0b] rounded-md border border-[#26201b]">
                    Belum ada pin kustom. Klik <strong>Add</strong> lalu klik di peta, atau klik kanan di mana saja!
                  </div>
                ) : (
                  customPins.map((pin) => (
                    <div
                      key={pin.id}
                      className="flex items-center justify-between p-2 rounded-md bg-[#0e0c0b] hover:bg-[#1a1613] border border-[#26201b] transition group"
                    >
                      <button
                        onClick={() => {
                          setActiveLayer(pin.layer);
                          flyToLocation(pin.lat, pin.lng, 5);
                        }}
                        className="flex-1 flex items-start gap-2 text-left min-w-0"
                      >
                        <div
                          className="w-5 h-5 rounded flex items-center justify-center text-xs shrink-0 mt-0.5 font-bold shadow-sm"
                          style={{
                            backgroundColor:
                              pin.color === 'cyan'
                                ? '#00f0ff'
                                : pin.color === 'red'
                                ? '#ef4444'
                                : pin.color === 'green'
                                ? '#10b981'
                                : pin.color === 'yellow'
                                ? '#eab308'
                                : pin.color === 'blue'
                                ? '#3b82f6'
                                : '#a855f7',
                            color: '#000',
                          }}
                        >
                          {pin.icon === 'sword'
                            ? '🗡️'
                            : pin.icon === 'shield'
                            ? '🛡️'
                            : pin.icon === 'bow'
                            ? '🏹'
                            : pin.icon === 'star'
                            ? '⭐'
                            : pin.icon === 'skull'
                            ? '💀'
                            : pin.icon === 'ore'
                            ? '💎'
                            : pin.icon === 'leaf'
                            ? '🍃'
                            : pin.icon === 'pot'
                            ? '🍲'
                            : '📍'}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[11px] font-bold text-white truncate group-hover:text-amber-200">
                            {pin.title}
                          </div>
                          <div className="text-[9.5px] text-gray-400 capitalize">
                            {pin.layer} • ({Math.round(pin.lng)}, {Math.round(pin.lat)})
                          </div>
                          {pin.note && (
                            <div className="text-[9px] text-gray-400 truncate mt-0.5">{pin.note}</div>
                          )}
                        </div>
                      </button>
                      <div className="flex items-center gap-1 shrink-0 ml-1">
                        <button
                          onClick={() =>
                            openPinModal({
                              lat: pin.lat,
                              lng: pin.lng,
                              layer: pin.layer,
                              existingPin: pin,
                            })
                          }
                          className="p-1 rounded text-gray-400 hover:text-white hover:bg-white/10"
                          title="Edit pin"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => deleteCustomPin(pin.id)}
                          className="p-1 rounded text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                          title="Delete pin"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Material Farming Routes Collapsible */}
          <div className="bg-[#131110] border border-[#2A2420] rounded-lg p-2 space-y-1.5">
            <button
              onClick={() => setFarmingRoutesOpen(!farmingRoutesOpen)}
              className="w-full flex items-center justify-between text-xs font-bold text-[#EAE2D5] text-left"
            >
              <span className="flex items-center space-x-1.5 text-[11px]">
                <Route className="w-3.5 h-3.5 text-emerald-400" />
                <span>Farming Routes (Jalur Panen)</span>
                {activeFarmingRouteId && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 animate-pulse">
                    ACTIVE
                  </span>
                )}
              </span>
              <div className="flex items-center space-x-1 text-gray-400">
                {farmingRoutesOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </div>
            </button>

            {farmingRoutesOpen && (
              <div className="pt-1.5 space-y-2 border-t border-[#2A2420]">
                {FARMING_ROUTES.map((route) => {
                  const isActive = activeFarmingRouteId === route.id;
                  return (
                    <div
                      key={route.id}
                      className={`p-2 rounded-lg border transition ${
                        isActive
                          ? 'bg-[#181512] border-emerald-500/60 shadow-sm'
                          : 'bg-[#0e0c0b] border-[#26201b] hover:bg-[#1a1613]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${route.badgeBg}`}>
                              {route.layer}
                            </span>
                            <span className="text-[11.5px] font-bold text-white">
                              {route.name}
                            </span>
                          </div>
                          <div className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                            <span>🚀 Start:</span>
                            <span className="text-gray-300 font-medium">{route.startLocation}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-[10.5px] font-medium text-emerald-300/90 bg-emerald-950/30 px-2 py-1 rounded border border-emerald-900/40 my-1.5">
                        📦 {route.estimatedYield}
                      </div>

                      <div className="text-[9.5px] text-gray-400 leading-snug line-clamp-2 mb-2">
                        {route.description}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            if (isActive) {
                              setActiveFarmingRoute(null);
                            } else {
                              setActiveLayer(route.layer);
                              setActiveFarmingRoute(route.id);
                              flyToLocation(route.path[0][0], route.path[0][1], 5);
                            }
                          }}
                          className={`flex-1 py-1 px-2 rounded text-[10.5px] font-bold transition flex items-center justify-center gap-1.5 border ${
                            isActive
                              ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 hover:bg-rose-500/30'
                              : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
                          }`}
                        >
                          <Route className="w-3 h-3" />
                          <span>{isActive ? 'Matikan Jalur' : 'Tampilkan Jalur'}</span>
                        </button>

                        {isActive && (
                          <button
                            onClick={() => {
                              setActiveLayer(route.layer);
                              flyToLocation(route.path[0][0], route.path[0][1], 5);
                            }}
                            className="py-1 px-2 rounded text-[10.5px] font-bold bg-[#26201b] border border-[#3b322a] text-gray-300 hover:text-white hover:bg-[#342b23] transition"
                            title="Fokus ke Titik Start"
                          >
                            Titik Start
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Zonai Parts Finder Collapsible */}
          <div className="bg-[#131110] border border-[#2A2420] rounded-lg p-2 space-y-1.5">
            <button
              onClick={() => setZonaiFinderOpen(!zonaiFinderOpen)}
              className="w-full flex items-center justify-between text-xs font-bold text-[#EAE2D5]"
            >
              <span className="flex items-center space-x-1.5 text-[11px]">
                <span>⚙️ Zonai Parts Finder (27 Devices)</span>
                {selectedZonaiPart && (
                  <span className="text-[10px] text-amber-400 font-mono">({selectedZonaiPart})</span>
                )}
              </span>
              <div className="flex items-center space-x-1 text-gray-400">
                {zonaiFinderOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </div>
            </button>

            {zonaiFinderOpen && (
              <div className="pt-1.5 space-y-2 border-t border-[#2A2420]">
                {/* All 27 Zonai Devices (Fully visible, alphabetical) */}
                <div className="flex flex-wrap gap-1">
                  {ALL_ZONAI_PARTS.map((part) => {
                    const isSelected = selectedZonaiPart === part;
                    return (
                      <button
                        key={part}
                        onClick={() => handleSelectZonaiPart(part)}
                        className={`text-[10px] sm:text-[9.5px] px-2 sm:px-1.5 py-1 sm:py-0.5 rounded transition font-medium border active:scale-95 touch-manipulation ${
                          isSelected
                            ? 'bg-amber-500 text-black border-amber-400 font-bold'
                            : 'bg-[#1C1A18] hover:bg-[#282420] text-gray-300 border-[#2E2824]'
                        }`}
                      >
                        {part}
                      </button>
                    );
                  })}
                </div>

                {/* Matching Dispensers List with 1-click jump & layer indicator */}
                {selectedZonaiPart && (
                  <div className="pt-2 border-t border-[#2A2420] space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-amber-300 font-bold">
                      <span>Found {matchingDispensers.length} Dispenser{matchingDispensers.length > 1 ? 's' : ''}:</span>
                      <button
                        onClick={() => setSelectedZonaiPart(null)}
                        className="text-[10px] text-gray-400 hover:text-white underline lowercase font-normal"
                      >
                        clear
                      </button>
                    </div>

                    <div className="max-h-44 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                      {matchingDispensers.map((disp) => {
                        const isCurrentLayer = disp.layer === activeLayer;
                        return (
                          <button
                            key={disp.id}
                            onClick={() => {
                              if (disp.layer !== activeLayer) setActiveLayer(disp.layer);
                              flyToLocation(disp.position.z, disp.position.x, 6);
                            }}
                            className={`w-full flex items-center justify-between p-1.5 rounded border transition text-left text-xs group ${
                              isCurrentLayer
                                ? 'bg-[#221c17] hover:bg-[#2c241d] border-amber-600/40 hover:border-amber-500'
                                : 'bg-black/40 hover:bg-white/5 border-[#302822] hover:border-gray-600'
                            }`}
                          >
                            <div className="min-w-0 pr-1">
                              <div className="text-[11px] font-semibold text-gray-200 group-hover:text-amber-200 truncate">
                                {disp.name}
                              </div>
                              <div className="text-[9.5px] text-gray-400 truncate">
                                {disp.location}
                              </div>
                            </div>
                            <span
                              className={`text-[9px] uppercase font-mono font-bold px-1.5 py-0.5 rounded shrink-0 ${
                                disp.layer === 'sky'
                                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                                  : disp.layer === 'depths'
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              }`}
                            >
                              {disp.layer}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 2-Column Categorized Sections (MapGenie Style) */}
          <div className="space-y-4 pt-1">
            {CATEGORY_SECTIONS.map((section: CategorySection) => (
              <div key={section.id} className="space-y-1.5">
                {/* Section Header */}
                <div className="flex items-center justify-between border-b border-[#362F29] pb-1 pt-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full shadow-sm"
                      style={{ backgroundColor: SECTION_THEMES[section.id]?.hex || '#d4b996' }}
                    />
                    <h2 className="font-['Cinzel',serif] text-xs font-black tracking-wider text-[#EAE3D6] uppercase">
                      {section.title}
                    </h2>
                  </div>
                </div>

                {/* 2-Column Grid */}
                <div className="grid grid-cols-2 gap-x-2.5 items-start">
                  {/* Left Column */}
                  <div className="flex flex-col space-y-0.5">
                    {section.left.map((item) => renderItem(item))}
                  </div>

                  {/* Right Column */}
                  <div className="flex flex-col space-y-0.5">
                    {section.right.map((item) => renderItem(item))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-2.5 border-t border-[#2E2824] flex items-center justify-between text-xs text-gray-400 bg-[#141211]">
          <span className="text-[10px] text-[#A0988C]">100% Free & Unlimited Tracker</span>
          <button
            onClick={resetAllProgress}
            className="flex items-center space-x-1 text-[10px] text-gray-400 hover:text-rose-400 transition"
            title="Reset progress"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </aside>
    </>
  );
};
