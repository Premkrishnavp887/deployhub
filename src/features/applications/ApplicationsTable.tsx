"use client";

import React, { useState } from "react";
import { FilterBar } from "@/components/ui/filter-bar";
import { EmptyState } from "@/components/ui/empty-state";
import { ApplicationsIcon } from "@/components/ui/icons";
import { StatusBadge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ApplicationItem } from "@/lib/types";

export function ApplicationsTable({
  applications,
  onEdit,
  onDelete,
}: {
  applications: ApplicationItem[];
  onEdit?: (app: ApplicationItem) => void;
  onDelete?: (app: ApplicationItem) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingApp, setDeletingApp] = useState<ApplicationItem | null>(null);

  const filtered = applications.filter(
    (a) =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.localPath.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.imageName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-3.5">
      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search applications..."
      />

      {filtered.length === 0 ? (
        <EmptyState
          icon={<ApplicationsIcon className="size-6" />}
          title="No applications found"
          description="No registered applications matched your search criteria."
          actionLabel="Clear search"
          onAction={() => setSearchTerm("")}
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200/80 bg-white shadow-2xs">
          <table className="w-full min-w-[700px] text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 pl-5 pr-2">#</th>
                <th className="py-3 px-3">Name</th>
                <th className="py-3 px-3">Project Path</th>
                <th className="py-3 px-3">Default Branch</th>
                <th className="py-3 px-3">Image Name</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 pl-2 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.map((app, index) => (
                <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 pl-5 pr-2 font-mono text-slate-400">
                    {index + 1}
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-slate-900">
                    {app.name}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-500 text-[11px]">
                    {app.localPath}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-600">
                    {app.defaultBranch}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-500 text-[11px]">
                    {app.imageName}
                  </td>
                  <td className="py-3.5 px-3">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="py-3.5 pl-2 pr-5 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => onEdit?.(app)}
                        className="rounded px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeletingApp(app)}
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

      {deletingApp && (
        <ConfirmDialog
          isOpen={Boolean(deletingApp)}
          onClose={() => setDeletingApp(null)}
          onConfirm={() => {
            if (deletingApp) {
              onDelete?.(deletingApp);
              setDeletingApp(null);
            }
          }}
          title="Delete Application"
          description={`Are you sure you want to delete application "${deletingApp.name}"? If it is referenced by deployment targets or deployment history, deletion will be safely rejected.`}
          confirmLabel="Delete Application"
          variant="danger"
        />
      )}
    </div>
  );
}
