"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@/components/ui/icons";
import { ApplicationsTable } from "@/features/applications/ApplicationsTable";
import { ApplicationForm } from "@/features/applications/ApplicationForm";
import { ApplicationItem } from "@/lib/types";

export default function ApplicationsPage() {
  const [view, setView] = useState<"list" | "form">("list");
  const [editingApp, setEditingApp] = useState<ApplicationItem | null>(null);
  const [applications, setApplications] = useState<ApplicationItem[]>([]);

  const loadApps = () => {
    fetch("/api/applications")
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setApplications(data))
      .catch(console.error);
  };

  useEffect(() => {
    loadApps();
  }, []);

  const handleSave = async (data: Partial<ApplicationItem>) => {
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        loadApps();
      } else {
        setApplications((prev) => [
          ...prev,
          { ...data, id: `app-${Date.now()}` } as ApplicationItem,
        ]);
      }
    } catch {
      setApplications((prev) => [
        ...prev,
        { ...data, id: `app-${Date.now()}` } as ApplicationItem,
      ]);
    }
    setView("list");
    setEditingApp(null);
  };

  return (
    <AppShell>
      {view === "form" ? (
        <ApplicationForm
          initialData={editingApp}
          onCancel={() => {
            setView("list");
            setEditingApp(null);
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
              setView("form");
            }}
          />
        </div>
      )}
    </AppShell>
  );
}
