"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ApplicationItem, DeploymentTargetItem } from "@/lib/types";

export function NewDeploymentModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const [apps, setApps] = useState<ApplicationItem[]>([]);
  const [targets, setTargets] = useState<DeploymentTargetItem[]>([]);
  const [selectedAppId, setSelectedAppId] = useState("");
  const [selectedTargetId, setSelectedTargetId] = useState("");
  const [branch, setBranch] = useState("main");
  const [imageTag, setImageTag] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetch("/api/applications")
        .then((r) => r.json())
        .then((data) => {
          setApps(data);
          if (data.length > 0 && !selectedAppId) {
            setSelectedAppId(data[0].id);
          }
        })
        .catch(console.error);

      fetch("/api/targets")
        .then((r) => r.json())
        .then((data) => {
          setTargets(data);
          if (data.length > 0 && !selectedTargetId) {
            setSelectedTargetId(data[0].id);
          }
        })
        .catch(console.error);
    }
  }, [isOpen, selectedAppId, selectedTargetId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppId || !selectedTargetId || !branch.trim() || !imageTag.trim()) {
      setError("Please fill in all deployment parameters.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/deployments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: selectedAppId,
          targetId: selectedTargetId,
          branch,
          requestedTag: imageTag,
          message: message || "Manual deployment via DeployHub control plane",
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to trigger deployment.");
      }

      onClose();
      onSuccess?.();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const currentTargets = targets.filter((t) => t.applicationId === selectedAppId);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Launch New Deployment"
      subtitle="Select target environment and specify docker image tag to trigger Jenkins execution"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-rose-50 border border-rose-200 p-2.5 text-xs text-rose-700">
            {error}
          </div>
        )}

        <Select
          label="Application"
          required
          value={selectedAppId}
          onChange={(e) => {
            setSelectedAppId(e.target.value);
            const sub = targets.filter((t) => t.applicationId === e.target.value);
            if (sub.length > 0) setSelectedTargetId(sub[0].id);
          }}
          options={apps.map((a) => ({ value: a.id, label: a.name }))}
        />

        <Select
          label="Deployment Target & Environment"
          required
          value={selectedTargetId}
          onChange={(e) => setSelectedTargetId(e.target.value)}
          options={
            currentTargets.length > 0
              ? currentTargets.map((t) => ({
                  value: t.id,
                  label: `${t.serverName || "Server"} (${t.environment})`,
                }))
              : targets.map((t) => ({
                  value: t.id,
                  label: `${t.applicationName || "App"} - ${t.serverName || "Server"} (${t.environment})`,
                }))
          }
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Git Branch"
            required
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            placeholder="main"
          />
          <Input
            label="Docker Image Tag"
            required
            value={imageTag}
            onChange={(e) => setImageTag(e.target.value)}
            placeholder="e.g. dev-65"
          />
        </div>

        <Input
          label="Deployment Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Reason for deployment..."
        />

        <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-xs text-slate-600">
          <span className="font-semibold block text-slate-900">Safe Execution Contract:</span>
          Jenkins pipeline will verify clean Git status, build container on WSL agent, transfer via SCP, and run Docker Compose.
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Triggering..." : "Launch Deployment"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
