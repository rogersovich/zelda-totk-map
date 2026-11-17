// Zelda: Tears of the Kingdom - Curated Material Farming Routes
// High-yield, fast-travel optimized paths for essential combat, healing, and Zonai battery materials.

export interface FarmingWaypoint {
  id: string;
  step: number;
  name: string;
  lat: number;
  lng: number;
  yield: string;
  tip?: string;
  icon: string;
}

export interface FarmingRoute {
  id: string;
  name: string;
  category: 'bomb_flower' | 'sundelion' | 'zonaite' | 'endura';
  layer: 'surface' | 'sky' | 'depths';
  themeColor: string;
  badgeBg: string;
  startLocation: string;
  estimatedYield: string;
  description: string;
  waypoints: FarmingWaypoint[];
  path: [number, number][]; // [lat, lng]
}

export const FARMING_ROUTES: FarmingRoute[] = [
  {
    id: 'bomb_flower_depths',
    name: 'Bomb Flower & Muddle Bud Grove',
    category: 'bomb_flower',
    layer: 'depths',
    themeColor: '#f97316',
    badgeBg: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
    startLocation: 'Nogukoyk Lightroot (Central Depths)',
    estimatedYield: '~32x Bomb Flower, 18x Muddle Bud, 12x Puffshroom',
    description: 'Jalur panen melingkar melewati pohon-pohon raksasa di bawah Great Plateau yang paling lebat tanaman Bomb Flower dan Muddle Bud.',
    waypoints: [
      {
        id: 'bomb-wp-1',
        step: 1,
        name: 'Nogukoyk Lightroot (Titik Start)',
        lat: 1551,
        lng: -708,
        yield: 'Fast travel start & tempat aman',
        tip: 'Aktifkan Sensor+ ke Bomb Flower jika sudah terbuka.',
        icon: '🏯',
      },
      {
        id: 'bomb-wp-2',
        step: 2,
        name: 'Gloom Tree Cluster Utara',
        lat: 1420,
        lng: -760,
        yield: '6x Bomb Flower, 3x Muddle Bud',
        tip: 'Periksa akar bagian bawah yang menghadap ke selatan.',
        icon: '💣',
      },
      {
        id: 'bomb-wp-3',
        step: 3,
        name: 'Stupendous Grove Barat',
        lat: 1310,
        lng: -890,
        yield: '8x Bomb Flower, 5x Puffshroom',
        tip: 'Awas ada 2 Stalkoblin di semak, lemparkan Dazzlefruit untuk instakill.',
        icon: '💣',
      },
      {
        id: 'bomb-wp-4',
        step: 4,
        name: 'Hollow Trunk Ridge',
        lat: 1220,
        lng: -1010,
        yield: '7x Bomb Flower, 4x Muddle Bud',
        tip: 'Di dalam batang pohon berongga ada tumpukan 4 Bomb Flower sekaligus.',
        icon: '🍄',
      },
      {
        id: 'bomb-wp-5',
        step: 5,
        name: 'Deep Canyon Forest',
        lat: 1360,
        lng: -1120,
        yield: '6x Bomb Flower, 4x Puffshroom',
        tip: 'Lemparkan Brightbloom Seed di tebing agar tidak tersandung Gloom.',
        icon: '💣',
      },
      {
        id: 'bomb-wp-6',
        step: 6,
        name: 'Pohon Raksasa Selatan & Loop Selesai',
        lat: 1520,
        lng: -940,
        yield: '5x Bomb Flower, 3x Muddle Bud',
        tip: 'Kembali dekat ke Nogukoyk Lightroot untuk teleport atau save.',
        icon: '✨',
      },
    ],
    path: [
      [1551, -708],
      [1420, -760],
      [1310, -890],
      [1220, -1010],
      [1360, -1120],
      [1520, -940],
      [1551, -708], // loop back
    ],
  },
  {
    id: 'sundelion_sky',
    name: 'Sundelion Fast Harvest (Gloom Heal)',
    category: 'sundelion',
    layer: 'sky',
    themeColor: '#eab308',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    startLocation: 'Josiu Shrine (North Necluda Sky)',
    estimatedYield: '~24x Sundelion (Cukup untuk 5x Sunny Steamed Meat)',
    description: 'Rute panen cepat memetik Sundelion di reruntuhan pulau langit untuk stok bahan masakan penyembuh retak Gloom sebelum masuk Depths.',
    waypoints: [
      {
        id: 'sun-wp-1',
        step: 1,
        name: 'Josiu Shrine (Titik Start)',
        lat: 1208,
        lng: 1758,
        yield: 'Fast travel start & peluncur Zonai launcher',
        tip: 'Pakai Glide Armor set agar terbang gliding lebih hemat stamina.',
        icon: '🏯',
      },
      {
        id: 'sun-wp-2',
        step: 2,
        name: 'Platform Reruntuhan Melengkung',
        lat: 1140,
        lng: 1840,
        yield: '5x Sundelion',
        tip: 'Tumbuh di sudut batu yang menghadap matahari terbit.',
        icon: '☀️',
      },
      {
        id: 'sun-wp-3',
        step: 3,
        name: 'Kolam Air Kering & Gazebo Kuno',
        lat: 1050,
        lng: 1930,
        yield: '6x Sundelion, 2x Fairy',
        tip: 'Jongkok saat mendekati kolam untuk menangkap Fairy tanpa kabur.',
        icon: '☀️',
      },
      {
        id: 'sun-wp-4',
        step: 4,
        name: 'Pilar Batu Menjulang Timur',
        lat: 960,
        lng: 2040,
        yield: '7x Sundelion',
        tip: 'Gunakan paraglider meluncur pelan mengikuti deretan bunga.',
        icon: '☀️',
      },
      {
        id: 'sun-wp-5',
        step: 5,
        name: 'Ujung Kepulauan Necluda Sky',
        lat: 880,
        lng: 2150,
        yield: '6x Sundelion',
        tip: 'Masak 5x Sundelion bersamaan untuk memulihkan 15 Broken Gloom Hearts.',
        icon: '🍲',
      },
    ],
    path: [
      [1208, 1758],
      [1140, 1840],
      [1050, 1930],
      [960, 2040],
      [880, 2150],
    ],
  },
  {
    id: 'zonaite_depths',
    name: 'Great Abandoned Central Mine Zonaite Rush',
    category: 'zonaite',
    layer: 'depths',
    themeColor: '#00f0ff',
    badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    startLocation: 'Koradat Lightroot (Central Mine)',
    estimatedYield: '~65x Zonaite, 8x Large Zonaite, 2x Forge Refiners',
    description: 'Jalur tambang mineral Zonaite dan Large Zonaite di lorong bawah tanah sekitar Central Mine untuk bahan bakar dan penukaran Energy Well.',
    waypoints: [
      {
        id: 'zon-wp-1',
        step: 1,
        name: 'Koradat Lightroot (Titik Start)',
        lat: 2186,
        lng: -1080,
        yield: 'Fast travel start & tambang deposit',
        tip: 'Bawa senjata blunt (Batu / Hammer / Yunobo) agar hancur dalam 1 hit.',
        icon: '🏯',
      },
      {
        id: 'zon-wp-2',
        step: 2,
        name: 'Deposit Dinding Gua Barat',
        lat: 2060,
        lng: -990,
        yield: '14x Zonaite, 2x Large Zonaite',
        tip: 'Gunakan Recall pada kereta tambang jika ingin menyeberang cepat.',
        icon: '🔋',
      },
      {
        id: 'zon-wp-3',
        step: 3,
        name: 'Pabrik Pengolahan Bawah Tanah',
        lat: 1940,
        lng: -870,
        yield: '18x Zonaite, 2x Large Zonaite',
        tip: 'Ada Forge Construct untuk tukar 100 Zonaite = 1 Energy Well.',
        icon: '🔋',
      },
      {
        id: 'zon-wp-4',
        step: 4,
        name: 'Kantung Tambang Rahasia Canyon',
        lat: 1860,
        lng: -760,
        yield: '16x Zonaite, 3x Large Zonaite',
        tip: 'Hati-hati Gloom Bokoblin penambang; lempar Muddle Bud agar saling serang.',
        icon: '🔋',
      },
      {
        id: 'zon-wp-5',
        step: 5,
        name: 'Hylia Canyon Mine Overlook',
        lat: 1770,
        lng: -640,
        yield: '17x Zonaite, 1x Large Zonaite',
        tip: 'Bisa dirakit Hover Bike untuk kembali dengan cepat.',
        icon: '💎',
      },
    ],
    path: [
      [2186, -1080],
      [2060, -990],
      [1940, -870],
      [1860, -760],
      [1770, -640],
    ],
  },
  {
    id: 'endura_surface',
    name: 'Satori Mountain Bounty & Endura Carrots',
    category: 'endura',
    layer: 'surface',
    themeColor: '#10b981',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    startLocation: 'Sonapan Shrine (Satori Mountain)',
    estimatedYield: '~5x Endura Carrot, 80x Apple, 6x Hearty Truffle, 10x Herbs',
    description: 'Pohon sakura Gunung Satori dan lereng Rutile Lake, titik paling kaya bahan pangan di seluruh Hyrule untuk stamina ekstra dan masakan penyembuh penuh.',
    waypoints: [
      {
        id: 'end-wp-1',
        step: 1,
        name: 'Sonapan Shrine (Titik Start)',
        lat: 358,
        lng: -1921,
        yield: 'Fast travel start & kebun pohon apel',
        tip: 'Gunakan Autobuild (kumpulan 20 apel) untuk menyedot semua apel otomatis!',
        icon: '🏯',
      },
      {
        id: 'end-wp-2',
        step: 2,
        name: 'Pohon Sakura Sakral Satori',
        lat: 410,
        lng: -2030,
        yield: '4x Endura Carrot (Wortel Stamina Emas)',
        tip: 'Taruh buah apel di mangkuk sesajen untuk memanggil Lord of the Mountain.',
        icon: '🥕',
      },
      {
        id: 'end-wp-3',
        step: 3,
        name: 'Kebun Herbal Lereng Barat',
        lat: 480,
        lng: -2120,
        yield: '8x Hyrule Herb, 4x Silent Shroom',
        tip: 'Sangat cocok untuk racikan ramuan stealth dan defense.',
        icon: '🍃',
      },
      {
        id: 'end-wp-4',
        step: 4,
        name: 'Rutile Lake Shore',
        lat: 560,
        lng: -2210,
        yield: '1x Endura Carrot, 6x Hearty Truffle, 4x Beetles',
        tip: 'Periksa akar pohon mati di tepi danau untuk menemukan Big Hearty Truffle.',
        icon: '🍄',
      },
    ],
    path: [
      [358, -1921],
      [410, -2030],
      [480, -2120],
      [560, -2210],
    ],
  },
];
