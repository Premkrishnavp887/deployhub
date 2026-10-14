"use client";

import React, { useState } from "react";
import { FilterBar } from "@/components/ui/filter-bar";
import { EmptyState } from "@/components/ui/empty-state";
import { MoreVerticalIcon, ApplicationsIcon } from "@/components/ui/icons";
import { StatusBadge } from "@/components/ui/badge";
import { ApplicationItem } from "@/lib/types";

export function ApplicationsTable({
  applications,
  onEdit,
}: {
  applications: ApplicationItem[];
  onEdit?: (app: ApplicationItem) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");

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
                    <button
                      onClick={() => onEdit?.(app)}
                      className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                      title="Edit application"
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
