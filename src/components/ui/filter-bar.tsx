"use client";

import React from "react";
import { SearchIcon, FilterIcon } from "./icons";

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  onFilterClick?: () => void;
  children?: React.ReactNode;
}

export function FilterBar({
  searchTerm,
  onSearchChange,
  placeholder = "Search...",
  onFilterClick,
  children,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="relative flex-1 max-w-sm">
        <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-slate-200 bg-white py-1.5 pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
        />
      </div>

      <div className="flex items-center gap-2">
        {children}
        <button
          type="button"
          onClick={onFilterClick}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 shadow-2xs transition-colors"
        >
          <FilterIcon className="size-3.5" />
          Filter
        </button>
      </div>
    </div>
  );
}
