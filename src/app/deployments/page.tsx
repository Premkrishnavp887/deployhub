"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@/components/ui/icons";
import { DeploymentsTable } from "@/features/deployments/DeploymentsTable";
import { NewDeploymentModal } from "@/features/deployments/NewDeploymentModal";
import { DeploymentItem } from "@/lib/types";

export default function DeploymentsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [deployments, setDeployments] = useState<DeploymentItem[]>([]);

  const loadDeployments = () => {
    fetch("/api/deployments")
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setDeployments(data))
      .catch(console.error);
  };

  useEffect(() => {
    loadDeployments();
  }, []);

  return (
    <AppShell>
      <div className="space-y-4">
        <PageHeader
          title="Deployments"
          subtitle="Trigger and monitor application deployments across registered servers"
          action={
            <Button
              variant="primary"
              size="md"
              icon={<PlusIcon className="size-4" />}
              onClick={() => setModalOpen(true)}
            >
              New Deployment
            </Button>
          }
        />

        <DeploymentsTable deployments={deployments} />
      </div>

      <NewDeploymentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={loadDeployments}
      />
    </AppShell>
  );
}
