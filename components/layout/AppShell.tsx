"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Navbar from "@/components/ui/Navbar";
import MobileBottomNav from "@/components/ui/MobileBottomNav";
import CommandPalette from "@/components/ui/CommandPalette";
import ToastNotification from "@/components/ui/ToastNotification";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // Marketing / Landing page uses full-bleed layout with top navigation
  const isMarketing = pathname === "/";

  if (isMarketing) {
    return (
      <div className="min-h-screen flex flex-col bg-resq-bg text-resq-text font-sans">
        <Navbar />
        <main className="flex-1 pb-16 md:pb-0">{children}</main>
        <MobileBottomNav />
        <CommandPalette />
        <ToastNotification />
      </div>
    );
  }

  // Operational Desktop SaaS Layout (Sidebar + Header + Workspace)
  return (
    <div className="min-h-screen bg-resq-bg text-resq-text flex font-sans">
      {/* Desktop Left Sidebar (240px) */}
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
      />

      {/* Main Column */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          collapsed ? "md:pl-20" : "md:pl-60"
        }`}
      >
        {/* Top 72px Global Header */}
        <Header sidebarCollapsed={collapsed} />

        {/* Workspace Container (Desktop optimized, generous 28-40px padding, up to 1640px) */}
        <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-desktop w-full mx-auto pb-24 md:pb-10">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Global Interactive Utilities */}
      <CommandPalette />
      <ToastNotification />
    </div>
  );
}
