"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function NotificationsPage() {
  return (
    <AppShell>
      <div className="space-y-5 max-w-4xl">
        <PageHeader
          title="Notifications"
          subtitle="Configure Microsoft Teams deployment webhooks and event alert rules"
          badge={
            <span className="rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-[10px] font-medium text-slate-600">
              Settings Placeholder
            </span>
          }
        />

        <Card padding="p-5" className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Microsoft Teams Webhook</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Dispatch adaptive cards to your Teams deployment channel on build start, success, and failure.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
              <span className="size-1.5 rounded-full bg-slate-400" /> Not Configured
            </span>
          </div>

          <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-xs text-slate-600">
            <span className="font-semibold block text-slate-800 mb-0.5">Configuration Requirement:</span>
            Add <code className="rounded bg-white px-1.5 py-0.5 border border-slate-200 text-slate-700">TEAMS_WEBHOOK_URL</code> to your local <code className="rounded bg-white px-1.5 py-0.5 border border-slate-200 text-slate-700">.env</code> to activate automated alert dispatch in Phase 2.
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="outline" size="sm" disabled>
              Send Test Card (Disabled in Phase 1)
            </Button>
            <Button variant="secondary" size="sm" disabled>
              Edit Webhook URL
            </Button>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
