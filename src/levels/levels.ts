import type { TargetType } from "../classes/Target";

export interface TargetDef {
  x: number; // Multiplier of blockSize relative to baseX
  y: number; // Multiplier of blockSize above floor (1 = on floor, 2 = on top of 1)
  w: number; // Multiplier of blockSize
  h: number; // Multiplier of blockSize
  type: TargetType;
}

export interface LevelConfig {
  birds: number;
  targets: TargetDef[];
}

export const levels: LevelConfig[] = [
  // Level 1 (Existing)
  {
    birds: 4,
    targets: [
      // Base stones
      { x: -1, y: 1, w: 1, h: 1, type: "stone" },
      { x: 1, y: 1, w: 1, h: 1, type: "stone" },
      // Wood plank across
      { x: -1, y: 5, w: 3, h: 1, type: "stone" }, // x is left edge? No, in code it was baseX - blockSize.
      // Let's stick to the code's logic.
      // Code: createTarget(baseX - blockSize, floorY - blockSize, ...)
      // My x will be relative to baseX in blocks.
      // If x=-1, pos = baseX - 1*blockSize.

      // Pig on top
      // { x: 0, y: 0, w: 1, h: 1, type: "pig" },

      // Side structures
      { x: -2.5, y: 2, w: 1, h: 1, type: "wood" },
      { x: -10.5, y: 2, w: 1, h: 1, type: "pig" },

      { x: 2.5, y: 2, w: 1, h: 1, type: "wood" },
      { x: 2.5, y: 2, w: 1, h: 1, type: "wood" },
    ],
  },
  // Level 2: Pyramid
  {
    birds: 4,
    targets: [
      // Row 1
      { x: -2, y: 1, w: 1, h: 1, type: "stone" },
      { x: -1, y: 1, w: 1, h: 1, type: "wood" },
      { x: 0, y: 1, w: 1, h: 1, type: "stone" },
      { x: 1, y: 1, w: 1, h: 1, type: "wood" },
      { x: 2, y: 1, w: 1, h: 1, type: "stone" },

      // Row 2
      { x: -1.5, y: 2, w: 1, h: 1, type: "ice" },
      { x: -0.5, y: 2, w: 1, h: 1, type: "pig" },
      { x: 0.5, y: 2, w: 1, h: 1, type: "pig" },
      { x: 1.5, y: 2, w: 1, h: 1, type: "ice" },

      // Row 3
      { x: -1, y: 3, w: 1, h: 1, type: "wood" },
      { x: 0, y: 3, w: 1, h: 1, type: "stone" },
      { x: 1, y: 3, w: 1, h: 1, type: "wood" },

      // Top
      { x: 0, y: 4, w: 1, h: 1, type: "pig" },
    ],
  },
  // Level 3: Fort
  {
    birds: 4,
    targets: [
      // Left Pillar
      { x: -3, y: 1, w: 1, h: 1, type: "stone" },
      { x: -3, y: 2, w: 1, h: 1, type: "stone" },
      { x: -3, y: 3, w: 1, h: 1, type: "stone" },

      // Right Pillar
      { x: 3, y: 1, w: 1, h: 1, type: "stone" },
      { x: 3, y: 2, w: 1, h: 1, type: "stone" },
      { x: 3, y: 3, w: 1, h: 1, type: "stone" },

      // Middle
      { x: -1, y: 1, w: 1, h: 1, type: "wood" },
      { x: 1, y: 1, w: 1, h: 1, type: "wood" },
      { x: 0, y: 2, w: 3, h: 1, type: "ice" }, // Bridge

      // Pigs
      { x: -3, y: 4, w: 1, h: 1, type: "pig" },
      { x: 3, y: 4, w: 1, h: 1, type: "pig" },
      { x: 0, y: 1, w: 1, h: 1, type: "pig" },
      { x: 0, y: 3, w: 1, h: 1, type: "pig" },
    ],
  },
];
