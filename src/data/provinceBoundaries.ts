export interface ProvinceBoundary {
  id: string;
  name: string;
  color: string;
  fillColor: string;
  // Coordinates in [lat (z), lng (x)] matching TotK raster map
  polygon: [number, number][];
}

export const PROVINCE_BOUNDARIES: ProvinceBoundary[] = [
  {
    id: 'boundary-hebra',
    name: 'Hebra Province',
    color: '#38bdf8',
    fillColor: 'rgba(56, 189, 248, 0.08)',
    polygon: [
      [-4000, -5000],
      [-4000, -1000],
      [-1700, -1000],
      [-1100, -1800],
      [-900, -3200],
      [-1000, -5000],
    ],
  },
  {
    id: 'boundary-eldin',
    name: 'Eldin Province',
    color: '#f97316',
    fillColor: 'rgba(249, 115, 22, 0.08)',
    polygon: [
      [-4000, -1000],
      [-4000, 3100],
      [-1800, 3100],
      [-1000, 2100],
      [-1100, 800],
      [-1700, -1000],
    ],
  },
  {
    id: 'boundary-akkala',
    name: 'Akkala Province',
    color: '#eab308',
    fillColor: 'rgba(234, 179, 8, 0.08)',
    polygon: [
      [-4000, 3100],
      [-4000, 5000],
      [-800, 5000],
      [-800, 2700],
      [-1800, 3100],
    ],
  },
  {
    id: 'boundary-central',
    name: 'Central Hyrule',
    color: '#e5c158',
    fillColor: 'rgba(229, 193, 88, 0.07)',
    polygon: [
      [-1700, -1000],
      [-1100, 800],
      [-500, 1300],
      [1400, 1200],
      [2300, 300],
      [2300, -1500],
      [1200, -2100],
      [-900, -2100],
      [-1100, -1800],
    ],
  },
  {
    id: 'boundary-lanayru',
    name: 'Lanayru Province',
    color: '#06b6d4',
    fillColor: 'rgba(6, 182, 212, 0.08)',
    polygon: [
      [-1000, 2100],
      [-800, 2700],
      [-800, 5000],
      [1300, 5000],
      [1100, 2200],
      [1400, 1200],
      [-500, 1300],
      [-1100, 800],
    ],
  },
  {
    id: 'boundary-gerudo',
    name: 'Gerudo Province',
    color: '#d97706',
    fillColor: 'rgba(217, 119, 6, 0.08)',
    polygon: [
      [-1000, -5000],
      [-900, -3200],
      [-900, -2100],
      [1200, -2100],
      [2300, -1500],
      [4000, -1600],
      [4000, -5000],
    ],
  },
  {
    id: 'boundary-faron',
    name: 'Faron Province',
    color: '#10b981',
    fillColor: 'rgba(16, 185, 129, 0.08)',
    polygon: [
      [2300, -1500],
      [2300, 300],
      [1800, 1600],
      [2600, 2800],
      [4000, 2600],
      [4000, -1600],
    ],
  },
  {
    id: 'boundary-necluda',
    name: 'Necluda Province',
    color: '#14b8a6',
    fillColor: 'rgba(20, 184, 166, 0.08)',
    polygon: [
      [1400, 1200],
      [1100, 2200],
      [1300, 5000],
      [4000, 5000],
      [4000, 2600],
      [2600, 2800],
      [1800, 1600],
      [2300, 300],
    ],
  },
];
