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
import AuthPortal from "@/components/auth/AuthPortal";

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
                HOPEPLATE connects restaurants, banquets, and supermarkets with verified shelters and volunteer EV drivers in minutes—eliminating food waste through explainable AI matching and verified handoffs.
              </p>

              {/* Action Buttons: Focused on Registration & Login Gateway */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#gateway"
                  className="px-7 py-4 rounded-xl bg-resq-blue hover:bg-resq-blue-hover text-white font-black text-sm shadow-glow transition-all flex items-center gap-2.5"
                >
                  <Sparkles className="w-4 h-4 text-resq-gold" />
                  Stakeholder Registration & Login Gateway
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="#login-section"
                  className="px-6 py-4 rounded-xl bg-resq-navy hover:bg-resq-navy-dark text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
                >
                  Fast Profile Login
                </a>
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

      {/* 2.5 STAKEHOLDER REGISTRATION & FAST LOGIN GATEWAY */}
      <section id="gateway" className="relative py-12 lg:py-16 bg-[#071626] border-y border-slate-800">
        <AuthPortal />
      </section>

      {/* 3. HOW RESQFOOD WORKS (The 5-Step Operational Pipeline) */}
      <section className="py-20 bg-white border-b border-resq-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-resq-blue">
              Autonomous Logistics Pipeline
            </span>
            <h3 className="text-3xl font-black text-resq-navy mt-1">
              How HOPEPLATE Solves Operational Food Waste
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
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-resq-navy">City Command Center</h4>
                <p className="text-xs text-resq-secondary mt-2 leading-relaxed">
                  Municipal authorities monitor real-time surplus vs demand zones, critical rescue queues, and audit logs.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-mono text-[10px]">
                  admin / admin123
                </span>
                <Link
                  href="/auth#login-section"
                  className="text-amber-600 hover:underline"
                >
                  Admin Sign In →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. STAKEHOLDER REGISTRATION & FAST ACCESS CTA */}
      <section className="py-20 bg-[#071626] text-white relative overflow-hidden border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-xs font-bold text-blue-300 border border-blue-500/40">
            <Sparkles className="w-4 h-4 text-resq-gold" />
            Join the Food Rescue Ecosystem
          </div>

          <h3 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Ready to Connect Surplus with Human Relief?
          </h3>

          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Whether you are a commercial kitchen, food business, shelter NGO, or volunteer EV driver, register your profile in minutes.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <a
              href="#gateway"
              className="px-8 py-4 rounded-xl bg-resq-blue text-white font-black text-sm shadow-glow hover:bg-resq-blue-hover transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-resq-gold" />
              Register Stakeholder Account
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="#login-section"
              className="px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm backdrop-blur border border-white/20 transition-all flex items-center gap-2"
            >
              Sign In to Your Platform
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
