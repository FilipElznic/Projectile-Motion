export type BirdType = "red" | "blue" | "yellow";

export interface BirdConfig {
  type: BirdType;
  radius: number;
  mass: number;
  color: string;
  launchPowerMultiplier: number; // Affects trajectory
  description: string;
}

export const BIRD_CONFIGS: Record<BirdType, BirdConfig> = {
  red: {
    type: "red",
    radius: 20,
    mass: 5,
    color: "#D62412",
    launchPowerMultiplier: 1.0,
    description: "Standard bird - balanced power",
  },
  blue: {
    type: "blue",
    radius: 15,
    mass: 3,
    color: "#2196F3",
    launchPowerMultiplier: 1.3,
    description: "Small bird - faster, longer trajectory",
  },
  yellow: {
    type: "yellow",
    radius: 25,
    mass: 8,
    color: "#FFD700",
    launchPowerMultiplier: 0.85,
    description: "Large bird - slower, more impact",
  },
};
