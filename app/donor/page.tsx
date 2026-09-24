"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Utensils,
  PlusCircle,
  Clock,
  MapPin,
  Truck,
  Sparkles,
  Flame,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Leaf,
  Layers,
} from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import AiDonationModal from "@/components/donor/AiDonationModal";
import RescueNetworkMap from "@/components/maps/RescueNetworkMap";
import { MapMarker } from "@/lib/maps";

export default function DonorDashboardPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"ACTIVE" | "HISTORY">("ACTIVE");

  // Floating operational KPI metrics
  const donorKpis = {
    foodRescuedKg: 345,
    mealsSupported: 1380,
    co2eAvoidedKg: 862,
    activeRescues: 2,
    criticalCount: 1,
    successRate: "98.5%",
  };

  const donorDonations = [
    {
      id: "RF-10283",
      foodName: "Paneer Butter Masala, Jeera Rice & Garlic Naan",
      category: "Prepared Meals",
      quantity: 30,
      unit: "KG",
      status: "IN_TRANSIT",
      urgency: "HIGH",
      recipient: "Hope Community Shelter",
      driver: "Rahul Sharma",
      eta: "12 mins",
      time: "45 mins ago",
      progress: 65,
    },
    {
      id: "RF-10104",
      foodName: "Steamed Vegetable Biryani & Dal Kettles",
      category: "Prepared Meals",
      quantity: 25,
      unit: "KG",
      status: "POSTED",
      urgency: "CRITICAL",
      recipient: "Matching Active...",
      driver: "Dispatch Pending",
      eta: "Express window (<42m)",
      time: "15 mins ago",
      progress: 20,
    },
    {
      id: "RF-10088",
      foodName: "Assorted Breakfast Pastries & Baguettes",
      category: "Bakery",
      quantity: 20,
      unit: "KG",
      status: "DELIVERED",
      urgency: "LOW",
      recipient: "St. Jude Mercy Food Bank",
      driver: "Priya Nair",
      eta: "Delivered",
      time: "Yesterday",
      progress: 100,
    },
  ];

  const mapMarkers: MapMarker[] = [
    {
      id: "greenfork",
      type: "DONOR",
      latitude: 12.9784,
      longitude: 77.6408,
      title: "GreenFork (Kitchen Hub)",
      subtitle: "30 KG Hot Chafing Batch Ready",
    },
    {
      id: "hope-shelter",
      type: "RECIPIENT",
      latitude: 12.9612,
      longitude: 77.6534,
      title: "Hope Community Shelter",
      subtitle: "Incoming RF-10283 • ETA 12m",
    },
    {
      id: "driver-rahul",
      type: "DRIVER",
      latitude: 12.9701,
      longitude: 77.6432,
      title: "Driver Rahul Sharma",
      subtitle: "In Transit on Old Airport Road",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Floating Operational Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-resq-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-resq-blue-light text-resq-blue">
              <Utensils className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Donor Command View
            </span>
          </div>
          <h1 className="text-2xl font-black text-resq-navy mt-1">
            GreenFork Restaurant & Banquets
          </h1>
          <p className="text-xs text-resq-secondary">
            100 Feet Road, Indiranagar • Zero-Waste Operational Kitchen
          </p>
        </div>

        {/* Signature Primary CTA */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-6 py-3.5 rounded-2xl bg-resq-blue hover:bg-resq-blue-hover text-white text-xs font-bold shadow-glow flex items-center gap-2 active:scale-95 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>CREATE DONATION (AI ASSISTANT)</span>
          </button>
        </div>
      </div>

      {/* Floating Operational KPI Data Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-resq-border shadow-card">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Food Rescued
          </span>
          <span className="text-xl font-black text-resq-navy mt-0.5 block">
            {donorKpis.foodRescuedKg} KG
          </span>
          <span className="text-[10px] text-resq-green font-semibold flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" />
            +45 KG this week
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-resq-border shadow-card">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Meals Supported
          </span>
          <span className="text-xl font-black text-emerald-800 mt-0.5 block">
            {donorKpis.mealsSupported}
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">
            4 local shelters
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-resq-border shadow-card">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            CO2e Prevented
          </span>
          <span className="text-xl font-black text-blue-800 mt-0.5 block">
            {donorKpis.co2eAvoidedKg} KG
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">
            EPA WARM factor
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-resq-border shadow-card">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Active Rescues
          </span>
          <span className="text-xl font-black text-resq-blue mt-0.5 block">
            {donorKpis.activeRescues}
          </span>
          <span className="text-[10px] text-resq-blue font-semibold block mt-1">
            In live routing
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-red-200 shadow-card">
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-500 block">
            Critical Alerts
          </span>
          <span className="text-xl font-black text-red-600 mt-0.5 block flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-red-500" />
            {donorKpis.criticalCount}
          </span>
          <span className="text-[10px] text-red-500 font-semibold block mt-1">
            &lt;42 mins remaining
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-resq-border shadow-card">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Success Rate
          </span>
          <span className="text-xl font-black text-resq-navy mt-0.5 block">
            {donorKpis.successRate}
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">
            Zero expired food
          </span>
        </div>
      </div>

      {/* Main Grid: Active Donations & Live Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Active Donations Queue */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-resq-navy">
              Active Donations & Transit Queue
            </h3>
            <div className="flex gap-1 p-0.5 bg-slate-100 rounded-lg text-xs">
              <button
                onClick={() => setActiveTab("ACTIVE")}
                className={`px-3 py-1 rounded-md font-bold transition-colors ${
                  activeTab === "ACTIVE" ? "bg-white text-resq-navy shadow-sm" : "text-slate-500"
                }`}
              >
                Active (2)
              </button>
              <button
                onClick={() => setActiveTab("HISTORY")}
                className={`px-3 py-1 rounded-md font-bold transition-colors ${
                  activeTab === "HISTORY" ? "bg-white text-resq-navy shadow-sm" : "text-slate-500"
                }`}
              >
                History
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {donorDonations.map((d) => (
              <div
                key={d.id}
                className="p-5 rounded-2xl bg-white border border-resq-border shadow-sm space-y-3 hover:border-resq-blue/40 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-resq-blue-light text-resq-blue font-bold text-xs">
                        {d.id}
                      </span>
                      <StatusBadge status={d.status} />
                      <StatusBadge status={d.urgency} type="urgency" />
                    </div>
                    <h4 className="text-sm font-bold text-resq-navy mt-2">
                      {d.foodName}
                    </h4>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-black text-resq-navy">
                      {d.quantity} {d.unit}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-semibold">
                      {d.quantity * 4} Meals
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-resq-secondary pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Recipient</span>
                    <span className="font-semibold text-resq-navy">{d.recipient}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Driver</span>
                    <span className="font-semibold text-resq-navy">{d.driver}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">ETA</span>
                    <span className="font-semibold text-resq-blue">{d.eta}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="pt-1">
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-resq-blue rounded-full transition-all duration-500"
                      style={{ width: `${d.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs pt-1">
                  <span className="text-[11px] text-slate-400">{d.time}</span>
                  <Link
                    href={`/rescues/${d.id}`}
                    className="font-bold text-resq-blue hover:underline flex items-center gap-1"
                  >
                    View Live Route →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Live Map & AI Insights */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-sm font-bold text-resq-navy">
            Live Network & Driver Corridors
          </h3>

          <RescueNetworkMap
            markers={mapMarkers}
            heightClass="h-[340px]"
          />

          {/* AI Predictive Insight Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-resq-navy to-[#0C2540] text-white space-y-2 shadow-card">
            <div className="flex items-center gap-2 text-xs font-bold text-resq-green-bright">
              <Sparkles className="w-4 h-4" />
              <span>AI Surplus Forecast: Weekend Banquet</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Historical trends indicate a 45-60 KG hot prepared surplus this Saturday evening (8-10 PM). Pre-allocating Hope Community Shelter and Driver Rahul.
            </p>
            <div className="flex justify-between items-center text-[10px] text-slate-400 pt-2 border-t border-white/10">
              <span>Model Confidence: 94%</span>
              <span className="text-resq-green-bright font-semibold">Auto-Reserved</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Donation Assistant Modal */}
      <AiDonationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={(donation) => {
          // Handled via realtime events automatically
        }}
      />
    </div>
  );
}
