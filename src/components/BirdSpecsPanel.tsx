import { BIRD_CONFIGS, type BirdConfig } from "../types/BirdTypes";
import { Info, Weight, Move, Maximize } from "lucide-react";

const BirdCard = ({ config }: { config: BirdConfig }) => {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors">
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-8 h-8 rounded-full shadow-lg border-2 border-white/20"
          style={{ backgroundColor: config.color }}
        ></div>
        <h3 className="font-black text-white uppercase tracking-wider">
          {config.type} Bird
        </h3>
      </div>

      <p className="text-slate-400 text-xs font-bold mb-4 leading-relaxed">
        {config.description}
      </p>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-slate-400">
            <Weight className="w-4 h-4" />
            <span>Mass</span>
          </div>
          <span className="font-mono font-bold text-white">
            {config.mass}kg
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-slate-400">
            <Maximize className="w-4 h-4" />
            <span>Size</span>
          </div>
          <span className="font-mono font-bold text-white">
            {config.radius}px
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-slate-400">
            <Move className="w-4 h-4" />
            <span>Speed</span>
          </div>
          <span className="font-mono font-bold text-white">
            {Math.round(config.launchPowerMultiplier * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export const BirdSpecsPanel = () => {
  return (
    <div className="h-full bg-slate-900/80 backdrop-blur-md border-l border-white/10 p-6 overflow-y-auto custom-scrollbar">
      <div className="flex items-center gap-2 mb-6 text-white">
        <Info className="w-5 h-5 text-sky-400" />
        <h2 className="font-black text-lg tracking-wide">BIRD SPECS</h2>
      </div>

      <div className="space-y-4">
        {Object.values(BIRD_CONFIGS).map((config) => (
          <BirdCard key={config.type} config={config} />
        ))}
      </div>
    </div>
  );
};
