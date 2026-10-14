"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeftIcon } from "@/components/ui/icons";
import {
  DeploymentTargetItem,
  ApplicationItem,
  ServerItem,
  EnvironmentType,
} from "@/lib/types";

export function TargetForm({
  applications,
  servers,
  onCancel,
  onSave,
  initialData,
}: {
  applications: ApplicationItem[];
  servers: ServerItem[];
  onCancel: () => void;
  onSave: (data: Partial<DeploymentTargetItem>) => void;
  initialData?: DeploymentTargetItem | null;
}) {
  const [applicationId, setApplicationId] = useState(
    initialData?.applicationId || (applications[0]?.id ?? "")
  );
  const [serverId, setServerId] = useState(
    initialData?.serverId || (servers[0]?.id ?? "")
  );
  const [environment, setEnvironment] = useState<EnvironmentType>(
    initialData?.environment || "DEVELOPMENT"
  );
  const [remotePath, setRemotePath] = useState(
    initialData?.remotePath || "/home/ai/deploy/"
  );
  const [composeFile, setComposeFile] = useState(
    initialData?.composeFile || "docker-compose.yml"
  );
  const [tagEnvVar, setTagEnvVar] = useState(initialData?.tagEnvVar || "tag");
  const [enabled, setEnabled] = useState(initialData ? initialData.enabled : true);
  const [requireApproval, setRequireApproval] = useState(
    initialData?.requireApproval || false
  );
  const [autoHealthCheck, setAutoHealthCheck] = useState(
    initialData?.autoHealthCheck ?? true
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicationId || !serverId || !remotePath.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    const app = applications.find((a) => a.id === applicationId);
    const srv = servers.find((s) => s.id === serverId);

    setLoading(true);
    onSave({
      name: `${app?.name || "App"} - ${environment}`,
      applicationId,
      applicationName: app?.name,
      serverId,
      serverName: srv?.name,
      environment,
      remotePath,
      composeFile,
      tagEnvVar,
      enabled,
      requireApproval,
      autoHealthCheck,
    });
  };

  return (
    <div className="space-y-4 max-w-4xl">
      <button
        onClick={onCancel}
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
      >
        <ArrowLeftIcon className="size-3.5" />
        Back
      </button>

      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          {initialData ? "Edit Deployment Target" : "Add Deployment Target"}
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure a deployment target for an application on a remote host
        </p>
      </div>

      <Card padding="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Select
              label="Application"
              required
              value={applicationId}
              onChange={(e) => setApplicationId(e.target.value)}
              options={applications.map((a) => ({ value: a.id, label: a.name }))}
            />
            <Input
              label="Docker Compose File"
              value={composeFile}
              onChange={(e) => setComposeFile(e.target.value)}
              placeholder="docker-compose.yml"
            />
            <Select
              label="Server"
              required
              value={serverId}
              onChange={(e) => setServerId(e.target.value)}
              options={servers.map((s) => ({ value: s.id, label: s.name }))}
            />
            <Input
              label="Tag Environment Variable"
              value={tagEnvVar}
              onChange={(e) => setTagEnvVar(e.target.value)}
              placeholder="tag"
            />
            <Select
              label="Environment"
              value={environment}
              onChange={(e) => setEnvironment(e.target.value as EnvironmentType)}
              options={[
                { value: "DEVELOPMENT", label: "Development" },
                { value: "STAGING", label: "Staging" },
                { value: "PRODUCTION", label: "Production" },
                { value: "OTHER", label: "Other" },
              ]}
            />

            <div className="space-y-2 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
              <Toggle
                label="Target Enabled"
                description="Enable this deployment target"
                checked={enabled}
                onChange={setEnabled}
              />
              <Toggle
                label="Require Approval"
                description="Require manual approval for deployments"
                checked={requireApproval}
                onChange={setRequireApproval}
              />
              <Toggle
                label="Auto Health Check"
                description="Verify application after deployment"
                checked={autoHealthCheck}
                onChange={setAutoHealthCheck}
              />
            </div>

            <div className="md:col-span-2">
              <Input
                label="Remote Deployment Path"
                required
                value={remotePath}
                onChange={(e) => setRemotePath(e.target.value)}
                placeholder="/home/ai/deploy/..."
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : initialData ? "Update Target" : "Save Target"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
