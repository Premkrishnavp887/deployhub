"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeftIcon } from "@/components/ui/icons";
import { ServerItem } from "@/lib/types";

export function ServerForm({
  onCancel,
  onSave,
  initialData,
  serverError,
}: {
  onCancel: () => void;
  onSave: (data: Partial<ServerItem>) => Promise<boolean>;
  initialData?: ServerItem | null;
  serverError?: string | null;
}) {
  const [name, setName] = useState(initialData?.name || "");
  const [host, setHost] = useState(initialData?.host || "");
  const [port, setPort] = useState(initialData?.port ? String(initialData.port) : "22");
  const [sshUsername, setSshUsername] = useState(initialData?.sshUsername || "");
  const [jenkinsCredentialId, setJenkinsCredentialId] = useState(
    initialData?.jenkinsCredentialId || "cred-office-ai"
  );
  const [knownHostFingerprint, setKnownHostFingerprint] = useState(
    initialData?.knownHostFingerprint || ""
  );
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState("");

  const error = localError || serverError;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !host.trim() || !sshUsername.trim() || !knownHostFingerprint.trim()) {
      setLocalError("Please fill in all required fields including the verified fingerprint.");
      return;
    }
    const portNum = parseInt(port, 10);
    if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
      setLocalError("Port must be a valid integer between 1 and 65535.");
      return;
    }

    setLoading(true);
    setLocalError("");
    try {
      await onSave({
        name,
        host,
        port: portNum,
        sshUsername,
        jenkinsCredentialId,
        knownHostFingerprint,
        status: "Online",
      });
    } catch (err: unknown) {
      setLocalError(err instanceof Error ? err.message : "Failed to save server.");
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
          {initialData ? "Edit Server" : "Add Server"}
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Register a remote Linux server for SSH & Docker Compose deployments
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
              label="Server Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Production Server"
            />
            <Select
              label="Jenkins SSH Credential ID"
              required
              value={jenkinsCredentialId}
              onChange={(e) => setJenkinsCredentialId(e.target.value)}
              options={[
                { value: "cred-office-ai", label: "cred-office-ai (SSH Key: ai)" },
                { value: "cred-prod-cluster", label: "cred-prod-cluster (SSH Key: osm)" },
                { value: "cred-staging-node", label: "cred-staging-node (SSH Key: ai)" },
                { value: "custom-cred", label: "+ Custom Jenkins Credential" },
              ]}
            />
            <Input
              label="Host/IP Address"
              required
              value={host}
              onChange={(e) => setHost(e.target.value)}
              placeholder="e.g. 192.168.11.112 or prod.example.com"
            />
            <Input
              label="SSH Port"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              placeholder="22"
            />
            <Input
              label="SSH Username"
              required
              value={sshUsername}
              onChange={(e) => setSshUsername(e.target.value)}
              placeholder="e.g. ai or ubuntu"
            />
            <Input
              label="Verified SSH Host Fingerprint"
              required
              value={knownHostFingerprint}
              onChange={(e) => setKnownHostFingerprint(e.target.value)}
              placeholder="SHA256:..."
            />

            {/* Trusted Verification Guidance */}
            <div className="md:col-span-2 rounded-xl border border-blue-100 bg-blue-50/60 p-4 space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-blue-600 font-bold text-xs mt-0.5">ℹ</span>
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-slate-900">
                    Trusted Host Fingerprint Verification
                  </h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    To prevent man-in-the-middle attacks, obtain and verify the host key fingerprint
                    directly on the target server console (e.g.{" "}
                    <code className="bg-white px-1 py-0.5 rounded border border-blue-200 font-mono text-[10px]">
                      ssh-keygen -l -f /etc/ssh/ssh_host_ed25519_key.pub
                    </code>
                    ). Never blindly trust unauthenticated network scans. Raw passwords and private keys are never stored.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : initialData ? "Update Server" : "Save Server"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
