export interface CategoryItem {
  id: string;
  name: string;
  count: number;
  icon: string; // Direct path to authentic Zelda map icon
  defaultActive?: boolean;
}

export interface CategorySection {
  id: string;
  title: string;
  left: CategoryItem[];
  right: CategoryItem[];
}

export const CATEGORY_SECTIONS: CategorySection[] = [
  {
    id: 'locations',
    title: 'LOCATIONS',
    left: [
      { id: 'area', name: 'AREA', count: 392, icon: '/icons/genie/area.png', defaultActive: true },
      { id: 'building', name: 'BUILDING', count: 9, icon: '/icons/genie/building.png' },
      { id: 'cave', name: 'CAVE', count: 147, icon: '/icons/genie/cave.png' },
      { id: 'chasm', name: 'CHASM', count: 76, icon: '/icons/genie/chasm.png' },
      { id: 'goddess_statue', name: 'GODDESS STATUE', count: 18, icon: '/icons/genie/goddess_statue.png' },
      { id: 'great_fairy', name: 'GREAT FAIRY', count: 5, icon: '/icons/genie/great_fairy.png' },
      { id: 'landmark', name: 'LANDMARK', count: 201, icon: '/icons/genie/landmark.png' },
      { id: 'lighthouse', name: 'LIGHTHOUSE', count: 18, icon: '/icons/genie/lighthouse.png' },
      { id: 'lightroot', name: 'LIGHTROOT', count: 120, icon: '/icons/genie/lightroot.png', defaultActive: true },
    ],
    right: [
      { id: 'point_of_interest', name: 'POINT OF INTEREST', count: 21, icon: '/icons/genie/point_of_interest.png' },
      { id: 'province', name: 'PROVINCE', count: 29, icon: '/icons/genie/province.png', defaultActive: true },
      { id: 'settlement', name: 'SETTLEMENT', count: 9, icon: '/icons/genie/settlement.png', defaultActive: true },
      { id: 'shrine', name: 'SHRINE', count: 152, icon: '/icons/genie/shrine.png', defaultActive: true },
      { id: 'tower', name: 'SKYVIEW TOWER', count: 15, icon: '/icons/genie/skyview_tower.png', defaultActive: true },
      { id: 'tech_lab', name: 'TECH LAB', count: 2, icon: '/icons/genie/tech_lab.png' },
      { id: 'temple', name: 'TEMPLE', count: 5, icon: '/icons/genie/temple.png' },
      { id: 'zonai_survey', name: 'ZONAI SURVEY TEAM...', count: 1, icon: '/icons/genie/zonai_survey_team_base.png' },
    ],
  },
  {
    id: 'services',
    title: 'SERVICES',
    left: [
      { id: 'armor_shop', name: 'ARMOR SHOP', count: 6, icon: '/icons/genie/armor_shop.png' },
      { id: 'bargainer', name: 'BARGAINER STATUE', count: 7, icon: '/icons/genie/bargainer_statue.png' },
      { id: 'crystal_refinery', name: 'CRYSTAL REFINERY', count: 2, icon: '/icons/genie/crystal_refinery.png' },
      { id: 'dispenser', name: 'DEVICE DISPENSER', count: 30, icon: '/icons/genie/device_dispenser.png', defaultActive: true },
      { id: 'dye_shop', name: 'DYE SHOP', count: 1, icon: '/icons/genie/dye_shop.png' },
      { id: 'general_store', name: 'GENERAL STORE', count: 30, icon: '/icons/genie/general_store.png' },
      { id: 'hestu', name: 'HESTU', count: 3, icon: '/icons/genie/hestu.png' },
    ],
    right: [
      { id: 'inn', name: 'INN', count: 10, icon: '/icons/genie/inn.png' },
      { id: 'jewelry_shop', name: 'JEWELRY SHOP', count: 1, icon: '/icons/genie/jewelry_shop.png' },
      { id: 'koltin', name: 'KOLTIN', count: 7, icon: '/icons/genie/koltin.png' },
      { id: 'mini_game', name: 'MINI-GAME', count: 17, icon: '/icons/genie/mini_game.png' },
      { id: 'stable', name: 'STABLE', count: 16, icon: '/icons/genie/stable.png', defaultActive: true },
      { id: 'travelling_merchant', name: 'TRAVELLING MERCH...', count: 11, icon: '/icons/genie/travelling_merchant.png' },
    ],
  },
  {
    id: 'collectibles',
    title: 'COLLECTIBLES',
    left: [
      { id: 'ancient_tablet', name: 'ANCIENT TABLET', count: 12, icon: '/icons/genie/lore.png' },
      { id: 'schema_stone', name: 'AUTOBUILD SCHEM...', count: 12, icon: '/icons/genie/schema_stone.png' },
      { id: 'dragon_tear', name: 'DRAGON TEAR', count: 12, icon: '/icons/genie/dragon_tear.png' },
      { id: 'key_item', name: 'KEY ITEM', count: 41, icon: '/icons/genie/key_item.png' },
      { id: 'korok', name: 'KOROK SEED', count: 1000, icon: '/icons/genie/korok_seed.png' },
      { id: 'master_sword', name: 'MASTER SWORD', count: 1, icon: '/icons/genie/master_sword.png' },
    ],
    right: [
      { id: 'paraglider_fabric', name: 'PARAGLIDER FABRIC', count: 28, icon: '/icons/genie/paraglider_fabric.png' },
      { id: 'sage_will', name: "SAGE'S WILL", count: 20, icon: '/icons/genie/sages_will.png' },
      { id: 'treasure', name: 'TREASURE', count: 2, icon: '/icons/genie/treasure.png' },
      { id: 'voice_memory', name: 'VOICE MEMORY', count: 240, icon: '/icons/genie/voice_memory.png' },
      { id: 'yiga_schematic', name: 'YIGA SCHEMATIC', count: 34, icon: '/icons/genie/yiga_schematic.png' },
    ],
  },
  {
    id: 'loot',
    title: 'LOOT',
    left: [
      { id: 'armor', name: 'ARMOR', count: 137, icon: '/icons/genie/armor.png' },
      { id: 'arrows', name: 'ARROWS', count: 100, icon: '/icons/genie/arrows.png' },
      { id: 'blupee', name: 'BLUPEE', count: 57, icon: '/icons/genie/blupee.png' },
      { id: 'chest', name: 'CHEST', count: 9, icon: '/icons/genie/chest.png' },
      { id: 'elixir', name: 'ELIXIR', count: 8, icon: '/icons/genie/elixir.png' },
      { id: 'gem', name: 'GEM', count: 121, icon: '/icons/genie/gem.png' },
      { id: 'poe', name: 'POE', count: 717, icon: '/icons/genie/poe.png' },
    ],
    right: [
      { id: 'rupees', name: 'RUPEES', count: 52, icon: '/icons/genie/rupees.png' },
      { id: 'shield', name: 'SHIELD', count: 89, icon: '/icons/genie/shield.png' },
      { id: 'treasure_chest', name: 'TREASURE CHEST', count: 4, icon: '/icons/genie/treasure_chest.png' },
      { id: 'weapon', name: 'WEAPON', count: 806, icon: '/icons/genie/weapon.png' },
      { id: 'zonai_charge', name: 'ZONAI CHARGE', count: 216, icon: '/icons/genie/zonai_charge.png' },
      { id: 'zonai_component', name: 'ZONAI COMPONENT', count: 97, icon: '/icons/genie/zonai_component.png' },
    ],
  },
  {
    id: 'quests',
    title: 'QUESTS',
    left: [
      { id: 'main_quest', name: 'MAIN QUEST', count: 23, icon: '/icons/genie/main_quest.png' },
      { id: 'memory', name: 'MEMORY', count: 14, icon: '/icons/genie/memory.png' },
      { id: 'shrine_quest', name: 'SHRINE QUEST', count: 31, icon: '/icons/genie/shrine_quest.png' },
    ],
    right: [
      { id: 'side_adventure', name: 'SIDE ADVENTURE', count: 60, icon: '/icons/genie/side_adventure.png' },
      { id: 'side_quest', name: 'SIDE QUEST', count: 137, icon: '/icons/genie/side_quest.png' },
    ],
  },
  {
    id: 'enemies',
    title: 'ENEMIES',
    left: [
      { id: 'dragon', name: 'DRAGON', count: 4, icon: '/icons/enemies/dragon.svg', defaultActive: true },
      { id: 'enemy_camp', name: 'ENEMY CAMP', count: 583, icon: '/icons/genie/enemy_camp.png' },
      { id: 'flux_construct', name: 'FLUX CONSTRUCT', count: 35, icon: '/icons/enemies/flux_construct.svg' },
      { id: 'frox', name: 'FROX', count: 40, icon: '/icons/enemies/frox.svg' },
      { id: 'gleeok', name: 'GLEEOK', count: 14, icon: '/icons/enemies/gleeok.svg' },
      { id: 'hinox', name: 'HINOX', count: 49, icon: '/icons/genie/hinox.png' },
      { id: 'lynel', name: 'LYNEL', count: 34, icon: '/icons/genie/lynel.png' },
      { id: 'miniboss', name: 'MINIBOSS', count: 53, icon: '/icons/enemies/miniboss.svg' },
    ],
    right: [
      { id: 'molduga', name: 'MOLDUGA', count: 4, icon: '/icons/genie/molduga.png' },
      { id: 'octorok', name: 'OCTOROK', count: 51, icon: '/icons/enemies/octorok.svg' },
      { id: 'stalnox', name: 'STALNOX', count: 20, icon: '/icons/enemies/stalnox.svg' },
      { id: 'stronghold', name: 'STRONGHOLD', count: 8, icon: '/icons/enemies/stronghold.svg' },
      { id: 'talus', name: 'TALUS', count: 87, icon: '/icons/genie/talus.png' },
      { id: 'wizzrobe', name: 'WIZZROBE', count: 61, icon: '/icons/genie/wizzrobe.png' },
      { id: 'yiga', name: 'YIGA', count: 58, icon: '/icons/genie/yiga.png' },
      { id: 'zonai_enemy', name: 'ZONAI', count: 4, icon: '/icons/enemies/zonai.svg' },
    ],
  },
  {
    id: 'other',
    title: 'OTHER',
    left: [
      { id: 'cave_entrance', name: 'CAVE ENTRANCE', count: 149, icon: '/icons/genie/cave_entrance.png' },
      { id: 'cooking_pot', name: 'COOKING POT', count: 76, icon: '/icons/genie/cooking_pot.png' },
      { id: 'easter_egg', name: 'EASTER EGG', count: 1, icon: '/icons/genie/easter_egg.png' },
      { id: 'falling_platform', name: 'FALLING PLATFORM', count: 19, icon: '/icons/genie/falling_platform.png' },
      { id: 'addison', name: 'HUDSON SIGN', count: 81, icon: '/icons/genie/hudson_sign.png' },
      { id: 'lore', name: 'LORE', count: 95, icon: '/icons/genie/lore.png' },
      { id: 'mechanism', name: 'MECHANISM', count: 5, icon: '/icons/genie/cracked_wall.png' },
    ],
    right: [
      { id: 'miscellaneous', name: 'MISCELLANEOUS', count: 24, icon: '/icons/genie/miscellaneous.png' },
      { id: 'npc', name: 'NPC', count: 98, icon: '/icons/genie/npc.png' },
      { id: 'quest_objective', name: 'QUEST OBJECTIVE', count: 55, icon: '/icons/genie/quest_objective.png' },
      { id: 'satori_tree', name: 'SATORI TREE', count: 8, icon: '/icons/genie/satori_tree.png' },
      { id: 'unique_horse', name: 'UNIQUE HORSE', count: 6, icon: '/icons/genie/unique_horse.png' },
      { id: 'vehicle', name: 'VEHICLE', count: 38, icon: '/icons/genie/vehicle.png' },
      { id: 'well', name: 'WELL', count: 58, icon: '/icons/genie/well.png' },
    ],
  },
];

// Helper to get flat list of all category IDs
export const ALL_CATEGORY_IDS = CATEGORY_SECTIONS.flatMap((s) => [
  ...s.left.map((i) => i.id),
  ...s.right.map((i) => i.id),
]);

// Helper to get default active categories
export const DEFAULT_ACTIVE_CATEGORIES = new Set<string>(
  CATEGORY_SECTIONS.flatMap((s) => [...s.left, ...s.right])
    .filter((i) => i.defaultActive)
    .map((i) => i.id)
);
