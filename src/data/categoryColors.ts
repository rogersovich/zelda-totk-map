export interface CategoryTheme {
  sectionId: string;
  sectionName: string;
  colorName: string;
  hex: string;
  borderHex: string;
  glowHex: string;
  badgeBg: string;
  badgeText: string;
}

export const SECTION_THEMES: Record<string, CategoryTheme> = {
  enemies: {
    sectionId: 'enemies',
    sectionName: 'Enemies',
    colorName: 'Merah muda',
    hex: '#d93856',
    borderHex: '#881337',
    glowHex: '#f43f5e',
    badgeBg: 'rgba(217, 56, 86, 0.25)',
    badgeText: '#fb7185',
  },
  quests: {
    sectionId: 'quests',
    sectionName: 'Quests',
    colorName: 'Coklat muda',
    hex: '#c2854a',
    borderHex: '#78350f',
    glowHex: '#d97706',
    badgeBg: 'rgba(194, 133, 74, 0.25)',
    badgeText: '#f59e0b',
  },
  loot: {
    sectionId: 'loot',
    sectionName: 'Loot',
    colorName: 'Biru muda',
    hex: '#0ea5e9',
    borderHex: '#0369a1',
    glowHex: '#38bdf8',
    badgeBg: 'rgba(14, 165, 233, 0.25)',
    badgeText: '#38bdf8',
  },
  collectibles: {
    sectionId: 'collectibles',
    sectionName: 'Collectibles',
    colorName: 'Ungu muda',
    hex: '#a855f7',
    borderHex: '#7e22ce',
    glowHex: '#c084fc',
    badgeBg: 'rgba(168, 85, 247, 0.25)',
    badgeText: '#c084fc',
  },
  services: {
    sectionId: 'services',
    sectionName: 'Services',
    colorName: 'Teal muda',
    hex: '#14b8a6',
    borderHex: '#0f766e',
    glowHex: '#2dd4bf',
    badgeBg: 'rgba(20, 184, 166, 0.25)',
    badgeText: '#2dd4bf',
  },
  locations: {
    sectionId: 'locations',
    sectionName: 'Locations',
    colorName: 'Biru tua',
    hex: '#2563eb',
    borderHex: '#1e3a8a',
    glowHex: '#3b82f6',
    badgeBg: 'rgba(37, 99, 235, 0.25)',
    badgeText: '#60a5fa',
  },
  other: {
    sectionId: 'other',
    sectionName: 'Other',
    colorName: 'Abu-abu muda',
    hex: '#94a3b8',
    borderHex: '#475569',
    glowHex: '#cbd5e1',
    badgeBg: 'rgba(148, 163, 184, 0.25)',
    badgeText: '#cbd5e1',
  },
};

// Map every single category to its section
export const CATEGORY_TO_SECTION: Record<string, string> = {
  // Enemies -> Merah muda
  dragon: 'enemies',
  enemy_camp: 'enemies',
  flux_construct: 'enemies',
  frox: 'enemies',
  gleeok: 'enemies',
  hinox: 'enemies',
  lynel: 'enemies',
  miniboss: 'enemies',
  molduga: 'enemies',
  octorok: 'enemies',
  stalnox: 'enemies',
  stronghold: 'enemies',
  talus: 'enemies',
  wizzrobe: 'enemies',
  yiga: 'enemies',
  zonai_enemy: 'enemies',

  // Quests -> Coklat muda
  main_quest: 'quests',
  memory: 'quests',
  shrine_quest: 'quests',
  side_adventure: 'quests',
  side_quest: 'quests',

  // Loot -> Biru muda
  armor: 'loot',
  arrows: 'loot',
  blupee: 'loot',
  chest: 'loot',
  elixir: 'loot',
  gem: 'loot',
  poe: 'loot',
  rupees: 'loot',
  shield: 'loot',
  treasure_chest: 'loot',
  weapon: 'loot',
  zonai_charge: 'loot',
  zonai_component: 'loot',

  // Collectibles -> Ungu muda
  ancient_tablet: 'collectibles',
  schema_stone: 'collectibles',
  dragon_tear: 'collectibles',
  key_item: 'collectibles',
  korok: 'collectibles',
  master_sword: 'collectibles',
  paraglider_fabric: 'collectibles',
  sage_will: 'collectibles',
  treasure: 'collectibles',
  voice_memory: 'collectibles',
  yiga_schematic: 'collectibles',
  old_map: 'collectibles',

  // Services -> Teal muda
  armor_shop: 'services',
  bargainer: 'services',
  crystal_refinery: 'services',
  dispenser: 'services',
  dye_shop: 'services',
  general_store: 'services',
  hestu: 'services',
  inn: 'services',
  jewelry_shop: 'services',
  koltin: 'services',
  mini_game: 'services',
  stable: 'services',
  travelling_merchant: 'services',

  // Locations -> Biru tua
  area: 'locations',
  building: 'locations',
  cave: 'locations',
  chasm: 'locations',
  goddess_statue: 'locations',
  great_fairy: 'locations',
  landmark: 'locations',
  lighthouse: 'locations',
  lightroot: 'locations',
  point_of_interest: 'locations',
  province: 'locations',
  settlement: 'locations',
  shrine: 'locations',
  tower: 'locations',
  tech_lab: 'locations',
  temple: 'locations',
  zonai_survey: 'locations',

  // Other -> Abu-abu muda
  cave_entrance: 'other',
  cooking_pot: 'other',
  easter_egg: 'other',
  falling_platform: 'other',
  addison: 'other',
  lore: 'other',
  mechanism: 'other',
  miscellaneous: 'other',
  npc: 'other',
  quest_objective: 'other',
  satori_tree: 'other',
  unique_horse: 'other',
  vehicle: 'other',
  well: 'other',
};

export function getCategoryTheme(category: string): CategoryTheme {
  const section = CATEGORY_TO_SECTION[category] || 'other';
  return SECTION_THEMES[section] || SECTION_THEMES.other;
}
