import { useState, useCallback } from "react";
import { AngryBirdsGame } from "../components/AngryBirdsGame";
import { SimulationStats } from "../components/stats/SimulationStats";
import { BirdSpecsPanel } from "../components/BirdSpecsPanel";
import type { FlightDataPoint } from "../types/FlightData";

export const SimulationPage = () => {
  const [flightData, setFlightData] = useState<FlightDataPoint[]>([]);
  const [birdMass, setBirdMass] = useState(1);

  const handleFlightComplete = useCallback(
    (data: FlightDataPoint[], mass: number) => {
      setFlightData(data);
      setBirdMass(mass);
    },
    []
  );

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
      <div className="w-full bg-slate-900/50 backdrop-blur-sm">
        <SimulationStats flightData={flightData} birdMass={birdMass} />
      </div>
    </div>
  );
};
