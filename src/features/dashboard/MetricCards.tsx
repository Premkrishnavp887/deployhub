import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import {
  ApplicationsIcon,
  ServersIcon,
  TargetsIcon,
  ChevronRightIcon,
} from "@/components/ui/icons";
import { calculateTrend } from "@/lib/trend-utils";
import { TrendIndicator } from "@/components/ui/trend-indicator";

interface MetricsProps {
  appCount?: number | null;
  serverCount?: number | null;
  targetCount?: number | null;
  deployCount?: number | null;
  onlineServerCount?: number | null;
  activeTargetCount?: number | null;
  prevAppCount?: number | null;
  prevDeployCount?: number | null;
}

export function MetricCards({
  appCount,
  serverCount,
  targetCount,
  deployCount,
  onlineServerCount,
  activeTargetCount,
  prevAppCount,
  prevDeployCount,
}: MetricsProps) {
  // Calculated trends
  const appTrend = calculateTrend(appCount, prevAppCount, {
    displayMode: "absolute",
    periodLabel: "this month",
  });

  const deployTrend = calculateTrend(deployCount, prevDeployCount, {
    displayMode: "percent",
    periodLabel: "this month",
  });

  const formatValue = (val: number | null | undefined) => {
    if (val === null || val === undefined) return "—";
    return val.toString();
  };

  const cards = [
    {
      title: "Applications",
      value: formatValue(appCount),
      href: "/applications",
      icon: ApplicationsIcon,
      iconBg: "bg-blue-50 text-blue-600",
      trendComponent: <TrendIndicator trend={appTrend} />,
      sparkColor: "#3b82f6",
      hasData: appTrend.direction !== "unavailable",
      sparkPath: "M0 16 Q8 14 16 18 T32 8 T48 10 T60 2",
    },
    {
      title: "Servers",
      value: formatValue(serverCount),
      href: "/servers",
      icon: ServersIcon,
      iconBg: "bg-emerald-50 text-emerald-600",
      trendComponent:
        serverCount === null || serverCount === undefined ? (
          <span className="text-xs text-slate-400">No server data</span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            {onlineServerCount != null ? `${onlineServerCount} online` : `${serverCount} total`}
          </span>
        ),
      sparkColor: "#10b981",
      hasData: Boolean(serverCount && serverCount > 0),
      sparkPath: "M0 18 Q10 16 20 18 T40 10 T52 6 T60 4",
    },
    {
      title: "Deployment Targets",
      value: formatValue(targetCount),
      href: "/targets",
      icon: TargetsIcon,
      iconBg: "bg-amber-50 text-amber-600",
      trendComponent:
        targetCount === null || targetCount === undefined ? (
          <span className="text-xs text-slate-400">No target data</span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            {activeTargetCount != null ? `${activeTargetCount} active` : `${targetCount} total`}
          </span>
        ),
      sparkColor: "#f59e0b",
      hasData: Boolean(targetCount && targetCount > 0),
      sparkPath: "M0 18 Q12 18 24 14 T44 12 T54 4 T60 6",
    },
    {
      title: "Total Deployments",
      value: formatValue(deployCount),
      href: "/deployments",
      icon: (props: { className?: string }) => (
        <svg className={props.className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a5 5 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.63 8.41m5.96 5.96a14.926 14.926 0 01-5.84 2.58m-.12-8.54a5 5 0 00-7.38 5.84l4.8-4.8z" />
        </svg>
      ),
      iconBg: "bg-purple-50 text-purple-600",
      trendComponent: <TrendIndicator trend={deployTrend} />,
      sparkColor: "#a855f7",
      hasData: deployTrend.direction !== "unavailable",
      sparkPath: "M0 16 Q10 18 20 12 T40 16 T50 4 T60 8",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 w-full">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <Link key={c.title} href={c.href} className="block group min-w-0">
            <Card padding="p-4" className="hover:border-slate-300 transition-all shadow-2xs h-full flex flex-col justify-between">
              <div className="flex items-start gap-3">
                <div className={`flex size-11 items-center justify-center rounded-xl ${c.iconBg} shrink-0`}>
                  <Icon className="size-5.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500 truncate">{c.title}</span>
                    <ChevronRightIcon className="size-3.5 text-slate-300 group-hover:text-slate-500 transition-colors shrink-0" />
                  </div>
                  <div className="text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
                    {c.value}
                  </div>
                  <div className="mt-2.5 flex items-center justify-between gap-1">
                    <div className="truncate text-xs">{c.trendComponent}</div>
                    <svg className="w-14 h-5 shrink-0 overflow-visible" viewBox="0 0 60 20">
                      {c.hasData ? (
                        <path
                          d={c.sparkPath}
                          fill="none"
                          stroke={c.sparkColor}
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      ) : (
                        <line
                          x1="0"
                          y1="10"
                          x2="60"
                          y2="10"
                          stroke="#e2e8f0"
                          strokeWidth="1.5"
                          strokeDasharray="3 3"
                        />
                      )}
                    </svg>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
