import { Target } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-16 border-t-8 border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
            <div className="bg-[#FFCE00] p-2 rounded-lg rotate-3">
              <Target className="w-6 h-6 text-slate-900" />
            </div>
            <h3 className="text-3xl font-black text-white tracking-tight">
              Projectile Motion
            </h3>
          </div>
          <p className="text-slate-400 font-medium max-w-md">
            An open-source educational tool designed to make physics accessible
            to everyone.
          </p>
        </div>

        <div className="flex flex-col items-center md:items-end gap-4">
          <p className="font-bold text-slate-400 uppercase tracking-widest text-sm">
            Created for
          </p>
          <a
            href="https://hackclub.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative"
          >
            <div className="absolute inset-0 bg-[#ec3750] rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative flex items-center gap-4 bg-slate-800 hover:bg-slate-700 transition-all px-8 py-4 rounded-2xl border-2 border-slate-700 hover:border-[#ec3750] group-hover:-translate-y-1">
              <img
                src="https://assets.hackclub.com/icon-rounded.png"
                alt="Hack Club"
                className="w-10 h-10 rounded-lg"
              />
              <div className="text-left">
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                  Accelerate
                </div>
                <div className="font-black text-2xl tracking-tight text-white">
                  Hack Club
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>

      <div className="mt-16 text-center text-slate-600 font-bold text-sm">
        © {new Date().getFullYear()} Projectile Motion Simulator. Built with
        React & TypeScript.
      </div>
    </footer>
  );
};
