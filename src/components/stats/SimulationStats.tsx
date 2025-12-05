import React from "react";
import { SimpleChart } from "./SimpleChart";
import type { FlightDataPoint } from "../../types/FlightData";
import "katex/dist/katex.min.css";
import { BlockMath, InlineMath } from "react-katex";

interface SimulationStatsProps {
  flightData: FlightDataPoint[];
  birdMass: number;
}

export const SimulationStats: React.FC<SimulationStatsProps> = ({
  flightData,
  birdMass,
}) => {
  if (!flightData || flightData.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-white/50 text-2xl font-bold">
        Launch a bird to see statistics!
      </div>
    );
  }

  // Process data for charts
  const velocityData = flightData.map((d) => ({
    x: d.time,
    y: Math.sqrt(d.vx * d.vx + d.vy * d.vy),
  }));

  const trajectoryData = flightData.map((d) => ({
    x: d.x,
    y: d.y,
  }));

  const energyData = flightData.map((d) => {
    const v = Math.sqrt(d.vx * d.vx + d.vy * d.vy);
    const ke = 0.5 * birdMass * v * v;
    const pe = birdMass * 9.8 * d.y; // Assuming g=9.8 and y is height
    return {
      x: d.time,
      y: ke + pe,
    };
  });

  const forceData = flightData.map((d, i) => {
    if (i === 0) return { x: d.time, y: 0 };
    const prev = flightData[i - 1];
    const dt = d.time - prev.time;
    if (dt <= 0) return { x: d.time, y: 0 };

    const dvx = d.vx - prev.vx;
    const dvy = d.vy - prev.vy;
    const ax = dvx / dt;
    const ay = dvy / dt;
    const a = Math.sqrt(ax * ax + ay * ay);
    const f = birdMass * a;

    return { x: d.time, y: f };
  });

  // Statistics
  const maxHeight = Math.max(...flightData.map((d) => d.y));
  const maxSpeed = Math.max(...velocityData.map((d) => d.y));
  const totalDistance = flightData[flightData.length - 1].x - flightData[0].x;
  const flightTime = flightData[flightData.length - 1].time;
  const collisionCount = flightData.filter((d) => d.isColliding).length;

  return (
    <div className="w-full max-w-7xl mx-auto p-8 space-y-12 text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard label="Max Height" value={`${maxHeight.toFixed(1)} m`} />
        <StatCard label="Max Speed" value={`${maxSpeed.toFixed(1)} m/s`} />
        <StatCard label="Distance" value={`${totalDistance.toFixed(1)} m`} />
        <StatCard label="Flight Time" value={`${flightTime.toFixed(2)} s`} />
        <StatCard label="Collisions" value={`${collisionCount}`} />
      </div>

      <div className="space-y-8">
        <h2 className="text-3xl font-black border-b border-white/20 pb-4">
          Flight Analysis
        </h2>

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
            title="Velocity vs Time"
            xLabel="Time (s)"
            yLabel="Speed (m/s)"
            color="#60a5fa"
          />
          <SimpleChart
            data={forceData}
            title="Force vs Time"
            xLabel="Time (s)"
            yLabel="Force (N)"
            color="#f87171"
          />
          <SimpleChart
            data={energyData}
            title="Total Energy vs Time"
            xLabel="Time (s)"
            yLabel="Energy (J)"
            color="#fbbf24"
          />
        </div>
      </div>

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
