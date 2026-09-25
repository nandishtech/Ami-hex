"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  PlusCircle,
  Truck,
  HeartHandshake,
  BarChart3,
  MapPin,
  ClipboardList,
  Sparkles,
} from "lucide-react";
import { getActiveSession } from "@/lib/auth";
import { UserRole } from "@/lib/types";

interface NavItem {
  label: string;
  href: string;
  icon: any;
  highlight?: boolean;
}

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [role, setRole] = useState<UserRole>("DONOR");

  useEffect(() => {
    const s = getActiveSession();
    if (s?.role) {
      setRole(s.role);
    }
  }, [pathname]);

  // Role-specific bottom navigation configurations as per Spec 63
  const navItems: Record<UserRole, NavItem[]> = {
    DONOR: [
      { label: "Home", href: "/donor", icon: Home },
      { label: "Create", href: "/donor?action=create", icon: PlusCircle, highlight: true },
      { label: "Rescues", href: "/rescues", icon: Truck },
      { label: "Impact", href: "/impact", icon: BarChart3 },
    ],
    RECIPIENT: [
      { label: "Home", href: "/recipient", icon: Home },
      { label: "Needs", href: "/recipient#needs", icon: ClipboardList },
      { label: "Incoming", href: "/rescues", icon: Truck },
      { label: "Impact", href: "/impact", icon: BarChart3 },
    ],
    DRIVER: [
      { label: "Jobs", href: "/driver", icon: Truck, highlight: true },
      { label: "Live Map", href: "/network", icon: MapPin },
      { label: "Matcher", href: "/matching", icon: Sparkles },
      { label: "Impact", href: "/impact", icon: BarChart3 },
    ],
    ADMIN: [
      { label: "Ops", href: "/admin", icon: Home },
      { label: "Network", href: "/network", icon: MapPin },
      { label: "Rescues", href: "/rescues", icon: Truck },
      { label: "Impact", href: "/impact", icon: BarChart3 },
    ],
  };

  const items = navItems[role] || navItems.DONOR;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-resq-border px-3 py-2">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.highlight) {
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex flex-col items-center justify-center -mt-5"
              >
                <div className="w-12 h-12 rounded-full bg-resq-blue text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-resq-blue mt-1">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center min-w-[48px] py-1 transition-colors ${
                isActive ? "text-resq-blue font-bold" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
