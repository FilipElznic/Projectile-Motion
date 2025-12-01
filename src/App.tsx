import { Simulation } from "./components/Simulation";
import { Button3D } from "./components/Button3D";
import { Card } from "./components/Card";
import { Play, Trophy, Target, Zap, Settings, Info, Star } from "lucide-react";

function App() {
  return (
    <div className="min-h-screen pb-20 overflow-x-hidden">
      {/* Floating Header */}
      <header className="pt-8 pb-4 px-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="animate-bounce">
          <div className="bg-white p-3 rounded-2xl shadow-[0_6px_0_rgba(0,0,0,0.1)] rotate-3 border-4 border-white/50">
            <Target className="w-8 h-8 text-[#D62412]" strokeWidth={3} />
          </div>
        </div>

        <nav className="flex gap-4">
          <button className="p-3 bg-white/20 rounded-xl hover:bg-white/40 transition-colors text-white border-2 border-white/30">
            <Settings className="w-6 h-6" strokeWidth={3} />
          </button>
          <button className="p-3 bg-white/20 rounded-xl hover:bg-white/40 transition-colors text-white border-2 border-white/30">
            <Info className="w-6 h-6" strokeWidth={3} />
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-4">
        <div className="text-center mb-12 relative">
          <h1 className="text-6xl md:text-8xl font-black text-white drop-shadow-[0_8px_0_rgba(0,0,0,0.15)] tracking-tight mb-4 transform -rotate-2">
            PROJECTILE
            <br />
            <span className="text-[#FFCE00] text-7xl md:text-9xl drop-shadow-[0_8px_0_rgba(180,140,0,1)]">
              MOTION
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-bold max-w-2xl mx-auto drop-shadow-md">
            Master the physics of flight in this interactive playground!
          </p>

          <div className="mt-8 flex justify-center gap-6">
            <Button3D variant="primary">
              <span className="flex items-center gap-2">
                <Play fill="currentColor" /> Play Now
              </span>
            </Button3D>
            <Button3D variant="secondary">
              <span className="flex items-center gap-2">
                <Trophy /> Leaderboard
              </span>
            </Button3D>
          </div>
        </div>

        {/* Game Container (TV Style) */}
        <div className="relative mx-auto max-w-5xl mb-24">
          <div className="bg-[#DEB887] p-4 md:p-6 rounded-[3rem] shadow-[0_20px_0_rgba(92,64,51,0.3)] border-b-[16px] border-[#c19a6b]">
            <div className="bg-slate-900 rounded-[2rem] overflow-hidden border-8 border-slate-800 shadow-inner relative h-[500px] md:h-[600px]">
              <Simulation />

              {/* Overlay UI */}
              <div className="absolute top-6 left-6 pointer-events-none">
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border-2 border-white/20 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="w-5 h-5 text-[#FFCE00] fill-[#FFCE00]" />
                    <span className="font-black text-lg">SCORE: 0</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Screws */}
            <div className="absolute top-6 left-6 w-4 h-4 rounded-full bg-[#c19a6b] shadow-inner"></div>
            <div className="absolute top-6 right-6 w-4 h-4 rounded-full bg-[#c19a6b] shadow-inner"></div>
            <div className="absolute bottom-8 left-6 w-4 h-4 rounded-full bg-[#c19a6b] shadow-inner"></div>
            <div className="absolute bottom-8 right-6 w-4 h-4 rounded-full bg-[#c19a6b] shadow-inner"></div>
          </div>
        </div>

        {/* Bento Grid Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <Card rotate="left" className="md:col-span-2" variant="white">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-4 rounded-2xl text-blue-500">
                <Target className="w-8 h-8" strokeWidth={3} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-700 mb-2">
                  Precision Physics
                </h3>
                <p className="text-slate-500 font-medium text-lg leading-relaxed">
                  Experience real-time vector mathematics. Adjust your angle and
                  velocity to hit targets with pinpoint accuracy.
                </p>
              </div>
            </div>
          </Card>

          <Card rotate="right" variant="wood">
            <div className="h-full flex flex-col justify-between">
              <div className="bg-[#5C4033]/10 p-4 rounded-2xl w-fit mb-4">
                <Zap className="w-8 h-8" strokeWidth={3} />
              </div>
              <div>
                <h3 className="text-2xl font-black mb-2">Power Ups</h3>
                <p className="font-medium opacity-80">
                  Unlock special projectiles and gravity modifiers!
                </p>
              </div>
            </div>
          </Card>

          <Card rotate="right" variant="glass" className="md:col-span-1">
            <div className="text-center py-8">
              <div className="text-6xl font-black text-[#D62412] mb-2">9.8</div>
              <div className="text-slate-600 font-bold uppercase tracking-widest">
                Gravity (m/s²)
              </div>
            </div>
          </Card>

          <Card rotate="left" className="md:col-span-2" variant="white">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <h3 className="text-2xl font-black text-slate-700 mb-4">
                  Learn While You Play
                </h3>
                <ul className="space-y-3">
                  {[
                    "Vector Addition",
                    "Parabolic Trajectories",
                    "Collision Mechanics",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 font-bold text-slate-600"
                    >
                      <div className="w-6 h-6 rounded-full bg-[#FFCE00] flex items-center justify-center text-xs text-[#5a4a00]">
                        ✓
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="w-full md:w-1/3 bg-slate-100 rounded-2xl p-4 border-4 border-slate-200">
                <div className="w-full aspect-square bg-white rounded-xl border-2 border-slate-200 flex items-center justify-center">
                  <span className="text-4xl">📐</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default App;
