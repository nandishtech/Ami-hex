"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Utensils,
  Truck,
  HeartHandshake,
  ShieldCheck,
  CheckCircle2,
  User,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { UserRole, UserSession } from "@/lib/types";
import { getActiveSession, setActiveSession, DEMO_USERS } from "@/lib/auth";

interface StakeholderAccessGateProps {
  requiredRole: UserRole;
  platformName: string;
}

export default function StakeholderAccessGate({
  requiredRole,
  platformName,
}: StakeholderAccessGateProps) {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    setSession(getActiveSession());

    const handleAuthChange = (e: any) => {
      setSession(e.detail || getActiveSession());
    };

    window.addEventListener("resqfood-auth-change", handleAuthChange);
    return () => {
      window.removeEventListener("resqfood-auth-change", handleAuthChange);
    };
  }, []);

  if (isDismissed || !session) return null;

  const isMatchedRole = session.role === requiredRole;

  // When already matched, show a very clean, minimal notification bar that does not obstruct the UI
  if (isMatchedRole) {
    return null;
  }

  const handleAuthorizeRole = () => {
    const demo = DEMO_USERS[requiredRole];
    setActiveSession(demo);
    setSession(demo);
  };

  const roleDisplayName =
    requiredRole === "DONOR"
      ? "Food Donor"
      : requiredRole === "DRIVER"
      ? "Delivery Driver"
      : requiredRole === "RECIPIENT"
      ? "Recipient Shelter"
      : "City Admin";

  return (
    <div className="w-full mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs transition-all">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
          {requiredRole === "DONOR" && <Utensils className="w-4 h-4" />}
          {requiredRole === "DRIVER" && <Truck className="w-4 h-4" />}
          {requiredRole === "RECIPIENT" && <HeartHandshake className="w-4 h-4" />}
          {requiredRole === "ADMIN" && <ShieldCheck className="w-4 h-4" />}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-slate-900">{platformName}</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900 font-bold text-[10px]">
              Viewing as {session.role}
            </span>
          </div>
          <p className="text-slate-600 mt-0.5">
            Switch to the {roleDisplayName} profile or register to unlock live dispatches and actions for this platform.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto flex-wrap">
        <button
          type="button"
          onClick={handleAuthorizeRole}
          className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all active:scale-95"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Switch to {DEMO_USERS[requiredRole].name}</span>
        </button>

        <Link
          href="/auth"
          className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
        >
          <User className="w-3.5 h-3.5" />
          <span>Register / Login</span>
        </Link>

        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
          title="Dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
