import React from "react";
import { EnvironmentType, DeploymentStatusType } from "@/lib/types";

export function StatusBadge({
  status,
  className = "",
}: {
  status: "Active" | "Disabled" | DeploymentStatusType | "Online" | "Offline";
  className?: string;
}) {
  switch (status) {
    case "Active":
    case "SUCCESS":
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ${className}`}
        >
          <span className="size-1.5 rounded-full bg-emerald-500" />
          {status === "SUCCESS" ? "Success" : "Active"}
        </span>
      );
    case "Online":
      return (
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 ${className}`}
        >
          <span className="size-2 rounded-full bg-emerald-500" />
          Online
        </span>
      );
    case "Disabled":
    case "FAILURE":
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-xs font-medium text-rose-700 ${className}`}
        >
          <span className="size-1.5 rounded-full bg-rose-500" />
          {status === "FAILURE" ? "Failed" : "Disabled"}
        </span>
      );
    case "RUNNING":
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ${className}`}
        >
          <span className="size-1.5 animate-pulse rounded-full bg-blue-600" />
          Running
        </span>
      );
    case "ABORTED":
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 ${className}`}
        >
          <span className="size-1.5 rounded-full bg-slate-400" />
          Cancelled
        </span>
      );
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 ${className}`}
        >
          <span className="size-1.5 rounded-full bg-amber-500" />
          Queued
        </span>
      );
  }
}

export function EnvironmentBadge({
  environment,
  className = "",
}: {
  environment: EnvironmentType;
  className?: string;
}) {
  switch (environment) {
    case "PRODUCTION":
      return (
        <span
          className={`inline-flex items-center rounded-md border border-rose-200/80 bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-600 ${className}`}
        >
          Production
        </span>
      );
    case "STAGING":
      return (
        <span
          className={`inline-flex items-center rounded-md border border-blue-200/80 bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600 ${className}`}
        >
          Staging
        </span>
      );
    case "DEVELOPMENT":
      return (
        <span
          className={`inline-flex items-center rounded-md border border-purple-200/80 bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-600 ${className}`}
        >
          Development
        </span>
      );
    default:
      return (
        <span
          className={`inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600 ${className}`}
        >
          Other
        </span>
      );
  }
}
