"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";

import { DeploymentItem } from "@/lib/types";

interface TerminalLogsProps {
  logs?: { time: string; msg: string; color?: string }[];
  deployment?: DeploymentItem | null;
}

export function TerminalLogs({ logs = [], deployment }: TerminalLogsProps) {
  const [activeTab, setActiveTab] = useState<"logs" | "details" | "health" | "notifications">("logs");


  return (
    <Card padding="p-0" className="overflow-hidden bg-white">
      {/* Tabs */}
      <div className="flex border-b border-slate-200 px-4 bg-slate-50/60 text-xs">
        {(
          [
            { key: "logs", label: "Logs" },
            { key: "details", label: "Details" },
            { key: "health", label: "Health Check" },
            { key: "notifications", label: "Notifications" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 font-medium transition-colors border-b-2 ${
              activeTab === tab.key
                ? "border-blue-600 text-blue-600 font-semibold bg-white"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-4 sm:p-5">
        {activeTab === "logs" && (
          <div className="rounded-xl bg-[#0f172a] p-4 font-mono text-xs text-slate-200 shadow-inner">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
              <span className="text-slate-400 text-[11px]">Jenkins Build Console · Job: deployhub-deploy</span>
              <span className="inline-flex items-center gap-1 rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400 border border-slate-700 font-sans">
                Console Preview
              </span>
            </div>
            <div className="space-y-1.5 overflow-x-auto leading-relaxed">
              {logs.length === 0 ? (
                <div className="py-8 text-center text-slate-500 font-sans text-xs">
                  No deployment execution logs available yet.
                </div>
              ) : (
                logs.map((log, idx) => (
                  <div key={idx} className="flex gap-4">
                    <span className="text-slate-500 select-none">{log.time}</span>
                    <span className={log.color}>{log.msg}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "details" && (
          <div className="space-y-3 text-xs text-slate-700 py-2">
            {deployment ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="font-semibold text-slate-900 block">Application:</span>
                  <span className="font-mono text-slate-600">{deployment.applicationName}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-900 block">Requested Tag / Branch:</span>
                  <span className="font-mono text-slate-600">
                    {deployment.requestedTag} ({deployment.branch})
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-slate-900 block">Jenkins Build:</span>
                  <span className="font-mono text-slate-600">
                    {deployment.jenkinsBuildNumber ? `#${deployment.jenkinsBuildNumber}` : "Not queued"}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-slate-900 block">Environment:</span>
                  <span className="font-mono text-slate-600">{deployment.environment}</span>
                </div>
              </div>
            ) : (
              <div className="text-slate-400">No deployment details available.</div>
            )}
          </div>
        )}

        {activeTab === "health" && (
          <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 text-xs text-slate-700">
            {deployment?.status === "SUCCESS" ? (
              <div className="text-emerald-800">
                <span className="font-semibold flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  Health check passed
                </span>
                <p className="mt-1 text-[11px] text-emerald-700">Deployment verified healthy.</p>
              </div>
            ) : (
              <div className="text-slate-400">No health check result recorded for this deployment.</div>
            )}
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 text-xs text-slate-700">
            <span className="font-semibold block text-slate-900">Notifications:</span>
            <span className="text-slate-400 mt-1 block">
              No notifications dispatched for this deployment.
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
