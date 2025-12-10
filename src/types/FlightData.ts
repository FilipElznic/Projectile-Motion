export interface FlightDataPoint {
  time: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  isColliding: boolean;
}

export interface FlightHistoryEntry {
  id: string;
  timestamp: number;
  data: FlightDataPoint[];
  config: {
    mass: number;
    color: string;
    label: string;
    launchForce: number;
  };
}
