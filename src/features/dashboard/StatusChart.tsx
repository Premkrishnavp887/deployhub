import React from "react";
import { Card } from "@/components/ui/card";

interface StatusCounts {
  successful: number;
  failed: number;
  running: number;
  cancelled: number;
}

interface StatusChartProps {
  counts?: StatusCounts | null;
  isLoading?: boolean;
}

export function StatusChart({ counts, isLoading = false }: StatusChartProps) {
  const hasData = counts !== null && counts !== undefined;
  const rawItems = [
    { label: "Successful", count: counts?.successful ?? 0, color: "bg-emerald-500", stroke: "#10b981" },
    { label: "Failed", count: counts?.failed ?? 0, color: "bg-rose-500", stroke: "#ef4444" },
    { label: "Running", count: counts?.running ?? 0, color: "bg-blue-600", stroke: "#2563eb" },
    { label: "Cancelled", count: counts?.cancelled ?? 0, color: "bg-slate-400", stroke: "#94a3b8" },
  ];

  const total = hasData ? rawItems.reduce((acc, item) => acc + item.count, 0) : 0;

  // Dynamic percentage calculation with safe division-by-zero handling
  const items = rawItems.map((item) => {
    const percent = total > 0 ? Math.round((item.count / total) * 100) : 0;
    return { ...item, percent };
  });

  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPercent = 0;

  return (
    <Card padding="p-4 sm:p-5" className="flex flex-col justify-between min-h-[260px]">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-bold text-slate-900">Deployment Status</h2>
        <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 shadow-2xs">
          <span>Last 30 days</span>
          <span className="text-[10px] text-slate-400">▼</span>
        </button>
      </div>

      <div className="flex flex-row items-center justify-around gap-6 my-auto pt-2">
        <div className="relative flex items-center justify-center shrink-0">
          <svg className="size-32 -rotate-90">
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="#f1f5f9"
              strokeWidth="12"
              fill="transparent"
            />
            {total > 0 &&
              items.map((item) => {
                const dasharray = (item.percent / 100) * circumference;
                const dashoffset = -((accumulatedPercent / 100) * circumference);
                accumulatedPercent += item.percent;

                return (
                  <circle
                    key={item.label}
                    cx="64"
                    cy="64"
                    r={radius}
                    stroke={item.stroke}
                    strokeWidth="12"
                    strokeDasharray={`${dasharray} ${circumference}`}
                    strokeDashoffset={dashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-300"
                  />
                );
              })}
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-bold tracking-tight text-slate-900 leading-none">
              {hasData && total > 0 ? total : "—"}
            </span>
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mt-0.5">
              Total
            </span>
          </div>
        </div>

        <div className="w-full max-w-[240px] space-y-2">
          {!hasData || total === 0 ? (
            <div className="py-4 text-center">
              <span className="text-xs font-medium text-slate-400">
                {isLoading ? "Loading deployment status..." : "No deployment status data yet"}
              </span>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.label} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={`size-2 rounded-full ${item.color}`} />
                  <span className="text-slate-700 font-medium">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900">{item.count}</span>
                  <span className="text-xs text-slate-400 w-8 text-right">{item.percent}%</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
}
