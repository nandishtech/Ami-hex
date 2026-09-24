"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Truck,
  Building2,
  Utensils,
  MapPin,
  Play,
  ArrowRight,
  X,
  Sparkles,
} from "lucide-react";

interface SearchItem {
  id: string;
  title: string;
  category: "RESCUE" | "ORGANIZATION" | "DRIVER" | "ACTION";
  subtitle: string;
  href: string;
}

const SEARCH_ITEMS: SearchItem[] = [
  {
    id: "action-demo",
    title: "Run End-to-End Rescue Demo",
    category: "ACTION",
    subtitle: "GreenFork (30 KG) → Hope Shelter → Rahul Sharma (Score: 96)",
    href: "/demo",
  },
  {
    id: "action-create",
    title: "Create Donation (AI Assistant)",
    category: "ACTION",
    subtitle: "Convert text or photo to instant structured rescue request",
    href: "/donor?action=create",
  },
  {
    id: "rescue-demo",
    title: "Rescue RF-10283 (In Transit)",
    category: "RESCUE",
    subtitle: "30 KG Paneer Rice & Naan • Rahul Sharma • ETA: 12 mins",
    href: "/rescues/RF-10283",
  },
  {
    id: "rescue-10203",
    title: "Rescue RF-10203 (Delivered)",
    category: "RESCUE",
    subtitle: "45 KG Continental Bakery • St. Jude Food Bank",
    href: "/rescues/RF-10203",
  },
  {
    id: "org-greenfork",
    title: "GreenFork Restaurant",
    category: "ORGANIZATION",
    subtitle: "Verified Donor • Indiranagar • Farm-to-table kitchen",
    href: "/donor",
  },
  {
    id: "org-hope",
    title: "Hope Community Shelter",
    category: "ORGANIZATION",
    subtitle: "Verified Recipient • Old Airport Road • 180 KG capacity",
    href: "/recipient",
  },
  {
    id: "driver-rahul",
    title: "Rahul Sharma (EV Car)",
    category: "DRIVER",
    subtitle: "1.2 KM from Indiranagar • 85 KG vehicle capacity • Available",
    href: "/driver",
  },
  {
    id: "action-matcher",
    title: "AI Matcher & Rescue Score Simulator",
    category: "ACTION",
    subtitle: "Multi-parameter matching engine with explainability",
    href: "/matching",
  },
  {
    id: "action-admin",
    title: "City Operations Command Center",
    category: "ACTION",
    subtitle: "Real-time municipal rescue queue, heatmaps & driver dispatch",
    href: "/admin",
  },
];

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    const handleCustomOpen = () => setIsOpen(true);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", handleCustomOpen);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", handleCustomOpen);
    };
  }, []);

  if (!isOpen) return null;

  const filtered = SEARCH_ITEMS.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (href: string) => {
    setIsOpen(false);
    setQuery("");
    router.push(href);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-resq-navy/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-floating border border-resq-border overflow-hidden">
        {/* Search Input */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-resq-border">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <input
            type="text"
            placeholder="Search rescues, shelters, drivers, or type an action..."
            className="w-full text-sm text-resq-text placeholder-slate-400 focus:outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No matching rescue records found.
            </div>
          ) : (
            filtered.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item.href)}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-resq-blue-light text-resq-blue flex items-center justify-center shrink-0">
                    {item.category === "RESCUE" && <Truck className="w-4 h-4" />}
                    {item.category === "ORGANIZATION" && <Building2 className="w-4 h-4" />}
                    {item.category === "DRIVER" && <MapPin className="w-4 h-4" />}
                    {item.category === "ACTION" && <Sparkles className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-resq-text group-hover:text-resq-blue transition-colors">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-slate-400">{item.subtitle}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-resq-blue transition-colors" />
              </button>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-resq-border flex items-center justify-between text-[11px] text-slate-400">
          <span>Navigate with arrows, Enter to select</span>
          <span className="font-semibold">RESQFOOD Command System</span>
        </div>
      </div>
    </div>
  );
}
