"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Truck,
  HeartHandshake,
  Utensils,
  Play,
  Layers,
  Clock,
  MapPin,
  Leaf,
  ChevronRight,
  Flame,
  Globe,
  Award,
} from "lucide-react";
import OpeningHandoffExperience from "@/components/3d/OpeningHandoffExperience";
import Hero3DNetwork from "@/components/3d/Hero3DNetwork";
import RescueNetworkMap from "@/components/maps/RescueNetworkMap";

export default function HomePage() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <div className="min-h-screen bg-resq-bg text-resq-text selection:bg-resq-blue selection:text-white">
      {/* 1. CINEMATIC 3D OPENING EXPERIENCE (Act I, II, III) */}
      {showIntro && (
        <OpeningHandoffExperience onComplete={() => setShowIntro(false)} />
      )}

      {/* 2. SCROLL-DRIVEN LANDING STORY */}
      <section className="relative overflow-hidden py-16 lg:py-24 bg-gradient-to-b from-white to-resq-bg border-b border-resq-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Narrative */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-resq-blue-light text-resq-blue text-xs font-bold border border-resq-blue/20">
                <Sparkles className="w-3.5 h-3.5" />
                Operational AI Food Logistics SaaS
              </div>

              <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-resq-navy leading-[1.1]">
                Turn Surplus Food Into{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-resq-blue to-resq-green">
                  Real-Time Relief.
                </span>
              </h2>

              <p className="text-base sm:text-lg text-resq-secondary leading-relaxed max-w-xl">
                RESQFOOD connects restaurants, banquets, and supermarkets with verified shelters and volunteer EV drivers in minutes—eliminating food waste through explainable AI matching and verified handoffs.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/donor?action=create"
                  className="px-6 py-3.5 rounded-xl bg-resq-blue hover:bg-resq-blue-hover text-white font-bold text-sm shadow-glow transition-all flex items-center gap-2"
                >
                  Start a Rescue
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/auth"
                  className="px-5 py-3.5 rounded-xl bg-resq-navy hover:bg-resq-navy-dark text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-resq-gold" />
                  Sign In / Register
                </Link>

                <Link
                  href="/demo"
                  className="px-5 py-3.5 rounded-xl bg-white border border-resq-border text-resq-navy hover:bg-slate-50 font-bold text-sm shadow-sm transition-all flex items-center gap-2"
                >
                  <Play className="w-4 h-4 text-resq-green fill-current" />
                  Interactive Demo
                </Link>
              </div>

              {/* KPI Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-resq-border">
                <div>
                  <span className="text-2xl font-black text-resq-navy block">
                    18 min
                  </span>
                  <span className="text-xs text-resq-secondary font-medium">
                    Average Dispatch
                  </span>
                </div>
                <div>
                  <span className="text-2xl font-black text-resq-green block">
                    96.4%
                  </span>
                  <span className="text-xs text-resq-secondary font-medium">
                    Match Success
                  </span>
                </div>
                <div>
                  <span className="text-2xl font-black text-resq-blue block">
                    14,200+
                  </span>
                  <span className="text-xs text-resq-secondary font-medium">
                    Meals Supported
                  </span>
                </div>
              </div>
            </div>

            {/* Right Interactive 3D Sphere Network */}
            <div className="relative h-[420px] rounded-3xl bg-resq-navy overflow-hidden shadow-floating border border-resq-border">
              <div className="absolute top-4 left-4 z-10">
                <span className="px-2.5 py-1 rounded-md bg-white/10 backdrop-blur text-white text-[11px] font-bold">
                  Living Ecosystem Telemetry
                </span>
              </div>
              <Hero3DNetwork />
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW RESQFOOD WORKS (The 5-Step Operational Pipeline) */}
      <section className="py-20 bg-white border-b border-resq-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-resq-blue">
              Autonomous Logistics Pipeline
            </span>
            <h3 className="text-3xl font-black text-resq-navy mt-1">
              How RESQFOOD Solves Operational Food Waste
            </h3>
            <p className="text-sm text-resq-secondary mt-2">
              Every donation travels seamlessly from natural description to verified delivery without delays.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-resq-border relative">
              <span className="text-xs font-black text-resq-blue mb-2 block">
                01 • INTAKE
              </span>
              <h4 className="text-sm font-bold text-resq-navy">AI Natural Extraction</h4>
              <p className="text-xs text-resq-secondary mt-1">
                Type, speak, or upload photo. AI extracts quantity, category, and temperature hold window.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-resq-border relative">
              <span className="text-xs font-black text-resq-blue mb-2 block">
                02 • MATCHING
              </span>
              <h4 className="text-sm font-bold text-resq-navy">Rescue Score Engine</h4>
              <p className="text-xs text-resq-secondary mt-1">
                Evaluates distance, urgency, capacity, food category, and driver proximity (0-100 score).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-resq-border relative">
              <span className="text-xs font-black text-resq-blue mb-2 block">
                03 • DISPATCH
              </span>
              <h4 className="text-sm font-bold text-resq-navy">Mobile Driver App</h4>
              <p className="text-xs text-resq-secondary mt-1">
                Volunteer driver accepts via 1-tap card and navigates with real-time GPS routing.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-resq-border relative">
              <span className="text-xs font-black text-resq-blue mb-2 block">
                04 • VERIFICATION
              </span>
              <h4 className="text-sm font-bold text-resq-navy">QR & Sensor Audit</h4>
              <p className="text-xs text-resq-secondary mt-1">
                Dual QR scan, hot holding temperature check, and GPS timestamp ensure safe custody.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 relative">
              <span className="text-xs font-black text-emerald-800 mb-2 block">
                05 • IMPACT
              </span>
              <h4 className="text-sm font-bold text-emerald-950">Impact Ripple & ESG</h4>
              <p className="text-xs text-emerald-800 mt-1">
                Instant meal count, EPA WARM CO2e calculation, and downloadable corporate receipt.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ROLE ARCHITECTURE (For Donors, Shelters, Drivers, Cities) */}
      <section className="py-20 bg-resq-bg border-b border-resq-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-resq-green">
              Multi-Stakeholder Architecture
            </span>
            <h3 className="text-3xl font-black text-resq-navy mt-1">
              Purpose-Built for Every Operational Role
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Donor */}
            <div className="bg-white p-6 rounded-3xl border border-resq-border shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-resq-blue-light text-resq-blue flex items-center justify-center mb-4">
                  <Utensils className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-resq-navy">For Food Donors</h4>
                <p className="text-xs text-resq-secondary mt-2 leading-relaxed">
                  Restaurants, banquets, and supermarkets create donations in seconds with AI natural language and track live driver arrival.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                <Link
                  href="/auth?mode=register&role=donor"
                  className="text-resq-blue hover:underline"
                >
                  Register as Donor →
                </Link>
                <Link
                  href="/auth?mode=login&role=donor"
                  className="text-slate-500 hover:text-resq-navy"
                >
                  Sign In
                </Link>
              </div>
            </div>

            {/* Recipient */}
            <div className="bg-white p-6 rounded-3xl border border-resq-border shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-resq-green-light text-resq-green flex items-center justify-center mb-4">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-resq-navy">For Shelters & NGOs</h4>
                <p className="text-xs text-resq-secondary mt-2 leading-relaxed">
                  Interactive capacity slider dynamically attracts compatible donations while current-needs gaps prioritize specific items.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                <Link
                  href="/auth?mode=register&role=recipient"
                  className="text-resq-green hover:underline"
                >
                  Register Shelter →
                </Link>
                <Link
                  href="/auth?mode=login&role=recipient"
                  className="text-slate-500 hover:text-resq-navy"
                >
                  Sign In
                </Link>
              </div>
            </div>

            {/* Driver */}
            <div className="bg-white p-6 rounded-3xl border border-resq-border shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-4">
                  <Truck className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-resq-navy">For Drivers & Fleet</h4>
                <p className="text-xs text-resq-secondary mt-2 leading-relaxed">
                  Mobile-first navigation, 1-tap swipe to accept, QR pickup scans, and handoff verification with large touch targets.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                <Link
                  href="/auth?mode=register&role=driver"
                  className="text-indigo-600 hover:underline"
                >
                  Register as Driver →
                </Link>
                <Link
                  href="/auth?mode=login&role=driver"
                  className="text-slate-500 hover:text-resq-navy"
                >
                  Sign In
                </Link>
              </div>
            </div>

            {/* Admin */}
            <div className="bg-white p-6 rounded-3xl border border-resq-border shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-resq-navy flex items-center justify-center mb-4">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-resq-navy">City Command Center</h4>
                <p className="text-xs text-resq-secondary mt-2 leading-relaxed">
                  Municipal authorities monitor real-time surplus vs demand zones, critical rescue queues, and audit logs.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                <Link
                  href="/auth?mode=register&role=admin"
                  className="text-resq-navy hover:underline"
                >
                  Register Command →
                </Link>
                <Link
                  href="/auth?mode=login&role=admin"
                  className="text-slate-500 hover:text-resq-navy"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE DEMO CTA SECTION */}
      <section className="py-20 bg-resq-navy text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-resq-green-bright border border-white/20">
            <Award className="w-4 h-4" />
            Full End-to-End Walkthrough Ready
          </div>

          <h3 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Experience the Complete Connected Rescue
          </h3>

          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Test the live story: GreenFork (30 KG Paneer Rice) → AI Match (Hope Shelter 96) → Driver Rahul acceptance → QR verification → Impact Ripple.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              href="/demo"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-resq-blue to-resq-green text-white font-black text-sm shadow-glow hover:opacity-95 transition-all flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              Launch Demo Walkthrough
            </Link>

            <Link
              href="/network"
              className="px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm backdrop-blur border border-white/20 transition-all flex items-center gap-2"
            >
              <Globe className="w-4 h-4" />
              Inspect City Network
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
