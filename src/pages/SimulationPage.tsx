import { useState, useCallback } from "react";
import { AngryBirdsGame } from "../components/AngryBirdsGame";
import { SimulationStats } from "../components/stats/SimulationStats";
import { BirdSpecsPanel } from "../components/BirdSpecsPanel";
import { FlightHistoryGraph } from "../components/stats/FlightHistoryGraph";
import type { FlightDataPoint, FlightHistoryEntry } from "../types/FlightData";
import { Trash2 } from "lucide-react";

export const SimulationPage = () => {
  const [flightData, setFlightData] = useState<FlightDataPoint[]>([]);
  const [birdMass, setBirdMass] = useState(1);
  const [flightHistory, setFlightHistory] = useState<FlightHistoryEntry[]>([]);

  const handleFlightComplete = useCallback(
    (
      data: FlightDataPoint[],
      mass: number,
      color: string,
      launchForce: number
    ) => {
      setFlightData(data);
      setBirdMass(mass);

      const newEntry: FlightHistoryEntry = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        data,
        config: {
          mass,
          color,
          label: `Flight ${flightHistory.length + 1} (${launchForce.toFixed(
            0
          )}N)`,
          launchForce,
        },
      };

      setFlightHistory((prev) => [...prev, newEntry]);
    },
    [flightHistory.length]
  );

  const clearHistory = () => setFlightHistory([]);

  return (
    <div className="p-4 flex flex-col">
      <div className="flex-none flex items-start justify-center w-full mb-12">
        <div className="w-full max-w-[95rem] flex flex-col lg:flex-row gap-6 items-stretch h-[85vh] min-h-[600px]">
          <main className="flex-1 bg-[#46C6F6] rounded-[2rem] border-8 border-white/20 shadow-2xl overflow-hidden relative ring-1 ring-white/10">
            {/* Sky Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/20 pointer-events-none"></div>

            {/* Clouds */}
            <div className="absolute top-10 left-10 w-32 h-12 bg-white/40 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute top-20 right-20 w-48 h-16 bg-white/30 rounded-full blur-xl animate-pulse delay-700"></div>

            <AngryBirdsGame onFlightComplete={handleFlightComplete} />
          </main>

          <aside className="w-full lg:w-80 flex-none bg-slate-900/50 rounded-[2rem] border border-white/10 overflow-hidden shadow-xl">
            <BirdSpecsPanel />
          </aside>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="w-full bg-slate-900/50 backdrop-blur-sm p-8 space-y-12">
        <SimulationStats flightData={flightData} birdMass={birdMass} />

        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-black text-white flex items-center gap-3">
              <span className="text-[#46C6F6]">📈</span> Flight History
            </h2>
            {flightHistory.length > 0 && (
              <button
                onClick={clearHistory}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-200 rounded-lg transition-colors border border-red-500/30"
              >
                <Trash2 className="w-4 h-4" /> Clear History
              </button>
            )}
          </div>
          <FlightHistoryGraph history={flightHistory} />
        </div>
      </div>
    </div>
  );
};
