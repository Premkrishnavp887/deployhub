"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeftIcon } from "@/components/ui/icons";
import { ApplicationItem } from "@/lib/types";

export function ApplicationForm({
  onCancel,
  onSave,
  initialData,
  serverError,
}: {
  onCancel: () => void;
  onSave: (data: Partial<ApplicationItem>) => Promise<boolean>;
  initialData?: ApplicationItem | null;
  serverError?: string | null;
}) {
  const [name, setName] = useState(initialData?.name || "");
  const [imageName, setImageName] = useState(initialData?.imageName || "");
  const [localPath, setLocalPath] = useState(initialData?.localPath || "");
  const [composeFile, setComposeFile] = useState(initialData?.composeFile || "docker-compose.yml");
  const [gitRemote, setGitRemote] = useState(initialData?.gitRemote || "origin");
  const [buildPlatform, setBuildPlatform] = useState(initialData?.buildPlatform || "linux/amd64");
  const [defaultBranch, setDefaultBranch] = useState(initialData?.defaultBranch || "main");
  const [buildCache, setBuildCache] = useState(!initialData?.noCache);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState("");

  const error = localError || serverError;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !imageName.trim() || !localPath.trim()) {
      setLocalError("Please fill in all required fields.");
      return;
    }
    if (!localPath.startsWith("/")) {
      setLocalError("Project path must be an absolute path starting with /.");
      return;
    }
    setLoading(true);
    setLocalError("");

    try {
      await onSave({
        name,
        imageName,
        localPath,
        composeFile,
        gitRemote,
        buildPlatform,
        defaultBranch,
        noCache: !buildCache,
        status: "Active",
      });
    } catch (err: unknown) {
      setLocalError(err instanceof Error ? err.message : "Failed to save application.");
    } finally {
      setLoading(false);
    }
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
          {initialData ? "Edit Application" : "Add Application"}
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Register an existing local project directory for deployment orchestration
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
            <Input
              label="Application Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sustainability Connect"
            />
            <Input
              label="Docker Image Name"
              required
              value={imageName}
              onChange={(e) => setImageName(e.target.value)}
              placeholder="e.g. dxb.ocir.io/oxydmrts.us/sustainability-connect"
            />
            <Input
              label="Project Directory Path"
              required
              value={localPath}
              onChange={(e) => setLocalPath(e.target.value)}
              placeholder="/home/user/project..."
            />
            <Input
              label="Docker Compose File"
              value={composeFile}
              onChange={(e) => setComposeFile(e.target.value)}
              placeholder="docker-compose.yml"
            />
            <Input
              label="Git Remote URL"
              value={gitRemote}
              onChange={(e) => setGitRemote(e.target.value)}
              placeholder="e.g. https://bitbucket.org/org/repo.git"
            />
            <Select
              label="Build Platform"
              value={buildPlatform}
              onChange={(e) => setBuildPlatform(e.target.value)}
              options={[
                { value: "linux/amd64", label: "linux/amd64" },
                { value: "linux/arm64", label: "linux/arm64" },
                { value: "native", label: "Native host platform" },
              ]}
            />
            <Input
              label="Default Branch"
              value={defaultBranch}
              onChange={(e) => setDefaultBranch(e.target.value)}
              placeholder="main"
            />
            <div className="pt-2">
              <Toggle
                label="Use Build Cache"
                description="Enable Docker layer build cache for faster builds"
                checked={buildCache}
                onChange={setBuildCache}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : initialData ? "Update Application" : "Save Application"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
