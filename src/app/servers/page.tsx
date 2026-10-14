"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@/components/ui/icons";
import { ServersTable } from "@/features/servers/ServersTable";
import { ServerForm } from "@/features/servers/ServerForm";
import { ErrorAlert } from "@/components/ui/error-alert";
import { ServerItem } from "@/lib/types";

export default function ServersPage() {
  const [view, setView] = useState<"list" | "form">("list");
  const [editingServer, setEditingServer] = useState<ServerItem | null>(null);
  const [servers, setServers] = useState<ServerItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadServers = useCallback(() => {
    fetch("/api/servers")
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setServers(data))
      .catch((err) => console.error("Failed to load servers:", err));
  }, []);

  useEffect(() => {
    loadServers();
  }, [loadServers]);

  const handleSave = async (data: Partial<ServerItem>): Promise<boolean> => {
    setErrorMessage(null);
    const isEdit = Boolean(editingServer?.id);
    const url = isEdit ? `/api/servers/${editingServer?.id}` : "/api/servers";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const body = await res.json();
    if (!res.ok) {
      const errorText = body.error || "Failed to save server.";
      setErrorMessage(errorText);
      throw new Error(errorText);
    }

    loadServers();
    setView("list");
    setEditingServer(null);
    return true;
  };

  const handleDelete = async (srv: ServerItem) => {
    setErrorMessage(null);
    try {
      const res = await fetch(`/api/servers/${srv.id}`, { method: "DELETE" });
      const body = await res.json();
      if (!res.ok) {
        setErrorMessage(body.error || `Failed to delete server "${srv.name}".`);
        return;
      }
      loadServers();
    } catch {
      setErrorMessage(`Failed to delete server "${srv.name}".`);
    }
  };

  return (
    <AppShell>
      {errorMessage && (
        <ErrorAlert message={errorMessage} onDismiss={() => setErrorMessage(null)} />
      )}

      {view === "form" ? (
        <ServerForm
          initialData={editingServer}
          serverError={errorMessage}
          onCancel={() => {
            setView("list");
            setEditingServer(null);
            setErrorMessage(null);
          }}
          onSave={handleSave}
        />
      ) : (
        <div className="space-y-4">
          <PageHeader
            title="Servers"
            subtitle="Manage your remote deployment servers and host authentication"
            action={
              <Button
                variant="primary"
                size="md"
                icon={<PlusIcon className="size-4" />}
                onClick={() => {
                  setEditingServer(null);
                  setErrorMessage(null);
                  setView("form");
                }}
              >
                Add Server
              </Button>
            }
          />

          <ServersTable
            servers={servers}
            onEdit={(srv) => {
              setEditingServer(srv);
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
