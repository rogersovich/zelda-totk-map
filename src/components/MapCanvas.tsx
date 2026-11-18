import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import L from 'leaflet';
import 'leaflet-rastercoords';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import { useMapStore } from '../store/useMapStore';
import { MarkerPoint, DRAGONS, getCategoryTheme } from '../data';
import { FARMING_ROUTES } from '../data/farmingRoutes';
import { PROVINCE_BOUNDARIES } from '../data/provinceBoundaries';
import { MarkerPopover } from './MarkerPopover';

declare module 'leaflet' {
  export type RasterCoords = any;
  export let RasterCoords: any;
}

interface MapCanvasProps {
  markers: MarkerPoint[];
}

const TILE_SIZE = 256;
const MAP_SIZE = [24000, 20000];
const MAP_VIEW_KEY = 'zelda_totk_map_view_v1';
const DENSE_CLUSTER_CATEGORIES = new Set(['cave', 'bubbul', 'well', 'chasm']);

// Subpixel seam fix: Expand tiles by 1px so adjacent tiles seamlessly overlap by 1 subpixel.
// Completely eliminates browser Chromium/WebKit 1px grid lines/seams without canvas redraw bugs.
const originalInitTile = (L.GridLayer.prototype as any)._initTile;
if (originalInitTile && !(L.GridLayer.prototype as any)._hasNoGapPatch) {
  (L.GridLayer.prototype as any)._hasNoGapPatch = true;
  L.GridLayer.include({
    _initTile: function (tile: HTMLElement) {
      originalInitTile.call(this, tile);
      const tileSize = this.getTileSize();
      tile.style.width = tileSize.x + 1 + 'px';
      tile.style.height = tileSize.y + 1 + 'px';
    },
  });
}

