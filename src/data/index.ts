import mapRawData from './map_data.json';
import areasRawData from './areas.json';
import extraMarkersRawData from './extra_markers.json';
import shrineTutorialsData from './shrine_tutorials.json';
import { SKYVIEW_TOWERS } from './towers';
import { KOROK_TUTORIALS } from './korokTutorials';
import { DEVICE_DISPENSERS } from './dispensers';
import { DRAGONS } from './dragons';
import { TOTK_PROVINCES } from './provinces';

export interface MarkerPoint {
  id: string;
  name: string;
  category: string;
  layer: 'surface' | 'sky' | 'depths';
  position: { x: number; y: number; z: number };
  lat: number; // z
  lng: number; // x
  icon: string;
  puzzleType?: string;
  tutorial?: {
    title: string;
    icon: string;
    shortDesc: string;
    instruction: string;
    reward: string;
  };
  korokPath?: {
    start: { lat: number; lng: number };
    end: { lat: number; lng: number };
  };
  twin?: {
    id: string;
    name: string;
    layer: 'surface' | 'depths';
    lat: number;
    lng: number;
  };
  items?: string[];
  description?: string;
  media?: {
    imageUrl?: string;
    videoUrl?: string;
    youtubeUrl?: string;
  };
}

// Convert game coordinates to Leaflet LatLng
export function toLeafletLatLng(x: number, z: number): [number, number] {
  return [z, x];
}

