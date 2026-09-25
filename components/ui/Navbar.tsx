"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, User, LogOut, Shield } from "lucide-react";
import { getActiveSession, logoutUser, getRoleRedirectPath } from "@/lib/auth";
import { UserSession } from "@/lib/types";

export default function Navbar() {
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);

  useEffect(() => {
    setSession(getActiveSession());

    const handleAuthChange = (e: any) => {
      setSession(e.detail || null);
    };

    window.addEventListener("resqfood-auth-change", handleAuthChange);
    return () => {
      window.removeEventListener("resqfood-auth-change", handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    logoutUser();
    setSession(null);
    router.push("/auth");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-slate-950/85 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-950/70 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* HopePlate Logo - Clean & High Visibility */}
          <Link href="/" className="flex items-center gap-3 group py-2">
            <img
              src="/logo.png"
              alt="HopePlate Charity Food Distribution"
              className="h-12 sm:h-14 md:h-16 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          {/* Right Action: Clean Authentication Gateway */}
          <div className="flex items-center gap-3">
            {session ? (
              <div className="flex items-center gap-3">
                <Link
                  href={getRoleRedirectPath(session.role)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs font-black shadow-md transition-all flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Open {session.role} Hub</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2 rounded-xl border border-white/20 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs font-black shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                <span>Register / Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
