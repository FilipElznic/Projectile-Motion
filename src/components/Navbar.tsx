import { Target, Home, Play, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="pt-8 pb-4 px-6 flex justify-between items-center max-w-7xl mx-auto w-full z-50 relative">
      <Link to="/" className="group">
        <div className="flex items-center gap-3">
          <div className="animate-bounce group-hover:animate-none transition-transform group-hover:scale-110">
            <div className="bg-white p-3 rounded-2xl shadow-[0_6px_0_rgba(0,0,0,0.1)] rotate-3 border-4 border-white/50">
              <Target className="w-8 h-8 text-[#D62412]" strokeWidth={3} />
            </div>
          </div>
          <span className="hidden md:block font-black text-2xl text-white drop-shadow-md tracking-tight">
            PROJECTILE MOTION
          </span>
        </div>
      </Link>

      <nav className="flex gap-4 bg-slate-900/50 backdrop-blur-md p-2 rounded-2xl border border-white/10">
        <Link
          to="/"
          className={`p-3 rounded-xl transition-all border-2 ${
            isActive("/")
              ? "bg-white text-[#D62412] border-white shadow-lg"
              : "bg-white/10 text-white border-transparent hover:bg-white/20"
          }`}
          title="Home"
        >
          <Home className="w-6 h-6" strokeWidth={3} />
        </Link>
        <Link
          to="/simulation"
          className={`p-3 rounded-xl transition-all border-2 ${
            isActive("/simulation")
              ? "bg-[#46C6F6] text-white border-[#2cb5e8] shadow-lg"
              : "bg-white/10 text-white border-transparent hover:bg-white/20"
          }`}
          title="Simulation"
        >
          <Play className="w-6 h-6" strokeWidth={3} fill="currentColor" />
        </Link>
        <Link
          to="/custom-bird"
          className={`p-3 rounded-xl transition-all border-2 ${
            isActive("/custom-bird")
              ? "bg-[#FFCE00] text-[#5a4a00] border-[#e6b800] shadow-lg"
              : "bg-white/10 text-white border-transparent hover:bg-white/20"
          }`}
          title="Custom Bird"
        >
          <Settings className="w-6 h-6" strokeWidth={3} />
        </Link>
      </nav>
    </header>
  );
};
