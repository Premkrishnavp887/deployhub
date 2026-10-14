"use client";

import React, { useState, useEffect, use } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { DeploymentDetails } from "@/features/deployments/DeploymentDetails";
import { TerminalLogs } from "@/features/deployments/TerminalLogs";
import { NewDeploymentModal } from "@/features/deployments/NewDeploymentModal";
import { DeploymentItem } from "@/lib/types";
import Link from "next/link";
import { ArrowLeftIcon } from "@/components/ui/icons";

export default function DeploymentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [modalOpen, setModalOpen] = useState(false);
  const [deployment, setDeployment] = useState<DeploymentItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/deployments")
      .then((r) => r.json())
      .then((list: DeploymentItem[]) => {
        if (Array.isArray(list)) {
          const found = list.find(
            (d) => d.id === resolvedParams.id || d.displayId === `#${resolvedParams.id}`
          );
          if (found) setDeployment(found);
        }
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [resolvedParams.id]);

  return (
    <AppShell>
      {isLoading ? (
        <div className="py-12 text-center text-xs text-slate-400">
          Loading deployment details...
        </div>
      ) : !deployment ? (
        <div className="py-12 text-center space-y-3">
          <p className="text-sm font-semibold text-slate-700">Deployment not found</p>
          <Link
            href="/deployments"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            <ArrowLeftIcon className="size-3.5" />
            Back to Deployments
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <DeploymentDetails
            deployment={deployment}
            onRedeploy={() => setModalOpen(true)}
          />
          <TerminalLogs />
        </div>
      )}

      <NewDeploymentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </AppShell>
  );
}
