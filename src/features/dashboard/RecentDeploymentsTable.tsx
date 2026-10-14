import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { StatusBadge, EnvironmentBadge } from "@/components/ui/badge";
import { MoreVerticalIcon } from "@/components/ui/icons";
import { AppBadgeIcon } from "@/components/ui/app-badge-icon";
import { DeploymentItem } from "@/lib/types";

interface RecentDeploymentsTableProps {
  deployments: DeploymentItem[];
  isLoading?: boolean;
}

export function RecentDeploymentsTable({
  deployments,
  isLoading = false,
}: RecentDeploymentsTableProps) {
  return (
    <Card padding="p-4 sm:p-5" className="flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-slate-900">Recent Deployments</h2>
        <Link
          href="/deployments"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          View All <span>&rarr;</span>
        </Link>
      </div>

      <div className="overflow-x-auto -mx-4 sm:-mx-5">
        <table className="w-full min-w-[700px] text-left border-collapse">
          <thead>
            <tr className="border-y border-slate-100 bg-slate-50/60 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-2.5 pl-4 sm:pl-5 pr-2">#</th>
              <th className="py-2.5 px-3">Application</th>
              <th className="py-2.5 px-2.5">Environment</th>
              <th className="py-2.5 px-3">Image Tag</th>
              <th className="py-2.5 px-3">Branch</th>
              <th className="py-2.5 px-2.5">Status</th>
              <th className="py-2.5 px-2.5">Duration</th>
              <th className="py-2.5 px-3">Deployed At</th>
              <th className="py-2.5 pl-2 pr-4 sm:pr-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {isLoading ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-xs text-slate-400">
                  Loading deployments...
                </td>
              </tr>
            ) : deployments.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-xs text-slate-400">
                  No deployments yet
                </td>
              </tr>
            ) : (
              deployments.slice(0, 5).map((d) => (
              <tr key={d.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 pl-4 sm:pl-5 pr-2 font-mono font-medium text-slate-500">
                  <Link href={`/deployments/${d.id}`} className="hover:text-blue-600">
                    {d.displayId || `#${d.id}`}
                  </Link>
                </td>
                <td className="py-3 px-3 font-semibold text-slate-900">
                  <div className="flex items-center gap-2.5">
                    <AppBadgeIcon name={d.applicationName} className="size-6" />
                    <Link
                      href={`/deployments/${d.id}`}
                      className="hover:text-blue-600 truncate max-w-[150px]"
                      title={d.applicationName}
                    >
                      {d.applicationName}
                    </Link>
                  </div>
                </td>
                <td className="py-3 px-2.5">
                  <EnvironmentBadge environment={d.environment} />
                </td>
                <td className="py-3 px-3 font-mono text-slate-700 text-xs">
                  {d.requestedTag}
                </td>
                <td className="py-3 px-3 font-mono text-slate-600 text-xs">
                  {d.branch}
                </td>
                <td className="py-3 px-2.5">
                  <StatusBadge status={d.status} />
                </td>
                <td className="py-3 px-2.5 text-slate-600 text-[11px] font-medium">
                  {d.durationFormatted || (d.durationSeconds ? `${d.durationSeconds}s` : "—")}
                </td>
                <td className="py-3 px-3 text-slate-500 text-[11px] whitespace-nowrap">
                  {d.createdAt}
                </td>
                <td className="py-3 pl-2 pr-4 sm:pr-5 text-right">
                  <Link
                    href={`/deployments/${d.id}`}
                    className="inline-flex rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    title="View details"
                  >
                    <MoreVerticalIcon className="size-4" />
                  </Link>
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
