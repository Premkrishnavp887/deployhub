"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@/components/ui/icons";
import { ServersTable } from "@/features/servers/ServersTable";
import { ServerForm } from "@/features/servers/ServerForm";
import { ServerItem } from "@/lib/types";

export default function ServersPage() {
  const [view, setView] = useState<"list" | "form">("list");
  const [editingServer, setEditingServer] = useState<ServerItem | null>(null);
  const [servers, setServers] = useState<ServerItem[]>([]);

  const loadServers = () => {
    fetch("/api/servers")
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setServers(data))
      .catch(console.error);
  };

  useEffect(() => {
    loadServers();
  }, []);

  const handleSave = async (data: Partial<ServerItem>) => {
    try {
      const res = await fetch("/api/servers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        loadServers();
      } else {
        setServers((prev) => [
          ...prev,
          { ...data, id: `srv-${Date.now()}` } as ServerItem,
        ]);
      }
    } catch {
      setServers((prev) => [
        ...prev,
        { ...data, id: `srv-${Date.now()}` } as ServerItem,
      ]);
    }
    setView("list");
    setEditingServer(null);
  };

  return (
    <AppShell>
      {view === "form" ? (
        <ServerForm
          initialData={editingServer}
          onCancel={() => {
            setView("list");
            setEditingServer(null);
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
              setView("form");
            }}
          />
        </div>
      )}
    </AppShell>
  );
}
