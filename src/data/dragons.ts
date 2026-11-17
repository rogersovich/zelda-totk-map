export interface Dragon {
  id: string;
  name: string;
  element: string;
  color: string;
  glowColor: string;
  description: string;
  keyDrops: string[];
  chasmEntry?: string;
  chasmExit?: string;
  // Array of coordinates [lat, lng] which is [z, x]
  path: [number, number][];
}

export const DRAGONS: Dragon[] = [
  {
    id: "light-dragon",
    name: "Light Dragon (Naga Cahaya)",
    element: "Holy / Light",
    color: "#fef08a",
    glowColor: "#facc15",
    description: "The divine dragon soaring across all of Hyrule. Carries the Master Sword on its head! Unlike the other dragons, it never enters the Depths and loops clockwise around the entire surface & sky rim (~112 real-world minutes per full loop).",
    keyDrops: ["Master Sword (Pull with 2 stamina wheels)", "Light Dragon's Horn (Heals on attack)", "Light Dragon's Scale", "Shard of Light Dragon's Fang"],
    path: [
      [-2200, 3600],
      [-1400, 3900],
      [-200, 3800],
      [1200, 3600],
      [2200, 3000],
      [3100, 1800],
      [3400, 800],
      [3200, -400],
      [2800, -1800],
      [2000, -3200],
      [800, -3800],
      [-600, -3600],
      [-1800, -3200],
      [-2800, -2200],
      [-3400, -800],
      [-3200, 600],
      [-2800, 2200],
      [-2200, 3600]
    ]
  },
  {
    id: "naydra",
    name: "Naydra (Naga Es)",
    element: "Ice / Frost",
    color: "#38bdf8",
    glowColor: "#0284c7",
    description: "The blue frost dragon of Wisdom. Freezes the air around it (Wear Unfreezable / Cold gear Lv 2). Emerges from Naydra Snowfield Chasm and dives into East Hill Chasm (Kakariko).",
    keyDrops: ["Shard of Naydra's Horn (Frost elemental burst)", "Naydra's Scale", "Naydra's Claw", "Naydra's Fang"],
    chasmExit: "Naydra Snowfield Chasm (near Mount Lanayru)",
    chasmEntry: "East Hill Chasm (near Kakariko Village)",
    path: [
      [1314, 3846],
      [1000, 3200],
      [600, 2500],
      [900, 1800],
      [1500, 1600],
      [2100, 2100],
      [2500, 2800],
      [2000, 3400],
      [1314, 3846]
    ]
  },
  {
    id: "dinraal",
    name: "Dinraal (Naga Api)",
    element: "Fire / Flame",
    color: "#f87171",
    glowColor: "#dc2626",
    description: "The red fire dragon of Power. Emits extreme heat (Wear Flamebreaker Lv 2). Flies around Death Mountain and northern Akkala. Emerges from East Akkala Plains Chasm and enters Drenan Highlands Chasm.",
    keyDrops: ["Shard of Dinraal's Horn (Fire explosion burst)", "Dinraal's Scale", "Dinraal's Claw", "Dinraal's Fang"],
    chasmExit: "East Akkala Plains Chasm (North of Tarrey Town)",
    chasmEntry: "Drenan Highlands Chasm (West of Typhlo Ruins)",
    path: [
      [-2700, 3800],
      [-3500, 3200],
      [-3800, 2000],
      [-3700, 500],
      [-3300, -800],
      [-2800, -2000],
      [-2500, -3200],
      [-2000, -3000],
      [-2200, -1500],
      [-2500, 0],
      [-2600, 2000],
      [-2700, 3800]
    ]
  },
  {
    id: "farosh",
    name: "Farosh (Naga Petir)",
    element: "Lightning / Shock",
    color: "#4ade80",
    glowColor: "#16a34a",
    description: "The golden-green lightning dragon of Courage. Discharges electrical orbs (Equip Lightning Helm or Rubber Set). Emerges from East Gerudo Chasm, flies past Lake Hylia, and enters Hills of Baumer Chasm.",
    keyDrops: ["Shard of Farosh's Horn (Lightning shock burst)", "Farosh's Scale", "Farosh's Claw", "Farosh's Fang"],
    chasmExit: "East Gerudo Chasm (South of Gerudo Canyon)",
    chasmEntry: "Hills of Baumer Chasm (East of Lake Hylia)",
    path: [
      [2400, -2500],
      [2200, -1800],
      [2000, -800],
      [2200, 200],
      [2500, 1000],
      [2700, 1600],
      [2500, 1900],
      [2100, 1600],
      [1800, 800],
      [1900, -500],
      [2100, -1500],
      [2400, -2500]
    ]
  }
];
