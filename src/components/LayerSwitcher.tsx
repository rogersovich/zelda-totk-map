import React from 'react';
import { useMapStore, MapLayer } from '../store/useMapStore';
import { Cloud, Mountain, Flame, MapPin } from 'lucide-react';

export const LayerSwitcher: React.FC = () => {
  const { activeLayer, setActiveLayer, isAddingPinMode, setIsAddingPinMode } = useMapStore();

  const layers: { id: MapLayer; name: string; icon: React.ReactNode; color: string; bgActive: string }[] = [
    {
      id: 'sky',
      name: 'Sky',
      icon: <Cloud className="w-4 h-4" />,
      color: 'text-sky-400',
      bgActive: 'bg-sky-500/20 border-sky-400 text-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.3)]',
    },
    {
      id: 'surface',
      name: 'Surface',
      icon: <Mountain className="w-4 h-4" />,
      color: 'text-emerald-400',
      bgActive: 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]',
    },
    {
      id: 'depths',
      name: 'Depths',
      icon: <Flame className="w-4 h-4" />,
      color: 'text-rose-400',
      bgActive: 'bg-rose-500/20 border-rose-400 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.3)]',
    },
  ];

  return (
    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 flex bg-totk-card/95 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-totk-border shadow-2xl">
      {layers.map((layer) => {
        const isActive = activeLayer === layer.id;
        return (
          <button
            key={layer.id}
            onClick={() => setActiveLayer(layer.id)}
            className={`flex items-center justify-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-3.5 py-2 sm:py-2 rounded-lg text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-all duration-200 border active:scale-95 touch-manipulation ${
              isActive
                ? layer.bgActive
                : 'border-transparent text-gray-400 hover:text-white hover:bg-totk-hover'
            }`}
            title={`Switch to ${layer.name} map`}
          >
            {layer.icon}
            <span className="hidden sm:inline">{layer.name}</span>
          </button>
        );
      })}

      {/* Custom Pin Placement Toggle Button */}
      <div className="w-[1px] h-5 bg-[#332c25] my-auto mx-1" />
      <button
        onClick={() => setIsAddingPinMode(!isAddingPinMode)}
        className={`flex items-center justify-center space-x-1.5 px-2.5 sm:px-3 py-2 rounded-lg text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-all duration-200 border active:scale-95 touch-manipulation ${
          isAddingPinMode
            ? 'bg-amber-500/25 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.4)] animate-pulse'
            : 'border-transparent text-amber-400 hover:text-amber-300 hover:bg-totk-hover'
        }`}
        title="Add custom pin: Click anywhere on the map or right-click"
      >
        <MapPin className="w-4 h-4" />
        <span className="hidden sm:inline">{isAddingPinMode ? 'Click Map' : '+ Pin'}</span>
      </button>
    </div>
  );
};
