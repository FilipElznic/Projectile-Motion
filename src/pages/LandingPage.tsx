import { GravitySimulation } from "../components/GravitySimulation";
import { DragSimulation } from "../components/DragSimulation";
import { CollisionSimulation } from "../components/CollisionSimulation";
import { Button3D } from "../components/Button3D";
import { Card } from "../components/Card";
import { MathBlock } from "../components/MathBlock";
import {
  Play,
  Trophy,
  Target,
  Zap,
  Settings,
  Info,
  Star,
  ArrowDown,
  Move,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";

const SimulationContainer = ({
  children,
  title,
  description,
  icon: Icon,
  color = "bg-[#DEB887]",
  borderColor = "border-[#c19a6b]",
  mathTitle,
  mathContent,
  formulas = [],
}: {
  children: React.ReactNode;
  title: string;
  description: string;
  icon: any;
  color?: string;
  borderColor?: string;
  mathTitle: string;
  mathContent: React.ReactNode;
  formulas?: string[];
}) => (
  <div className="mb-32">
    <div className="text-center mb-12">
      <div className="inline-flex items-center justify-center p-4 bg-white rounded-full shadow-lg mb-4">
        <Icon className="w-8 h-8 text-slate-700" strokeWidth={3} />
      </div>
      <h2 className="text-4xl md:text-5xl font-black text-white drop-shadow-md mb-2">
        {title}
      </h2>
      <p className="text-xl text-white/90 font-bold max-w-2xl mx-auto">
        {description}
      </p>
    </div>

    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
      {/* Simulation Side */}
      <div className="relative h-full min-h-[500px]">
        <div
          className={`${color} p-4 md:p-6 rounded-[3rem] shadow-[0_20px_0_rgba(0,0,0,0.2)] border-b-[16px] ${borderColor} h-full`}
        >
          <div className="bg-slate-900 rounded-[2rem] overflow-hidden border-8 border-slate-800 shadow-inner relative h-full min-h-[400px]">
            {children}
          </div>

          {/* Decorative Screws */}
          <div
            className={`absolute top-6 left-6 w-4 h-4 rounded-full ${borderColor} shadow-inner opacity-50`}
          ></div>
          <div
            className={`absolute top-6 right-6 w-4 h-4 rounded-full ${borderColor} shadow-inner opacity-50`}
          ></div>
          <div
            className={`absolute bottom-8 left-6 w-4 h-4 rounded-full ${borderColor} shadow-inner opacity-50`}
          ></div>
          <div
            className={`absolute bottom-8 right-6 w-4 h-4 rounded-full ${borderColor} shadow-inner opacity-50`}
          ></div>
        </div>
      </div>

      {/* Math Side */}
      <div className="h-full">
        <MathBlock title={mathTitle} formulas={formulas}>
          {mathContent}
        </MathBlock>
      </div>
    </div>
  </div>
);

export const LandingPage = () => {
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
        <div className="text-center mb-24 relative">
          <h1 className="text-6xl md:text-8xl font-black text-white drop-shadow-[0_8px_0_rgba(0,0,0,0.15)] tracking-tight mb-4 transform -rotate-2">
            PROJECTILE
            <br />
            <span className="text-[#FFCE00] text-7xl md:text-9xl drop-shadow-[0_8px_0_rgba(180,140,0,1)]">
              MOTION
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-bold max-w-2xl mx-auto drop-shadow-md mb-8">
            Master the physics of flight in this interactive playground!
          </p>

          <div className="flex justify-center gap-6">
            <Link to="/simulation">
              <Button3D variant="primary">
                <span className="flex items-center gap-2">
                  <Play fill="currentColor" /> Start Learning
                </span>
              </Button3D>
            </Link>
          </div>
        </div>

        {/* Section 1: Gravity */}
        <SimulationContainer
          title="1. Gravity & Acceleration"
          description="Observe how constant acceleration affects vertical velocity."
          icon={ArrowDown}
          color="bg-[#4ECDC4]"
          borderColor="border-[#3b9c95]"
          mathTitle="The Physics of Falling"
          mathContent={
            <>
              <p>
                Gravity is a constant force that accelerates objects downwards.
                In our simulation, we apply this acceleration to the vertical
                velocity component ($v_y$) every frame.
              </p>
              <p>
                When the ball hits the ground, we reverse its velocity and
                multiply it by a <strong>restitution coefficient</strong> (0.7)
                to simulate energy loss, making each bounce lower than the last.
              </p>
            </>
          }
          formulas={[
            "v_y = v_{y0} + g \\cdot t",
            "y = y_0 + v_{y0}t + \\frac{1}{2}gt^2",
            "v_{new} = -v_{old} \\times 0.7",
          ]}
        >
          <GravitySimulation />
        </SimulationContainer>

        {/* Section 2: Drag & Shoot */}
        <SimulationContainer
          title="2. Projectile Motion"
          description="Combine horizontal velocity with vertical gravity."
          icon={Move}
          color="bg-[#FF6B6B]"
          borderColor="border-[#c44d4d]"
          mathTitle="Vector Decomposition"
          mathContent={
            <>
              <p>
                When you launch the ball, you give it an initial velocity
                vector. This vector has both magnitude (speed) and direction.
              </p>
              <p>
                We decompose this into horizontal ($v_x$) and vertical ($v_y$)
                components. The horizontal velocity remains constant (ignoring
                air resistance), while gravity affects the vertical component.
              </p>
            </>
          }
          formulas={[
            "\\vec{v} = \\vec{v}_x + \\vec{v}_y",
            "v_x = |\\vec{v}| \\cos(\\theta)",
            "v_y = |\\vec{v}| \\sin(\\theta)",
          ]}
        >
          <DragSimulation />
          <div className="absolute top-6 left-6 pointer-events-none">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border-2 border-white/20 text-white">
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-5 h-5 text-[#FFCE00] fill-[#FFCE00]" />
                <span className="font-black text-lg">TRY IT!</span>
              </div>
            </div>
          </div>
        </SimulationContainer>

        {/* Section 3: Collisions */}
        <SimulationContainer
          title="3. Elastic Collisions"
          description="Momentum transfer in a zero-gravity environment."
          icon={RefreshCw}
          color="bg-[#95E1D3]"
          borderColor="border-[#7ac0b3]"
          mathTitle="Conservation of Momentum"
          mathContent={
            <>
              <p>
                In a perfectly elastic collision, both momentum and kinetic
                energy are conserved. When two balls collide, they exchange
                momentum based on their masses and velocities.
              </p>
              <p>
                Our simulation simplifies this by assuming equal mass, resulting
                in a direct exchange of velocity components along the collision
                normal.
              </p>
            </>
          }
          formulas={[
            "m_1v_1 + m_2v_2 = m_1v_1' + m_2v_2'",
            "\\frac{1}{2}m_1v_1^2 + \\frac{1}{2}m_2v_2^2 = \\frac{1}{2}m_1v_1'^2 + \\frac{1}{2}m_2v_2'^2",
          ]}
        >
          <CollisionSimulation />
        </SimulationContainer>

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
};
