"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { NewDeploymentModal } from "@/features/deployments/NewDeploymentModal";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [newDeployOpen, setNewDeployOpen] = useState(false);

  return (
    <div className="h-[100dvh] w-full overflow-hidden bg-slate-50 text-slate-900 antialiased font-sans flex">
      {/* Fixed 100dvh Sidebar */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Area: Independent Vertical Scroll */}
      <div className="flex flex-1 flex-col min-w-0 h-[100dvh] overflow-hidden md:pl-64">
        {/* Sticky Top Header */}
        <Header onMenuClick={() => setMobileOpen(true)} />

        {/* Independently Scrollable Page Content Container */}
        <main className="flex-1 overflow-y-auto min-h-0 p-4 sm:p-5 lg:p-6 w-full max-w-[1600px] mx-auto space-y-4 sm:space-y-5">
          {children}
        </main>
      </div>

      <NewDeploymentModal
        isOpen={newDeployOpen}
        onClose={() => setNewDeployOpen(false)}
      />
    </div>
  );
}
