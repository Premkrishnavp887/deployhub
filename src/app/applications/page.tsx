"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@/components/ui/icons";
import { ApplicationsTable } from "@/features/applications/ApplicationsTable";
import { ApplicationForm } from "@/features/applications/ApplicationForm";
import { ErrorAlert } from "@/components/ui/error-alert";
import { ApplicationItem } from "@/lib/types";

export default function ApplicationsPage() {
  const [view, setView] = useState<"list" | "form">("list");
  const [editingApp, setEditingApp] = useState<ApplicationItem | null>(null);
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadApps = useCallback(() => {
    fetch("/api/applications")
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setApplications(data))
      .catch((err) => console.error("Failed to load applications:", err));
  }, []);

  useEffect(() => {
    loadApps();
  }, [loadApps]);

  const handleSave = async (data: Partial<ApplicationItem>): Promise<boolean> => {
    setErrorMessage(null);
    const isEdit = Boolean(editingApp?.id);
    const url = isEdit ? `/api/applications/${editingApp?.id}` : "/api/applications";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const body = await res.json();
    if (!res.ok) {
      const errorText = body.error || "Failed to save application.";
      setErrorMessage(errorText);
      throw new Error(errorText);
    }

    loadApps();
    setView("list");
    setEditingApp(null);
    return true;
  };

  const handleDelete = async (app: ApplicationItem) => {
    setErrorMessage(null);
    try {
      const res = await fetch(`/api/applications/${app.id}`, { method: "DELETE" });
      const body = await res.json();
      if (!res.ok) {
        setErrorMessage(body.error || `Failed to delete application "${app.name}".`);
        return;
      }
      loadApps();
    } catch {
      setErrorMessage(`Failed to delete application "${app.name}".`);
    }
  };

  return (
    <AppShell>
      {errorMessage && (
        <ErrorAlert message={errorMessage} onDismiss={() => setErrorMessage(null)} />
      )}

      {view === "form" ? (
        <ApplicationForm
          initialData={editingApp}
          serverError={errorMessage}
          onCancel={() => {
            setView("list");
            setEditingApp(null);
            setErrorMessage(null);
          }}
          onSave={handleSave}
        />
      ) : (
        <div className="space-y-4">
          <PageHeader
            title="Applications"
            subtitle="Manage your registered applications and local project directories"
            action={
              <Button
                variant="primary"
                size="md"
                icon={<PlusIcon className="size-4" />}
                onClick={() => {
                  setEditingApp(null);
                  setErrorMessage(null);
                  setView("form");
                }}
              >
                Add Application
              </Button>
            }
          />

          <ApplicationsTable
            applications={applications}
            onEdit={(app) => {
              setEditingApp(app);
              setErrorMessage(null);
              setView("form");
            }}
            onDelete={handleDelete}
          />
        </div>
      )}
    </AppShell>
  );
}
