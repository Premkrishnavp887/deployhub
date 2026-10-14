import React from "react";
import { TrendResult } from "@/lib/trend-utils";

export function TrendIndicator({
  trend,
  className = "",
}: {
  trend: TrendResult;
  className?: string;
}) {
  const { direction, formattedText, isFavorable } = trend;

  let colorClass = "text-slate-400 font-normal";
  if (direction === "up" || direction === "down") {
    colorClass = isFavorable ? "text-emerald-600 font-medium" : "text-rose-600 font-medium";
  } else if (direction === "neutral") {
    colorClass = "text-slate-500 font-medium";
  }

  const renderIcon = () => {
    switch (direction) {
      case "up":
        return <span className="font-bold text-xs">↑</span>;
      case "down":
        return <span className="font-bold text-xs">↓</span>;
      case "neutral":
        return <span className="font-bold text-xs">→</span>;
      default:
        return null;
    }
  };

  return (
    <div className={`inline-flex items-center gap-1 text-xs font-medium ${colorClass} ${className}`}>
      {renderIcon()}
      <span>{formattedText}</span>
    </div>
  );
}
