import { create } from 'zustand';
import { MarkerPoint } from '../data';
import {
  ALL_CATEGORY_IDS,
  DEFAULT_ACTIVE_CATEGORIES,
} from '../data/categoryDefinitions';

export type MapLayer = 'surface' | 'sky' | 'depths';

export interface CategoryInfo {
  id: string;
  label: string;
  icon: string;
  badgeColor: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { id: 'shrine', label: 'Shrines (152)', icon: '/icons/genie/shrine.png', badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40' },
  { id: 'lightroot', label: 'Lightroots (120)', icon: '/icons/genie/lightroot.png', badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' },
  { id: 'tower', label: 'Skyview Towers (15)', icon: '/icons/genie/skyview_tower.png', badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/40' },
  { id: 'dispenser', label: 'Zonai Dispensers', icon: '/icons/genie/device_dispenser.png', badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/40' },
  { id: 'korok', label: 'Korok Seeds (1,000)', icon: '/icons/genie/korok_seed.png', badgeColor: 'bg-lime-500/20 text-lime-400 border-lime-500/40' },
  { id: 'cave', label: 'Caves', icon: '/icons/genie/cave.png', badgeColor: 'bg-stone-500/20 text-stone-300 border-stone-500/40' },
  { id: 'bubbul', label: 'Bubbulfrogs', icon: '/icons/genie/bubbulfrog.png', badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40' },
  { id: 'chasm', label: 'Chasms', icon: '/icons/genie/chasm.png', badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/40' },
  { id: 'well', label: 'Wells (58)', icon: '/icons/genie/well.png', badgeColor: 'bg-sky-500/20 text-sky-400 border-sky-500/40' },
  { id: 'addison', label: 'Hudson Signs (Addison)', icon: '/icons/genie/hudson_sign.png', badgeColor: 'bg-orange-500/20 text-orange-400 border-orange-500/40' },
  { id: 'sage_will', label: "Sage's Wills (20)", icon: '/icons/genie/sages_will.png', badgeColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40' },
];

export interface CustomPin {
  id: string;
  title: string;
  note?: string;
  icon: 'sword' | 'shield' | 'bow' | 'star' | 'skull' | 'ore' | 'leaf' | 'pot' | 'pin';
  color: 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'cyan';
  layer: MapLayer;
  lat: number;
  lng: number;
  createdAt: number;
}

const COMPLETED_STORAGE_KEY = 'zelda_totk_completed_v1';
const SETTINGS_STORAGE_KEY = 'zelda_totk_settings_v1';
const CUSTOM_PINS_STORAGE_KEY = 'zelda_totk_custom_pins_v1';
const AUTH_TOKEN_KEY = 'zelda_totk_auth_token_v1';
const USER_PROFILE_KEY = 'zelda_totk_user_profile_v1';

function getInitialAuth(): { token: string | null; user: { id: string; username: string } | null } {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const userRaw = localStorage.getItem(USER_PROFILE_KEY);
    const user = userRaw ? JSON.parse(userRaw) : null;
    return { token, user };
  } catch (e) {
    return { token: null, user: null };
  }
}

function getInitialCustomPins(): CustomPin[] {
  try {
    const raw = localStorage.getItem(CUSTOM_PINS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function persistCustomPins(pins: CustomPin[]) {
  try {
    localStorage.setItem(CUSTOM_PINS_STORAGE_KEY, JSON.stringify(pins));
  } catch (e) {
    console.error('Failed to save custom pins to localStorage', e);
  }
}

function persistCompleted(items: Record<string, boolean>) {
  try {
    localStorage.setItem(COMPLETED_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save completed items to localStorage', e);
  }
}

let syncTimer: any = null;
function scheduleCloudSync(get: () => MapState) {
  const token = get().authToken;
  if (!token) return;
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    get().syncToCloud();
  }, 1000);
}

interface SavedSettings {
  activeLayer?: MapLayer;
  activeCategories?: string[];
  showDragons?: boolean;
  showProvinceBoundaries?: boolean;
  hideCompleted?: boolean;
  sidebarOpen?: boolean;
  selectedZonaiPart?: string | null;
  activeFarmingRouteId?: string | null;
}

function getInitialCompleted(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(COMPLETED_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function getInitialSettings(): SavedSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function persistSettings(data: {
  activeLayer: MapLayer;
  activeCategories: Set<string>;
  showDragons: boolean;
  showProvinceBoundaries?: boolean;
  hideCompleted: boolean;
  sidebarOpen: boolean;
  selectedZonaiPart: string | null;
  activeFarmingRouteId?: string | null;
}) {
  try {
    const payload: SavedSettings = {
      activeLayer: data.activeLayer,
      activeCategories: Array.from(data.activeCategories),
      showDragons: data.showDragons,
      showProvinceBoundaries: data.showProvinceBoundaries,
      hideCompleted: data.hideCompleted,
      sidebarOpen: data.sidebarOpen,
      selectedZonaiPart: data.selectedZonaiPart,
      activeFarmingRouteId: data.activeFarmingRouteId,
    };
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    console.error('Failed to save settings to localStorage', e);
  }
}

interface MapState {
  activeLayer: MapLayer;
  searchQuery: string;
  activeCategories: Set<string>;
  showDragons: boolean;
  showProvinceBoundaries: boolean;
  selectedZonaiPart: string | null;
  selectedMarker: MarkerPoint | null;
  flyToTarget: { lat: number; lng: number; zoom?: number; markerId?: string } | null;
  transitionToast: { message: string; type: 'dive' | 'ascend' } | null;
  customPins: CustomPin[];
  pinModalTarget: { lat: number; lng: number; layer: MapLayer; existingPin?: CustomPin } | null;
  isAddingPinMode: boolean;
  isArmorModalOpen: boolean;
  activeFarmingRouteId: string | null;
  completedItems: Record<string, boolean>;
  hideCompleted: boolean;
  sidebarOpen: boolean;

  // Cloudflare D1 Auth & Cloud Sync State
  currentUser: { id: string; username: string } | null;
  authToken: string | null;
  isAuthModalOpen: boolean;
  isSyncing: boolean;
  lastSyncedAt: string | null;

  // Actions
  setActiveLayer: (layer: MapLayer) => void;
  setSearchQuery: (query: string) => void;
  toggleCategory: (categoryId: string) => void;
  enableAllCategories: () => void;
  disableAllCategories: () => void;
  toggleDragons: () => void;
  toggleProvinceBoundaries: () => void;
  openArmorModal: () => void;
  closeArmorModal: () => void;
  setSelectedZonaiPart: (part: string | null) => void;
  setSelectedMarker: (marker: MarkerPoint | null) => void;
  jumpToTwin: (twin: MarkerPoint['twin']) => void;
  clearTransitionToast: () => void;
  flyToLocation: (lat: number, lng: number, zoom?: number, markerId?: string) => void;
  clearFlyTo: () => void;
  setIsAddingPinMode: (active: boolean) => void;
  openPinModal: (target: { lat: number; lng: number; layer: MapLayer; existingPin?: CustomPin }) => void;
  closePinModal: () => void;
  setActiveFarmingRoute: (routeId: string | null) => void;
  addCustomPin: (pin: Omit<CustomPin, 'id' | 'createdAt'>) => void;
  updateCustomPin: (id: string, updates: Partial<CustomPin>) => void;
  deleteCustomPin: (id: string) => void;
  toggleCompleted: (id: string) => void;
  toggleHideCompleted: () => void;
  setSidebarOpen: (open: boolean) => void;
  resetAllProgress: () => void;

  // D1 Cloud Auth Actions
  openAuthModal: () => void;
  closeAuthModal: () => void;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  syncToCloud: () => Promise<void>;
  initAuth: () => Promise<void>;
}

const initialSettings = getInitialSettings();
const initialAuth = getInitialAuth();

export const useMapStore = create<MapState>((set, get) => ({
  activeLayer: initialSettings.activeLayer || 'surface',
  searchQuery: '',
  activeCategories: initialSettings.activeCategories
    ? new Set(initialSettings.activeCategories)
    : new Set(DEFAULT_ACTIVE_CATEGORIES),
  showDragons: initialSettings.showDragons !== undefined ? initialSettings.showDragons : true,
  showProvinceBoundaries: initialSettings.showProvinceBoundaries !== undefined ? initialSettings.showProvinceBoundaries : false,
  selectedZonaiPart: initialSettings.selectedZonaiPart || null,
  selectedMarker: null,
  flyToTarget: null,
  transitionToast: null,
  customPins: getInitialCustomPins(),
  pinModalTarget: null,
  isAddingPinMode: false,
  isArmorModalOpen: false,
  activeFarmingRouteId: initialSettings.activeFarmingRouteId || null,
  completedItems: getInitialCompleted(),
  hideCompleted: initialSettings.hideCompleted || false,
  sidebarOpen: initialSettings.sidebarOpen !== undefined ? initialSettings.sidebarOpen : true,

  // Cloudflare D1 Auth State
  currentUser: initialAuth.user,
  authToken: initialAuth.token,
  isAuthModalOpen: false,
  isSyncing: false,
  lastSyncedAt: null,

  setActiveLayer: (layer) => {
    set({ activeLayer: layer });
    persistSettings({
      activeLayer: layer,
      activeCategories: get().activeCategories,
      showDragons: get().showDragons,
      hideCompleted: get().hideCompleted,
      sidebarOpen: get().sidebarOpen,
      selectedZonaiPart: get().selectedZonaiPart,
      activeFarmingRouteId: get().activeFarmingRouteId,
    });
    scheduleCloudSync(get);
  },

  setSearchQuery: (query) => set({ searchQuery: query }),

  toggleCategory: (categoryId) => {
    const current = new Set(get().activeCategories);
    let dragonsState = get().showDragons;

    if (current.has(categoryId)) {
      current.delete(categoryId);
      if (categoryId === 'dragon') {
        dragonsState = false;
        set({ showDragons: false });
      }
    } else {
      current.add(categoryId);
      if (categoryId === 'dragon') {
        dragonsState = true;
        set({ showDragons: true });
      }
    }

    set({ activeCategories: current });

    persistSettings({
      activeLayer: get().activeLayer,
      activeCategories: current,
      showDragons: dragonsState,
      hideCompleted: get().hideCompleted,
      sidebarOpen: get().sidebarOpen,
      selectedZonaiPart: get().selectedZonaiPart,
      activeFarmingRouteId: get().activeFarmingRouteId,
    });
    scheduleCloudSync(get);
  },

  enableAllCategories: () => {
    const all = new Set(ALL_CATEGORY_IDS);
    set({ activeCategories: all, showDragons: true });
    persistSettings({
      activeLayer: get().activeLayer,
      activeCategories: all,
      showDragons: true,
      hideCompleted: get().hideCompleted,
      sidebarOpen: get().sidebarOpen,
      selectedZonaiPart: get().selectedZonaiPart,
      activeFarmingRouteId: get().activeFarmingRouteId,
    });
    scheduleCloudSync(get);
  },

  disableAllCategories: () => {
    const empty = new Set<string>();
    set({ activeCategories: empty, showDragons: false });
    persistSettings({
      activeLayer: get().activeLayer,
      activeCategories: empty,
      showDragons: false,
      hideCompleted: get().hideCompleted,
      sidebarOpen: get().sidebarOpen,
      selectedZonaiPart: get().selectedZonaiPart,
      activeFarmingRouteId: get().activeFarmingRouteId,
    });
    scheduleCloudSync(get);
  },

  toggleDragons: () => {
    const next = !get().showDragons;
    const current = new Set(get().activeCategories);
    if (next) current.add('dragon');
    else current.delete('dragon');

    set({ showDragons: next, activeCategories: current });

    persistSettings({
      activeLayer: get().activeLayer,
      activeCategories: current,
      showDragons: next,
      showProvinceBoundaries: get().showProvinceBoundaries,
      hideCompleted: get().hideCompleted,
      sidebarOpen: get().sidebarOpen,
      selectedZonaiPart: get().selectedZonaiPart,
      activeFarmingRouteId: get().activeFarmingRouteId,
    });
    scheduleCloudSync(get);
  },

  toggleProvinceBoundaries: () => {
    const next = !get().showProvinceBoundaries;
    set({ showProvinceBoundaries: next });
    persistSettings({
      activeLayer: get().activeLayer,
      activeCategories: get().activeCategories,
      showDragons: get().showDragons,
      showProvinceBoundaries: next,
      hideCompleted: get().hideCompleted,
      sidebarOpen: get().sidebarOpen,
      selectedZonaiPart: get().selectedZonaiPart,
      activeFarmingRouteId: get().activeFarmingRouteId,
    });
    scheduleCloudSync(get);
  },

  openArmorModal: () => set({ isArmorModalOpen: true }),
  closeArmorModal: () => set({ isArmorModalOpen: false }),

  setSelectedZonaiPart: (part) => {
    set({ selectedZonaiPart: part });
    persistSettings({
      activeLayer: get().activeLayer,
      activeCategories: get().activeCategories,
      showDragons: get().showDragons,
      hideCompleted: get().hideCompleted,
      sidebarOpen: get().sidebarOpen,
      selectedZonaiPart: part,
      activeFarmingRouteId: get().activeFarmingRouteId,
    });
    scheduleCloudSync(get);
  },

  setSelectedMarker: (marker) => set({ selectedMarker: marker }),

  jumpToTwin: (twin) => {
    if (!twin) return;
    const isDiving = twin.layer === 'depths';
    set({
      activeLayer: twin.layer,
      flyToTarget: { lat: twin.lat, lng: twin.lng, zoom: 5, markerId: twin.id },
      transitionToast: {
        message: isDiving ? '🕳️ Diving into The Depths...' : '✨ Ascending to Surface...',
        type: isDiving ? 'dive' : 'ascend',
      },
    });
    setTimeout(() => {
      set({ transitionToast: null });
    }, 2400);

    persistSettings({
      activeLayer: twin.layer,
      activeCategories: get().activeCategories,
      showDragons: get().showDragons,
      hideCompleted: get().hideCompleted,
      sidebarOpen: get().sidebarOpen,
      selectedZonaiPart: get().selectedZonaiPart,
      activeFarmingRouteId: get().activeFarmingRouteId,
    });
    scheduleCloudSync(get);
  },

  clearTransitionToast: () => set({ transitionToast: null }),

  flyToLocation: (lat, lng, zoom = 5, markerId?: string) => {
    set({ flyToTarget: { lat, lng, zoom, markerId } });
  },

  clearFlyTo: () => set({ flyToTarget: null }),

  setIsAddingPinMode: (active) => set({ isAddingPinMode: active }),

  openPinModal: (target) => set({ pinModalTarget: target, isAddingPinMode: false }),

  closePinModal: () => set({ pinModalTarget: null }),

  setActiveFarmingRoute: (routeId) => {
    set({ activeFarmingRouteId: routeId });
    persistSettings({
      activeLayer: get().activeLayer,
      activeCategories: get().activeCategories,
      showDragons: get().showDragons,
      hideCompleted: get().hideCompleted,
      sidebarOpen: get().sidebarOpen,
      selectedZonaiPart: get().selectedZonaiPart,
      activeFarmingRouteId: routeId,
    });
    scheduleCloudSync(get);
  },

  addCustomPin: (pinData) => {
    const newPin: CustomPin = {
      ...pinData,
      id: `custom-pin-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: Date.now(),
    };
    const updated = [newPin, ...get().customPins];
    persistCustomPins(updated);
    set({ customPins: updated, isAddingPinMode: false });
    scheduleCloudSync(get);
  },

  updateCustomPin: (id, updates) => {
    const updated = get().customPins.map((p) => (p.id === id ? { ...p, ...updates } : p));
    persistCustomPins(updated);
    set({ customPins: updated });
    scheduleCloudSync(get);
  },

  deleteCustomPin: (id) => {
    const updated = get().customPins.filter((p) => p.id !== id);
    persistCustomPins(updated);
    set({ customPins: updated });
    scheduleCloudSync(get);
  },

  toggleCompleted: (id) => {
    const current = { ...get().completedItems };
    if (current[id]) {
      delete current[id];
    } else {
      current[id] = true;
    }
    persistCompleted(current);
    set({ completedItems: current });
    scheduleCloudSync(get);
  },

  toggleHideCompleted: () => {
    const next = !get().hideCompleted;
    set({ hideCompleted: next });
    persistSettings({
      activeLayer: get().activeLayer,
      activeCategories: get().activeCategories,
      showDragons: get().showDragons,
      hideCompleted: next,
      sidebarOpen: get().sidebarOpen,
      selectedZonaiPart: get().selectedZonaiPart,
      activeFarmingRouteId: get().activeFarmingRouteId,
    });
    scheduleCloudSync(get);
  },

  setSidebarOpen: (open) => {
    set({ sidebarOpen: open });
    persistSettings({
      activeLayer: get().activeLayer,
      activeCategories: get().activeCategories,
      showDragons: get().showDragons,
      hideCompleted: get().hideCompleted,
      sidebarOpen: open,
      selectedZonaiPart: get().selectedZonaiPart,
      activeFarmingRouteId: get().activeFarmingRouteId,
    });
    scheduleCloudSync(get);
  },

  resetAllProgress: () => {
    if (window.confirm('Are you sure you want to reset all checklist progress?')) {
      localStorage.removeItem(COMPLETED_STORAGE_KEY);
      set({ completedItems: {} });
      scheduleCloudSync(get);
    }
  },

  openAuthModal: () => set({ isAuthModalOpen: true }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),

  login: async (username, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!data.success) {
        return { success: false, error: data.error || 'Failed to login' };
      }

      // 1. Save credentials permanently
      localStorage.setItem(AUTH_TOKEN_KEY, data.token);
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(data.user));

      // 2. OVERWRITE local state with D1 state (As requested by user!)
      const d1Completed = data.state?.completedItems || {};
      const d1Pins = data.state?.customPins || [];
      const d1Settings = data.state?.settings || {};

      persistCompleted(d1Completed);
      persistCustomPins(d1Pins);

      const restoredCategories = Array.isArray(d1Settings.activeCategories)
        ? new Set<string>(d1Settings.activeCategories)
        : get().activeCategories;

      const restoredZonaiPart = d1Settings.selectedZonaiPart !== undefined
        ? d1Settings.selectedZonaiPart
        : get().selectedZonaiPart;

      const restoredDragons = d1Settings.showDragons !== undefined
        ? d1Settings.showDragons
        : get().showDragons;

      const restoredProvinceBoundaries = d1Settings.showProvinceBoundaries !== undefined
        ? d1Settings.showProvinceBoundaries
        : get().showProvinceBoundaries;

      const restoredHideCompleted = d1Settings.hideCompleted !== undefined
        ? d1Settings.hideCompleted
        : get().hideCompleted;

      const restoredLayer = d1Settings.activeLayer || get().activeLayer;
      const restoredRouteId = d1Settings.activeFarmingRouteId !== undefined
        ? d1Settings.activeFarmingRouteId
        : get().activeFarmingRouteId;
      const restoredSidebarOpen = d1Settings.sidebarOpen !== undefined
        ? d1Settings.sidebarOpen
        : get().sidebarOpen;

      persistSettings({
        activeLayer: restoredLayer,
        activeCategories: restoredCategories,
        showDragons: restoredDragons,
        showProvinceBoundaries: restoredProvinceBoundaries,
        hideCompleted: restoredHideCompleted,
        sidebarOpen: restoredSidebarOpen,
        selectedZonaiPart: restoredZonaiPart,
        activeFarmingRouteId: restoredRouteId,
      });

      set({
        currentUser: data.user,
        authToken: data.token,
        completedItems: d1Completed,
        customPins: d1Pins,
        activeLayer: restoredLayer,
        activeCategories: restoredCategories,
        showDragons: restoredDragons,
        showProvinceBoundaries: restoredProvinceBoundaries,
        hideCompleted: restoredHideCompleted,
        selectedZonaiPart: restoredZonaiPart,
        activeFarmingRouteId: restoredRouteId,
        sidebarOpen: restoredSidebarOpen,
        isAuthModalOpen: false,
        lastSyncedAt: data.state?.updatedAt || new Date().toISOString(),
        transitionToast: {
          message: `✨ Logged in as ${data.user.username}! All progress & sidebar settings loaded.`,
          type: 'ascend',
        },
      });

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error' };
    }
  },

  register: async (username, password) => {
    try {
      const state = get();
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          initialState: {
            completedItems: state.completedItems,
            customPins: state.customPins,
            settings: {
              activeLayer: state.activeLayer,
              activeCategories: Array.from(state.activeCategories),
              showDragons: state.showDragons,
              showProvinceBoundaries: state.showProvinceBoundaries,
              hideCompleted: state.hideCompleted,
              selectedZonaiPart: state.selectedZonaiPart,
              activeFarmingRouteId: state.activeFarmingRouteId,
              sidebarOpen: state.sidebarOpen,
            },
          },
        }),
      });
      const data = await res.json();
      if (!data.success) {
        return { success: false, error: data.error || 'Failed to register' };
      }

      localStorage.setItem(AUTH_TOKEN_KEY, data.token);
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(data.user));

      set({
        currentUser: data.user,
        authToken: data.token,
        isAuthModalOpen: false,
        lastSyncedAt: new Date().toISOString(),
        transitionToast: {
          message: `✨ Welcome ${data.user.username}! Account created & synced to D1.`,
          type: 'ascend',
        },
      });

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error' };
    }
  },

  logout: () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_PROFILE_KEY);
    set({
      currentUser: null,
      authToken: null,
      lastSyncedAt: null,
      transitionToast: {
        message: '👋 Logged out. Now in guest mode.',
        type: 'dive',
      },
    });
  },

  syncToCloud: async () => {
    const token = get().authToken;
    if (!token) return;
    set({ isSyncing: true });
    try {
      const state = get();
      const res = await fetch('/api/user/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          completedItems: state.completedItems,
          customPins: state.customPins,
          settings: {
            activeLayer: state.activeLayer,
            activeCategories: Array.from(state.activeCategories),
            showDragons: state.showDragons,
            showProvinceBoundaries: state.showProvinceBoundaries,
            hideCompleted: state.hideCompleted,
            selectedZonaiPart: state.selectedZonaiPart,
            activeFarmingRouteId: state.activeFarmingRouteId,
            sidebarOpen: state.sidebarOpen,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        set({ lastSyncedAt: data.updatedAt, isSyncing: false });
      } else {
        set({ isSyncing: false });
      }
    } catch (e) {
      console.error('Failed to sync to Cloudflare D1', e);
      set({ isSyncing: false });
    }
  },

  initAuth: async () => {
    const { token, user } = getInitialAuth();
    if (!token) return;

    set({ authToken: token, currentUser: user, isSyncing: true });

    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && data.user) {
        set({
          currentUser: data.user,
          lastSyncedAt: data.state?.updatedAt || null,
          isSyncing: false,
        });
        if (data.state) {
          const cloudCompleted = data.state.completedItems || {};
          const cloudPins = data.state.customPins || [];
          const cloudSettings = data.state.settings || {};

          persistCompleted(cloudCompleted);
          persistCustomPins(cloudPins);

          const restoredCategories = Array.isArray(cloudSettings.activeCategories)
            ? new Set<string>(cloudSettings.activeCategories)
            : get().activeCategories;

          const restoredZonaiPart = cloudSettings.selectedZonaiPart !== undefined
            ? cloudSettings.selectedZonaiPart
            : get().selectedZonaiPart;

          const restoredDragons = cloudSettings.showDragons !== undefined
            ? cloudSettings.showDragons
            : get().showDragons;

          const restoredProvinceBoundaries = cloudSettings.showProvinceBoundaries !== undefined
            ? cloudSettings.showProvinceBoundaries
            : get().showProvinceBoundaries;

          const restoredHideCompleted = cloudSettings.hideCompleted !== undefined
            ? cloudSettings.hideCompleted
            : get().hideCompleted;

          const restoredLayer = cloudSettings.activeLayer || get().activeLayer;
          const restoredRouteId = cloudSettings.activeFarmingRouteId !== undefined
            ? cloudSettings.activeFarmingRouteId
            : get().activeFarmingRouteId;
          const restoredSidebarOpen = cloudSettings.sidebarOpen !== undefined
            ? cloudSettings.sidebarOpen
            : get().sidebarOpen;

          persistSettings({
            activeLayer: restoredLayer,
            activeCategories: restoredCategories,
            showDragons: restoredDragons,
            showProvinceBoundaries: restoredProvinceBoundaries,
            hideCompleted: restoredHideCompleted,
            sidebarOpen: restoredSidebarOpen,
            selectedZonaiPart: restoredZonaiPart,
            activeFarmingRouteId: restoredRouteId,
          });

          set({
            completedItems: cloudCompleted,
            customPins: cloudPins,
            activeLayer: restoredLayer,
            activeCategories: restoredCategories,
            showDragons: restoredDragons,
            showProvinceBoundaries: restoredProvinceBoundaries,
            hideCompleted: restoredHideCompleted,
            selectedZonaiPart: restoredZonaiPart,
            activeFarmingRouteId: restoredRouteId,
            sidebarOpen: restoredSidebarOpen,
          });
        }
      } else {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(USER_PROFILE_KEY);
        set({ currentUser: null, authToken: null, isSyncing: false });
      }
    } catch (e) {
      set({ isSyncing: false });
    }
  },
}));
