"use client";

import React, { useState } from "react";
import { FilterBar } from "@/components/ui/filter-bar";
import { EmptyState } from "@/components/ui/empty-state";
import { MoreVerticalIcon, TargetsIcon } from "@/components/ui/icons";
import { StatusBadge, EnvironmentBadge } from "@/components/ui/badge";
import { DeploymentTargetItem } from "@/lib/types";

export function TargetsTable({
  targets,
  onEdit,
}: {
  targets: DeploymentTargetItem[];
  onEdit?: (target: DeploymentTargetItem) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = targets.filter(
    (t) =>
      t.applicationName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.serverName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.remotePath.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.environment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-3.5">
      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search targets..."
      />

      {filtered.length === 0 ? (
        <EmptyState
          icon={<TargetsIcon className="size-6" />}
          title="No deployment targets found"
          description="No application-to-server targets matched your search criteria."
          actionLabel="Clear search"
          onAction={() => setSearchTerm("")}
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200/80 bg-white shadow-2xs">
          <table className="w-full min-w-[700px] text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 pl-5 pr-2">#</th>
                <th className="py-3 px-3">Application</th>
                <th className="py-3 px-3">Server</th>
                <th className="py-3 px-3">Environment</th>
                <th className="py-3 px-3">Deploy Path</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 pl-2 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.map((tgt, index) => (
                <tr key={tgt.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 pl-5 pr-2 font-mono text-slate-400">
                    {index + 1}
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-slate-900">
                    {tgt.applicationName}
                  </td>
                  <td className="py-3.5 px-3 text-slate-700">
                    {tgt.serverName}
                  </td>
                  <td className="py-3.5 px-3">
                    <EnvironmentBadge environment={tgt.environment} />
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-500 text-[11px]">
                    {tgt.remotePath}
                  </td>
                  <td className="py-3.5 px-3">
                    <StatusBadge status={tgt.enabled ? "Active" : "Disabled"} />
                  </td>
                  <td className="py-3.5 pl-2 pr-5 text-right">
                    <button
                      onClick={() => onEdit?.(tgt)}
                      className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                      title="Manage target"
                    >
                      <MoreVerticalIcon className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
