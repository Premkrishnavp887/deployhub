"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@/components/ui/icons";
import { MetricCards } from "@/features/dashboard/MetricCards";
import { OverviewChart } from "@/features/dashboard/OverviewChart";
import { StatusChart } from "@/features/dashboard/StatusChart";
import { RecentDeploymentsTable } from "@/features/dashboard/RecentDeploymentsTable";
import { NewDeploymentModal } from "@/features/deployments/NewDeploymentModal";
import { DashboardData } from "@/lib/types";

export default function DashboardPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleRefresh = useCallback(() => {
    setIsLoading(true);
    setError(null);
    fetch("/api/dashboard")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load dashboard data");
        return res.json();
      })
      .then((data: DashboardData) => {
        setDashboardData(data);
        setIsLoading(false);
      })
      .catch(() => {
        setError("Unable to load dashboard data. Please try again.");
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/api/dashboard")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load dashboard data");
        return res.json();
      })
      .then((data: DashboardData) => {
        if (active) {
          setDashboardData(data);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setError("Unable to load dashboard data. Please try again.");
          setIsLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const metrics = dashboardData?.metrics;

  return (
    <AppShell>
      <div className="space-y-4 sm:space-y-5">
        {/* Dashboard Title & Action */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Dashboard
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Overview of your applications, servers and recent deployments
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            icon={<PlusIcon className="size-4" />}
            onClick={() => setModalOpen(true)}
          >
            New Deployment
          </Button>
        </div>

        {/* Error notification banner if API call failed */}
        {error && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={handleRefresh}
              className="underline hover:text-rose-900 font-medium ml-2 cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* 4 Summary Metric Cards in 1 Row */}
        <MetricCards
          appCount={metrics?.appCount ?? (isLoading ? null : 0)}
          serverCount={metrics?.serverCount ?? (isLoading ? null : 0)}
          targetCount={metrics?.targetCount ?? (isLoading ? null : 0)}
          deployCount={metrics?.deployCount ?? (isLoading ? null : 0)}
          onlineServerCount={
            metrics?.onlineServerCount ?? (isLoading ? null : 0)
          }
          activeTargetCount={
            metrics?.activeTargetCount ?? (isLoading ? null : 0)
          }
          prevAppCount={metrics?.prevAppCount ?? null}
          prevDeployCount={metrics?.prevDeployCount ?? null}
        />

        {/* Charts Row */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.25fr_0.75fr]">
          <OverviewChart
            data={dashboardData?.overviewSeries ?? []}
            isLoading={isLoading}
          />
          <StatusChart
            counts={dashboardData?.statusSummary ?? null}
            isLoading={isLoading}
          />
        </div>

        {/* Full-width Recent Deployments Table */}
        <RecentDeploymentsTable
          deployments={dashboardData?.recentDeployments ?? []}
          isLoading={isLoading}
        />
      </div>

      <NewDeploymentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleRefresh}
      />
    </AppShell>
  );
}

