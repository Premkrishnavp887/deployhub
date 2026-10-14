import React from "react";
import { ServiceState } from "@/app/api/health/route";

export function ServiceBadge({
  state,
  className = "",
}: {
  state: ServiceState;
  className?: string;
}) {
  switch (state) {
    case "Connected":
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 ${className}`}
        >
          <span className="size-1.5 rounded-full bg-emerald-500" />
          Connected
        </span>
      );
    case "Disconnected":
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[11px] font-medium text-rose-700 ${className}`}
        >
          <span className="size-1.5 rounded-full bg-rose-500" />
          Disconnected
        </span>
      );
    case "Not Configured":
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 ${className}`}
        >
          <span className="size-1.5 rounded-full bg-slate-400" />
          Not Configured
        </span>
      );
    case "Unknown":
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 ${className}`}
        >
          <span className="size-1.5 rounded-full bg-amber-500" />
          Unknown
        </span>
      );
  }
}
