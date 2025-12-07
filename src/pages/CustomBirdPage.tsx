import { useState, useCallback } from "react";
import { AngryBirdsGame } from "../components/AngryBirdsGame";
import { SimulationStats } from "../components/stats/SimulationStats";
import type { FlightDataPoint } from "../types/FlightData";
import type { BirdConfig } from "../types/BirdTypes";
import { Link } from "react-router-dom";
import { ArrowLeft, Play, Settings } from "lucide-react";

export const CustomBirdPage = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [flightData, setFlightData] = useState<FlightDataPoint[]>([]);
  const [birdMass, setBirdMass] = useState(1);

  // Custom Bird Config State
  const [config, setConfig] = useState<BirdConfig>({
    type: "red", // Placeholder
    radius: 20,
    mass: 5,
    color: "#D62412",
    launchPowerMultiplier: 1.0,
    description: "Custom Bird",
  });

  const handleFlightComplete = useCallback(
    (data: FlightDataPoint[], mass: number) => {
      setFlightData(data);
      setBirdMass(mass);
    },
    []
  );

  if (isPlaying) {
    return (
      <div className="min-h-screen bg-slate-900 p-4 flex flex-col">
        <header className="flex-none mb-4 flex items-center justify-between max-w-7xl mx-auto w-full z-10">
          <button
            onClick={() => setIsPlaying(false)}
            className="flex items-center gap-2 text-white/80 hover:text-white font-bold transition-colors bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm"
          >
            <Settings className="w-5 h-5" /> Edit Bird
          </button>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-wider drop-shadow-lg">
            CUSTOM LEVEL
          </h1>
          <div className="w-[100px] hidden md:block"></div>
        </header>

        <div className="flex-none flex items-center justify-center w-full mb-12">
          <main className="w-full max-w-7xl aspect-video max-h-[80vh] bg-[#46C6F6] rounded-[2rem] md:rounded-[3rem] border-8 border-white/20 shadow-2xl overflow-hidden relative ring-1 ring-white/10">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/20 pointer-events-none"></div>
            <AngryBirdsGame
              onFlightComplete={handleFlightComplete}
              customBirdConfig={config}
            />
          </main>
        </div>

        <div className="w-full bg-slate-900/50 backdrop-blur-sm">
          <SimulationStats flightData={flightData} birdMass={birdMass} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white font-bold mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Home
        </Link>

        <div className="bg-slate-800 rounded-[2rem] p-8 md:p-12 border border-white/10 shadow-2xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black text-white mb-4">
              Create Your Bird
            </h1>
            <p className="text-slate-400">
              Design the ultimate projectile. Adjust mass, size, and power to
              conquer the sandbox level.
            </p>
          </div>

          <div className="space-y-8 mb-12">
            {/* Preview */}
            <div className="flex justify-center mb-8">
              <div
                className="rounded-full shadow-2xl border-4 border-white/20 transition-all duration-300"
                style={{
                  width: config.radius * 4, // Scale up for preview
                  height: config.radius * 4,
                  backgroundColor: config.color,
                }}
              ></div>
            </div>

            {/* Controls */}
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-white font-bold mb-2">
                  <span>Mass (kg)</span>
                  <span>{config.mass}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="0.5"
                  value={config.mass}
                  onChange={(e) =>
                    setConfig({ ...config, mass: parseFloat(e.target.value) })
                  }
                  className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-white font-bold mb-2">
                  <span>Size (Radius px)</span>
                  <span>{config.radius}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  step="1"
                  value={config.radius}
                  onChange={(e) =>
                    setConfig({ ...config, radius: parseFloat(e.target.value) })
                  }
                  className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-white font-bold mb-2">
                  <span>Launch Power</span>
                  <span>{Math.round(config.launchPowerMultiplier * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={config.launchPowerMultiplier}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      launchPowerMultiplier: parseFloat(e.target.value),
                    })
                  }
                  className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
              </div>

              <div>
                <div className="text-white font-bold mb-4">Color</div>
                <div className="flex gap-4 justify-center flex-wrap">
                  {[
                    "#D62412", // Red
                    "#2196F3", // Blue
                    "#FFD700", // Yellow
                    "#4CAF50", // Green
                    "#9C27B0", // Purple
                    "#FF5722", // Orange
                    "#607D8B", // Grey
                    "#E91E63", // Pink
                  ].map((c) => (
                    <button
                      key={c}
                      onClick={() => setConfig({ ...config, color: c })}
                      className={`w-10 h-10 rounded-full border-2 transition-transform hover:scale-110 ${
                        config.color === c
                          ? "border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => setIsPlaying(true)}
              className="group relative inline-flex items-center justify-center px-8 py-4 font-black text-white transition-all duration-200 bg-[#4ECDC4] rounded-2xl hover:bg-[#3dbdb5] hover:-translate-y-1 active:translate-y-0 shadow-[0_8px_0_#2a8f88] active:shadow-none"
            >
              <Play className="w-6 h-6 mr-2 fill-current" />
              START CUSTOM GAME
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