function getSavedMapView(): { lat: number; lng: number; zoom: number } | null {
  try {
    const raw = localStorage.getItem(MAP_VIEW_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export const MapCanvas: React.FC<MapCanvasProps> = ({ markers }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const currentTileLayerRef = useRef<L.TileLayer | null>(null);
  const markerLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const korokClusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);
  const denseClusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);
  const dragonLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const pathLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const customPinLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const farmingRouteLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const provinceLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const mapBoundsRef = useRef<L.LatLngBounds | null>(null);
  const popupRef = useRef<L.Popup | null>(null);
  const popupContainerRef = useRef<HTMLDivElement>(document.createElement('div'));

  const {
    activeLayer,
    activeCategories,
    searchQuery,
    showDragons,
    showProvinceBoundaries,
    selectedZonaiPart,
    completedItems,
    hideCompleted,
    flyToTarget,
    selectedMarker,
    customPins,
    isAddingPinMode,
    activeFarmingRouteId,
    openPinModal,
    clearFlyTo,
    setSelectedMarker,
  } = useMapStore();

  // 1. Initialize Map with exact TotK raster transformation
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const crs = L.Util.extend({}, L.CRS.Simple);
    // @ts-ignore
    crs.transformation = new L.Transformation(
      4 / TILE_SIZE,
      MAP_SIZE[0] / TILE_SIZE,
      4 / TILE_SIZE,
      MAP_SIZE[1] / TILE_SIZE
    );

    const savedView = getSavedMapView();
    const initialCenter: [number, number] = savedView ? [savedView.lat, savedView.lng] : [0, 0];
    const initialZoom = savedView ? savedView.zoom : 3;

    const map = L.map(mapContainerRef.current, {
      crs,
      minZoom: 2,
      maxZoom: 9,
      zoom: initialZoom,
      center: initialCenter,
      maxBoundsViscosity: 1.0, // Hard stop at map boundaries: user CANNOT drag past into empty void!
      zoomSnap: 1,            // Integer zoom snap eliminates fractional subpixel rendering blur
      zoomDelta: 1,
      zoomControl: false,
      attributionControl: false,
      fadeAnimation: true,
      zoomAnimation: true,
      markerZoomAnimation: true,
    });

    // Save map view on pan/zoom
    map.on('moveend', () => {
      try {
        const c = map.getCenter();
        const z = map.getZoom();
        localStorage.setItem(
          MAP_VIEW_KEY,
          JSON.stringify({ lat: Math.round(c.lat), lng: Math.round(c.lng), zoom: z })
        );
      } catch (e) {}
    });

    // Track zoom level on container for dynamic pin scaling
    const updateZoomClass = () => {
      const z = map.getZoom();
      const container = map.getContainer();
      if (!container) return;
      container.className = container.className.replace(/\btotk-zoom-\d+\b/g, '').trim();
      container.classList.add(`totk-zoom-${Math.min(9, Math.max(2, Math.round(z)))}`);
    };

    map.on('zoom', updateZoomClass);
    map.on('zoomend', updateZoomClass);
    updateZoomClass();

    const rc = new (L as any).RasterCoords(map, MAP_SIZE);
    const southWest = rc.unproject([0, MAP_SIZE[1]]);
    const northEast = rc.unproject([MAP_SIZE[0], 0]);
    const bounds = new L.LatLngBounds(southWest, northEast);
    map.setMaxBounds(bounds);
    mapBoundsRef.current = bounds;

    // Add zoom control at bottom-right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Coordinate display control at bottom-left
    const CoordControl = L.Control.extend({
      options: { position: 'bottomleft' },
      onAdd: function () {
        const div = L.DomUtil.create(
          'div',
          'coord-display bg-totk-card/90 border border-totk-border px-3 py-1.5 rounded-lg text-xs font-mono text-totk-zonai shadow-lg backdrop-blur-md flex items-center space-x-3 pointer-events-none'
        );
        div.id = 'cursor-coords';
        div.innerHTML = `<span>X: 0</span><span>Z: 0</span>`;
        return div;
      },
    });
    new CoordControl().addTo(map);

    map.on('mousemove', (e) => {
      const coordEl = document.getElementById('cursor-coords');
      if (coordEl) {
        const x = Math.round(e.latlng.lng);
        const z = Math.round(e.latlng.lat);
        coordEl.innerHTML = `
          <span class="text-gray-400">Purah Pad:</span>
          <span>X: <strong class="text-white">${x.toString().padStart(4, '0')}</strong></span>
          <span>Z: <strong class="text-white">${z.toString().padStart(4, '0')}</strong></span>
        `;
      }
    });

    // Create layer groups
    const provinceGroup = L.layerGroup().addTo(map);
    const markerGroup = L.layerGroup().addTo(map);
    const korokClusterGroup = L.markerClusterGroup({
      chunkedLoading: true,
      maxClusterRadius: 55,
      disableClusteringAtZoom: 6,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      iconCreateFunction: (cluster) => {
        const count = cluster.getChildCount();
        const size = count >= 100 ? 38 : count >= 10 ? 34 : 30;
        return L.divIcon({
          html: `<div class="totk-cluster-badge is-korok"><span>🌿</span><span>${count}</span></div>`,
          className: 'totk-cluster-icon',
          iconSize: L.point(size, size),
        });
      },
    }).addTo(map);

    const denseClusterGroup = L.markerClusterGroup({
      chunkedLoading: true,
      maxClusterRadius: 48,
      disableClusteringAtZoom: 6,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      iconCreateFunction: (cluster) => {
        const count = cluster.getChildCount();
        const size = count >= 100 ? 38 : count >= 10 ? 34 : 30;
        return L.divIcon({
          html: `<div class="totk-cluster-badge is-dense"><span>📍</span><span>${count}</span></div>`,
          className: 'totk-cluster-icon',
          iconSize: L.point(size, size),
        });
      },
    }).addTo(map);

    const dragonGroup = L.layerGroup().addTo(map);
    const pathGroup = L.layerGroup().addTo(map);
    const customPinGroup = L.layerGroup().addTo(map);
    const farmingGroup = L.layerGroup().addTo(map);

    provinceLayerGroupRef.current = provinceGroup;
    markerLayerGroupRef.current = markerGroup;
    korokClusterGroupRef.current = korokClusterGroup;
    denseClusterGroupRef.current = denseClusterGroup;
    dragonLayerGroupRef.current = dragonGroup;
    pathLayerGroupRef.current = pathGroup;
    customPinLayerGroupRef.current = customPinGroup;
    farmingRouteLayerGroupRef.current = farmingGroup;
    mapInstanceRef.current = map;

    // Right-click (desktop) or long-press (mobile) to place custom pin
    map.on('contextmenu', (e: L.LeafletMouseEvent) => {
      openPinModal({
        lat: Math.round(e.latlng.lat),
        lng: Math.round(e.latlng.lng),
        layer: useMapStore.getState().activeLayer,
      });
    });

    // Map click in Add Pin Mode
    map.on('click', (e: L.LeafletMouseEvent) => {
      if (useMapStore.getState().isAddingPinMode) {
        openPinModal({
          lat: Math.round(e.latlng.lat),
          lng: Math.round(e.latlng.lng),
          layer: useMapStore.getState().activeLayer,
        });
      }
    });

    // Create Leaflet popup anchored directly to markers (responsive for mobile)
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const popup = L.popup({
      className: 'totk-leaflet-popup',
      offset: [0, -32],
      closeButton: false,
      autoPan: true,
      autoPanPadding: isMobile ? [16, 20] : [40, 40],
      minWidth: isMobile ? Math.min(280, window.innerWidth - 32) : 320,
      maxWidth: isMobile ? Math.min(350, window.innerWidth - 24) : 380,
    });
    popup.setContent(popupContainerRef.current);
    popup.on('remove', () => {
      setSelectedMarker(null);
    });
    popupRef.current = popup;

    return () => {
      map.off('zoom', updateZoomClass);
      map.off('zoomend', updateZoomClass);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Synchronize Leaflet popup position with selectedMarker
  useEffect(() => {
    const map = mapInstanceRef.current;
    const popup = popupRef.current;
    if (!map || !popup) return;

    if (selectedMarker) {
      popup
        .setLatLng([selectedMarker.lat, selectedMarker.lng])
        .openOn(map);
    } else {
      map.closePopup(popup);
    }
  }, [selectedMarker]);

  // 2. Handle Layer Change (High-res slippy tileLayer WebP)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const bounds = mapBoundsRef.current;
    if (!map || !bounds) return;

    if (currentTileLayerRef.current) {
      map.removeLayer(currentTileLayerRef.current);
    }

    const areaMap: Record<string, string> = {
      surface: 'Ground',
      sky: 'Sky',
      depths: 'Depths',
    };
    const area = areaMap[activeLayer] || 'Ground';

    // Set clean dark container background matching Zonai UI
    if (mapContainerRef.current) {
      mapContainerRef.current.style.backgroundColor = '#0a0d13';
    }

    // High resolution dynamic vector/raster tile layer with generous buffer
    // Note: Do NOT set bounds on tileLayer, as it causes Leaflet to reject perimeter tiles!
    // The map already has maxBounds and maxBoundsViscosity: 1.0.
    const newTileLayer = L.tileLayer(
      `https://objmap-totk.zeldamods.org/game_files/map/${area}/maptex/{z}/{x}/{y}.webp`,
      {
        maxNativeZoom: 7,
        minZoom: 2,
        maxZoom: 9,
        tileSize: 256,
        keepBuffer: 16,         // Keep 16 extra tile rows/cols in memory: prevents unloading when panning!
        updateInterval: 30,     // Request new tiles every 30ms during pan: eliminates delay!
        updateWhenIdle: false,  // Fetch tiles smoothly while dragging
        updateWhenZooming: true,
        noWrap: true,
        crossOrigin: 'anonymous',
      }
    );

    // Preload overview tiles at zoom 2 & 3 in the background for instant panning
    setTimeout(() => {
      // Zoom 2: 3x3 tiles
      for (let x = 0; x <= 2; x++) {
        for (let y = 0; y <= 2; y++) {
          const img = new Image();
          img.src = `https://objmap-totk.zeldamods.org/game_files/map/${area}/maptex/2/${x}/${y}.webp`;
        }
      }
      // Zoom 3: key central overview tiles
      for (let x = 1; x <= 4; x++) {
        for (let y = 1; y <= 3; y++) {
          const img = new Image();
          img.src = `https://objmap-totk.zeldamods.org/game_files/map/${area}/maptex/3/${x}/${y}.webp`;
        }
      }
    }, 50);

    newTileLayer.addTo(map);
    currentTileLayerRef.current = newTileLayer;
  }, [activeLayer]);

  // 3. Handle FlyTo requests
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !flyToTarget) return;

    map.flyTo([flyToTarget.lat, flyToTarget.lng], flyToTarget.zoom ?? 5, {
      duration: 1.2,
      easeLinearity: 0.25,
    });

    if (flyToTarget.markerId) {
      const targetId = flyToTarget.markerId;
      setTimeout(() => {
        const found = markers.find((m) => m.id === targetId);
        if (found) {
          setSelectedMarker(found);
        }
      }, 400);
    }

    clearFlyTo();
  }, [flyToTarget, clearFlyTo, markers, setSelectedMarker]);

  // 4. Render Dragon Flight Paths
  useEffect(() => {
    const dragonGroup = dragonLayerGroupRef.current;
    if (!dragonGroup) return;

    dragonGroup.clearLayers();

    // Dragons are visible in Surface and Sky
    if (!showDragons || activeLayer === 'depths') return;

    DRAGONS.forEach((dragon) => {
      const polyline = L.polyline(dragon.path, {
        color: dragon.color,
        weight: 3.5,
        opacity: 0.85,
        dashArray: dragon.id === 'light-dragon' ? undefined : '6, 8',
      });

      polyline.bindTooltip(
        `<div class="font-bold text-xs" style="color: ${dragon.glowColor}">${dragon.name}</div>
         <div class="text-[10px] text-gray-300">${dragon.element} Flight Loop</div>`,
        { sticky: true, className: 'dragon-tooltip' }
      );

      polyline.addTo(dragonGroup);
    });
  }, [showDragons, activeLayer]);

  // 4b. Render Province Boundary Overlays
  useEffect(() => {
    const provinceGroup = provinceLayerGroupRef.current;
    if (!provinceGroup) return;
    provinceGroup.clearLayers();

    if (!showProvinceBoundaries || activeLayer === 'sky') return;

    PROVINCE_BOUNDARIES.forEach((b) => {
      const poly = L.polygon(b.polygon, {
        color: b.color,
        weight: 1.8,
        dashArray: '6, 6',
        opacity: 0.7,
        fillColor: b.fillColor,
        fillOpacity: 1,
      });

      poly.bindTooltip(
        `<div class="text-[11px] font-bold tracking-wider uppercase" style="color: ${b.color}">${b.name}</div>`,
        { sticky: true, className: 'totk-hover-tooltip', opacity: 0.95 }
      );

      poly.on('mouseover', () => {
        poly.setStyle({ weight: 3, opacity: 0.95, fillOpacity: 1.6 });
      });
      poly.on('mouseout', () => {
        poly.setStyle({ weight: 1.8, opacity: 0.7, fillOpacity: 1 });
      });

      poly.addTo(provinceGroup);
    });
  }, [showProvinceBoundaries, activeLayer]);

  // 5. Render Active Markers
  useEffect(() => {
    const markerGroup = markerLayerGroupRef.current;
    const korokClusterGroup = korokClusterGroupRef.current;
    const denseClusterGroup = denseClusterGroupRef.current;
    const pathGroup = pathLayerGroupRef.current;
    const map = mapInstanceRef.current;
    if (!markerGroup || !korokClusterGroup || !denseClusterGroup || !pathGroup || !map) return;

    markerGroup.clearLayers();
    korokClusterGroup.clearLayers();
    denseClusterGroup.clearLayers();
    pathGroup.clearLayers();

    const isSearching = searchQuery.trim().length > 0;
    const korokMarkersToCluster: L.Marker[] = [];
    const denseMarkersToCluster: L.Marker[] = [];

    const filtered = markers.filter((m) => {
      // Layer match
      if (m.layer !== activeLayer) return false;

      // Category match (if a Zonai part is being searched, automatically allow dispensers through)
      const isZonaiMatch = Boolean(selectedZonaiPart && m.category === 'dispenser');
      if (m.category === 'province') {
        // Allow province through if either 'province' or 'area' is active in sidebar
        if (!activeCategories.has('province') && !activeCategories.has('area')) return false;
      } else if (!isZonaiMatch && !activeCategories.has(m.category)) {
        return false;
      }

      // Completed filter
      const isDone = completedItems[m.id];
      if (hideCompleted && isDone) return false;

      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = m.name.toLowerCase().includes(q);
        const matchesDesc = m.description?.toLowerCase().includes(q);
        const matchesItems = m.items?.some((item) => item.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesItems) return false;
      }

      // Zonai part filter: only filters among dispensers!
      // Other categories (Shrines, Towers, etc.) remain visible so map markings are not wiped.
      if (selectedZonaiPart && m.category === 'dispenser') {
        const query = selectedZonaiPart.toLowerCase().replace('big ', '').trim();
        const hasPart = m.items?.some(
          (it) => it.toLowerCase().includes(query) || selectedZonaiPart.toLowerCase().includes(it.toLowerCase())
        );
        if (!hasPart) return false;
      }

      return true;
    });

    filtered.forEach((m) => {
      const isDone = completedItems[m.id];
      const isSelected = selectedMarker?.id === m.id;

      // Special rendering for AREA & PROVINCE: Floating text labels on the map
      if (m.category === 'area' || m.category === 'province') {
        const isProvince = m.category === 'province';

        const labelHtml = isProvince
          ? `
            <div class="totk-region-label cursor-pointer ${
              isSelected ? 'is-selected' : ''
            }">
              ${m.name}
            </div>
          `
          : `
            <div class="totk-area-label cursor-pointer ${
              isSelected ? 'is-selected' : ''
            }">
              ${m.name}
            </div>
          `;

        const labelIcon = L.divIcon({
          html: labelHtml,
          className: isProvince ? 'totk-region-div-icon' : 'totk-area-div-icon is-micro',
          iconSize: isProvince ? [320, 36] : [200, 24],
          iconAnchor: isProvince ? [160, 18] : [100, 12],
        });

        const labelMarker = L.marker([m.lat, m.lng], { icon: labelIcon });
        labelMarker.on('click', () => {
          setSelectedMarker(m);
        });
        labelMarker.addTo(markerGroup);
        return;
      }

      const theme = getCategoryTheme(m.category);

      // Create Custom HTML Teardrop Pin Icon with exact Section Color, Crisp White Icon, No Border, and No Shadow
      const iconHtml = `
        <div class="totk-pin-wrapper ${isSelected ? 'is-selected' : ''} ${isDone ? 'is-done' : ''}" style="width: 30px; height: 38px; position: relative; cursor: pointer;">
          <svg width="30" height="38" viewBox="0 0 30 38" fill="none" xmlns="http://www.w3.org/2000/svg" class="totk-pin-svg" style="width: 30px; height: 38px; position: absolute; top: 0; left: 0; pointer-events: none; overflow: visible;">
            <path
              d="M 15 38 L 3.63 24.78 A 15 15 0 1 1 26.37 24.78 Z"
              fill="${theme.hex}"
              stroke="none"
              stroke-width="0"
            />
            <image
              href="${m.icon}"
              xlink:href="${m.icon}"
              x="4.5"
              y="4.5"
              width="21"
              height="21"
              preserveAspectRatio="xMidYMid meet"
              style="pointer-events: none; image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges;"
            />
            <!-- Completed Checkmark Badge rendered strictly ON TOP inside SVG -->
            ${
              isDone
                ? `
                <g class="totk-pin-badge" style="filter: drop-shadow(0 2px 3px rgba(0,0,0,0.6));">
                  <circle cx="23.5" cy="6" r="6.5" fill="#10b981" stroke="#ffffff" stroke-width="1.8" />
                  <path d="M 20.5 6 L 22.5 8.2 L 26.5 3.8" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none" />
                </g>
                `
                : ''
            }
          </svg>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'totk-div-icon',
        iconSize: [30, 38],
        iconAnchor: [15, 38],
      });

      const marker = L.marker([m.lat, m.lng], { icon: customIcon });

      // Hover tooltip (Image 1 style)
      marker.bindTooltip(
        `<div class="totk-tooltip-text">${m.name}</div>`,
        {
          direction: 'auto',
          offset: [16, -20],
          className: 'totk-hover-tooltip',
          opacity: 1,
        }
      );

      // Click handler
      marker.on('click', () => {
        setSelectedMarker(m);

        // Draw Korok companion path if available
        pathGroup.clearLayers();
        if (m.korokPath) {
          const pathLine = L.polyline(
            [
              [m.korokPath.start.lat, m.korokPath.start.lng],
              [m.korokPath.end.lat, m.korokPath.end.lng],
            ],
            {
              color: '#a3e635',
              weight: 3,
              dashArray: '8, 8',
              opacity: 0.9,
            }
          );

          // Friend tent icon at target
          const tentIcon = L.divIcon({
            html: `<div class="bg-lime-500 text-black text-xs font-bold px-2 py-0.5 rounded shadow-lg border border-white">Campfire Friend ⛺</div>`,
            className: 'tent-icon',
            iconSize: [100, 20],
            iconAnchor: [50, 10],
          });
          const tentMarker = L.marker([m.korokPath.end.lat, m.korokPath.end.lng], {
            icon: tentIcon,
          });

          pathLine.addTo(pathGroup);
          tentMarker.addTo(pathGroup);
        }
      });

      if (!isSearching && m.category === 'korok') {
        korokMarkersToCluster.push(marker);
      } else if (!isSearching && DENSE_CLUSTER_CATEGORIES.has(m.category)) {
        denseMarkersToCluster.push(marker);
      } else {
        marker.addTo(markerGroup);
      }
    });

    if (korokMarkersToCluster.length > 0) {
      korokClusterGroup.addLayers(korokMarkersToCluster);
    }
    if (denseMarkersToCluster.length > 0) {
      denseClusterGroup.addLayers(denseMarkersToCluster);
    }
  }, [
    markers,
    activeLayer,
    activeCategories,
    searchQuery,
    selectedZonaiPart,
    completedItems,
    hideCompleted,
    selectedMarker,
    setSelectedMarker,
  ]);

  // Update cursor when in Add Pin mode
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (isAddingPinMode) {
      mapContainerRef.current.style.cursor = 'crosshair';
    } else {
      mapContainerRef.current.style.cursor = '';
    }
  }, [isAddingPinMode]);

  // Render Custom User Pins (Purah Pad Beacons & Stamps)
  useEffect(() => {
    const customGroup = customPinLayerGroupRef.current;
    if (!customGroup) return;

    customGroup.clearLayers();

    const currentLayerPins = customPins.filter((p) => p.layer === activeLayer);

    const COLOR_HEX: Record<string, string> = {
      cyan: '#38bdf8',
      red: '#f87171',
      green: '#34d399',
      yellow: '#fbbf24',
      blue: '#60a5fa',
      purple: '#c084fc',
    };

    currentLayerPins.forEach((pin) => {
      const colorHex = COLOR_HEX[pin.color] || '#38bdf8';

      // Pure crisp white glyphs centered at (15, 14) for the solid teardrop pin
      const STAMP_SVGS: Record<string, string> = {
        star: `<polygon points="15,6.5 17.5,12 23.5,12.7 19,17 20.3,23 15,19.8 9.7,23 11,17 6.5,12.7 12.5,12" fill="#ffffff" stroke="none" />`,
        sword: `<path d="M14 6 L16 8 L16 19 L18.5 19 L18.5 21 L16 21 L16 24 L14 24 L14 21 L11.5 21 L11.5 19 L14 19 Z M15 8 L15 17" fill="#ffffff" stroke="none" />`,
        shield: `<path d="M9 7 C12 7 15 5.5 15 5.5 C15 5.5 18 7 21 7 C21 14 18 19.5 15 22.5 C12 19.5 9 14 9 7 Z" fill="#ffffff" stroke="none" /><path d="M15 9 L15 19 M11.5 13 L18.5 13" stroke="${colorHex}" stroke-width="1.2" />`,
        bow: `<circle cx="15" cy="14" r="6.5" fill="none" stroke="#ffffff" stroke-width="1.8" /><circle cx="15" cy="14" r="2.2" fill="#ffffff" /><line x1="15" y1="5.5" x2="15" y2="22.5" stroke="#ffffff" stroke-width="1.5" /><line x1="6.5" y1="14" x2="23.5" y2="14" stroke="#ffffff" stroke-width="1.5" />`,
        skull: `<path d="M10 14 C10 10 12 7.5 15 7.5 C18 7.5 20 10 20 14 C20 16.5 18.5 17.5 18.5 20 L11.5 20 C11.5 17.5 10 16.5 10 14 Z" fill="#ffffff" stroke="none" /><circle cx="12.5" cy="13" r="1.3" fill="${colorHex}" /><circle cx="17.5" cy="13" r="1.3" fill="${colorHex}" /><line x1="13.5" y1="20" x2="13.5" y2="18" stroke="${colorHex}" stroke-width="1" /><line x1="16.5" y1="20" x2="16.5" y2="18" stroke="${colorHex}" stroke-width="1" />`,
        ore: `<polygon points="15,6 22.5,11 19,21 11,21 7.5,11" fill="#ffffff" stroke="none" /><polygon points="15,6 18.5,11 15,21 11.5,11" fill="${colorHex}" opacity="0.35" />`,
        leaf: `<path d="M15 6 C21 8 22.5 14 19.5 18.5 C16.5 23 12 21.5 10 18.5 C8 14.5 10 8 15 6 Z" fill="#ffffff" stroke="none" /><path d="M15 6 C15 11.5 14 16.5 12.5 22.5" stroke="${colorHex}" stroke-width="1.2" fill="none" />`,
        pot: `<path d="M8.5 12 L21.5 12 C22.5 16 21 19 15 19.5 C9 19 7.5 16 8.5 12 Z" fill="#ffffff" stroke="none" /><path d="M7.5 10 L22.5 10" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" /><path d="M12.5 20 L11 23 M17.5 20 L19 23" stroke="#ffffff" stroke-width="1.3" stroke-linecap="round" /><path d="M15 6 C16.5 7.5 15.5 9 15 9.5" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round" fill="none" />`,
        pin: `<path d="M15 6.5 C11 6.5 8.5 9 8.5 13 C8.5 17.5 15 23.5 15 23.5 C15 23.5 21.5 17.5 21.5 13 C21.5 9 19 6.5 15 6.5 Z" fill="#ffffff" stroke="none" /><circle cx="15" cy="13" r="2.8" fill="${colorHex}" />`,
      };

      const stampSvg = STAMP_SVGS[pin.icon] || STAMP_SVGS.pin;

      const customIcon = L.divIcon({
        className: 'custom-pin-container',
        iconSize: [36, 110],
        iconAnchor: [18, 106],
        html: `
          <div class="totk-custom-beacon" style="--beacon-color: ${colorHex};">
            <!-- Ground Contact Energy Ring & Shadow -->
            <div class="totk-beacon-ground-ripple"></div>
            <!-- Vertical Light Beam Pillar -->
            <div class="totk-beacon-light-pillar"></div>
            <!-- Teardrop Pin Body -->
            <div class="totk-beacon-pin-body">
              <svg width="30" height="38" viewBox="0 0 30 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                <!-- Solid Teardrop Body (Soft & Clean) -->
                <path
                  d="M 15 38 L 3.63 24.78 A 15 15 0 1 1 26.37 24.78 Z"
                  fill="${colorHex}"
                />
                <!-- Crisp Pure White Stamp Glyph -->
                ${stampSvg}
              </svg>
            </div>
          </div>
        `,
      });

      const marker = L.marker([pin.lat, pin.lng], {
        icon: customIcon,
        zIndexOffset: 1200, // Show above normal markers
      });

      // Tooltip matching the official Zelda map tooltip
      marker.bindTooltip(
        `<div class="totk-tooltip-text">${pin.title}${pin.note ? ` • <span style="opacity: 0.8; font-weight: 400;">${pin.note}</span>` : ''}</div>`,
        {
          direction: 'auto',
          offset: [18, -32],
          className: 'totk-hover-tooltip',
          opacity: 1,
        }
      );

      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        openPinModal({
          lat: pin.lat,
          lng: pin.lng,
          layer: pin.layer,
          existingPin: pin,
        });
      });

      marker.addTo(customGroup);
    });
  }, [customPins, activeLayer, openPinModal]);

  // Render Active Farming Route (Path polyline & Waypoint nodes)
  useEffect(() => {
    const farmingGroup = farmingRouteLayerGroupRef.current;
    if (!farmingGroup) return;

    farmingGroup.clearLayers();

    if (!activeFarmingRouteId) return;

    const route = FARMING_ROUTES.find((r) => r.id === activeFarmingRouteId);
    if (!route || route.layer !== activeLayer) return;

    // 1. Ambient Glow Underline
    L.polyline(route.path, {
      color: route.themeColor,
      weight: 8,
      opacity: 0.35,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(farmingGroup);

    // 2. Main Animated Dashed Route Line
    L.polyline(route.path, {
      color: route.themeColor,
      weight: 3.5,
      opacity: 0.95,
      dashArray: '8, 12',
      className: 'totk-route-dash',
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(farmingGroup);

    // 3. Numbered Waypoint Markers
    route.waypoints.forEach((wp) => {
      const wpIcon = L.divIcon({
        className: 'totk-waypoint-container',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        html: `
          <div class="totk-waypoint-marker" style="--wp-color: ${route.themeColor}; background: ${route.themeColor};">
            <span>${wp.step}</span>
          </div>
        `,
      });

      const wpMarker = L.marker([wp.lat, wp.lng], {
        icon: wpIcon,
        zIndexOffset: 1600,
      });

      wpMarker.bindTooltip(
        `<div class="totk-tooltip-text">
          <div style="font-weight: 700; color: #fff; font-size: 12px;">${wp.step}. ${wp.name}</div>
          <div style="font-size: 11px; color: ${route.themeColor}; font-weight: 600; margin-top: 2px;">📦 ${wp.yield}</div>
          ${wp.tip ? `<div style="font-size: 10px; color: #cbd5e1; margin-top: 3px; max-width: 220px; line-height: 1.3;">💡 ${wp.tip}</div>` : ''}
        </div>`,
        {
          direction: 'auto',
          offset: [14, -14],
          className: 'totk-hover-tooltip',
          opacity: 1,
        }
      );

      wpMarker.addTo(farmingGroup);
    });
  }, [activeFarmingRouteId, activeLayer]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-totk-bg">
      <div ref={mapContainerRef} className="w-full h-full z-0" />
      {selectedMarker &&
        createPortal(
          <MarkerPopover
            marker={selectedMarker}
            onClose={() => setSelectedMarker(null)}
          />,
          popupContainerRef.current
        )}
    </div>
  );
};
