"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DeployHubLogo,
  DashboardIcon,
  ApplicationsIcon,
  ServersIcon,
  TargetsIcon,
  DeploymentsIcon,
  MonitoringIcon,
  NotificationsIcon,
  SettingsIcon,
  PulseIcon,
  DatabaseIcon,
  KeyIcon,
  UsersIcon,
  ChevronRightIcon,
} from "@/components/ui/icons";
import { SystemHealthResponse } from "@/app/api/health/route";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
}

const NAV_ITEMS: NavItem[] = [
  { name: "Dashboard", href: "/", icon: DashboardIcon },
  { name: "Applications", href: "/applications", icon: ApplicationsIcon },
  { name: "Servers", href: "/servers", icon: ServersIcon },
  { name: "Deployment Targets", href: "/targets", icon: TargetsIcon },
  { name: "Deployments", href: "/deployments", icon: DeploymentsIcon },
  { name: "Monitoring", href: "/monitoring", icon: MonitoringIcon },
  { name: "Notifications", href: "/notifications", icon: NotificationsIcon },
  { name: "Settings", href: "/settings", icon: SettingsIcon },
];

export function Sidebar({
  mobileOpen = false,
  setMobileOpen,
}: {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}) {
  const pathname = usePathname();
  const [health, setHealth] = useState<SystemHealthResponse | null>(null);

  useEffect(() => {
    fetch("/api/health")
      .then((r) => r.json())
      .then((data) => setHealth(data))
      .catch(() => {});
  }, []);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  const systemHealthItems = [
    {
      name: "PostgreSQL",
      icon: DatabaseIcon,
      state: health ? health.postgres.state : "Unknown",
    },
    {
      name: "Jenkins",
      icon: SettingsIcon,
      state: health ? health.jenkins.state : "Not Configured",
    },
    {
      name: "Build Agent",
      icon: ApplicationsIcon,
      state: health ? health.wslAgent.state : "Unknown",
    },
    {
      name: "SSH Access",
      icon: KeyIcon,
      state: health ? health.ssh.state : "Not Configured",
    },
    {
      name: "Teams",
      icon: UsersIcon,
      state: health ? health.teams.state : "Not Configured",
    },
  ];

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-xs md:hidden"
          onClick={() => setMobileOpen?.(false)}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex h-[100dvh] w-64 flex-col border-r border-slate-200/90 bg-white transition-transform duration-200 ease-in-out md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo and Brand */}
        <div className="flex h-16 shrink-0 items-center gap-3 border-b border-slate-100 px-5">
          <DeployHubLogo className="size-8" />
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-slate-900 leading-tight">
              DeployHub
            </span>
            <span className="text-[10px] font-medium text-slate-400">
              Local Deployment Management
            </span>
          </div>
        </div>

        {/* Scrollable Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen?.(false)}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  active
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon
                  className={`size-4 shrink-0 transition-colors ${
                    active ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
                  }`}
                />
                <span className="flex-1 text-left">{item.name}</span>
                {item.badge && (
                  <span className="flex size-4.5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white leading-none">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* System Health Anchored at Bottom */}
        <div className="shrink-0 border-t border-slate-100 p-4 bg-white">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <PulseIcon className="size-4 text-blue-600" />
              <span className="text-xs font-bold text-slate-900 tracking-tight">
                System Health
              </span>
            </div>
            <ChevronRightIcon className="size-3.5 text-slate-400" />
          </div>
          <div className="space-y-2 text-[11px]">
            {systemHealthItems.map((item) => {
              const Icon = item.icon;
              const isConnected = item.state === "Connected";
              const isDisconnected = item.state === "Disconnected";
              const dotClass = isConnected
                ? "bg-emerald-500"
                : isDisconnected
                ? "bg-rose-500"
                : "bg-slate-300";
              const textClass = isConnected
                ? "text-emerald-600"
                : isDisconnected
                ? "text-rose-600"
                : "text-slate-400";

              return (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Icon className="size-3.5 text-slate-400" />
                    <span>{item.name}</span>
                  </div>
                  <span className={`inline-flex items-center gap-1 font-medium ${textClass}`}>
                    <span className={`size-1.5 rounded-full ${dotClass}`} />
                    {item.state}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </aside>
    </>
  );
}
