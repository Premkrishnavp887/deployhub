"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeftIcon } from "@/components/ui/icons";
import { DeploymentTargetItem, ApplicationItem, ServerItem, EnvironmentType } from "@/lib/types";

interface TargetFormProps {
  applications: ApplicationItem[];
  servers: ServerItem[];
  onCancel: () => void;
  onSave: (data: Partial<DeploymentTargetItem>) => Promise<boolean>;
  initialData?: DeploymentTargetItem | null;
  serverError?: string | null;
}

export function TargetForm({
  applications,
  servers,
  onCancel,
  onSave,
  initialData,
  serverError,
}: TargetFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [appId, setAppId] = useState(initialData?.applicationId || (applications[0]?.id ?? ""));
  const [srvId, setSrvId] = useState(initialData?.serverId || (servers[0]?.id ?? ""));
  const [env, setEnv] = useState<EnvironmentType>(initialData?.environment || "DEVELOPMENT");
  const [path, setPath] = useState(initialData?.remotePath || "/home/deploy/app");
  const [compose, setCompose] = useState(initialData?.composeFile || "docker-compose.yml");
  const [tagVar, setTagVar] = useState(initialData?.tagEnvVar || "tag");
  const [enabled, setEnabled] = useState(initialData ? initialData.enabled : true);
  const [approval, setApproval] = useState(initialData?.requireApproval || false);
  const [localErr, setLocalErr] = useState("");
  const [loading, setLoading] = useState(false);

  const error = localErr || serverError;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appId || !srvId || !path.trim()) {
      setLocalErr("Please fill in all required fields.");
      return;
    }
    if (!path.startsWith("/")) {
      setLocalErr("Remote deployment path must be an absolute path starting with /.");
      return;
    }

    const app = applications.find((a) => a.id === appId);
    const targetName = name.trim() || `${app?.name || "Target"} - ${env}`;

    setLoading(true);
    setLocalErr("");
    try {
      await onSave({
        name: targetName, applicationId: appId, serverId: srvId, environment: env,
        remotePath: path.trim(), composeFile: compose.trim() || "docker-compose.yml",
        tagEnvVar: tagVar.trim() || "tag", enabled, requireApproval: approval,
      });
    } catch (err: unknown) {
      setLocalErr(err instanceof Error ? err.message : "Failed to save target.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-4xl">
      <button onClick={onCancel} className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800">
        <ArrowLeftIcon className="size-3.5" /> Back
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
          {error && <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">{error}</div>}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Input
              label="Target Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Staging Server Node 1"
              helper="Leave blank to auto-generate from Application and Environment"
            />
            <Select
              label="Environment"
              value={env}
              onChange={(e) => setEnv(e.target.value as EnvironmentType)}
              options={[
                { value: "DEVELOPMENT", label: "Development" },
                { value: "STAGING", label: "Staging" },
                { value: "PRODUCTION", label: "Production" },
                { value: "OTHER", label: "Other" },
              ]}
            />
            <Select
              label="Application"
              required
              value={appId}
              onChange={(e) => setAppId(e.target.value)}
              options={applications.map((a) => ({ value: a.id, label: a.name }))}
            />
            <Select
              label="Server"
              required
              value={srvId}
              onChange={(e) => setSrvId(e.target.value)}
              options={servers.map((s) => ({ value: s.id, label: `${s.name} (${s.host})` }))}
            />
            <Input
              label="Remote Deployment Path"
              required
              value={path}
              onChange={(e) => setPath(e.target.value)}
              placeholder="/home/deploy/..."
            />
            <Input
              label="Docker Compose File"
              value={compose}
              onChange={(e) => setCompose(e.target.value)}
              placeholder="docker-compose.yml"
            />
            <Input
              label="Tag Environment Variable"
              value={tagVar}
              onChange={(e) => setTagVar(e.target.value)}
              placeholder="tag"
            />

            <div className="space-y-2 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
              <Toggle label="Target Enabled" description="Enable this deployment target" checked={enabled} onChange={setEnabled} />
              <Toggle label="Require Approval" description="Require manual sign-off before deploying" checked={approval} onChange={setApproval} />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : initialData ? "Update Target" : "Save Target"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
