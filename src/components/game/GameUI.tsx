import { RefreshCw, Trophy, Target } from "lucide-react";

export const GameUI = ({
  birdsRemaining,
  score,
  currentLevel,
  totalLevels,
  onReset,
}: {
  birdsRemaining: number;
  score: number;
  currentLevel: number;
  totalLevels: number;
  onReset: () => void;
}) => (
  <div className="absolute top-4 left-4 flex gap-4 z-10">
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 backdrop-blur p-3 rounded-xl shadow-lg border-2 border-blue-700 flex items-center gap-2">
      <Target className="w-6 h-6 text-white" />
      <span className="font-black text-xl text-white">
        Level {currentLevel}/{totalLevels}
      </span>
    </div>
    <div className="bg-white/90 backdrop-blur p-3 rounded-xl shadow-lg border-2 border-slate-200 flex items-center gap-2">
      <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-red-700 relative overflow-hidden">
        <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full"></div>
      </div>
      <span className="font-black text-xl text-slate-700">
        x {birdsRemaining}
      </span>
    </div>
    <div className="bg-white/90 backdrop-blur p-3 rounded-xl shadow-lg border-2 border-slate-200 flex items-center gap-2">
      <Trophy className="w-6 h-6 text-yellow-500" />
      <span className="font-black text-xl text-slate-700">{score}</span>
    </div>
    <button
      onClick={onReset}
      className="bg-white/90 backdrop-blur p-3 rounded-xl shadow-lg border-2 border-slate-200 hover:bg-white transition-colors"
    >
      <RefreshCw className="w-6 h-6 text-slate-700" />
    </button>
  </div>
);
