"use client";

import React, { useState, useEffect } from "react";
import { SearchIcon, BellIcon } from "@/components/ui/icons";

export function Header({
  onMenuClick,
  unreadNotificationCount = 0,
}: {
  onMenuClick?: () => void;
  unreadNotificationCount?: number;
}) {
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    function updateClock() {
      const now = new Date();
      const datePart = now.toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      const timePart = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      setCurrentTime(`${datePart} | ${timePart}`);
    }
    updateClock();
    const timer = setInterval(updateClock, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/95 backdrop-blur-xs px-4 sm:px-6">
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 md:hidden"
          aria-label="Open sidebar"
        >
          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="relative w-full">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search applications, servers, deployments..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50/70 py-1.5 pl-9 pr-14 text-xs text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
            <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
              Ctrl
            </kbd>
            <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
              K
            </kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {currentTime ? (
          <div className="hidden lg:block text-xs font-medium text-slate-500">
            {currentTime}
          </div>
        ) : null}

        <button
          type="button"
          className="relative rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          aria-label="Notifications"
        >
          <BellIcon className="size-4.5" />
          {unreadNotificationCount > 0 && (
            <span className="absolute right-1 top-1 flex size-2 items-center justify-center rounded-full bg-rose-500">
              <span className="sr-only">{unreadNotificationCount} alerts</span>
            </span>
          )}
        </button>

        <div className="h-5 w-px bg-slate-200 hidden sm:block" />

        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold text-white">
            PS
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-900 leading-tight">Prem</span>
            <span className="text-[10px] font-medium text-slate-400">Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
}
