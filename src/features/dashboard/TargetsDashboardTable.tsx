import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { StatusBadge, EnvironmentBadge } from "@/components/ui/badge";
import { MoreVerticalIcon } from "@/components/ui/icons";
import { DeploymentTargetItem } from "@/lib/types";

export function TargetsDashboardTable({
  targets,
}: {
  targets: DeploymentTargetItem[];
}) {
  return (
    <Card padding="p-4 sm:p-5" className="flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-slate-900">Deployment Targets</h2>
        <Link
          href="/targets"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          View All <span>&rarr;</span>
        </Link>
      </div>

      <div className="overflow-x-auto -mx-4 sm:-mx-5">
        <table className="w-full min-w-[540px] text-left border-collapse">
          <thead>
            <tr className="border-y border-slate-100 bg-slate-50/60 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-2.5 pl-4 sm:pl-5 pr-2">#</th>
              <th className="py-2.5 px-2.5">Application</th>
              <th className="py-2.5 px-2">Server</th>
              <th className="py-2.5 px-2">Environment</th>
              <th className="py-2.5 px-2">Deploy Path</th>
              <th className="py-2.5 px-2">Status</th>
              <th className="py-2.5 pl-2 pr-4 sm:pr-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {targets.slice(0, 4).map((tgt, index) => (
              <tr key={tgt.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-2.5 pl-4 sm:pl-5 pr-2 font-mono text-slate-400">
                  {index + 1}
                </td>
                <td className="py-2.5 px-2.5 font-semibold text-slate-900">
                  <Link href="/targets" className="hover:text-blue-600 truncate max-w-[140px] block" title={tgt.applicationName}>
                    {tgt.applicationName}
                  </Link>
                </td>
                <td className="py-2.5 px-2 text-slate-700 truncate max-w-[120px]" title={tgt.serverName}>
                  {tgt.serverName}
                </td>
                <td className="py-2.5 px-2">
                  <EnvironmentBadge environment={tgt.environment} />
                </td>
                <td className="py-2.5 px-2 font-mono text-[11px] text-slate-500 truncate max-w-[130px]" title={tgt.remotePath}>
                  {tgt.remotePath}
                </td>
                <td className="py-2.5 px-2">
                  <StatusBadge status={tgt.enabled ? "Active" : "Disabled"} />
                </td>
                <td className="py-2.5 pl-2 pr-4 sm:pr-5 text-right">
                  <Link href="/targets" className="rounded p-1 text-slate-400 hover:text-slate-600 inline-block">
                    <MoreVerticalIcon className="size-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
