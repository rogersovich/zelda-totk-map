import dispensersData from './dispensers.json';

export interface DeviceDispenser {
  id: string;
  name: string;
  location: string;
  layer: "surface" | "sky" | "depths";
  position: { x: number; y: number; z: number };
  items: string[];
}

export const DEVICE_DISPENSERS: DeviceDispenser[] = dispensersData as DeviceDispenser[];

// All 27 canonical Zonai Devices in The Legend of Zelda: Tears of the Kingdom (Alphabetical)
export const ALL_ZONAI_PARTS = [
  "Balloon",
  "Battery",
  "Beam Emitter",
  "Big Battery",
  "Big Wheel",
  "Cannon",
  "Cart",
  "Construct Head",
  "Fan",
  "Flame Emitter",
  "Frost Emitter",
  "Homing Cart",
  "Hover Stone",
  "Hydrant",
  "Light",
  "Mirror",
  "Portable Pot",
  "Rocket",
  "Shock Emitter",
  "Sled",
  "Small Wheel",
  "Spring",
  "Stabilizer",
  "Stake",
  "Steering Stick",
  "Time Bomb",
  "Wing"
];
