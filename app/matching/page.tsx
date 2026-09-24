"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Sliders,
  CheckCircle2,
  Split,
  Truck,
  HeartHandshake,
  MapPin,
  Clock,
  ArrowRight,
  Database,
  Filter,
} from "lucide-react";
import AiMatcherSimulation from "@/components/matching/AiMatcherSimulation";

export default function MatchingPage() {
  const [selectedBatch, setSelectedBatch] = useState<"HOT_MEALS" | "BAKERY" | "DAIRY">("HOT_MEALS");

  const scenarios = {
    HOT_MEALS: {
      id: "donation-demo-101",
      foodName: "Paneer Butter Masala, Jeera Rice & Garlic Naan",
      quantityKg: 30,
      category: "Prepared Meals",
      donorName: "GreenFork Banquets",
      location: "Indiranagar 100 Ft Rd",
    },
    BAKERY: {
      id: "donation-demo-102",
      foodName: "French Baguettes, Sourdough Loaves & Croissants",
      quantityKg: 25,
      category: "Bakery",
      donorName: "Artisan Breads Bengaluru",
      location: "Koramangala 5th Block",
    },
    DAIRY: {
      id: "donation-demo-103",
      foodName: "Greek Yogurt Tubs, Pasteurized Milk & Cottage Cheese",
      quantityKg: 40,
      category: "Dairy & Produce",
      donorName: "Nilgiri Fresh Dairy Hub",
      location: "MG Road, Central",
    },
  };

  return (
    <div className="w-full max-w-[1640px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-resq-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-resq-blue-light text-resq-blue">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Autonomous Logistics & Matching Architecture
            </span>
          </div>
          <h1 className="text-2xl font-black text-resq-navy mt-1">
            AI Multi-Criteria Matching Simulator
          </h1>
          <p className="text-xs text-resq-secondary">
            Real-time multi-dimensional scoring engine balancing urgency, transit friction, shelter intake capacity, dietary compatibility, and driver proximity.
          </p>
        </div>

        {/* Batch Selection Tabs */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-2xl text-xs font-bold">
            <button
              onClick={() => setSelectedBatch("HOT_MEALS")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                selectedBatch === "HOT_MEALS"
                  ? "bg-white text-resq-navy shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              🔥 Hot Chafing (30 KG)
            </button>
            <button
              onClick={() => setSelectedBatch("BAKERY")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                selectedBatch === "BAKERY"
                  ? "bg-white text-resq-navy shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              🥖 Bakery (25 KG)
            </button>
            <button
              onClick={() => setSelectedBatch("DAIRY")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                selectedBatch === "DAIRY"
                  ? "bg-white text-resq-navy shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              ❄️ Dairy / Cold (40 KG)
            </button>
          </div>

          <Link
            href="/demo"
            className="px-4 py-2 rounded-2xl bg-resq-navy hover:bg-resq-navy-dark text-white text-xs font-bold transition-all shadow-sm"
          >
            Launch Demo Flow →
          </Link>
        </div>
      </div>

      {/* Main Simulation View */}
      <AiMatcherSimulation
        key={selectedBatch}
        initialDonation={scenarios[selectedBatch]}
      />
    </div>
  );
}
