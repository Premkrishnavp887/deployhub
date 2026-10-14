import React from "react";
import Link from "next/link";
import { Card, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { ApplicationItem, ServerItem } from "@/lib/types";

export function QuickListCards({
  applications,
  servers,
}: {
  applications: ApplicationItem[];
  servers: ServerItem[];
}) {
  return (
    <div className="space-y-4">
      {/* Applications quick list */}
      <Card padding="p-4 sm:p-5">
        <CardHeader
          title="Applications"
          action={
            <Link
              href="/applications"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View All <span>&rarr;</span>
            </Link>
          }
        />
        <div className="divide-y divide-slate-100">
          {applications.slice(0, 4).map((app) => (
            <div key={app.id} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
              <div className="flex flex-col min-w-0 pr-2">
                <span className="text-xs font-semibold text-slate-900 truncate">
                  {app.name}
                </span>
                <span className="text-[10px] font-mono text-slate-400 truncate">
                  {app.localPath}
                </span>
              </div>
              <StatusBadge status={app.status} />
            </div>
          ))}
        </div>
      </Card>

      {/* Servers quick list */}
      <Card padding="p-4 sm:p-5">
        <CardHeader
          title="Servers"
          action={
            <Link
              href="/servers"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View All <span>&rarr;</span>
            </Link>
          }
        />
        <div className="divide-y divide-slate-100">
          {servers.slice(0, 3).map((srv) => (
            <div key={srv.id} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
              <div className="flex flex-col min-w-0 pr-2">
                <span className="text-xs font-semibold text-slate-900 truncate">
                  {srv.name}
                </span>
                <span className="text-[10px] font-mono text-slate-400 truncate">
                  {srv.host}:{srv.port}
                </span>
              </div>
              <StatusBadge status="Online" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
