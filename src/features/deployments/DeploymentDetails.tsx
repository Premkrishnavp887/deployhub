"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "@/components/ui/icons";
import { StatusBadge, EnvironmentBadge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DeploymentItem } from "@/lib/types";

export function DeploymentDetails({
  deployment,
  onRedeploy,
}: {
  deployment: DeploymentItem;
  onRedeploy?: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Breadcrumbs
          items={[
            { label: "Dashboard", href: "/" },
            { label: "Deployments", href: "/deployments" },
            { label: deployment.displayId || `#${deployment.id}` },
          ]}
        />
        <Link
          href="/deployments"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
        >
          <ArrowLeftIcon className="size-3.5" />
          Back to Deployments
        </Link>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Deployment {deployment.displayId || `#${deployment.id}`}
          </h1>
          <StatusBadge status={deployment.status} />
        </div>
        <Button variant="primary" size="md" onClick={onRedeploy}>
          Re-deploy
        </Button>
      </div>

      <Card padding="p-4 sm:p-5" className="bg-white">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 text-xs">
          <div>
            <span className="block text-[11px] font-medium text-slate-400">Application</span>
            <span className="font-semibold text-slate-900 mt-0.5 block truncate" title={deployment.applicationName}>
              {deployment.applicationName}
            </span>
            <EnvironmentBadge environment={deployment.environment} className="mt-1" />
          </div>

          <div>
            <span className="block text-[11px] font-medium text-slate-400">Image Tag</span>
            <span className="font-mono font-medium text-slate-800 mt-0.5 block">
              {deployment.requestedTag}
            </span>
          </div>

          <div>
            <span className="block text-[11px] font-medium text-slate-400">Branch</span>
            <span className="font-mono text-slate-700 mt-0.5 block">
              {deployment.branch}
            </span>
          </div>

          <div>
            <span className="block text-[11px] font-medium text-slate-400">Commit</span>
            <span className="font-mono text-slate-700 mt-0.5 block">
              {deployment.commitSha || "—"}
            </span>
          </div>

          <div>
            <span className="block text-[11px] font-medium text-slate-400">Started At</span>
            <span className="text-slate-700 mt-0.5 block whitespace-nowrap">
              {deployment.startedAt || deployment.createdAt}
            </span>
          </div>

          <div>
            <span className="block text-[11px] font-medium text-slate-400">Duration</span>
            <span className="font-semibold text-slate-900 mt-0.5 block">
              {deployment.durationFormatted || "—"}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
