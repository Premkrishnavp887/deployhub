import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { DeploymentOverviewPoint } from "@/lib/types";

interface OverviewChartProps {
  data?: DeploymentOverviewPoint[];
  isLoading?: boolean;
}

export function OverviewChart({ data = [], isLoading = false }: OverviewChartProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const hasData = data && data.length > 0;
  const maxVal = hasData ? Math.max(15, ...data.map((d) => d.total)) : 15;
  const height = 150;
  const width = 500;
  const paddingX = 40;
  const step = hasData && data.length > 1 ? (width - paddingX * 2) / (data.length - 1) : 0;

  const points = data.map((d, i) => {
    const x = paddingX + i * step;
    const y = height - (d.total / maxVal) * 110 - 20;
    return { x, y, ...d, index: i };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, "");

  const activePoint = selectedIdx !== null ? points[selectedIdx] : null;

  return (
    <Card padding="p-4 sm:p-5" className="flex flex-col justify-between relative min-h-[260px]">
      {/* Header with Title, Legends, and Time-range selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
        <h2 className="text-sm font-bold text-slate-900">Deployment Overview</h2>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-500" /> Successful
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-rose-500" /> Failed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-blue-600" /> Total
            </span>
          </div>

          <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 shadow-2xs">
            <span>Last 14 days</span>
            <span className="text-[10px] text-slate-400">▼</span>
          </button>
        </div>
      </div>

      {/* Chart Area */}
      <div className="relative w-full overflow-hidden pt-2 flex-1 flex flex-col justify-end">
        {!hasData ? (
          <div className="relative flex flex-col items-center justify-center h-44 border border-dashed border-slate-200/80 rounded-lg bg-slate-50/50">
            <span className="text-xs font-medium text-slate-400">
              {isLoading ? "Loading deployment overview..." : "No deployment history yet"}
            </span>
          </div>
        ) : (
          <>
            {activePoint && (
              <div
                className="absolute z-10 -translate-x-1/2 rounded-lg border border-slate-200/90 bg-white p-2.5 shadow-md text-xs pointer-events-none transition-all duration-150"
                style={{
                  left: `${(activePoint.x / width) * 100}%`,
                  top: `${Math.max(10, activePoint.y - 65)}px`,
                }}
              >
                <div className="font-bold text-slate-900 text-[11px] mb-1">
                  {activePoint.date}
                </div>
                <div className="space-y-0.5 text-[11px]">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <span className="size-1.5 rounded-full bg-blue-600" />
                    <span>{activePoint.total} total</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    <span>{activePoint.success} successful</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <span className="size-1.5 rounded-full bg-rose-500" />
                    <span>{activePoint.failed} failed</span>
                  </div>
                </div>
              </div>
            )}

            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44 overflow-visible">
              {[0, 5, 10, 15].map((gridVal) => {
                const y = height - (gridVal / maxVal) * 110 - 20;
                return (
                  <g key={gridVal}>
                    <line
                      x1={paddingX - 10}
                      y1={y}
                      x2={width - 10}
                      y2={y}
                      stroke="#f1f5f9"
                      strokeDasharray="4 4"
                    />
                    <text x="5" y={y + 3} fill="#94a3b8" fontSize="9" textAnchor="start">
                      {gridVal}
                    </text>
                  </g>
                );
              })}

              {points.map((p) => {
                const barW = 10;
                const successH = (p.success / maxVal) * 110;
                const failedH = (p.failed / maxVal) * 110;
                const baseY = height - 20;
                const isHovered = selectedIdx === p.index;

                return (
                  <g
                    key={p.label}
                    className="cursor-pointer"
                    onMouseEnter={() => setSelectedIdx(p.index)}
                    onClick={() => setSelectedIdx(p.index)}
                  >
                    <rect
                      x={p.x - 18}
                      y={0}
                      width={36}
                      height={height}
                      fill="transparent"
                    />
                    {p.success > 0 && (
                      <rect
                        x={p.x - barW - 1}
                        y={baseY - successH}
                        width={barW}
                        height={successH}
                        rx="1.5"
                        fill="#10b981"
                        className={isHovered ? "opacity-100" : "opacity-90"}
                      />
                    )}
                    {p.failed > 0 && (
                      <rect
                        x={p.x + 1}
                        y={baseY - failedH}
                        width={barW}
                        height={failedH}
                        rx="1.5"
                        fill="#ef4444"
                        className={isHovered ? "opacity-100" : "opacity-90"}
                      />
                    )}
                    <text
                      x={p.x}
                      y={height - 4}
                      fill={isHovered ? "#0f172a" : "#64748b"}
                      fontSize="9"
                      fontWeight={isHovered ? "600" : "normal"}
                      textAnchor="middle"
                    >
                      {p.label}
                    </text>
                  </g>
                );
              })}

              <path d={pathD} fill="none" stroke="#2563eb" strokeWidth="2.2" />
              {points.map((p) => (
                <circle
                  key={`circle-${p.label}`}
                  cx={p.x}
                  cy={p.y}
                  r={selectedIdx === p.index ? "4" : "3"}
                  fill="#ffffff"
                  stroke="#2563eb"
                  strokeWidth="2"
                  className="cursor-pointer transition-all"
                  onMouseEnter={() => setSelectedIdx(p.index)}
                />
              ))}
            </svg>
          </>
        )}
      </div>
    </Card>
  );
}
