"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Bell,
  Play,
  Sparkles,
  ChevronRight,
  Shield,
  Activity,
  Globe,
  SlidersHorizontal,
} from "lucide-react";
import { DEMO_USERS, getActiveSession } from "@/lib/auth";
import { UserSession } from "@/lib/types";

interface HeaderProps {
  sidebarCollapsed?: boolean;
}

export default function Header({ sidebarCollapsed = false }: HeaderProps) {
  const pathname = usePathname();
  const [session, setSession] = useState<UserSession>(DEMO_USERS.DONOR);
  const [unreadCount, setUnreadCount] = useState(3);

  useEffect(() => {
    setSession(getActiveSession());

    const handleAuthChange = (e: any) => {
      if (e.detail) setSession(e.detail);
      else setSession(DEMO_USERS.DONOR);
    };

    window.addEventListener("resqfood-auth-change", handleAuthChange);
    return () => {
      window.removeEventListener("resqfood-auth-change", handleAuthChange);
    };
  }, [pathname]);

  // Derive dynamic breadcrumbs & titles
  const getPageMeta = () => {
    if (pathname.startsWith("/donor")) {
      return {
        section: "Operations",
        title: "Donor Command Center",
        subtitle: "Real-time surplus intake & live route coordination",
      };
    }
    if (pathname.startsWith("/recipient")) {
      return {
        section: "Network",
        title: "Recipient Intake Portal",
        subtitle: "Dynamic capacity management & hunger deficit tracking",
      };
    }
    if (pathname.startsWith("/driver")) {
      return {
        section: "Network",
        title: "Driver Operations Hub",
        subtitle: "Turn-by-turn routing & custody handoff verification",
      };
    }
    if (pathname.startsWith("/admin")) {
      return {
        section: "Overview",
        title: "City Operations Command Center",
        subtitle: "Metropolitan live rescue grid & municipal audit logs",
      };
    }
    if (pathname.startsWith("/matching")) {
      return {
        section: "Intelligence",
        title: "AI Matcher & Simulation",
        subtitle: "Multi-parameter Rescue Score & explainable dispatch",
      };
    }
    if (pathname.startsWith("/rescues")) {
      return {
        section: "Operations",
        title: "Rescue Operations & Telemetry",
        subtitle: "Live GPS tracking, route waypoints & digital custody logs",
      };
    }
    if (pathname.startsWith("/network")) {
      return {
        section: "Network",
        title: "Metropolitan Rescue Grid",
        subtitle: "Interactive spatial map of donors, shelters, and drivers",
      };
    }
    if (pathname.startsWith("/impact")) {
      return {
        section: "Impact",
        title: "Corporate ESG & Lifecycle Impact",
        subtitle: "EPA WARM v15 verified carbon and water preservation metrics",
      };
    }
    if (pathname.startsWith("/analytics")) {
      return {
        section: "Intelligence",
        title: "Logistical Analytics & Heatmaps",
        subtitle: "Drill-down charts, driver utilization & demand forecasting",
      };
    }
    if (pathname.startsWith("/settings")) {
      return {
        section: "Organization",
        title: "Platform Configuration",
        subtitle: "Multi-branch management, API keys, webhooks & billing",
      };
    }
    if (pathname.startsWith("/demo")) {
      return {
        section: "Overview",
        title: "End-to-End Rescue Walkthrough",
        subtitle: "Connected scenario from donation intake to impact ripple",
      };
    }
    return {
      section: "Platform",
      title: "RESQFOOD Network",
      subtitle: "Rescue Food. Route Hope.",
    };
  };

  const meta = getPageMeta();

  return (
    <header className="sticky top-0 z-30 h-[72px] bg-white/95 backdrop-blur border-b border-resq-border px-6 flex items-center justify-between transition-all">
      {/* Left: Breadcrumbs & Dynamic Titles */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
          <span>{meta.section}</span>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-resq-blue font-bold">{meta.title}</span>
        </div>
        <h1 className="text-lg font-black text-resq-navy tracking-tight -mt-0.5 leading-tight flex items-center gap-2">
          {meta.title}
        </h1>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Live Network Status Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-resq-border text-xs">
          <span className="w-2 h-2 rounded-full bg-resq-green-bright animate-ping" />
          <span className="text-slate-500 font-medium">
            Live: <strong className="text-resq-navy">18 Orgs</strong> • <strong className="text-resq-blue">12 EV Drivers</strong>
          </span>
        </div>

        {/* Global Command Palette Trigger (Ctrl + K) */}
        <button
          onClick={() => {
            window.dispatchEvent(new CustomEvent("open-command-palette"));
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-resq-border bg-slate-50 text-slate-500 text-xs hover:border-slate-300 transition-colors shadow-xs"
          title="Search (Ctrl + K)"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline font-medium">Search...</span>
          <kbd className="hidden sm:inline px-1.5 py-0.5 text-[10px] font-bold bg-white border border-slate-200 rounded text-slate-500 shadow-xs">
            ⌘K
          </kbd>
        </button>

        {/* Quick Demo Mode Button */}
        <Link
          href="/demo"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-resq-blue to-resq-green text-white shadow-xs hover:opacity-95 transition-opacity"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          Demo Flow
        </Link>

        {/* Notifications Icon with live counter */}
        <Link
          href="/notifications"
          className="relative p-2 rounded-xl text-slate-500 hover:text-resq-navy hover:bg-slate-50 border border-resq-border transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-resq-red text-white text-[9px] font-black rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Link>

        {/* User Account / Auth Portal Button */}
        <Link
          href="/auth"
          className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-2xl border border-resq-border bg-slate-50 hover:bg-white hover:border-slate-300 transition-all text-left group"
          title="Switch Profile / Sign In"
        >
          <div className="w-7 h-7 rounded-xl overflow-hidden bg-slate-200 shrink-0">
            <img
              src={session.avatar || "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=100"}
              alt={session.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden md:flex flex-col">
            <span className="text-[11px] font-bold text-resq-navy leading-none">
              {session.name.split(" ")[0]}
            </span>
            <span className="text-[9px] font-black text-resq-blue mt-0.5 leading-none">
              {session.role}
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
}
