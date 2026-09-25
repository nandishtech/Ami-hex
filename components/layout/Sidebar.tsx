"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Utensils,
  Truck,
  History,
  Sparkles,
  Bot,
  BarChart3,
  HeartHandshake,
  Navigation,
  Globe,
  Leaf,
  FileSpreadsheet,
  Users,
  GitBranch,
  Puzzle,
  Bell,
  HelpCircle,
  Settings,
  ShieldCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Flame,
  Award,
  Volume2,
  VolumeX,
} from "lucide-react";
import { DEMO_USERS, getActiveSession, switchDemoRole } from "@/lib/auth";
import { UserRole, UserSession } from "@/lib/types";

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function Sidebar({ collapsed = false, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const [session, setSession] = useState<UserSession | null>(null);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const toggleAudio = () => {
    const nextState = !audioEnabled;
    setAudioEnabled(nextState);
    if (nextState && typeof window !== "undefined") {
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) {
          const ctx = new AudioContext();
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();
          osc1.type = "sine";
          osc1.frequency.setValueAtTime(880, ctx.currentTime);
          osc2.type = "triangle";
          osc2.frequency.setValueAtTime(1320, ctx.currentTime + 0.08);
          gain.gain.setValueAtTime(0.12, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(ctx.destination);
          osc1.start(ctx.currentTime);
          osc1.stop(ctx.currentTime + 0.15);
          osc2.start(ctx.currentTime + 0.08);
          osc2.stop(ctx.currentTime + 0.3);
        }
      } catch (e) {}
    }
  };

  useEffect(() => {
    setSession(getActiveSession());

    const handleAuthChange = (e: any) => {
      setSession(e.detail || null);
    };

    window.addEventListener("resqfood-auth-change", handleAuthChange);
    return () => {
      window.removeEventListener("resqfood-auth-change", handleAuthChange);
    };
  }, [pathname]);

  // Determine active stakeholder role from current path or authenticated session
  const effectiveRole: UserRole = pathname.startsWith("/recipient")
    ? "RECIPIENT"
    : pathname.startsWith("/driver")
    ? "DRIVER"
    : pathname.startsWith("/donor")
    ? "DONOR"
    : pathname.startsWith("/admin")
    ? "ADMIN"
    : session?.role || "DONOR";

  // Dynamic role-specific navigation sections (display only needed sections)
  const getNavSections = () => {
    switch (effectiveRole) {
      case "DONOR":
        return [
          {
            title: "FOOD DONOR CONSOLE",
            items: [
              { label: "Donor Dashboard", href: "/donor", icon: LayoutDashboard },
              { label: "Post Surplus Food", href: "/donor?action=create", icon: Utensils },
              { label: "Active Rescues", href: "/rescues", icon: Truck },
              { label: "Rescue History", href: "/rescues?status=DELIVERED", icon: History },
            ],
          },
          {
            title: "INTELLIGENCE",
            items: [
              { label: "AI Food Matcher", href: "/matching", icon: Sparkles },
              { label: "Metropolitan Grid", href: "/network", icon: Globe },
            ],
          },
          {
            title: "IMPACT & PROFILE",
            items: [
              { label: "Tax Exemption & ESG", href: "/impact", icon: Leaf },
              { label: "Restaurant Leaderboard & Tokens", href: "/donor?tab=LEADERBOARD", icon: Award },
              { label: "Kitchen Settings", href: "/settings", icon: Settings },
            ],
          },
        ];

      case "DRIVER":
        return [
          {
            title: "DRIVER TERMINAL",
            items: [
              { label: "Driver Operations Hub", href: "/driver", icon: Navigation },
              { label: "Active Pickups & Radar", href: "/driver", icon: Truck },
              { label: "Delivered Receipts", href: "/rescues?status=DELIVERED", icon: History },
            ],
          },
          {
            title: "NETWORK RADAR",
            items: [
              { label: "Live City Radar", href: "/network", icon: Globe },
              { label: "Transit Cold-Chain", href: "/driver", icon: Sparkles },
            ],
          },
          {
            title: "IMPACT & REWARDS",
            items: [
              { label: "EV Carbon Saved", href: "/impact", icon: Leaf },
              { label: "Rescue Leaderboard & Tokens", href: "/driver?tab=LEADERBOARD", icon: Award },
            ],
          },
        ];

      case "RECIPIENT":
        return [
          {
            title: "SHELTER INTAKE",
            items: [
              { label: "Shelter Intake Portal", href: "/recipient", icon: LayoutDashboard },
              { label: "Incoming Rescues", href: "/recipient", icon: Truck },
              { label: "Intake Storage & Needs", href: "/recipient", icon: HeartHandshake },
            ],
          },
          {
            title: "NETWORK & INTEL",
            items: [
              { label: "City Rescue Grid", href: "/network", icon: Globe },
              { label: "Matched Donors", href: "/matching", icon: Sparkles },
              { label: "Community Leaderboard", href: "/recipient?tab=LEADERBOARD", icon: Award },
            ],
          },
          {
            title: "RELIEF IMPACT",
            items: [
              { label: "Meals Distributed", href: "/impact", icon: Leaf },
              { label: "Shelter Profile", href: "/settings", icon: Settings },
            ],
          },
        ];

      case "ADMIN":
        return [
          {
            title: "CITY COMMAND",
            items: [
              { label: "City Operations Center", href: "/admin", icon: LayoutDashboard },
              { label: "Metropolitan Rescue Grid", href: "/network", icon: Globe },
              { label: "Live Rescue Fleets", href: "/rescues", icon: Truck },
              { label: "City Analytics", href: "/analytics", icon: BarChart3 },
            ],
          },
          {
            title: "GOVERNANCE & AUDIT",
            items: [
              { label: "SLA Compliance Audit", href: "/admin", icon: ShieldCheck },
              { label: "Regional ESG Reports", href: "/impact", icon: Leaf },
              { label: "System Settings", href: "/settings", icon: Settings },
            ],
          },
        ];

      default:
        return [
          {
            title: "OVERVIEW",
            items: [
              { label: "Dashboard", href: session?.role ? `/${session.role.toLowerCase()}` : "/donor", icon: LayoutDashboard },
              { label: "Active Rescues", href: "/rescues", icon: Truck },
            ],
          },
          {
            title: "NETWORK",
            items: [
              { label: "Live Network", href: "/network", icon: Globe },
              { label: "Impact", href: "/impact", icon: Leaf },
            ],
          },
        ];
    }
  };

  const navSections = getNavSections();

  const handleRoleChange = (role: UserRole) => {
    const newSession = switchDemoRole(role);
    setSession(newSession);
    setShowRoleDropdown(false);
  };

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 bg-white border-r border-resq-border transition-all duration-300 flex flex-col justify-between hidden md:flex ${
        collapsed ? "w-20" : "w-60"
      }`}
    >
      {/* Top Header & Brand */}
      <div>
        <div className="h-[72px] px-5 flex items-center justify-between border-b border-resq-border">
          <Link href="/" className="flex items-center gap-2.5 group py-1">
            <img
              src="/logo.png"
              alt="HopePlate"
              className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="p-1.5 rounded-lg text-slate-400 hover:text-resq-navy hover:bg-slate-100 transition-colors"
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Navigation Sections */}
        <div className="px-3 py-4 space-y-5 overflow-y-auto max-h-[calc(100vh-230px)]">
          {navSections.map((sec) => (
            <div key={sec.title} className="space-y-1">
              {!collapsed && (
                <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  {sec.title}
                </span>
              )}
              {sec.items.map((item) => {
                const rolePrefix = session?.role ? `/${session.role.toLowerCase()}` : "";
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href) && item.href !== rolePrefix);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                      isActive
                        ? "bg-resq-blue-light text-resq-blue font-bold shadow-xs"
                        : "text-slate-600 hover:text-resq-navy hover:bg-slate-50"
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-resq-blue" : "text-slate-400 group-hover:text-resq-navy"}`} />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Profile & System Links - Only Settings, Audio, and Help */}
      <div className="p-3 border-t border-resq-border bg-slate-50/80">
        <div className="flex items-center justify-around px-2 py-1.5 text-slate-500">
          <Link
            href="/settings"
            className="hover:text-amber-600 p-2 rounded-xl hover:bg-white transition-colors"
            title="System & Tenant Settings"
          >
            <Settings className="w-4 h-4" />
          </Link>
          <button
            type="button"
            onClick={toggleAudio}
            className={`p-2 rounded-xl transition-all ${
              audioEnabled
                ? "text-amber-600 hover:bg-amber-50"
                : "text-slate-400 hover:text-slate-600 hover:bg-slate-200"
            }`}
            title={audioEnabled ? "Operational Audio: Enabled (Click to Mute)" : "Operational Audio: Muted (Click to Enable)"}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <Link
            href="/developers"
            className="hover:text-amber-600 p-2 rounded-xl hover:bg-white transition-colors"
            title="Help, Safety & API Guidelines"
          >
            <HelpCircle className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
