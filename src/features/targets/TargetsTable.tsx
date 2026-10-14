"use client";

import React, { useState } from "react";
import { FilterBar } from "@/components/ui/filter-bar";
import { EmptyState } from "@/components/ui/empty-state";
import { TargetsIcon } from "@/components/ui/icons";
import { StatusBadge, EnvironmentBadge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DeploymentTargetItem } from "@/lib/types";

export function TargetsTable({
  targets,
  onEdit,
  onDelete,
  onToggleEnabled,
}: {
  targets: DeploymentTargetItem[];
  onEdit?: (target: DeploymentTargetItem) => void;
  onDelete?: (target: DeploymentTargetItem) => void;
  onToggleEnabled?: (target: DeploymentTargetItem, enabled: boolean) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingTarget, setDeletingTarget] = useState<DeploymentTargetItem | null>(null);

  const filtered = targets.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
                <th className="py-3 px-3">Target / Application</th>
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
                  <td className="py-3.5 px-3">
                    <span className="font-semibold text-slate-900 block">{tgt.name}</span>
                    <span className="text-[11px] text-slate-500">{tgt.applicationName}</span>
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
                    <button
                      type="button"
                      onClick={() => onToggleEnabled?.(tgt, !tgt.enabled)}
                      className="cursor-pointer"
                      title={tgt.enabled ? "Click to disable" : "Click to enable"}
                    >
                      <StatusBadge status={tgt.enabled ? "Active" : "Disabled"} />
                    </button>
                  </td>
                  <td className="py-3.5 pl-2 pr-5 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => onEdit?.(tgt)}
                        className="rounded px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeletingTarget(tgt)}
                        className="rounded px-2 py-1 text-xs text-rose-600 hover:bg-rose-50 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {deletingTarget && (
        <ConfirmDialog
          isOpen={Boolean(deletingTarget)}
          onClose={() => setDeletingTarget(null)}
          onConfirm={() => {
            if (deletingTarget) {
              onDelete?.(deletingTarget);
              setDeletingTarget(null);
            }
          }}
          title="Delete Deployment Target"
          description={`Are you sure you want to delete target "${deletingTarget.name}"? If it is referenced by deployment history, deletion will be safely rejected.`}
          confirmLabel="Delete Target"
          variant="danger"
        />
      )}
    </div>
  );
}
