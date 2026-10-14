import React from "react";
import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={item.label}>
            {index > 0 && <span className="text-slate-300">/</span>}
            {item.href && !isLast ? (
              <Link href={item.href} className="hover:text-blue-600 font-medium">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "font-semibold text-slate-800" : ""}>
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
