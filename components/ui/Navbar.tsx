"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sparkles,
  Search,
  Bell,
  MapPin,
  ChevronDown,
  User,
  Shield,
  Truck,
  HeartHandshake,
  Utensils,
  Play,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import { DEMO_USERS, getActiveSession, switchDemoRole } from "@/lib/auth";
import { UserRole, UserSession } from "@/lib/types";
import { realtime } from "@/lib/realtime";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<UserSession>(DEMO_USERS.DONOR);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const [recentNotifs, setRecentNotifs] = useState([
    {
      id: "n1",
      title: "Driver Rahul Sharma accepted RF-10283",
      time: "2 mins ago",
      type: "RESCUE",
      read: false,
    },
    {
      id: "n2",
      title: "Critical rescue window: 42 mins remaining",
      time: "10 mins ago",
      type: "CRITICAL",
      read: false,
    },
    {
      id: "n3",
      title: "Delivery Confirmed: +120 meals to Hope Shelter",
      time: "25 mins ago",
      type: "IMPACT",
      read: false,
    },
  ]);

  useEffect(() => {
    setSession(getActiveSession());

    // Listen for realtime events to update notifications dynamically
    const unsubscribe = realtime.subscribe("*", (msg) => {
      setUnreadCount((c) => c + 1);
      setRecentNotifs((prev) => [
        {
          id: `n-${Date.now()}`,
          title: `Realtime update: ${msg.type.replace(/_/g, " ")}`,
          time: "Just now",
          type: "RESCUE",
          read: false,
        },
        ...prev.slice(0, 5),
      ]);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleRoleChange = (role: UserRole) => {
    const newSession = switchDemoRole(role);
    setSession(newSession);
    setShowRoleMenu(false);

    // Route to appropriate dashboard
    if (role === "DONOR") router.push("/donor");
    else if (role === "RECIPIENT") router.push("/recipient");
    else if (role === "DRIVER") router.push("/driver");
    else if (role === "ADMIN") router.push("/admin");
  };

  const navLinks = [
    { label: "Dashboard", href: `/${session.role.toLowerCase()}` },
    { label: "Active Rescues", href: "/rescues" },
    { label: "AI Matcher", href: "/matching" },
    { label: "Network Map", href: "/network" },
    { label: "Impact & ESG", href: "/impact" },
    ...(session.role === "ADMIN" ? [{ label: "City Ops", href: "/admin" }] : []),
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-resq-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-resq-navy flex items-center justify-center text-white font-black tracking-wider shadow-sm group-hover:scale-105 transition-transform relative overflow-hidden">
                <span className="text-resq-green-bright text-lg">R</span>
                <span className="text-white text-xs font-semibold">Q</span>
                <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-resq-green-bright animate-ping opacity-75" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tight text-resq-navy flex items-center gap-1.5">
                  RESQFOOD
                  <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-resq-blue-light text-resq-blue">
                    SaaS v1.0
                  </span>
                </span>
                <span className="text-[11px] text-resq-secondary font-medium -mt-1 hidden sm:block">
                  Rescue Food. Route Hope.
                </span>
              </div>
            </Link>

            {/* Main Nav Links (Desktop) */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-resq-blue-light text-resq-blue"
                        : "text-resq-secondary hover:text-resq-text hover:bg-slate-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Quick Demo Mode Button */}
            <Link
              href="/demo"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-resq-blue to-resq-green text-white shadow-sm hover:opacity-95 transition-opacity"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Demo Flow
            </Link>

            {/* Global Search Trigger (Ctrl+K) */}
            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent("open-command-palette"));
              }}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-resq-border text-resq-secondary text-xs hover:border-slate-300 transition-colors bg-slate-50"
              title="Search (Ctrl + K)"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Search...</span>
              <kbd className="hidden md:inline px-1.5 py-0.5 text-[10px] font-semibold bg-white border border-slate-200 rounded text-slate-500">
                ⌘K
              </kbd>
            </button>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifs(!showNotifs)}
                className="relative p-2 rounded-lg text-resq-secondary hover:text-resq-text hover:bg-slate-50 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-resq-red text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {showNotifs && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-floating border border-resq-border p-4 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-3 border-b border-resq-border">
                    <span className="text-sm font-bold text-resq-navy">
                      Live Operations Alerts
                    </span>
                    <button
                      onClick={() => setUnreadCount(0)}
                      className="text-xs text-resq-blue hover:underline"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto mt-2">
                    {recentNotifs.map((n) => (
                      <div
                        key={n.id}
                        className="py-2.5 flex items-start gap-2.5 text-xs hover:bg-slate-50 rounded-lg p-1.5 transition-colors"
                      >
                        <div
                          className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                            n.type === "CRITICAL"
                              ? "bg-resq-red"
                              : n.type === "IMPACT"
                              ? "bg-resq-green"
                              : "bg-resq-blue"
                          }`}
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-resq-text">{n.title}</p>
                          <span className="text-slate-400 text-[11px]">{n.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-slate-100 text-center">
                    <Link
                      href="/notifications"
                      className="text-xs text-resq-secondary hover:text-resq-blue"
                    >
                      View all audit & rescue alerts →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Role Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-resq-border hover:bg-slate-50 transition-colors text-left"
              >
                <div className="w-7 h-7 rounded-lg overflow-hidden bg-slate-200 shrink-0">
                  <img
                    src={session.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                    alt={session.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className="text-xs font-bold text-resq-navy leading-none">
                    {session.role}
                  </span>
                  <span className="text-[10px] text-resq-secondary leading-none truncate max-w-[100px]">
                    {session.name.split(" ")[0]}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Role Switcher Modal / Dropdown */}
              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white shadow-floating border border-resq-border p-2 z-50">
                  <div className="px-3 py-2 border-b border-resq-border mb-1">
                    <p className="text-xs font-semibold text-slate-400 uppercase">
                      Switch Active Persona
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Explore role-specific workflows
                    </p>
                  </div>

                  <button
                    onClick={() => handleRoleChange("DONOR")}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-xs font-medium transition-colors ${
                      session.role === "DONOR"
                        ? "bg-resq-blue-light text-resq-blue"
                        : "hover:bg-slate-50 text-resq-text"
                    }`}
                  >
                    <Utensils className="w-4 h-4 text-resq-blue" />
                    <div>
                      <p className="font-bold">Donor (Chef Vikram)</p>
                      <p className="text-[11px] text-slate-400">GreenFork Restaurant</p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleRoleChange("RECIPIENT")}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-xs font-medium transition-colors ${
                      session.role === "RECIPIENT"
                        ? "bg-resq-green-light text-resq-green"
                        : "hover:bg-slate-50 text-resq-text"
                    }`}
                  >
                    <HeartHandshake className="w-4 h-4 text-resq-green" />
                    <div>
                      <p className="font-bold">Recipient (Sister Teresa)</p>
                      <p className="text-[11px] text-slate-400">Hope Community Shelter</p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleRoleChange("DRIVER")}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-xs font-medium transition-colors ${
                      session.role === "DRIVER"
                        ? "bg-indigo-50 text-indigo-700"
                        : "hover:bg-slate-50 text-resq-text"
                    }`}
                  >
                    <Truck className="w-4 h-4 text-indigo-600" />
                    <div>
                      <p className="font-bold">Driver (Rahul Sharma)</p>
                      <p className="text-[11px] text-slate-400">EV Fleet Dispatch</p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleRoleChange("ADMIN")}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-xs font-medium transition-colors ${
                      session.role === "ADMIN"
                        ? "bg-slate-100 text-resq-navy"
                        : "hover:bg-slate-50 text-resq-text"
                    }`}
                  >
                    <Shield className="w-4 h-4 text-resq-navy" />
                    <div>
                      <p className="font-bold">Admin (City Ops)</p>
                      <p className="text-[11px] text-slate-400">Command Center & Audit</p>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
