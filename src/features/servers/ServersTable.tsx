"use client";

import React, { useState } from "react";
import { FilterBar } from "@/components/ui/filter-bar";
import { EmptyState } from "@/components/ui/empty-state";
import { MoreVerticalIcon, ServersIcon } from "@/components/ui/icons";
import { StatusBadge } from "@/components/ui/badge";
import { ServerItem } from "@/lib/types";

export function ServersTable({
  servers,
  onEdit,
}: {
  servers: ServerItem[];
  onEdit?: (server: ServerItem) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = servers.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.host.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.sshUsername.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-3.5">
      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search servers..."
      />

      {filtered.length === 0 ? (
        <EmptyState
          icon={<ServersIcon className="size-6" />}
          title="No servers found"
          description="No remote deployment servers matched your search criteria."
          actionLabel="Clear search"
          onAction={() => setSearchTerm("")}
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200/80 bg-white shadow-2xs">
          <table className="w-full min-w-[650px] text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 pl-5 pr-2">#</th>
                <th className="py-3 px-3">Name</th>
                <th className="py-3 px-3">Host/IP</th>
                <th className="py-3 px-3">SSH Port</th>
                <th className="py-3 px-3">Username</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 pl-2 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.map((srv, index) => (
                <tr key={srv.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 pl-5 pr-2 font-mono text-slate-400">
                    {index + 1}
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-slate-900">
                    {srv.name}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-600 text-xs">
                    {srv.host}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-600">
                    {srv.port}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-600">
                    {srv.sshUsername}
                  </td>
                  <td className="py-3.5 px-3">
                    <StatusBadge status={srv.status} />
                  </td>
                  <td className="py-3.5 pl-2 pr-5 text-right">
                    <button
                      onClick={() => onEdit?.(srv)}
                      className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                      title="Manage server"
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
