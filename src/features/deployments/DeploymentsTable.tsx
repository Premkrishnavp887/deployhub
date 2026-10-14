"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FilterBar } from "@/components/ui/filter-bar";
import { EmptyState } from "@/components/ui/empty-state";
import { MoreVerticalIcon, DeploymentsIcon } from "@/components/ui/icons";
import { StatusBadge, EnvironmentBadge } from "@/components/ui/badge";
import { DeploymentItem } from "@/lib/types";

type TabType = "ALL" | "RUNNING" | "SUCCESS" | "FAILURE" | "ABORTED";

export function DeploymentsTable({
  deployments,
}: {
  deployments: DeploymentItem[];
}) {
  const [currentTab, setCurrentTab] = useState<TabType>("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = deployments.filter((d) => {
    const matchesTab =
      currentTab === "ALL"
        ? true
        : currentTab === "SUCCESS"
        ? d.status === "SUCCESS"
        : currentTab === "FAILURE"
        ? d.status === "FAILURE"
        : currentTab === "RUNNING"
        ? d.status === "RUNNING"
        : d.status === "ABORTED";

    const matchesSearch =
      d.applicationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.requestedTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.environment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.displayId && d.displayId.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesTab && matchesSearch;
  });

  const tabs: { key: TabType; label: string }[] = [
    { key: "ALL", label: "All Deployments" },
    { key: "RUNNING", label: "Running" },
    { key: "SUCCESS", label: "Successful" },
    { key: "FAILURE", label: "Failed" },
    { key: "ABORTED", label: "Cancelled" },
  ];

  return (
    <div className="space-y-3.5">
      {/* Status tabs */}
      <div className="flex border-b border-slate-200 gap-1 overflow-x-auto text-xs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setCurrentTab(tab.key)}
            className={`px-3.5 py-2 font-medium transition-colors border-b-2 whitespace-nowrap ${
              currentTab === tab.key
                ? "border-blue-600 text-blue-600 font-semibold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search deployments..."
      />

      {filtered.length === 0 ? (
        <EmptyState
          icon={<DeploymentsIcon className="size-6" />}
          title="No deployments found"
          description="No deployments matched the current status filter and search term."
          actionLabel="Show all deployments"
          onAction={() => {
            setCurrentTab("ALL");
            setSearchTerm("");
          }}
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200/80 bg-white shadow-2xs">
          <table className="w-full min-w-[700px] text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 pl-5 pr-2">#</th>
                <th className="py-3 px-3">Application</th>
                <th className="py-3 px-3">Environment</th>
                <th className="py-3 px-3">Image Tag</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Duration</th>
                <th className="py-3 px-3">Deployed At</th>
                <th className="py-3 pl-2 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 pl-5 pr-2 font-mono font-medium text-slate-500">
                    <Link href={`/deployments/${d.id}`} className="hover:text-blue-600">
                      {d.displayId || `#${d.id}`}
                    </Link>
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-slate-900">
                    <Link href={`/deployments/${d.id}`} className="hover:text-blue-600">
                      {d.applicationName}
                    </Link>
                  </td>
                  <td className="py-3.5 px-3">
                    <EnvironmentBadge environment={d.environment} />
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-600">
                    {d.requestedTag}
                  </td>
                  <td className="py-3.5 px-3">
                    <StatusBadge status={d.status} />
                  </td>
                  <td className="py-3.5 px-3 text-slate-600">
                    {d.durationFormatted || (d.durationSeconds ? `${d.durationSeconds}s` : "—")}
                  </td>
                  <td className="py-3.5 px-3 text-slate-500 text-[11px] whitespace-nowrap">
                    {d.createdAt}
                  </td>
                  <td className="py-3.5 pl-2 pr-5 text-right">
                    <Link
                      href={`/deployments/${d.id}`}
                      className="inline-flex rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                      title="View details & logs"
                    >
                      <MoreVerticalIcon className="size-4" />
                    </Link>
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
