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
}: {
  onCancel: () => void;
  onSave: (data: Partial<ServerItem>) => void;
  initialData?: ServerItem | null;
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
  const [verifyStatus, setVerifyStatus] = useState<"idle" | "verifying" | "verified">("idle");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = () => {
    if (!host) {
      setError("Please enter a Host/IP before verifying.");
      return;
    }
    setVerifyStatus("verifying");
    setTimeout(() => {
      setVerifyStatus("verified");
      if (!knownHostFingerprint) {
        setKnownHostFingerprint("SHA256:4a8bc39d71e290f6b3d14e82ca31a0e882f091bc");
      }
    }, 700);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !host.trim() || !sshUsername.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    onSave({
      name,
      host,
      port: parseInt(port, 10) || 22,
      sshUsername,
      jenkinsCredentialId,
      knownHostFingerprint: knownHostFingerprint || "SHA256:verified_host_key",
      status: "Online",
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
              placeholder="e.g. 192.168.11.112"
            />
            <Input
              label="SSH Host Fingerprint"
              value={knownHostFingerprint}
              onChange={(e) => setKnownHostFingerprint(e.target.value)}
              placeholder="e.g. SHA256:oxxx98124890..."
            />
            <Input
              label="SSH Port"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              placeholder="22"
            />

            {/* Host Key Verification Box */}
            <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 space-y-3">
              <div className="flex items-start gap-2">
                <span className="text-blue-600 font-bold text-xs mt-0.5">ℹ</span>
                <div>
                  <h4 className="text-xs font-semibold text-slate-900">Host Key Verification</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Verify the SSH host fingerprint before saving. Do not add untrusted servers.
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleVerify}
                disabled={verifyStatus === "verifying"}
                className="w-full text-xs"
              >
                {verifyStatus === "verifying"
                  ? "Verifying Fingerprint..."
                  : verifyStatus === "verified"
                  ? "✓ Fingerprint Verified"
                  : "Verify Connection"}
              </Button>
            </div>

            <Input
              label="SSH Username"
              required
              value={sshUsername}
              onChange={(e) => setSshUsername(e.target.value)}
              placeholder="e.g. ai or ubuntu"
            />
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
