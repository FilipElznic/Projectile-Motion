import React, { useMemo } from "react";
import type { FlightHistoryEntry } from "../../types/FlightData";
import { MultiLineChart } from "./MultiLineChart";

interface FlightHistoryGraphProps {
  history: FlightHistoryEntry[];
}

export const FlightHistoryGraph: React.FC<FlightHistoryGraphProps> = ({
  history,
}) => {
  const datasets = useMemo(() => {
    return history.map((entry) => {
      // Downsample data for performance if needed, or just take it all
      // Let's take every 2nd point to keep it lighter if it's long
      const data = entry.data
        .filter((_, i) => i % 2 === 0)
        .map((p) => ({
          x: p.x,
          y: -p.y, // Invert Y because canvas Y is down, but graph Y should be up
        }));

      return {
        label: entry.config.label,
        color: entry.config.color,
        data,
      };
    });
  }, [history]);

  if (history.length === 0) {
    return (
      <div className="text-center text-white/50 p-8 border border-white/10 rounded-xl bg-white/5">
        No flight history yet. Launch some birds!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <MultiLineChart
        datasets={datasets}
        title="Trajectory Comparison (Height vs Distance)"
        xLabel="Distance (px)"
        yLabel="Height (px)"
      />
    </div>
  );
};
