import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ChevronRightIcon } from "@/components/ui/icons";
import { AppBadgeIcon } from "@/components/ui/app-badge-icon";
import { ApplicationItem } from "@/lib/types";

export function ApplicationsOverviewCard({
  applications,
}: {
  applications: ApplicationItem[];
}) {
  return (
    <Card padding="p-4 sm:p-5" className="flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-slate-900">Applications</h2>
        <Link
          href="/applications"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          View All <span>&rarr;</span>
        </Link>
      </div>

      <div className="divide-y divide-slate-100 flex-1 flex flex-col justify-between">
        {applications.slice(0, 4).map((app) => {
          const isActive = app.status === "Active";
          return (
            <Link
              key={app.id}
              href="/applications"
              className="group flex items-center justify-between py-2.5 first:pt-0 last:pb-0 hover:bg-slate-50/70 -mx-2 px-2 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <AppBadgeIcon name={app.name} className="size-8" />
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-slate-900 truncate">
                    {app.name}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 truncate max-w-[210px]" title={app.localPath}>
                    {app.localPath}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium ${
                    isActive
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 bg-slate-100 text-slate-500"
                  }`}
                >
                  <span
                    className={`size-1.5 rounded-full ${
                      isActive ? "bg-emerald-500" : "bg-slate-400"
                    }`}
                  />
                  {app.status}
                </span>
                <ChevronRightIcon className="size-3.5 text-slate-300 group-hover:text-slate-500" />
              </div>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
