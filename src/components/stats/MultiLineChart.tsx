import React, { useMemo } from "react";

interface DataPoint {
  x: number;
  y: number;
}

interface Dataset {
  label: string;
  color: string;
  data: DataPoint[];
}

interface MultiLineChartProps {
  datasets: Dataset[];
  width?: number;
  height?: number;
  xLabel?: string;
  yLabel?: string;
  title?: string;
}

export const MultiLineChart: React.FC<MultiLineChartProps> = ({
  datasets,
  width = 500,
  height = 300,
  xLabel,
  yLabel,
  title,
}) => {
  const padding = 40;
  const graphWidth = width - padding * 2;
  const graphHeight = height - padding * 2;

  const { minX, maxX, minY, maxY, processedDatasets } = useMemo(() => {
    if (datasets.length === 0)
      return {
        minX: 0,
        maxX: 100,
        minY: 0,
        maxY: 100,
        processedDatasets: [],
      };

    const allPoints = datasets.flatMap((d) => d.data);
    const xValues = allPoints.map((d) => d.x);
    const yValues = allPoints.map((d) => d.y);

    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);

    const rangeX = maxX - minX || 1;
    const rangeY = maxY - minY || 1;

    const processedDatasets = datasets.map((dataset) => {
      const points = dataset.data
        .map((d) => {
          const x = padding + ((d.x - minX) / rangeX) * graphWidth;
          const y = height - padding - ((d.y - minY) / rangeY) * graphHeight;
          return `${x},${y}`;
        })
        .join(" ");
      return { ...dataset, points };
    });

    return { minX, maxX, minY, maxY, processedDatasets };
  }, [datasets, width, height]);

  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
      {title && (
        <h4 className="text-white/90 font-bold mb-4 text-center">{title}</h4>
      )}
      <div className="relative">
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
          {/* Grid Lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((t) => (
            <React.Fragment key={t}>
              <line
                x1={padding}
                y1={padding + t * graphHeight}
                x2={width - padding}
                y2={padding + t * graphHeight}
                stroke="rgba(255,255,255,0.1)"
                strokeDasharray="4 4"
              />
              <line
                x1={padding + t * graphWidth}
                y1={padding}
                x2={padding + t * graphWidth}
                y2={height - padding}
                stroke="rgba(255,255,255,0.1)"
                strokeDasharray="4 4"
              />
            </React.Fragment>
          ))}

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

          {/* Data Lines */}
          {processedDatasets.map((dataset, i) => (
            <polyline
              key={i}
              points={dataset.points}
              fill="none"
              stroke={dataset.color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-md"
            />
          ))}

          {/* Labels */}
          <text
            x={width / 2}
            y={height - 10}
            fill="rgba(255,255,255,0.6)"
            textAnchor="middle"
            fontSize="12"
          >
            {xLabel}
          </text>
          <text
            x={10}
            y={height / 2}
            fill="rgba(255,255,255,0.6)"
            textAnchor="middle"
            transform={`rotate(-90, 10, ${height / 2})`}
            fontSize="12"
          >
            {yLabel}
          </text>

          {/* Values */}
          <text
            x={padding - 10}
            y={height - padding}
            fill="rgba(255,255,255,0.4)"
            textAnchor="end"
            fontSize="10"
          >
            {minY.toFixed(1)}
          </text>
          <text
            x={padding - 10}
            y={padding}
            fill="rgba(255,255,255,0.4)"
            textAnchor="end"
            fontSize="10"
          >
            {maxY.toFixed(1)}
          </text>
          <text
            x={padding}
            y={height - padding + 15}
            fill="rgba(255,255,255,0.4)"
            textAnchor="middle"
            fontSize="10"
          >
            {minX.toFixed(1)}
          </text>
          <text
            x={width - padding}
            y={height - padding + 15}
            fill="rgba(255,255,255,0.4)"
            textAnchor="middle"
            fontSize="10"
          >
            {maxX.toFixed(1)}
          </text>
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center mt-4">
        {datasets.map((d, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: d.color }}
            ></div>
            <span className="text-xs text-white/80">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
