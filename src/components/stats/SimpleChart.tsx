import React, { useMemo } from "react";

interface DataPoint {
  x: number;
  y: number;
}

interface SimpleChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  color?: string;
  xLabel?: string;
  yLabel?: string;
  title?: string;
}

export const SimpleChart: React.FC<SimpleChartProps> = ({
  data,
  width = 500,
  height = 300,
  color = "#3b82f6",
  xLabel,
  yLabel,
  title,
}) => {
  const padding = 40;
  const graphWidth = width - padding * 2;
  const graphHeight = height - padding * 2;

  const { minX, maxX, minY, maxY, points } = useMemo(() => {
    if (data.length === 0)
      return { minX: 0, maxX: 100, minY: 0, maxY: 100, points: "" };

    const xValues = data.map((d) => d.x);
    const yValues = data.map((d) => d.y);

    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);

    const rangeX = maxX - minX || 1;
    const rangeY = maxY - minY || 1;

    const points = data
      .map((d) => {
        const x = padding + ((d.x - minX) / rangeX) * graphWidth;
        const y = height - padding - ((d.y - minY) / rangeY) * graphHeight;
        return `${x},${y}`;
      })
      .join(" ");

    return { minX, maxX, minY, maxY, points };
  }, [data, height, padding, graphWidth, graphHeight]);

  return (
    <div className="flex flex-col items-center bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10">
      {title && <h3 className="text-white font-bold mb-2">{title}</h3>}
      <svg width={width} height={height} className="overflow-visible">
        {/* Axes */}
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="white"
          strokeWidth="2"
        />
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={height - padding}
          stroke="white"
          strokeWidth="2"
        />

        {/* Grid lines (optional, simple) */}
        <line
          x1={padding}
          y1={padding}
          x2={width - padding}
          y2={padding}
          stroke="rgba(255,255,255,0.1)"
        />
        <line
          x1={width - padding}
          y1={padding}
          x2={width - padding}
          y2={height - padding}
          stroke="rgba(255,255,255,0.1)"
        />

        {/* Data Path */}
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Labels */}
        <text
          x={width / 2}
          y={height - 5}
          fill="white"
          textAnchor="middle"
          fontSize="12"
        >
          {xLabel}
        </text>
        <text
          x={10}
          y={height / 2}
          fill="white"
          textAnchor="middle"
          transform={`rotate(-90, 10, ${height / 2})`}
          fontSize="12"
        >
          {yLabel}
        </text>

        {/* Min/Max Values */}
        <text
          x={padding - 5}
          y={height - padding}
          fill="rgba(255,255,255,0.7)"
          textAnchor="end"
          fontSize="10"
        >
          {minY.toFixed(1)}
        </text>
        <text
          x={padding - 5}
          y={padding + 10}
          fill="rgba(255,255,255,0.7)"
          textAnchor="end"
          fontSize="10"
        >
          {maxY.toFixed(1)}
        </text>
        <text
          x={padding}
          y={height - padding + 15}
          fill="rgba(255,255,255,0.7)"
          textAnchor="middle"
          fontSize="10"
        >
          {minX.toFixed(1)}
        </text>
        <text
          x={width - padding}
          y={height - padding + 15}
          fill="rgba(255,255,255,0.7)"
          textAnchor="middle"
          fontSize="10"
        >
          {maxX.toFixed(1)}
        </text>
      </svg>
    </div>
  );
};
