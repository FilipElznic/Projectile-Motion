import { useMemo, type CSSProperties } from "react";

export const ParticleExplosion = ({
  x,
  y,
  color,
}: {
  x: number;
  y: number;
  color: string;
}) => {
  const particles = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => {
      const angle = (Math.PI * 2 * i) / 8;
      const dist = 30 + ((i * 13) % 20);
      const tx = Math.cos(angle) * dist;
      const ty = Math.sin(angle) * dist;
      return { id: i, tx, ty };
    });
  }, []);

  return (
    <div className="absolute pointer-events-none" style={{ left: x, top: y }}>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute w-3 h-3 rounded-sm animate-particle"
          style={
            {
              backgroundColor: color,
              "--tx": `${p.tx}px`,
              "--ty": `${p.ty}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
};

export const ScorePopup = ({
  x,
  y,
  score,
}: {
  x: number;
  y: number;
  score: number;
}) => (
  <div
    className="absolute pointer-events-none font-black text-2xl text-white drop-shadow-md animate-popup z-30"
    style={{ left: x, top: y }}
  >
    +{score}
  </div>
);
