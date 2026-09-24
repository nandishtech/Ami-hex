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
} from "lucide-react";
import { DEMO_USERS, getActiveSession, switchDemoRole } from "@/lib/auth";
import { UserRole, UserSession } from "@/lib/types";

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function Sidebar({ collapsed = false, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const [session, setSession] = useState<UserSession>(DEMO_USERS.DONOR);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  useEffect(() => {
    setSession(getActiveSession());
  }, [pathname]);

  const navSections = [
    {
      title: "OVERVIEW",
      items: [
        { label: "Dashboard", href: `/${session.role.toLowerCase()}`, icon: LayoutDashboard },
      ],
    },
    {
      title: "OPERATIONS",
      items: [
        { label: "Donations", href: "/donor", icon: Utensils },
        { label: "Active Rescues", href: "/rescues", icon: Truck },
        { label: "Rescue History", href: "/rescues?status=DELIVERED", icon: History },
      ],
    },
    {
      title: "INTELLIGENCE",
      items: [
        { label: "AI Matcher", href: "/matching", icon: Sparkles },
        { label: "AI Assistant", href: "/donor?action=create", icon: Bot },
        { label: "Analytics", href: "/analytics", icon: BarChart3 },
      ],
    },
    {
      title: "NETWORK",
      items: [
        { label: "Recipients", href: "/recipient", icon: HeartHandshake },
        { label: "Drivers", href: "/driver", icon: Navigation },
        { label: "Live Network", href: "/network", icon: Globe },
      ],
    },
    {
      title: "IMPACT",
      items: [
        { label: "Impact", href: "/impact", icon: Leaf },
        { label: "ESG Reports", href: "/impact#esg", icon: FileSpreadsheet },
      ],
    },
    {
      title: "ORGANIZATION",
      items: [
        { label: "Team", href: "/settings?tab=team", icon: Users },
        { label: "Branches", href: "/settings?tab=branches", icon: GitBranch },
        { label: "Integrations", href: "/settings?tab=integrations", icon: Puzzle },
      ],
    },
  ];

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
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-resq-navy flex items-center justify-center text-white font-black tracking-wider shadow-sm group-hover:scale-105 transition-transform relative overflow-hidden shrink-0">
              <span className="text-resq-green-bright text-lg">R</span>
              <span className="text-white text-xs font-semibold">Q</span>
              <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-resq-green-bright animate-ping opacity-75" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-base font-black tracking-tight text-resq-navy flex items-center gap-1.5 leading-tight">
                  RESQFOOD
                  <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-resq-blue-light text-resq-blue">
                    SaaS
                  </span>
                </span>
                <span className="text-[10px] text-resq-secondary font-medium truncate">
                  Rescue Food. Route Hope.
                </span>
              </div>
            )}
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
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href) && item.href !== `/${session.role.toLowerCase()}`);
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

      {/* Bottom Profile & System Links */}
      <div className="p-3 border-t border-resq-border bg-slate-50/60 space-y-2">
        {/* System Links */}
        <div className="flex items-center justify-around px-2 py-1 text-slate-400">
          <Link href="/notifications" className="hover:text-resq-navy p-1" title="Notifications">
            <Bell className="w-4 h-4" />
          </Link>
          <Link href="/settings" className="hover:text-resq-navy p-1" title="Settings">
            <Settings className="w-4 h-4" />
          </Link>
          <Link href="/developers" className="hover:text-resq-navy p-1" title="Help & API Documentation">
            <HelpCircle className="w-4 h-4" />
          </Link>
        </div>

        {/* User Persona & Organization Card */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="w-full flex items-center justify-between p-2 rounded-xl border border-resq-border bg-white hover:border-slate-300 transition-colors text-left"
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-200 shrink-0">
                <img
                  src={session.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                  alt={session.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {!collapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-resq-navy truncate">
                    {session.name}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-resq-green font-bold">
                      VERIFIED {session.role}
                    </span>
                  </div>
                </div>
              )}
            </div>
            {!collapsed && <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
          </button>

          {/* Quick Role Switcher Dropdown */}
          {showRoleDropdown && (
            <div className="absolute bottom-full left-0 right-0 mb-2 rounded-2xl bg-white shadow-floating border border-resq-border p-2 z-50 animate-in fade-in slide-in-from-bottom-2 text-xs">
              <span className="px-2.5 py-1 text-[10px] font-bold uppercase text-slate-400 block border-b border-resq-border mb-1">
                Switch Operational Persona
              </span>
              {(["DONOR", "RECIPIENT", "DRIVER", "ADMIN"] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => handleRoleChange(r)}
                  className={`w-full text-left px-2.5 py-2 rounded-lg font-semibold flex items-center justify-between transition-colors ${
                    session.role === r
                      ? "bg-resq-blue-light text-resq-blue"
                      : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <span>{r}</span>
                  {session.role === r && <ShieldCheck className="w-3.5 h-3.5 text-resq-blue" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
