import { Star } from "lucide-react";

export const GameOverlay = ({
  gameState,
  score,
  onReset,
}: {
  gameState: "aiming" | "flying" | "hit" | "resetting" | "won" | "lost";
  score: number;
  onReset: () => void;
}) => {
  if (gameState === "resetting") {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-20">
        <button
          onClick={onReset}
          className="bg-[#D62412] text-white px-8 py-4 rounded-2xl font-black text-2xl shadow-xl hover:scale-105 transition-transform"
        >
          TRY AGAIN
        </button>
      </div>
    );
  }

  if (gameState === "won") {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md z-20">
        <div className="bg-white p-8 rounded-3xl shadow-2xl text-center transform scale-110">
          <div className="flex justify-center gap-2 mb-4">
            <Star
              className="w-12 h-12 text-yellow-400 fill-yellow-400 animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <Star
              className="w-12 h-12 text-yellow-400 fill-yellow-400 animate-bounce"
              style={{ animationDelay: "100ms" }}
            />
            <Star
              className="w-12 h-12 text-yellow-400 fill-yellow-400 animate-bounce"
              style={{ animationDelay: "200ms" }}
            />
          </div>
          <h2 className="text-4xl font-black text-slate-800 mb-2">
            LEVEL CLEARED!
          </h2>
          <p className="text-2xl font-bold text-slate-500 mb-8">
            Score: {score}
          </p>
          <button
            onClick={onReset}
            className="bg-[#48bb78] text-white px-8 py-4 rounded-2xl font-black text-2xl shadow-xl hover:scale-105 transition-transform"
          >
            NEXT LEVEL
          </button>
        </div>
      </div>
    );
  }

  return null;
};
