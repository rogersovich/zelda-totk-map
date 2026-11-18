import React, { useMemo, useEffect } from 'react';
import { loadAllMarkers } from './data';
import { FARMING_ROUTES } from './data/farmingRoutes';
import { MapCanvas } from './components/MapCanvas';
import { LayerSwitcher } from './components/LayerSwitcher';
import { Sidebar } from './components/Sidebar';
import { CustomPinModal } from './components/CustomPinModal';
import { AuthModal } from './components/AuthModal';
import { ArmorPlannerModal } from './components/ArmorPlannerModal';
import { useMapStore } from './store/useMapStore';
import { Route as RouteIcon, X as CloseIcon } from 'lucide-react';

export const App: React.FC = () => {
  const {
    transitionToast,
    activeFarmingRouteId,
    setActiveFarmingRoute,
    flyToLocation,
    setActiveLayer,
    setSelectedMarker,
    activeCategories,
    toggleCategory,
    initAuth,
  } = useMapStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const activeRoute = useMemo(() => {
    return FARMING_ROUTES.find((r) => r.id === activeFarmingRouteId) || null;
  }, [activeFarmingRouteId]);

  // Pre-load and memoize all markers from data sources
  const allMarkers = useMemo(() => {
    return loadAllMarkers();
  }, []);

  // Handle Shareable URL / Deeplink (?layer=...&lat=...&lng=...&zoom=...&marker=...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const layerParam = params.get('layer');
    const markerId = params.get('marker');
    const latParam = params.get('lat');
    const lngParam = params.get('lng');
    const zoomParam = Number(params.get('zoom')) || 6;

    if (!markerId && (!latParam || !lngParam)) return;

    if (markerId) {
      const target = allMarkers.find((m) => m.id === markerId);
      if (target) {
        setActiveLayer(target.layer);
        if (!activeCategories.has(target.category)) {
          toggleCategory(target.category);
        }
        setTimeout(() => {
          flyToLocation(target.lat, target.lng, zoomParam, target.id);
          setSelectedMarker(target);
        }, 250);
        return;
      }
    }

    const lat = Number(latParam);
    const lng = Number(lngParam);
    if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
      if (layerParam === 'surface' || layerParam === 'sky' || layerParam === 'depths') {
        setActiveLayer(layerParam);
      }
      setTimeout(() => {
        flyToLocation(lat, lng, zoomParam);
      }, 250);
    }
    // Run only once on initial mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-totk-bg select-none">
      {/* Interactive Leaflet Map Canvas with Anchor Popovers */}
      <MapCanvas markers={allMarkers} />

      {/* Custom Pin Creation / Edit Modal */}
      <CustomPinModal />

      {/* Cloudflare D1 Auth & Cloud Sync Modal */}
      <AuthModal />

      {/* Armor Sets & Great Fairy Upgrade Planner Modal */}
      <ArmorPlannerModal />

      {/* Floating Transition Toast for Chasm Dives and Ascends */}
      {transitionToast && (
        <div className="absolute top-4 sm:top-6 left-1/2 -translate-x-1/2 z-[2000] pointer-events-none transition-all duration-300">
          <div
            className={`flex items-center gap-2.5 px-4 py-2 rounded-full backdrop-blur-md border shadow-2xl animate-bounce ${
              transitionToast.type === 'dive'
                ? 'bg-red-950/90 border-red-500/50 text-rose-200 shadow-red-950/80'
                : 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200 shadow-emerald-950/80'
            }`}
          >
            <span className="text-xs sm:text-sm font-bold tracking-wide">
              {transitionToast.message}
            </span>
          </div>
        </div>
      )}

      {/* Floating Active Farming Route HUD Bar */}
      {activeRoute && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1500] max-w-[92vw] sm:max-w-xl pointer-events-auto">
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#0c141e]/95 border border-emerald-500/50 backdrop-blur-md shadow-2xl text-white">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
              <RouteIcon className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded border uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
                  {activeRoute.layer}
                </span>
                <span className="text-xs sm:text-sm font-bold truncate">
                  {activeRoute.name}
                </span>
              </div>
              <div className="text-[11px] text-emerald-300/90 truncate mt-0.5">
                📦 {activeRoute.estimatedYield}
              </div>
            </div>
            <button
              onClick={() => {
                setActiveLayer(activeRoute.layer);
                flyToLocation(activeRoute.path[0][0], activeRoute.path[0][1], 5);
              }}
              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#1d2837] hover:bg-[#28384d] border border-cyan-500/30 text-cyan-300 shrink-0 transition"
            >
              Start
            </button>
            <button
              onClick={() => setActiveFarmingRoute(null)}
              className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white shrink-0 transition"
              title="Tutup Jalur"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Layer Switcher (Sky, Surface, Depths) */}
      <LayerSwitcher />

      {/* Interactive Sidebar & Progress Tracker */}
      <Sidebar markers={allMarkers} />
    </div>
  );
};

export default App;
