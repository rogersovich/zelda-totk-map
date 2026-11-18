import { MapLayer } from '../store/useMapStore';

export interface ArmorPiece {
  id: string;
  slot: 'Head' | 'Body' | 'Legs';
  name: string;
  locationHint: string;
  coords?: { lat: number; lng: number; layer: MapLayer };
}

export interface ArmorUpgradeTier {
  level: 1 | 2 | 3 | 4;
  defensePerPiece: number;
  rupeesPerPiece: number;
  materials: string[];
}

export interface ArmorSet {
  id: string;
  name: string;
  effect: string;
  setBonus: string;
  pieces: ArmorPiece[];
  upgrades?: ArmorUpgradeTier[];
  note?: string;
}

export const ARMOR_SETS: ArmorSet[] = [
  {
    id: 'fierce-deity',
    name: 'Fierce Deity Set',
    effect: 'Attack Up',
    setBonus: 'Charge Attack Stamina Up (2★)',
    pieces: [
      {
        id: 'armor-fd-head',
        slot: 'Head',
        name: 'Fierce Deity Mask',
        locationHint: 'Skull Lake Cave (Akkala)',
        coords: { lat: -3156, lng: 3254, layer: 'surface' },
      },
      {
        id: 'armor-fd-body',
        slot: 'Body',
        name: 'Fierce Deity Armor',
        locationHint: 'Akkala Citadel Ruins Summit Cave',
        coords: { lat: -1512, lng: 3294, layer: 'surface' },
      },
      {
        id: 'armor-fd-legs',
        slot: 'Legs',
        name: 'Fierce Deity Boots',
        locationHint: 'Ancient Tree Stump Cave (Hyrule Field)',
        coords: { lat: 462, lng: -1122, layer: 'surface' },
      },
    ],
    upgrades: [
      { level: 1, defensePerPiece: 5, rupeesPerPiece: 10, materials: ['5x Hinox Toenail', '1x Shard of Dinraal/Naydra/Farosh Fang'] },
      { level: 2, defensePerPiece: 8, rupeesPerPiece: 50, materials: ['5x Hinox Tooth', '1x Shard of Dragon Claw'] },
      { level: 3, defensePerPiece: 12, rupeesPerPiece: 200, materials: ['5x Hinox Guts', '1x Dragon Scale'] },
      { level: 4, defensePerPiece: 20, rupeesPerPiece: 500, materials: ['5x Lynel Guts', '1x Dragon Horn'] },
    ],
  },
  {
    id: 'glide-suit',
    name: 'Glide Suit',
    effect: 'Skydive Mobility Up',
    setBonus: 'Impact Proof — No Fall Damage (2★)',
    pieces: [
      {
        id: 'armor-glide-head',
        slot: 'Head',
        name: 'Glide Mask',
        locationHint: 'Valor Island Dive Ceremony (Lanayru Sky)',
        coords: { lat: 468, lng: 4460, layer: 'sky' },
      },
      {
        id: 'armor-glide-body',
        slot: 'Body',
        name: 'Glide Shirt',
        locationHint: 'Courage Island Dive Ceremony (Central Sky)',
        coords: { lat: -846, lng: -2344, layer: 'sky' },
      },
      {
        id: 'armor-glide-legs',
        slot: 'Legs',
        name: 'Glide Tights',
        locationHint: 'Bravery Island Dive Ceremony (Eldin Sky)',
        coords: { lat: -2865, lng: 256, layer: 'sky' },
      },
    ],
    upgrades: [
      { level: 1, defensePerPiece: 4, rupeesPerPiece: 10, materials: ['3x Keese Wing'] },
      { level: 2, defensePerPiece: 7, rupeesPerPiece: 50, materials: ['5x Aerocuda Wing', '6x Aerocuda Eyeball'] },
      { level: 3, defensePerPiece: 10, rupeesPerPiece: 200, materials: ['8x Aerocuda Wing', '5x Zonaite'] },
      { level: 4, defensePerPiece: 16, rupeesPerPiece: 500, materials: ['6x Gleeok Wing', '12x Large Zonaite'] },
    ],
  },
  {
    id: 'froggy-set',
    name: 'Froggy Set',
    effect: 'Slip Resistance',
    setBonus: 'Slip Proof — Climb in Rain (2★)',
    note: 'Reward from Penn & Traysi "Potential Princess Sightings!" (12 Stable Quests)',
    pieces: [
      { id: 'armor-frog-head', slot: 'Head', name: 'Froggy Hood', locationHint: 'Complete 9 Stable Quests (Lucky Clover Gazette)' },
      { id: 'armor-frog-body', slot: 'Body', name: 'Froggy Sleeve', locationHint: 'Complete 4 Stable Quests (Lucky Clover Gazette)' },
      { id: 'armor-frog-legs', slot: 'Legs', name: 'Froggy Leggings', locationHint: 'Complete 12 Stable Quests (Lucky Clover Gazette)' },
    ],
    upgrades: [
      { level: 1, defensePerPiece: 5, rupeesPerPiece: 10, materials: ['3x Sticky Lizard'] },
      { level: 2, defensePerPiece: 8, rupeesPerPiece: 50, materials: ['5x Sticky Lizard', '5x Horriblin Horn'] },
      { level: 3, defensePerPiece: 12, rupeesPerPiece: 200, materials: ['5x Sticky Frog', '5x Blue Horriblin Horn'] },
      { level: 4, defensePerPiece: 20, rupeesPerPiece: 500, materials: ['10x Sticky Frog', '5x Black Horriblin Horn', '10x Opal'] },
    ],
  },
  {
    id: 'miners-set',
    name: "Miner's Set",
    effect: 'Glow (Lights up Depths)',
    setBonus: 'Shining Steps (2★)',
    pieces: [
      {
        id: 'armor-miner-head',
        slot: 'Head',
        name: "Miner's Mask",
        locationHint: 'Abandoned Kara Kara Mine (Depths)',
        coords: { lat: 2564, lng: -3225, layer: 'depths' },
      },
      {
        id: 'armor-miner-body',
        slot: 'Body',
        name: "Miner's Top",
        locationHint: 'Daphnes Canyon Mine (Depths)',
        coords: { lat: 1094, lng: -1075, layer: 'depths' },
      },
      {
        id: 'armor-miner-legs',
        slot: 'Legs',
        name: "Miner's Trousers",
        locationHint: 'Hylia Canyon Mine (Depths)',
        coords: { lat: 2158, lng: -1293, layer: 'depths' },
      },
    ],
    upgrades: [
      { level: 1, defensePerPiece: 5, rupeesPerPiece: 10, materials: ['10x Brightbloom Seed'] },
      { level: 2, defensePerPiece: 8, rupeesPerPiece: 50, materials: ['15x Brightbloom Seed', '5x Brightcap'] },
      { level: 3, defensePerPiece: 12, rupeesPerPiece: 200, materials: ['20x Giant Brightbloom Seed', '5x Glowing Cave Fish'] },
      { level: 4, defensePerPiece: 20, rupeesPerPiece: 500, materials: ['15x Large Zonaite', '10x Dazzlefruit', '3x Diamond'] },
    ],
  },
  {
    id: 'depths-set',
    name: 'Armor of the Depths',
    effect: 'Gloom Resistance',
    setBonus: 'Gloom Attack Resist (2★)',
    pieces: [
      {
        id: 'armor-depths-head',
        slot: 'Head',
        name: 'Hood of the Depths',
        locationHint: 'Bargainer Statues (All 6 Found — 300 Poes)',
      },
      {
        id: 'armor-depths-body',
        slot: 'Body',
        name: 'Tunic of the Depths',
        locationHint: 'Bargainer Statues (2 Found — 150 Poes)',
      },
      {
        id: 'armor-depths-legs',
        slot: 'Legs',
        name: 'Gaiters of the Depths',
        locationHint: 'Bargainer Statues (4 Found — 200 Poes)',
      },
    ],
    upgrades: [
      { level: 1, defensePerPiece: 5, rupeesPerPiece: 10, materials: ['3x Deep Firefly'] },
      { level: 2, defensePerPiece: 8, rupeesPerPiece: 50, materials: ['5x Deep Firefly', '5x Dark Clump'] },
      { level: 3, defensePerPiece: 12, rupeesPerPiece: 200, materials: ['10x Dark Clump', '3x Black Hinox Horn'] },
      { level: 4, defensePerPiece: 20, rupeesPerPiece: 500, materials: ['3x Frox Fang', '5x Frox Guts', '15x Zonaite'] },
    ],
  },
  {
    id: 'zonaite-set',
    name: 'Zonaite Set',
    effect: 'Energy Up (Half Battery Drain)',
    setBonus: 'Energy Recharge Up (2★)',
    pieces: [
      {
        id: 'armor-zonai-head',
        slot: 'Head',
        name: 'Zonaite Helm',
        locationHint: 'Lightcast Island (Tabantha Sky)',
        coords: { lat: -1462, lng: -3735, layer: 'sky' },
      },
      {
        id: 'armor-zonai-body',
        slot: 'Body',
        name: 'Zonaite Waistguard',
        locationHint: 'Zonaite Forge Island (Necluda Sky)',
        coords: { lat: 1416, lng: 2384, layer: 'sky' },
      },
      {
        id: 'armor-zonai-legs',
        slot: 'Legs',
        name: 'Zonaite Shin Guards',
        locationHint: 'Sky Mine (Akkala Sky)',
        coords: { lat: -2172, lng: 4464, layer: 'sky' },
      },
    ],
    upgrades: [
      { level: 1, defensePerPiece: 7, rupeesPerPiece: 10, materials: ['5x Soldier Construct Horn'] },
      { level: 2, defensePerPiece: 12, rupeesPerPiece: 50, materials: ['5x Soldier Construct II Horn', '5x Captain Construct I Horn'] },
      { level: 3, defensePerPiece: 18, rupeesPerPiece: 200, materials: ['5x Soldier Construct III Horn', '5x Captain Construct II Horn', '5x Zonaite'] },
      { level: 4, defensePerPiece: 28, rupeesPerPiece: 500, materials: ['5x Soldier Construct IV Horn', '5x Captain Construct III Horn', '10x Large Zonaite'] },
    ],
  },
  {
    id: 'barbarian-set',
    name: 'Barbarian Set',
    effect: 'Attack Up',
    setBonus: 'Charge Attack Stamina Up (2★)',
    pieces: [
      {
        id: 'armor-barb-head',
        slot: 'Head',
        name: 'Barbarian Helm',
        locationHint: 'Robred Dropoff Cave (Necluda)',
        coords: { lat: 1435, lng: 2566, layer: 'surface' },
      },
      {
        id: 'armor-barb-body',
        slot: 'Body',
        name: 'Barbarian Armor',
        locationHint: 'Crenel Hills Cave (Hyrule Field)',
        coords: { lat: -535, lng: 492, layer: 'surface' },
      },
      {
        id: 'armor-barb-legs',
        slot: 'Legs',
        name: 'Barbarian Leg Wraps',
        locationHint: 'Walnot Mountain Cave (Hateno)',
        coords: { lat: 2116, lng: 3934, layer: 'surface' },
      },
    ],
    upgrades: [
      { level: 1, defensePerPiece: 5, rupeesPerPiece: 10, materials: ['3x Mighty Thistle'] },
      { level: 2, defensePerPiece: 8, rupeesPerPiece: 50, materials: ['5x Mighty Thistle', '2x Lynel Horn / Saber Horn'] },
      { level: 3, defensePerPiece: 12, rupeesPerPiece: 200, materials: ['3x Blue-Maned Lynel Saber Horn', '3x Razorshroom'] },
      { level: 4, defensePerPiece: 20, rupeesPerPiece: 500, materials: ['3x White-Maned Lynel Saber Horn', '3x Silver Lynel Mace Horn', '3x Bladed Rhino Beetle'] },
    ],
  },
  {
    id: 'climbing-set',
    name: 'Climbing Set',
    effect: 'Climb Speed Up',
    setBonus: 'Climbing Jump Stamina Up (2★)',
    pieces: [
      {
        id: 'armor-climb-head',
        slot: 'Head',
        name: "Climber's Bandanna",
        locationHint: 'Ploymus Mountain Cave (Zora Domain)',
        coords: { lat: -365, lng: 3630, layer: 'surface' },
      },
      {
        id: 'armor-climb-body',
        slot: 'Body',
        name: 'Climbing Gear',
        locationHint: 'North Hyrule Plain Cave',
        coords: { lat: -743, lng: -1191, layer: 'surface' },
      },
      {
        id: 'armor-climb-legs',
        slot: 'Legs',
        name: 'Climbing Boots',
        locationHint: 'Upland Zorana Byroad (Lanayru)',
        coords: { lat: -504, lng: 2882, layer: 'surface' },
      },
    ],
    upgrades: [
      { level: 1, defensePerPiece: 5, rupeesPerPiece: 10, materials: ['3x Keese Wing', '3x Rushroom'] },
      { level: 2, defensePerPiece: 8, rupeesPerPiece: 50, materials: ['5x Electric Keese Wing', '5x Hightail Lizard'] },
      { level: 3, defensePerPiece: 12, rupeesPerPiece: 200, materials: ['5x Ice Keese Wing', '10x Hot-Footed Frog'] },
      { level: 4, defensePerPiece: 20, rupeesPerPiece: 500, materials: ['5x Fire Keese Wing', '15x Swift Violet'] },
    ],
  },
  {
    id: 'snowquill-set',
    name: 'Snowquill Set',
    effect: 'Cold Resistance',
    setBonus: 'Unfreezable (2★)',
    pieces: [
      { id: 'armor-snow-head', slot: 'Head', name: 'Snowquill Headdress', locationHint: 'Rito Village Armor Shop (650 Rupees)' },
      { id: 'armor-snow-body', slot: 'Body', name: 'Snowquill Tunic', locationHint: 'Rito Village Armor Shop (500 Rupees)' },
      { id: 'armor-snow-legs', slot: 'Legs', name: 'Snowquill Trousers', locationHint: 'Rito Village Armor Shop (1,000 Rupees)' },
    ],
    upgrades: [
      { level: 1, defensePerPiece: 5, rupeesPerPiece: 10, materials: ['3x Red ChuChu Jelly'] },
      { level: 2, defensePerPiece: 8, rupeesPerPiece: 50, materials: ['5x Red ChuChu Jelly', '3x Warm Safflina'] },
      { level: 3, defensePerPiece: 12, rupeesPerPiece: 200, materials: ['5x Fire Keese Wing', '5x Sunshroom', '3x Fire-Breath Lizalfos Tail'] },
      { level: 4, defensePerPiece: 20, rupeesPerPiece: 500, materials: ['5x Ruby', '10x Fire-Breath Lizalfos Tail', '5x Sizzlefin Trout'] },
    ],
  },
  {
    id: 'flamebreaker-set',
    name: 'Flamebreaker Set',
    effect: 'Flame Guard',
    setBonus: 'Fireproof (2★)',
    pieces: [
      { id: 'armor-flame-head', slot: 'Head', name: 'Flamebreaker Helm', locationHint: 'Goron City Armor Shop (1,400 Rupees)' },
      { id: 'armor-flame-body', slot: 'Body', name: 'Flamebreaker Armor', locationHint: 'Goron City Armor Shop (700 Rupees)' },
      { id: 'armor-flame-legs', slot: 'Legs', name: 'Flamebreaker Boots', locationHint: 'Goron City Armor Shop (1,200 Rupees)' },
    ],
    upgrades: [
      { level: 1, defensePerPiece: 5, rupeesPerPiece: 10, materials: ['3x Fireproof Lizard'] },
      { level: 2, defensePerPiece: 8, rupeesPerPiece: 50, materials: ['5x Fireproof Lizard', '5x Moblin Horn'] },
      { level: 3, defensePerPiece: 12, rupeesPerPiece: 200, materials: ['5x Smotherwing Butterfly', '5x Blue Moblin Horn', '3x Flint'] },
      { level: 4, defensePerPiece: 20, rupeesPerPiece: 500, materials: ['10x Smotherwing Butterfly', '5x Black Moblin Horn', '5x Ruby'] },
    ],
  },
];
