export interface Tower {
  id: string;
  name: string;
  region: string;
  position: { x: number; y: number; z: number };
  description: string;
}

export const SKYVIEW_TOWERS: Tower[] = [
  {
    id: "tower-lookout-landing",
    name: "Lookout Landing Skyview Tower",
    region: "Central Hyrule",
    position: { x: -293, y: 124, z: -137 },
    description: "The main headquarters tower built by Purah in Lookout Landing. First tower unlocked."
  },
  {
    id: "tower-hyrule-field",
    name: "Hyrule Field Skyview Tower",
    region: "Hyrule Field",
    position: { x: -761, y: 58, z: 1019 },
    description: "Surrounded by a Bokoblin fortified camp with barricades and a spiked gate."
  },
  {
    id: "tower-lindors-brow",
    name: "Lindor's Brow Skyview Tower",
    region: "Hyrule Ridge",
    position: { x: -1909, y: 290, z: -1245 },
    description: "Located on a high rock surrounded by deep water. Use Ultrahand to bridge wood or create a raft."
  },
  {
    id: "tower-rospro-pass",
    name: "Rospro Pass Skyview Tower",
    region: "Hebra / Rito",
    position: { x: -3679, y: 226, z: -2346 },
    description: "Covered in thorny vines on the cliffs of Rospro Pass. Burn the thorns with fire to enter."
  },
  {
    id: "tower-pikida-stonegrove",
    name: "Pikida Stonegrove Skyview Tower",
    region: "Hebra Mountains",
    position: { x: -2311, y: 436, z: -3062 },
    description: "Perched atop a towering icy pillar in the freezing Hebra Mountains. Cold resistance required."
  },
  {
    id: "tower-thyphlo-ruins",
    name: "Thyphlo Ruins Skyview Tower",
    region: "Great Hyrule Forest",
    position: { x: 343, y: 173, z: -3141 },
    description: "The top vent is blocked by floating Zonai ruins. Move the floating platforms with rockets/fans to clear."
  },
  {
    id: "tower-eldin-canyon",
    name: "Eldin Canyon Skyview Tower",
    region: "Eldin / Death Mountain",
    position: { x: 1641, y: 219, z: -1191 },
    description: "The door is jammed shut. Climb up and drop in through the open rooftop, or recall a falling rock."
  },
  {
    id: "tower-ulri-mountain",
    name: "Ulri Mountain Skyview Tower",
    region: "Akkala",
    position: { x: 3499, y: 181, z: -2026 },
    description: "An Aerocuda monster has stolen the terminal console. Shoot it down with an arrow to restore power."
  },
  {
    id: "tower-upland-zorana",
    name: "Upland Zorana Skyview Tower",
    region: "Lanayru / Zora's Domain",
    position: { x: 2866, y: 373, z: -581 },
    description: "The door is sealed shut by thick sludge. Throw Splash Fruit or use a Hydrant to wash it away."
  },
  {
    id: "tower-mount-lanayru",
    name: "Mount Lanayru Skyview Tower",
    region: "Lanayru Mountains",
    position: { x: 3846, y: 539, z: 1314 },
    description: "Located at the peak of snowy Mount Lanayru. Level 2 cold protection or warm food needed."
  },
  {
    id: "tower-sahasra-slope",
    name: "Sahasra Slope Skyview Tower",
    region: "West Necluda",
    position: { x: 1341, y: 160, z: 1178 },
    description: "Door is stuck. Enter the Sahasra Slope Cave below and use Ascend right beneath the tower terminal."
  },
  {
    id: "tower-rabella-wetlands",
    name: "Rabella Wetlands Skyview Tower",
    region: "East Necluda",
    position: { x: 2420, y: 215, z: 2755 },
    description: "Surrounded by thorns in constant rain. Build a roof over the thorns with wooden boards, then burn them."
  },
  {
    id: "tower-popla-foothills",
    name: "Popla Foothills Skyview Tower",
    region: "Faron",
    position: { x: 605, y: 92, z: 2127 },
    description: "Terminal is unresponsive. Rescue the mechanic Elmerson trapped in the Popla Foothills Excavation Site cave below."
  },
  {
    id: "tower-gerudo-canyon",
    name: "Gerudo Canyon Skyview Tower",
    region: "Gerudo Canyon",
    position: { x: -2439, y: 300, z: 2183 },
    description: "The elevator platform is broken. Attach heavy metal boxes to the counterweight cable to pull the mechanic up."
  },
  {
    id: "tower-gerudo-highlands",
    name: "Gerudo Highlands Skyview Tower",
    region: "Gerudo Highlands",
    position: { x: -3961, y: 416, z: 1306 },
    description: "Buried completely in deep snow. Enter the Meadela's Mantle Cave nearby and use Ascend upward into the tower."
  }
];
