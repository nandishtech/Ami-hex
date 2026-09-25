"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Navbar from "@/components/ui/Navbar";
import MobileBottomNav from "@/components/ui/MobileBottomNav";
import CommandPalette from "@/components/ui/CommandPalette";
import ToastNotification from "@/components/ui/ToastNotification";
import BreadDonationAnimation from "@/components/illustrations/BreadDonationAnimation";
import {
  getActiveSession,
  setActiveSession,
  DEMO_USERS,
  PERMANENT_ADMIN,
  getRoleRedirectPath,
} from "@/lib/auth";
import { UserSession, UserRole } from "@/lib/types";
import {
  Lock,
  ShieldCheck,
  Utensils,
  Truck,
  HeartHandshake,
  ArrowRight,
  Sparkles,
  Zap,
} from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [session, setSession] = useState<UserSession | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    setSession(getActiveSession());
    setAuthChecked(true);

    const handleAuthChange = (e: any) => {
      setSession(e.detail || null);
    };

    window.addEventListener("resqfood-auth-change", handleAuthChange);
    return () => {
      window.removeEventListener("resqfood-auth-change", handleAuthChange);
    };
  }, [pathname]);

  const handleQuickLogin = (role: UserRole) => {
    const user = DEMO_USERS[role];
    setActiveSession(user);
    setSession(user);
    const target = getRoleRedirectPath(role);
    router.push(target);
  };

  const handleAdminLogin = () => {
    setActiveSession(PERMANENT_ADMIN.user);
    setSession(PERMANENT_ADMIN.user);
    router.push("/admin");
  };

  // Marketing / Landing page uses full-bleed layout with top navigation
  const isMarketing = pathname === "/";
  const isAuth =
    pathname.startsWith("/auth") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register");

  if (isAuth) {
    return (
      <div className="min-h-screen bg-slate-950 font-sans">
        <main className="w-full">{children}</main>
        <ToastNotification />
      </div>
    );
  }

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

  // COMPULSORY AUTHENTICATION BARRIER FOR ALL OPERATIONAL DASHBOARDS
  if (authChecked && !session) {
    return (
      <div className="min-h-screen bg-[#071626] text-white flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden font-sans">
        {/* Ambient atmospheric glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl w-full mx-auto space-y-6 text-center">
          {/* HopePlate Logo */}
          <div className="flex justify-center">
            <img
              src="/logo.png"
              alt="HopePlate Charity Food Distribution"
              className="h-20 sm:h-24 w-auto object-contain drop-shadow-2xl"
            />
          </div>

          {/* Bread Donation Animation */}
          <div className="py-2">
            <BreadDonationAnimation />
          </div>

          {/* Compulsory Authentication Card */}
          <div
            className="rounded-3xl p-6 sm:p-8 backdrop-blur-2xl bg-white/[0.04] border border-white/20 shadow-2xl text-left space-y-5"
            style={{
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
            }}
          >
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  AUTHENTICATION COMPULSORY
                </span>
                <h2 className="text-xl font-black text-white mt-0.5">
                  Sign In Required to Open Dashboard
                </h2>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              To guarantee chain-of-custody food safety, prevent spoilage, and coordinate real-time EV routing within the 10 KM delivery corridor, all operational sections require authenticated stakeholder access.
            </p>

            {/* Permanent Admin Credentials Callout */}
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-white block">Permanent Admin Login</span>
                  <span className="text-slate-300">
                    Username: <strong className="text-amber-300 font-mono">admin</strong> • Password: <strong className="text-amber-300 font-mono">admin123</strong>
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAdminLogin}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Admin Sign In</span>
              </button>
            </div>

            {/* Quick Stakeholder Login Buttons */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                Or Sign In With Stakeholder Role:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleQuickLogin("DONOR")}
                  className="p-3 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-left transition-all group flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-amber-400" />
                    <div>
                      <span className="text-xs font-bold text-white block">Food Donor</span>
                      <span className="text-[10px] text-amber-300">Chef Vikram</span>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin("DRIVER")}
                  className="p-3 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-left transition-all group flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="text-xs font-bold text-white block">Delivery Driver</span>
                      <span className="text-[10px] text-emerald-300">Rahul Sharma</span>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin("RECIPIENT")}
                  className="p-3 rounded-2xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-left transition-all group flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <HeartHandshake className="w-4 h-4 text-purple-400" />
                    <div>
                      <span className="text-xs font-bold text-white block">Shelter / NGO</span>
                      <span className="text-[10px] text-purple-300">Sister Teresa</span>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-purple-400 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Bottom Register / Sign In Full Gateway Link */}
            <div className="pt-2 flex items-center justify-between border-t border-white/10 text-xs">
              <Link href="/" className="text-slate-400 hover:text-white transition-colors">
                ← Back to Home
              </Link>
              <Link
                href="/auth"
                className="font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                <span>Open Full Registration & Login Gateway</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
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
