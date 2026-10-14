"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";

export default function MonitoringPage() {
  return (
    <AppShell>
      <div className="space-y-5">
        <PageHeader
          title="Monitoring & Health"
          subtitle="Real-time server resource utilization and container health observability"
          badge={
            <span className="rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-[10px] font-medium text-slate-600">
              Telemetry Preview (Phase 1)
            </span>
          }
        />

        <div className="rounded-lg border border-blue-200 bg-blue-50/70 p-3 text-xs text-blue-800">
          <strong>Notice:</strong> Host metrics below represent sample layout structure. Live agent daemon telemetry collection will be wired during Phase 2.
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: "Office Server (AI)", ip: "192.168.11.112", cpu: "14%", mem: "42%", uptime: "99.98%" },
            { name: "Production Server", ip: "95.216.49.99", cpu: "28%", mem: "61%", uptime: "100.0%" },
            { name: "Staging Server", ip: "192.168.11.120", cpu: "8%", mem: "35%", uptime: "99.95%" },
          ].map((srv) => (
            <Card key={srv.name} padding="p-4" className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-slate-900">{srv.name}</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                  <span className="size-1.5 rounded-full bg-emerald-500" /> Healthy
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-400">{srv.ip}</div>
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">CPU</span>
                  <span className="font-medium text-slate-700">{srv.cpu}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">RAM</span>
                  <span className="font-medium text-slate-700">{srv.mem}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Uptime</span>
                  <span className="font-medium text-emerald-600">{srv.uptime}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
