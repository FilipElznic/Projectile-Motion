import React, { useMemo, useState } from "react";
import { SimpleChart } from "./SimpleChart";
import type { FlightDataPoint } from "../../types/FlightData";
import "katex/dist/katex.min.css";
import { BlockMath, InlineMath } from "react-katex";
import { ChevronDown, ChevronUp, Activity } from "lucide-react";

interface SimulationStatsProps {
  flightData: FlightDataPoint[];
  birdMass: number;
}

export const SimulationStats: React.FC<SimulationStatsProps> = ({
  flightData,
  birdMass,
}) => {
  const [showGraphs, setShowGraphs] = useState(false);

  const processData = useMemo(() => {
    if (!flightData || flightData.length === 0) return null;

    // 1. Sort data by time
    const sorted = [...flightData].sort((a, b) => a.time - b.time);

    // 2. Moving Average Smoothing Function
    const smooth = (data: number[], windowSize: number = 12) => {
      const result = [];
      for (let i = 0; i < data.length; i++) {
        let sum = 0;
        let count = 0;
        const start = Math.max(0, i - Math.floor(windowSize / 2));
        const end = Math.min(data.length, i + Math.floor(windowSize / 2) + 1);
        for (let j = start; j < end; j++) {
          sum += data[j];
          count++;
        }
        result.push(sum / count);
      }
      return result;
    };

    // 3. Smooth base metrics (Position & Velocity)
    const rawVx = sorted.map((d) => d.vx);
    const rawVy = sorted.map((d) => d.vy);
    const rawX = sorted.map((d) => d.x);
    const rawY = sorted.map((d) => d.y);

    const smoothVx = smooth(rawVx);
    const smoothVy = smooth(rawVy);
    const smoothX = smooth(rawX);
    const smoothY = smooth(rawY);

    // 4. Generate derived datasets
    const velocityData = sorted.map((d, i) => ({
      x: d.time,
      y: Math.sqrt(smoothVx[i] ** 2 + smoothVy[i] ** 2),
    }));

    const trajectoryData = sorted.map((_, i) => ({
      x: smoothX[i],
      y: smoothY[i],
    }));

    const vxData = sorted.map((d, i) => ({
      x: d.time,
      y: smoothVx[i],
    }));

    const vyData = sorted.map((d, i) => ({
      x: d.time,
      y: smoothVy[i],
    }));

    const energyData = sorted.map((d, i) => {
      const v = Math.sqrt(smoothVx[i] ** 2 + smoothVy[i] ** 2);
      const ke = 0.5 * birdMass * v * v;
      const pe = birdMass * 9.8 * smoothY[i];
      return {
        x: d.time,
        y: ke + pe,
      };
    });

    const keData = sorted.map((d, i) => {
      const v = Math.sqrt(smoothVx[i] ** 2 + smoothVy[i] ** 2);
      return {
        x: d.time,
        y: 0.5 * birdMass * v * v,
      };
    });

    const peData = sorted.map((d, i) => ({
      x: d.time,
      y: birdMass * 9.8 * smoothY[i],
    }));

    // Force Calculation (Smoothed)
    const rawForce = sorted.map((d, i) => {
      if (i === 0) return 0;
      const dt = d.time - sorted[i - 1].time;
      if (dt <= 0.0001) return 0;

      const dvx = smoothVx[i] - smoothVx[i - 1];
      const dvy = smoothVy[i] - smoothVy[i - 1];
      const a = Math.sqrt((dvx / dt) ** 2 + (dvy / dt) ** 2);
      return birdMass * a;
    });

    const smoothForce = smooth(rawForce, 20); // Stronger smoothing for force
    const forceData = sorted.map((d, i) => ({ x: d.time, y: smoothForce[i] }));

    // Statistics
    const maxHeight = Math.max(...smoothY);
    const maxSpeed = Math.max(...velocityData.map((d) => d.y));
    const totalDistance = smoothX[smoothX.length - 1] - smoothX[0];
    const flightTime = sorted[sorted.length - 1].time;
    const collisionCount = sorted.filter((d) => d.isColliding).length;

    return {
      velocityData,
      trajectoryData,
      energyData,
      keData,
      peData,
      vxData,
      vyData,
      forceData,
      maxHeight,
      maxSpeed,
      totalDistance,
      flightTime,
      collisionCount,
    };
  }, [flightData, birdMass]);

  if (!processData) {
    return (
      <div className="w-full h-full flex items-center justify-center text-white/50 text-2xl font-bold">
        Launch a bird to see statistics!
      </div>
    );
  }

  const {
    velocityData,
    trajectoryData,
    energyData,
    keData,
    peData,
    vxData,
    vyData,
    forceData,
    maxHeight,
    maxSpeed,
    totalDistance,
    flightTime,
    collisionCount,
  } = processData;

  return (
    <div className="w-full max-w-7xl mx-auto p-8 space-y-12 text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard label="Max Height" value={`${maxHeight.toFixed(1)} m`} />
        <StatCard label="Max Speed" value={`${maxSpeed.toFixed(1)} m/s`} />
        <StatCard label="Distance" value={`${totalDistance.toFixed(1)} m`} />
        <StatCard label="Flight Time" value={`${flightTime.toFixed(2)} s`} />
        <StatCard label="Collisions" value={`${collisionCount}`} />
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => setShowGraphs(!showGraphs)}
          className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 transition-colors rounded-full font-bold text-sky-300 border border-sky-500/30"
        >
          <Activity className="w-5 h-5" />
          {showGraphs ? "Hide Flight Graphs" : "Show Flight Graphs"}
          {showGraphs ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
      </div>

      {showGraphs && (
        <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <h2 className="text-3xl font-black border-b border-white/20 pb-4">
            Flight Analysis
          </h2>

          <h3 className="text-xl font-bold text-sky-400">Kinematics</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SimpleChart
              data={trajectoryData}
              title="Trajectory (Height vs Distance)"
              xLabel="Distance (m)"
              yLabel="Height (m)"
              color="#4ade80"
            />
            <SimpleChart
              data={velocityData}
              title="Total Velocity vs Time"
              xLabel="Time (s)"
              yLabel="Speed (m/s)"
              color="#60a5fa"
            />
            <SimpleChart
              data={vxData}
              title="Horizontal Velocity (Vx) vs Time"
              xLabel="Time (s)"
              yLabel="Vx (m/s)"
              color="#c084fc"
            />
            <SimpleChart
              data={vyData}
              title="Vertical Velocity (Vy) vs Time"
              xLabel="Time (s)"
              yLabel="Vy (m/s)"
              color="#f472b6"
            />
          </div>

          <h3 className="text-xl font-bold text-amber-400 mt-8">
            Dynamics & Energy
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SimpleChart
              data={forceData}
              title="Force vs Time"
              xLabel="Time (s)"
              yLabel="Force (N)"
              color="#f87171"
            />
            <SimpleChart
              data={energyData}
              title="Total Mechanical Energy vs Time"
              xLabel="Time (s)"
              yLabel="Energy (J)"
              color="#fbbf24"
            />
            <SimpleChart
              data={keData}
              title="Kinetic Energy vs Time"
              xLabel="Time (s)"
              yLabel="KE (J)"
              color="#a3e635"
            />
            <SimpleChart
              data={peData}
              title="Potential Energy vs Time"
              xLabel="Time (s)"
              yLabel="PE (J)"
              color="#22d3ee"
            />
          </div>
        </div>
      )}

      <div className="space-y-8">
        <h2 className="text-3xl font-black border-b border-white/20 pb-4">
          The Physics Behind The Simulation
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-sky-300">
              Projectile Motion
            </h3>
            <p className="text-slate-300 leading-relaxed">
              The bird follows a parabolic trajectory determined by its initial
              velocity and gravity. The horizontal motion is constant (ignoring
              air resistance), while the vertical motion is accelerated by
              gravity.
            </p>
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
              <BlockMath math="x(t) = v_{0x} t + x_0" />
              <BlockMath math="y(t) = -\frac{1}{2}gt^2 + v_{0y}t + y_0" />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-sky-300">
              Newton's Second Law
            </h3>
            <p className="text-slate-300 leading-relaxed">
              The force acting on the bird is primarily gravity, but during
              collisions, impulse forces cause rapid changes in velocity.
            </p>
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
              <BlockMath math="\vec{F} = m\vec{a}" />
              <BlockMath math="\vec{F}_{gravity} = m\vec{g}" />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-amber-300">
              Conservation of Energy
            </h3>
            <p className="text-slate-300 leading-relaxed">
              In the absence of non-conservative forces (like friction or air
              resistance), the total mechanical energy remains constant. Kinetic
              energy transforms into potential energy and vice versa.
            </p>
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
              <BlockMath math="E_{total} = KE + PE = \text{constant}" />
              <BlockMath math="KE = \frac{1}{2}mv^2, \quad PE = mgh" />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-purple-300">
              Velocity Components
            </h3>
            <p className="text-slate-300 leading-relaxed">
              Velocity is a vector quantity with horizontal (
              <InlineMath math="v_x" />) and vertical (<InlineMath math="v_y" />
              ) components. <InlineMath math="v_x" /> remains constant while{" "}
              <InlineMath math="v_y" /> changes linearly due to gravity.
            </p>
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
              <BlockMath math="v_x(t) = v_{0x}" />
              <BlockMath math="v_y(t) = v_{0y} - gt" />
              <BlockMath math="v = \sqrt{v_x^2 + v_y^2}" />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-sky-300">
              Energy Conservation
            </h3>
            <p className="text-slate-300 leading-relaxed">
              Total mechanical energy is the sum of kinetic and potential
              energy. In an ideal system, this is conserved, but collisions
              dissipate energy.
            </p>
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
              <BlockMath math="E_{total} = KE + PE" />
              <BlockMath math="KE = \frac{1}{2}mv^2" />
              <BlockMath math="PE = mgh" />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-sky-300">
              Collision Physics
            </h3>
            <p className="text-slate-300 leading-relaxed">
              When objects collide, we calculate the impulse{" "}
              <InlineMath math="J" /> to resolve the collision, changing the
              velocities of both objects based on their restitution
              (bounciness).
            </p>
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
              <BlockMath math="J = \frac{-(1+e)(v_A - v_B) \cdot n}{1/m_A + 1/m_B}" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-white/10 backdrop-blur p-6 rounded-2xl border border-white/10">
    <div className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">
      {label}
    </div>
    <div className="text-3xl font-black text-white">{value}</div>
  </div>
);
