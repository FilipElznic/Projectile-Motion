import { AngryBirdsGame } from "../components/AngryBirdsGame";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export const SimulationPage = () => {
  return (
    <div className="fixed inset-0 bg-slate-900 p-4 flex flex-col overflow-hidden">
      <header className="flex-none mb-4 flex items-center justify-between max-w-7xl mx-auto w-full z-10">
        <Link
          to="/"
          className="flex items-center gap-2 text-white/80 hover:text-white font-bold transition-colors bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Home
        </Link>
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-wider drop-shadow-lg">
          SIMULATION MODE
        </h1>
        <div className="w-[100px] hidden md:block"></div>{" "}
        {/* Spacer for centering */}
      </header>

      <div className="flex-1 flex items-center justify-center w-full min-h-0">
        <main className="w-full max-w-7xl h-full md:h-auto md:aspect-video md:max-h-[80vh] bg-[#46C6F6] rounded-[2rem] md:rounded-[3rem] border-8 border-white/20 shadow-2xl overflow-hidden relative ring-1 ring-white/10">
          {/* Sky Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/20 pointer-events-none"></div>

          {/* Clouds */}
          <div className="absolute top-10 left-10 w-32 h-12 bg-white/40 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-20 right-20 w-48 h-16 bg-white/30 rounded-full blur-xl animate-pulse delay-700"></div>

          <AngryBirdsGame />
        </main>
      </div>
    </div>
  );
};
