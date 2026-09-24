"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Utensils,
  Truck,
  HeartHandshake,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  User,
  Shield,
  CheckCircle2,
  Lock,
  ChevronDown,
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

  const handleAuthorizeRole = () => {
    const demo = DEMO_USERS[requiredRole];
    setActiveSession(demo);
    setSession(demo);
  };

  return (
    <div
      className="w-full mb-6 p-4 rounded-2xl text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-md"
      style={{
        backgroundColor: isMatchedRole ? "rgba(16, 185, 129, 0.12)" : "rgba(23, 105, 255, 0.12)",
        border: isMatchedRole ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid rgba(23, 105, 255, 0.3)",
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{
            backgroundColor: isMatchedRole ? "#10B981" : "#1769FF",
            color: "#ffffff",
          }}
        >
          {requiredRole === "DONOR" && <Utensils className="w-5 h-5" />}
          {requiredRole === "DRIVER" && <Truck className="w-5 h-5" />}
          {requiredRole === "RECIPIENT" && <HeartHandshake className="w-5 h-5" />}
          {requiredRole === "ADMIN" && <ShieldCheck className="w-5 h-5" />}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="font-black text-slate-900 dark:text-white">
              {platformName}
            </span>
            <span
              className="text-[10px] font-extrabold px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: isMatchedRole ? "#D1FAE5" : "#DBEAFE",
                color: isMatchedRole ? "#065F46" : "#1E40AF",
              }}
            >
              {isMatchedRole ? "✓ Active Session Verified" : "⚠️ Preview Mode (Logged as " + session.role + ")"}
            </span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 mt-0.5">
            {isMatchedRole
              ? `Operational console unlocked for ${session.name} (${session.organizationName || session.role}).`
              : `You are accessing this section while active as ${session.name}. Switch or register to save data under this role.`}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
        {!isMatchedRole && (
          <button
            type="button"
            onClick={handleAuthorizeRole}
            className="px-3.5 py-1.5 rounded-xl font-bold text-white shadow-sm flex items-center gap-1.5 transition-all hover:opacity-90"
            style={{
              backgroundColor: requiredRole === "DONOR" ? "#1769FF" : requiredRole === "DRIVER" ? "#10B981" : "#A855F7",
            }}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>1-Click Authorize as {DEMO_USERS[requiredRole].name.split(" ")[0]}</span>
          </button>
        )}

        <Link
          href={`/auth?role=${requiredRole.toLowerCase()}`}
          className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
        >
          <User className="w-3.5 h-3.5" />
          <span>Registration / Login Gate</span>
        </Link>

        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-2 py-1 text-xs"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
