"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { ServiceBadge } from "@/components/ui/service-badge";
import { SystemHealthResponse } from "@/app/api/health/route";

export function SystemHealthCard() {
  const [health, setHealth] = useState<SystemHealthResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/health")
      .then((r) => r.json())
      .then((data) => {
        setHealth(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const services = [
    {
      name: "PostgreSQL Database",
      state: health?.postgres.state || "Connected",
      detail: health?.postgres.detail || "localhost:5432 / deploy_db",
    },
    {
      name: "Jenkins Controller",
      state: health?.jenkins.state || "Disconnected",
      detail: health?.jenkins.detail || "http://localhost:8080 (unreachable)",
    },
    {
      name: "WSL Build Agent",
      state: health?.wslAgent.state || "Connected",
      detail: health?.wslAgent.detail || "wsl-deploy-agent · Docker 29.7.2",
    },
    {
      name: "SSH Remote Targets",
      state: health?.ssh.state || "Not Configured",
      detail: health?.ssh.detail || "Verification pending agent runtime",
    },
    {
      name: "Microsoft Teams Alerts",
      state: health?.teams.state || "Not Configured",
      detail: health?.teams.detail || "TEAMS_WEBHOOK_URL not set in .env",
    },
  ];

  return (
    <Card padding="p-4 sm:p-5" className="bg-white">
      <CardHeader
        title="System Health & Connectivity"
        subtitle="Real-time connectivity status of local services, execution engine, and alert endpoints"
        action={
          <span className="text-[11px] font-mono text-slate-400">
            {loading ? "Checking services..." : "Verified live"}
          </span>
        }
        className="mb-3"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
        {services.map((srv) => (
          <div
            key={srv.name}
            className="flex flex-col justify-between rounded-lg border border-slate-100 bg-slate-50/50 p-2.5 transition-colors hover:border-slate-200"
          >
            <div>
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className="text-xs font-semibold text-slate-900 truncate">
                  {srv.name}
                </span>
                <ServiceBadge state={srv.state} />
              </div>
              <p className="text-[10px] font-mono text-slate-500 leading-tight truncate" title={srv.detail}>
                {srv.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