// Build unified markers list
export function loadAllMarkers(): MarkerPoint[] {
  const markers: MarkerPoint[] = [];

  // 1. Process Shrines
  const shrines = (mapRawData as any).shrines || [];
  const lightroots = (mapRawData as any).lightroots || [];

  shrines.forEach((s: any, idx: number) => {
    const isSky = s.position.y > 600;
    const layer: 'surface' | 'sky' = isSky ? 'sky' : 'surface';
    const id = `shrine-${s.completion_hash || idx}`;

    // Find twin lightroot if on surface
    let twinData = undefined;
    if (layer === 'surface') {
      for (const lr of lightroots) {
        const dx = s.position.x - lr.position.x;
        const dz = s.position.z - lr.position.z;
        if (dx * dx + dz * dz < 10000) {
          twinData = {
            id: `lightroot-${lr.completion_hash}`,
            name: lr.display_name,
            layer: 'depths' as const,
            lat: lr.position.z,
            lng: lr.position.x,
          };
          break;
        }
      }
    }

    const tutorialData = (shrineTutorialsData as any)[s.display_name];
    const desc = tutorialData?.description || (isSky ? 'Sacred Sky Shrine of Light' : 'Ancient Surface Shrine of Light');
    const media = tutorialData
      ? {
          imageUrl: tutorialData.imageUrl,
          videoUrl: tutorialData.videoUrl,
          youtubeUrl: tutorialData.youtubeUrl,
        }
      : undefined;

    markers.push({
      id,
      name: s.display_name,
      category: 'shrine',
      layer,
      position: s.position,
      lat: s.position.z,
      lng: s.position.x,
      icon: '/icons/genie/shrine.png',
      twin: twinData,
      description: desc,
      media,
    });
  });

  // 2. Process Lightroots
  lightroots.forEach((lr: any, idx: number) => {
    const id = `lightroot-${lr.completion_hash || idx}`;

    let twinData = undefined;
    for (const s of shrines) {
      if (s.position.y < 600) {
        const dx = lr.position.x - s.position.x;
        const dz = lr.position.z - s.position.z;
        if (dx * dx + dz * dz < 10000) {
          twinData = {
            id: `shrine-${s.completion_hash}`,
            name: s.display_name,
            layer: 'surface' as const,
            lat: s.position.z,
            lng: s.position.x,
          };
          break;
        }
      }
    }

    markers.push({
      id,
      name: lr.display_name,
      category: 'lightroot',
      layer: 'depths',
      position: lr.position,
      lat: lr.position.z,
      lng: lr.position.x,
      icon: '/icons/genie/lightroot.png',
      twin: twinData,
      description: 'Luminescent Lightroot dispelling the surrounding Gloom in the Depths.'
    });
  });

  // 3. Process Skyview Towers
  SKYVIEW_TOWERS.forEach((tower) => {
    markers.push({
      id: tower.id,
      name: tower.name,
      category: 'tower',
      layer: 'surface',
      position: tower.position,
      lat: tower.position.z,
      lng: tower.position.x,
      icon: '/icons/genie/skyview_tower.png',
      description: `${tower.description} (Region: ${tower.region})`
    });
  });

  // 4. Process Hidden Koroks
  const hiddenKoroks = (mapRawData as any).hidden_koroks || [];
  hiddenKoroks.forEach((k: any, idx: number) => {
    const pType = k.type || 'Puzzle';
    const tutorial = KOROK_TUTORIALS[pType];
    const layer = k.position.y > 600 ? 'sky' : 'surface';

    markers.push({
      id: `korok-hidden-${k.completion_hash || idx}`,
      name: `Korok Seed (${pType})`,
      category: 'korok',
      layer,
      position: k.position,
      lat: k.position.z,
      lng: k.position.x,
      icon: '/icons/genie/korok_seed.png',
      puzzleType: pType,
      tutorial: tutorial || {
        title: pType,
        icon: '🌿',
        shortDesc: 'Hidden Korok puzzle.',
        instruction: 'Examine surroundings to solve the environmental puzzle.',
        reward: '1 Korok Seed'
      }
    });
  });

  // 5. Process Carry Koroks (Backpack friend with path)
  const carryKoroks = (mapRawData as any).carry_koroks || [];
  carryKoroks.forEach((k: any, idx: number) => {
    const layer = k.position.y > 600 ? 'sky' : 'surface';
    const tutorial = KOROK_TUTORIALS['Korok Friends'];

    let korokPath = undefined;
    if (k.path && k.path.start && k.path.end) {
      korokPath = {
        start: { lat: k.path.start.z, lng: k.path.start.x },
        end: { lat: k.path.end.z, lng: k.path.end.x }
      };
    }

    markers.push({
      id: `korok-carry-${k.completion_hash || idx}`,
      name: "Korok (Need to Reach Friend)",
      category: 'korok',
      layer,
      position: k.position,
      lat: k.position.z,
      lng: k.position.x,
      icon: '/icons/genie/korok_seed.png',
      puzzleType: 'Korok Friends',
      korokPath,
      tutorial
    });
  });



  // 9. Process Bosses with specific categories
  const gleeoks = (mapRawData as any).gleeoks || [];
  gleeoks.forEach((g: any, idx: number) => {
    const isSky = g.position.y > 600;
    markers.push({
      id: `gleeok-${g.completion_hash || idx}`,
      name: g.display_name || "Gleeok Boss",
      category: 'gleeok',
      layer: isSky ? 'sky' : 'surface',
      position: g.position,
      lat: g.position.z,
      lng: g.position.x,
      icon: '/icons/enemies/gleeok.svg',
      description: "Three-headed dragon boss (Flame, Frost, Thunder, or King Gleeok)."
    });
  });

  const hinoxes = (mapRawData as any).hinoxes || [];
  hinoxes.forEach((h: any, idx: number) => {
    const isDepths = h.position.y < -100;
    const isStalnox = idx >= 49;
    const category = isStalnox ? 'stalnox' : 'hinox';
    const name = isStalnox ? (h.display_name || "Stalnox (Skeleton Hinox)") : (h.display_name || "Hinox");
    markers.push({
      id: `${category}-${h.completion_hash || idx}`,
      name,
      category,
      layer: isDepths ? 'depths' : 'surface',
      position: h.position,
      lat: h.position.z,
      lng: h.position.x,
      icon: isStalnox ? '/icons/enemies/stalnox.svg' : '/icons/genie/hinox.png',
      description: isStalnox 
        ? "Skeletal cyclops that only awakens at night or underground in the Depths!" 
        : "Giant cyclops sleeping boss. Shoot its eye to stun!"
    });
  });

  const taluses = (mapRawData as any).taluses || [];
  taluses.forEach((t: any, idx: number) => {
    const isDepths = t.position.y < -100;
    markers.push({
      id: `talus-${t.completion_hash || idx}`,
      name: t.display_name || "Stone Talus",
      category: 'talus',
      layer: isDepths ? 'depths' : 'surface',
      position: t.position,
      lat: t.position.z,
      lng: t.position.x,
      icon: '/icons/genie/talus.png',
      description: "Living rock formation monster. Mine its ore deposit on top."
    });
  });

  const froxes = (mapRawData as any).froxes || [];
  froxes.forEach((f: any, idx: number) => {
    markers.push({
      id: `frox-${f.completion_hash || idx}`,
      name: f.display_name || "Frox",
      category: 'frox',
      layer: 'depths',
      position: f.position,
      lat: f.position.z,
      lng: f.position.x,
      icon: '/icons/enemies/frox.svg',
      description: "Gigantic depths toad monster that feeds on Zonaite ore."
    });
  });

  const moldugas = (mapRawData as any).moldugas || [];
  moldugas.forEach((m: any, idx: number) => {
    markers.push({
      id: `molduga-${m.completion_hash || idx}`,
      name: m.display_name || "Molduga",
      category: 'molduga',
      layer: 'surface',
      position: m.position,
      lat: m.position.z,
      lng: m.position.x,
      icon: '/icons/genie/molduga.png',
      description: "Gerudo desert sand whale that attacks sound and tremors."
    });
  });

  const fluxConstructs = (mapRawData as any).flux_constructs || [];
  fluxConstructs.forEach((fc: any, idx: number) => {
    const isDepths = fc.position.y < -100;
    const isSky = fc.position.y > 600;
    const layer = isDepths ? 'depths' : isSky ? 'sky' : 'surface';
    markers.push({
      id: `flux-${fc.completion_hash || idx}`,
      name: fc.display_name || "Flux Construct",
      category: 'flux_construct',
      layer,
      position: fc.position,
      lat: fc.position.z,
      lng: fc.position.x,
      icon: '/icons/enemies/flux_construct.svg',
      description: "Zonai shape-shifting guardian core (Level I, II, or III)."
    });
  });

  // 10. Addison Signposts (Hudson Construction)
  const addisonSigns = (mapRawData as any).addison_signposts || [];
  addisonSigns.forEach((ad: any, idx: number) => {
    markers.push({
      id: `addison-${ad.completion_hash || idx}`,
      name: "Hudson Construction Sign (Addison)",
      category: 'addison',
      layer: 'surface',
      position: ad.position,
      lat: ad.position.z,
      lng: ad.position.x,
      icon: '/icons/genie/hudson_sign.png',
      description: "Help Addison keep President Hudson's sign standing with Ultrahand building blocks!"
    });
  });

  // 11. Sage's Wills
  const sagesWills = (mapRawData as any).sages_wills || [];
  sagesWills.forEach((sw: any, idx: number) => {
    markers.push({
      id: `sage-${sw.completion_hash || idx}`,
      name: "Sage's Will",
      category: 'sage_will',
      layer: 'sky',
      position: sw.position,
      lat: sw.position.z,
      lng: sw.position.x,
      icon: '/icons/genie/sages_will.png',
      description: "Collect 4 to permanently enhance the combat bond and attack damage of a Sage avatar!"
    });
  });

  // 12. Old Maps
  const oldMaps = (mapRawData as any).old_maps || [];
  oldMaps.forEach((om: any, idx: number) => {
    markers.push({
      id: `oldmap-${om.completion_hash || idx}`,
      name: "Old Map",
      category: 'old_map',
      layer: 'sky',
      position: om.position,
      lat: om.position.z,
      lng: om.position.x,
      icon: '/icons/genie/treasure.png',
      description: "Treasure map found in the Sky that marks a sunken chest containing armor in the Depths!"
    });
  });

  // 13. Autobuild Schema Stones & Yiga Schematics
  const schemaStones = (mapRawData as any).schema_stones || [];
  schemaStones.forEach((ss: any, idx: number) => {
    markers.push({
      id: `schema-${ss.completion_hash || idx}`,
      name: ss.display_name || "Schema Stone",
      category: 'schema_stone',
      layer: 'depths',
      position: ss.position,
      lat: ss.position.z,
      lng: ss.position.x,
      icon: '/icons/genie/schema_stone.png',
      description: "Zonai ancient autobuild schematic blueprint."
    });
  });

  const yigaSchematics = (mapRawData as any).yiga_schematics || [];
  yigaSchematics.forEach((ys: any, idx: number) => {
    markers.push({
      id: `yiga-${ys.completion_hash || idx}`,
      name: ys.display_name || "Yiga Schematic",
      category: 'yiga_schematic',
      layer: 'depths',
      position: ys.position,
      lat: ys.position.z,
      lng: ys.position.x,
      icon: '/icons/genie/yiga_schematic.png',
      description: "Yiga Clan vehicle blueprint for Autobuild."
    });
  });

  // 14. All MapGenie Markers (Enemy Camps, Lynels, Wizzrobes, Octoroks, Yiga, Minibosses, Strongholds, Zonai Enemies, Chests, Caves, Chasms, Wells, Loot, Quests, NPCs, Services, etc.)
  // Pre-link all 38 Chasm pairs (Surface entrance <-> Depths exit) bidirectionally for seamless dive/ascend
  const chasmTwinMap = new Map<string, MarkerPoint['twin']>();
  const surfaceChasms: MarkerPoint[] = [];
  const depthsChasms: MarkerPoint[] = [];

  (extraMarkersRawData as MarkerPoint[]).forEach((m) => {
    if (m.category === 'chasm') {
      if (m.layer === 'surface') surfaceChasms.push(m);
      else if (m.layer === 'depths') depthsChasms.push(m);
    }
  });

  surfaceChasms.forEach((sc) => {
    let target: MarkerPoint | undefined = undefined;
    const match = sc.description && sc.description.match(/locationIds=(\d+)/);
    if (match) {
      target = depthsChasms.find((d) => d.id === `genie-${match[1]}`);
    }
    if (!target) {
      let minDist = Infinity;
      depthsChasms.forEach((dc) => {
        const dx = sc.position.x - dc.position.x;
        const dz = sc.position.z - dc.position.z;
        const dist = dx * dx + dz * dz;
        if (dist < minDist) {
          minDist = dist;
          target = dc;
        }
      });
    }

    if (target) {
      chasmTwinMap.set(sc.id, {
        id: target.id,
        name: target.name,
        layer: 'depths',
        lat: target.lat,
        lng: target.lng,
      });
      chasmTwinMap.set(target.id, {
        id: sc.id,
        name: sc.name,
        layer: 'surface',
        lat: sc.lat,
        lng: sc.lng,
      });
    }
  });

  (extraMarkersRawData as MarkerPoint[]).forEach((extra) => {
    if (extra.category === 'chasm' && chasmTwinMap.has(extra.id)) {
      markers.push({
        ...extra,
        twin: chasmTwinMap.get(extra.id),
      });
    } else {
      markers.push(extra);
    }
  });

  // 15. Device Dispensers
  DEVICE_DISPENSERS.forEach((disp) => {
    markers.push({
      id: disp.id,
      name: `Device Dispenser: ${disp.name}`,
      category: 'dispenser',
      layer: disp.layer,
      position: disp.position,
      lat: disp.position.z,
      lng: disp.position.x,
      icon: '/icons/genie/device_dispenser.png',
      items: disp.items,
      description: `Dispenses: ${disp.items.join(', ')} (${disp.location})`
    });
  });

  // 16. Areas & Region Names (MapGenie Area Labels)
  (areasRawData as any[]).forEach((area) => {
    markers.push({
      id: area.id,
      name: area.name,
      category: 'area',
      layer: area.layer,
      position: area.position,
      lat: area.lat,
      lng: area.lng,
      icon: area.icon || '/icons/genie/area.png',
      description: area.description || 'Geographic region and area landmark in Hyrule.'
    });
  });

  // 17. Major Provinces / Regions (Hyrule Field, Hyrule Ridge, Lanayru, etc.)
  TOTK_PROVINCES.forEach((prov) => {
    markers.push(prov);
  });

  return markers;
}

export { SKYVIEW_TOWERS, KOROK_TUTORIALS, DEVICE_DISPENSERS, DRAGONS, TOTK_PROVINCES };
export * from './categoryColors';
