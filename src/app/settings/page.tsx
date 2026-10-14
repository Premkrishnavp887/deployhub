"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="space-y-5 max-w-4xl">
        <PageHeader
          title="Settings & System Topology"
          subtitle="Local WSL2 host parameters, execution agent definition, and database binding"
          badge={
            <span className="rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-[10px] font-medium text-slate-600">
              Host Configuration
            </span>
          }
        />

        <Card padding="p-5" className="space-y-4">
          <h2 className="text-sm font-semibold text-slate-900">WSL2 Deployment Agent Engine</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700">
            <div className="rounded-lg bg-slate-50 border border-slate-100 p-3">
              <span className="font-semibold text-slate-900 block">Agent Label:</span>
              <span className="font-mono text-slate-600">wsl-deploy-agent</span>
            </div>
            <div className="rounded-lg bg-slate-50 border border-slate-100 p-3">
              <span className="font-semibold text-slate-900 block">Project Source Root:</span>
              <span className="font-mono text-slate-600">/home/prem</span>
            </div>
            <div className="rounded-lg bg-slate-50 border border-slate-100 p-3">
              <span className="font-semibold text-slate-900 block">PostgreSQL Database:</span>
              <span className="font-mono text-slate-600">localhost:5432 / deploy_db</span>
            </div>
            <div className="rounded-lg bg-slate-50 border border-slate-100 p-3">
              <span className="font-semibold text-slate-900 block">Docker Daemon:</span>
              <span className="font-mono text-slate-600">Docker 29.7.2 native socket</span>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3 text-xs text-slate-600">
            <strong>Execution Model:</strong> Deployments are orchestrated through Jenkins targeting the local WSL2 inbound agent, avoiding fragile controller socket mounts and keeping developer credentials secure.
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
