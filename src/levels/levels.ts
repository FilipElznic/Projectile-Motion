import type { TargetType } from "../classes/Target";
import type { BirdType } from "../types/BirdTypes";

export interface TargetDef {
  x: number; // Multiplier of blockSize relative to baseX
  y: number; // Multiplier of blockSize above floor (1 = on floor, 2 = on top of 1)
  w: number; // Multiplier of blockSize
  h: number; // Multiplier of blockSize
  type: TargetType;
}

export interface LevelConfig {
  birds: number;
  birdTypes?: BirdType[]; // Optional: specific bird types for this level
  targets: TargetDef[];
}

export const levels: LevelConfig[] = [
  // Level 1: Simple Tower
  {
    birds: 4,
    birdTypes: ["red", "blue", "yellow", "red"],
    targets: [
      // Base foundation - wide stone base
      { x: -3, y: 1, w: 2, h: 1, type: "stone" },
      { x: -1, y: 1, w: 2, h: 1, type: "stone" },
      { x: 1, y: 1, w: 2, h: 1, type: "stone" },

      // Second layer - wood platforms
      { x: -2.5, y: 2, w: 1.5, h: 1, type: "wood" },
      { x: -0.5, y: 2, w: 1, h: 1, type: "wood" },
      { x: 0.5, y: 2, w: 1, h: 1, type: "wood" },
      { x: 1.5, y: 2, w: 1.5, h: 1, type: "wood" },

      // Vertical pillars
      { x: -2, y: 3, w: 1, h: 2, type: "wood" },
      { x: 0, y: 3, w: 1, h: 1, type: "pig" },
      { x: 2, y: 3, w: 1, h: 2, type: "wood" },

      // Top layer
      { x: -2, y: 5, w: 2, h: 1, type: "ice" },
      { x: 0, y: 5, w: 2, h: 1, type: "ice" },

      // Crown
      { x: -0.5, y: 6, w: 1, h: 1, type: "pig" },
    ],
  },
  // Level 2: Castle Fortress
  {
    birds: 5,
    birdTypes: ["yellow", "red", "blue", "yellow", "red"],
    targets: [
      // Left tower base
      { x: -5, y: 1, w: 1, h: 3, type: "stone" },
      { x: -4, y: 1, w: 1, h: 3, type: "stone" },

      // Right tower base
      { x: 3, y: 1, w: 1, h: 3, type: "stone" },
      { x: 4, y: 1, w: 1, h: 3, type: "stone" },

      // Left tower top
      { x: -5, y: 4, w: 2, h: 1, type: "wood" },
      { x: -5, y: 5, w: 1, h: 1, type: "pig" },
      { x: -4, y: 5, w: 1, h: 1, type: "wood" },

      // Right tower top
      { x: 3, y: 4, w: 2, h: 1, type: "wood" },
      { x: 3, y: 5, w: 1, h: 1, type: "wood" },
      { x: 4, y: 5, w: 1, h: 1, type: "pig" },

      // Central structure - multi-level
      { x: -2, y: 1, w: 1, h: 2, type: "wood" },
      { x: -1, y: 1, w: 2, h: 1, type: "ice" },
      { x: 1, y: 1, w: 1, h: 2, type: "wood" },

      { x: -2, y: 3, w: 1.5, h: 1, type: "wood" },
      { x: -0.5, y: 3, w: 1, h: 1, type: "pig" },
      { x: 0.5, y: 3, w: 1.5, h: 1, type: "wood" },

      { x: -1.5, y: 4, w: 3, h: 1, type: "ice" },
      { x: -0.5, y: 5, w: 1, h: 1, type: "pig" },

      // Bridge between towers
      { x: -3, y: 4, w: 2, h: 0.5, type: "ice" },
      { x: 1, y: 4, w: 2, h: 0.5, type: "ice" },
    ],
  },
  // Level 3: Complex Pyramid Structure
  {
    birds: 5,
    birdTypes: ["red", "yellow", "blue", "red", "yellow"],
    targets: [
      // Bottom layer - 7 blocks wide
      { x: -3, y: 1, w: 1, h: 1, type: "stone" },
      { x: -2, y: 1, w: 1, h: 1, type: "wood" },
      { x: -1, y: 1, w: 1, h: 1, type: "stone" },
      { x: 0, y: 1, w: 1, h: 1, type: "ice" },
      { x: 1, y: 1, w: 1, h: 1, type: "stone" },
      { x: 2, y: 1, w: 1, h: 1, type: "wood" },
      { x: 3, y: 1, w: 1, h: 1, type: "stone" },

      // Second layer - 5 blocks
      { x: -2, y: 2, w: 1, h: 1, type: "ice" },
      { x: -1, y: 2, w: 1, h: 1, type: "pig" },
      { x: 0, y: 2, w: 1, h: 1, type: "wood" },
      { x: 1, y: 2, w: 1, h: 1, type: "pig" },
      { x: 2, y: 2, w: 1, h: 1, type: "ice" },

      // Third layer - 3 blocks
      { x: -1, y: 3, w: 1, h: 1, type: "wood" },
      { x: 0, y: 3, w: 1, h: 1, type: "stone" },
      { x: 1, y: 3, w: 1, h: 1, type: "wood" },

      // Fourth layer - 2 blocks
      { x: -0.5, y: 4, w: 1, h: 1, type: "ice" },
      { x: 0.5, y: 4, w: 1, h: 1, type: "ice" },

      // Top - single pig
      { x: 0, y: 5, w: 1, h: 1, type: "pig" },
    ],
  },
  // Level 4: The Great Wall
  {
    birds: 4,
    birdTypes: ["blue", "yellow", "red", "blue"],
    targets: [
      // Wall Base
      { x: -4, y: 1, w: 1, h: 2, type: "stone" },
      { x: -2, y: 1, w: 1, h: 2, type: "stone" },
      { x: 0, y: 1, w: 1, h: 2, type: "stone" },
      { x: 2, y: 1, w: 1, h: 2, type: "stone" },
      { x: 4, y: 1, w: 1, h: 2, type: "stone" },

      // Wall Fillers
      { x: -3, y: 1, w: 1, h: 1, type: "wood" },
      { x: -1, y: 1, w: 1, h: 1, type: "ice" },
      { x: 1, y: 1, w: 1, h: 1, type: "wood" },
      { x: 3, y: 1, w: 1, h: 1, type: "ice" },

      // Second Layer
      { x: -3, y: 2, w: 1, h: 1, type: "pig" },
      { x: -1, y: 2, w: 1, h: 1, type: "pig" },
      { x: 1, y: 2, w: 1, h: 1, type: "pig" },
      { x: 3, y: 2, w: 1, h: 1, type: "pig" },

      // Roof
      { x: -3, y: 3, w: 2, h: 0.5, type: "wood" },
      { x: -1, y: 3, w: 2, h: 0.5, type: "wood" },
      { x: 1, y: 3, w: 2, h: 0.5, type: "wood" },
      { x: 3, y: 3, w: 2, h: 0.5, type: "wood" },
    ],
  },
  // Level 5: The Bunker
  {
    birds: 4,
    birdTypes: ["yellow", "red", "red", "blue"],
    targets: [
      // Left Wall
      { x: -3, y: 1, w: 1, h: 3, type: "stone" },
      // Right Wall
      { x: 3, y: 1, w: 1, h: 3, type: "stone" },

      // Roof
      { x: 0, y: 4, w: 8, h: 1, type: "stone" },

      // Interior Protection
      { x: -1.5, y: 1, w: 1, h: 2, type: "wood" },
      { x: 1.5, y: 1, w: 1, h: 2, type: "wood" },

      // The Prize
      { x: 0, y: 1, w: 1, h: 1, type: "pig" },
      { x: 0, y: 2, w: 2, h: 0.5, type: "ice" },
      { x: 0, y: 3, w: 1, h: 1, type: "pig" },

      // Roof Defenders
      { x: -2, y: 5, w: 1, h: 1, type: "pig" },
      { x: 2, y: 5, w: 1, h: 1, type: "pig" },
    ],
  },
  // Level 6: Twin Towers
  {
    birds: 5,
    birdTypes: ["red", "blue", "yellow", "red", "blue"],
    targets: [
      // Left Tower
      { x: -4, y: 1, w: 1.5, h: 4, type: "stone" },
      { x: -4, y: 5, w: 2, h: 1, type: "wood" },
      { x: -4, y: 6, w: 1, h: 1, type: "pig" },

      // Right Tower
      { x: 4, y: 1, w: 1.5, h: 4, type: "stone" },
      { x: 4, y: 5, w: 2, h: 1, type: "wood" },
      { x: 4, y: 6, w: 1, h: 1, type: "pig" },

      // The Bridge
      { x: 0, y: 3, w: 6, h: 0.5, type: "wood" },

      // Bridge Dwellers
      { x: -1, y: 3.5, w: 1, h: 1, type: "ice" },
      { x: 0, y: 3.5, w: 1, h: 1, type: "pig" },
      { x: 1, y: 3.5, w: 1, h: 1, type: "ice" },

      // Under Bridge
      { x: 0, y: 1, w: 1, h: 1, type: "pig" },
    ],
  },
  // Level 7: The Pyramid
  {
    birds: 6,
    birdTypes: ["yellow", "red", "blue", "yellow", "red", "blue"],
    targets: [
      // Base (9 wide)
      { x: -4, y: 1, w: 1, h: 1, type: "stone" },
      { x: -3, y: 1, w: 1, h: 1, type: "wood" },
      { x: -2, y: 1, w: 1, h: 1, type: "stone" },
      { x: -1, y: 1, w: 1, h: 1, type: "wood" },
      { x: 0, y: 1, w: 1, h: 1, type: "stone" },
      { x: 1, y: 1, w: 1, h: 1, type: "wood" },
      { x: 2, y: 1, w: 1, h: 1, type: "stone" },
      { x: 3, y: 1, w: 1, h: 1, type: "wood" },
      { x: 4, y: 1, w: 1, h: 1, type: "stone" },

      // Layer 2 (7 wide)
      { x: -3, y: 2, w: 1, h: 1, type: "ice" },
      { x: -2, y: 2, w: 1, h: 1, type: "pig" },
      { x: -1, y: 2, w: 1, h: 1, type: "ice" },
      { x: 0, y: 2, w: 1, h: 1, type: "wood" },
      { x: 1, y: 2, w: 1, h: 1, type: "ice" },
      { x: 2, y: 2, w: 1, h: 1, type: "pig" },
      { x: 3, y: 2, w: 1, h: 1, type: "ice" },

      // Layer 3 (5 wide)
      { x: -2, y: 3, w: 1, h: 1, type: "stone" },
      { x: -1, y: 3, w: 1, h: 1, type: "wood" },
      { x: 0, y: 3, w: 1, h: 1, type: "pig" },
      { x: 1, y: 3, w: 1, h: 1, type: "wood" },
      { x: 2, y: 3, w: 1, h: 1, type: "stone" },

      // Layer 4 (3 wide)
      { x: -1, y: 4, w: 1, h: 1, type: "ice" },
      { x: 0, y: 4, w: 1, h: 1, type: "stone" },
      { x: 1, y: 4, w: 1, h: 1, type: "ice" },

      // Top
      { x: 0, y: 5, w: 1, h: 1, type: "pig" },
    ],
  },
];
