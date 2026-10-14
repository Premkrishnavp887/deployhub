import React from "react";

export function AppBadgeIcon({ name, className = "size-6" }: { name: string; className?: string }) {
  const lower = name.toLowerCase();

  if (lower.includes("sustainability")) {
    return (
      <div className={`flex items-center justify-center rounded-full bg-emerald-600 text-white shrink-0 ${className}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="size-3.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 01-9-9c0-4.97 4.03-9 9-9 4.97 0 9 4.03 9 9 0 2.5-1 4.5-2.5 6-1.5 1.5-3.5 3-6.5 3z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18" />
        </svg>
      </div>
    );
  }

  if (lower.includes("vendor")) {
    return (
      <div className={`flex items-center justify-center rounded-lg bg-indigo-600 text-white shrink-0 ${className}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="size-3.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      </div>
    );
  }

  if (lower.includes("manufacturing")) {
    return (
      <div className={`flex items-center justify-center rounded-lg bg-amber-600 text-white shrink-0 ${className}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="size-3.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7h-4V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM9 5h6v2H9V5z" />
        </svg>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center rounded-lg bg-blue-600 text-white shrink-0 ${className}`}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="size-3.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    </div>
  );
}
