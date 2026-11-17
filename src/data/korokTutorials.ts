export interface KorokTutorial {
  title: string;
  icon: string;
  shortDesc: string;
  instruction: string;
  reward: string;
}

export const KOROK_TUTORIALS: Record<string, KorokTutorial> = {
  "Korok Friends": {
    title: "Backpack Korok (Need to Reach Friend)",
    icon: "🎒",
    shortDesc: "Tired Korok with a giant backpack separated from his friend.",
    instruction: "Build a vehicle (cart, boat, or flying machine) with Ultrahand or carry him on horseback to reunite with his friend at the smoke campfire. Yields 2 Korok Seeds!",
    reward: "2 Korok Seeds"
  },
  "Puzzle Blocks": {
    title: "Block / Cube Puzzle",
    icon: "🧱",
    shortDesc: "Geometric stone structure with a missing piece.",
    instruction: "Find the detached rusted metal block nearby. Use Ultrahand to rotate and fit it into the stone structure until it forms a perfectly symmetrical matching shape.",
    reward: "1 Korok Seed"
  },
  "Offering Plate": {
    title: "Statue Offering Plate",
    icon: "🍎",
    shortDesc: "Statues with stone bowls or plates in front of them.",
    instruction: "Check what food/item is already placed in the other statues (typically Apples, Bananas, or Spicy Peppers). Drop the same matching item into the empty plate.",
    reward: "1 Korok Seed"
  },
  "Pull the Plug": {
    title: "Plug / Cork Puzzle",
    icon: "🪵",
    shortDesc: "Wooden plug wedged into a hollow tree stump or hollow stone.",
    instruction: "Attach a heavy rock, Zonai rocket, or heavy vehicle to the dangling plug with Ultrahand, then drop/launch it to pull the plug out with force.",
    reward: "1 Korok Seed"
  },
  "Flower Trail": {
    title: "Chasing Flower Trail",
    icon: "🌸",
    shortDesc: "Yellow flower that vanishes when touched.",
    instruction: "Approach and touch the yellow flower. It will disappear and reappear nearby. Follow and touch each consecutive flower until it turns white to reveal the Korok.",
    reward: "1 Korok Seed"
  },
  "Through the Roof": {
    title: "Ceiling Stump (Ascend Puzzle)",
    icon: "⬆️",
    shortDesc: "Tree stump with green leaf patterns embedded in a ceiling.",
    instruction: "Stand directly underneath the leaf pattern underneath bridges, cliffs, or archways, and use your Ascend ability to swim up through the stump.",
    reward: "1 Korok Seed"
  },
  "Repair Roof": {
    title: "Shelter / Roof Repair",
    icon: "🛖",
    shortDesc: "Small wooden hut or shrine missing a portion of its roof.",
    instruction: "Locate nearby wooden planks or bark slabs with Ultrahand. Place and attach the wood over the open hole in the roof to keep the interior dry.",
    reward: "1 Korok Seed"
  },
  "Goal Ring (Race)": {
    title: "Timed Race (Stump & Ring)",
    icon: "⏱️",
    shortDesc: "Tree stump with a leaf icon that triggers a glowing circle.",
    instruction: "Step on the tree stump to trigger a golden ring in the distance with a ticking sound. Reach the ring before the countdown expires (use shield surf, glide, or vehicles).",
    reward: "1 Korok Seed"
  },
  "Land on Target": {
    title: "Target Landing Pad",
    icon: "🎯",
    shortDesc: "Circular target printed with leaves down below a high cliff.",
    instruction: "Dive or paraglide down from the high perch and land directly in the center of the target ring without touching surrounding ground first.",
    reward: "1 Korok Seed"
  },
  "Pinwheel Balloons": {
    title: "Pinwheel & Flying Targets",
    icon: "🎈",
    shortDesc: "Small pinwheel spinning in the wind.",
    instruction: "Stand right next to the pinwheel. Look around the sky or trees for floating balloons or wooden acorns moving in patterns. Shoot them with your bow.",
    reward: "1 Korok Seed"
  },
  "Hanging Acorn": {
    title: "Hanging Acorn / Pot",
    icon: "🏺",
    shortDesc: "Small clay jar or acorn hanging from a chain under a bridge or hollow tree.",
    instruction: "Aim with your bow and shoot the hanging pot or acorn to shatter it.",
    reward: "1 Korok Seed"
  },
  "Rock Pattern": {
    title: "Rock Circle / Pattern",
    icon: "⭕",
    shortDesc: "A circle or triangle of stones with one or more gaps.",
    instruction: "Find a solitary rock nearby. Pick it up and place it into the empty gap to complete the geometric pattern.",
    reward: "1 Korok Seed"
  },
  "Rock Lift": {
    title: "Lone Rock",
    icon: "🪨",
    shortDesc: "A suspicious lone stone perched at the top of a peak, pillar, or tree.",
    instruction: "Walk up and lift the rock. A Korok will pop out underneath!",
    reward: "1 Korok Seed"
  },
  "Dive": {
    title: "Lilypad Dive Circle",
    icon: "🤿",
    shortDesc: "Ring of lilypads floating in water below a cliff or bridge.",
    instruction: "Dive headfirst (press jump/dive) from the ledge above directly into the center of the lilypad circle.",
    reward: "1 Korok Seed"
  },
  "Catch the Light": {
    title: "Fairy Sparkle / Moving Light",
    icon: "✨",
    shortDesc: "Sparkling dust or leaf particles running around a meadow or tree branch.",
    instruction: "Run after the moving sparkles and press the Examine / Catch prompt when you get close.",
    reward: "1 Korok Seed"
  },
  "Boulder Stand": {
    title: "Boulder 3-Prong Stand",
    icon: "⛳",
    shortDesc: "Three wooden posts or branches arranged like a golf tee.",
    instruction: "Use Ultrahand to lift a large nearby boulder and balance it securely on top of the 3 wooden posts.",
    reward: "1 Korok Seed"
  },
  "Ring the Bell": {
    title: "Dangling Bell / Target",
    icon: "🔔",
    shortDesc: "Bell suspended under ruins or structures.",
    instruction: "Use Ultrahand to swing a weight into the bell or strike it with an arrow to make it chime.",
    reward: "1 Korok Seed"
  }
};
