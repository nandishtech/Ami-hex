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
} from "lucide-react";
import AiMatcherSimulation from "@/components/matching/AiMatcherSimulation";

export default function MatchingPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-resq-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-resq-blue-light text-resq-blue">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Autonomous Logistics Engine
            </span>
          </div>
          <h1 className="text-2xl font-black text-resq-navy mt-1">
            AI Matcher & Multi-Criteria Simulator
          </h1>
          <p className="text-xs text-resq-secondary">
            Simulate and audit real-time matching between active food surplus and regional shelter capacity.
          </p>
        </div>

        <Link
          href="/demo"
          className="px-4 py-2 rounded-xl bg-resq-navy hover:bg-resq-navy-dark text-white text-xs font-bold transition-colors"
        >
          View Demo Scenario →
        </Link>
      </div>

      {/* Main Simulation View */}
      <AiMatcherSimulation
        initialDonation={{
          id: "donation-demo-101",
          foodName: "Paneer Butter Masala, Jeera Rice & Garlic Naan",
          quantityKg: 30,
          category: "Prepared Meals",
        }}
      />
    </div>
  );
}
