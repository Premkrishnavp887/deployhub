import React from "react";
import { Breadcrumbs, BreadcrumbItem } from "./breadcrumbs";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  action?: React.ReactNode;
  badge?: React.ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  action,
  badge,
}: PageHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            {title}
          </h1>
          {badge}
        </div>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
