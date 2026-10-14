"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@/components/ui/icons";
import { TargetsTable } from "@/features/targets/TargetsTable";
import { TargetForm } from "@/features/targets/TargetForm";
import {
  DeploymentTargetItem,
  ApplicationItem,
  ServerItem,
} from "@/lib/types";

export default function TargetsPage() {
  const [view, setView] = useState<"list" | "form">("list");
  const [editingTarget, setEditingTarget] = useState<DeploymentTargetItem | null>(null);
  const [targets, setTargets] = useState<DeploymentTargetItem[]>([]);
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [servers, setServers] = useState<ServerItem[]>([]);

  const loadAll = () => {
    fetch("/api/targets")
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setTargets(data))
      .catch(console.error);

    fetch("/api/applications")
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setApplications(data))
      .catch(console.error);

    fetch("/api/servers")
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setServers(data))
      .catch(console.error);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleSave = async (data: Partial<DeploymentTargetItem>) => {
    try {
      const res = await fetch("/api/targets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        loadAll();
      } else {
        setTargets((prev) => [
          ...prev,
          { ...data, id: `tgt-${Date.now()}` } as DeploymentTargetItem,
        ]);
      }
    } catch {
      setTargets((prev) => [
        ...prev,
        { ...data, id: `tgt-${Date.now()}` } as DeploymentTargetItem,
      ]);
    }
    setView("list");
    setEditingTarget(null);
  };

  return (
    <AppShell>
      {view === "form" ? (
        <TargetForm
          applications={applications}
          servers={servers}
          initialData={editingTarget}
          onCancel={() => {
            setView("list");
            setEditingTarget(null);
          }}
          onSave={handleSave}
        />
      ) : (
        <div className="space-y-4">
          <PageHeader
            title="Deployment Targets"
            subtitle="Manage application-deployment targets for each server environment"
            action={
              <Button
                variant="primary"
                size="md"
                icon={<PlusIcon className="size-4" />}
                onClick={() => {
                  setEditingTarget(null);
                  setView("form");
                }}
              >
                Add Target
              </Button>
            }
          />

          <TargetsTable
            targets={targets}
            onEdit={(tgt) => {
              setEditingTarget(tgt);
              setView("form");
            }}
          />
        </div>
      )}
    </AppShell>
  );
}
