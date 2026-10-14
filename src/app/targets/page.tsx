"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@/components/ui/icons";
import { TargetsTable } from "@/features/targets/TargetsTable";
import { TargetForm } from "@/features/targets/TargetForm";
import { ErrorAlert } from "@/components/ui/error-alert";
import { DeploymentTargetItem, ApplicationItem, ServerItem } from "@/lib/types";

export default function TargetsPage() {
  const [view, setView] = useState<"list" | "form">("list");
  const [editingTarget, setEditingTarget] = useState<DeploymentTargetItem | null>(null);
  const [targets, setTargets] = useState<DeploymentTargetItem[]>([]);
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [servers, setServers] = useState<ServerItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadAll = useCallback(() => {
    fetch("/api/targets")
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setTargets(data))
      .catch((err) => console.error("Failed to load targets:", err));

    fetch("/api/applications")
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setApplications(data))
      .catch((err) => console.error("Failed to load applications:", err));

    fetch("/api/servers")
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setServers(data))
      .catch((err) => console.error("Failed to load servers:", err));
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleSave = async (data: Partial<DeploymentTargetItem>): Promise<boolean> => {
    setErrorMessage(null);
    const isEdit = Boolean(editingTarget?.id);
    const url = isEdit ? `/api/targets/${editingTarget?.id}` : "/api/targets";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const body = await res.json();
    if (!res.ok) {
      const errorText = body.error || "Failed to save deployment target.";
      setErrorMessage(errorText);
      throw new Error(errorText);
    }

    loadAll();
    setView("list");
    setEditingTarget(null);
    return true;
  };

  const handleToggle = async (target: DeploymentTargetItem, enabled: boolean) => {
    setErrorMessage(null);
    try {
      const res = await fetch(`/api/targets/${target.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled }),
      });
      if (!res.ok) {
        const body = await res.json();
        setErrorMessage(body.error || "Failed to update target status.");
        return;
      }
      loadAll();
    } catch {
      setErrorMessage("Failed to update target status.");
    }
  };

  const handleDelete = async (target: DeploymentTargetItem) => {
    setErrorMessage(null);
    try {
      const res = await fetch(`/api/targets/${target.id}`, { method: "DELETE" });
      const body = await res.json();
      if (!res.ok) {
        setErrorMessage(body.error || `Failed to delete target "${target.name}".`);
        return;
      }
      loadAll();
    } catch {
      setErrorMessage(`Failed to delete target "${target.name}".`);
    }
  };

  return (
    <AppShell>
      {errorMessage && (
        <ErrorAlert message={errorMessage} onDismiss={() => setErrorMessage(null)} />
      )}

      {view === "form" ? (
        <TargetForm
          applications={applications}
          servers={servers}
          initialData={editingTarget}
          serverError={errorMessage}
          onCancel={() => {
            setView("list");
            setEditingTarget(null);
            setErrorMessage(null);
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
                  setErrorMessage(null);
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
              setErrorMessage(null);
              setView("form");
            }}
            onToggleEnabled={handleToggle}
            onDelete={handleDelete}
          />
        </div>
      )}
    </AppShell>
  );
}
