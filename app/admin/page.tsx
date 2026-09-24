"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Flame,
  Truck,
  Building2,
  Clock,
  Sparkles,
  AlertTriangle,
  MapPin,
  CheckCircle2,
  Users,
  Search,
  Filter,
} from "lucide-react";
import RescueNetworkMap from "@/components/maps/RescueNetworkMap";
import StatusBadge from "@/components/ui/StatusBadge";
import { MapMarker } from "@/lib/maps";

export default function AdminCommandCenterPage() {
  const [selectedCity, setSelectedCity] = useState("Bengaluru");
  const [activeTab, setActiveTab] = useState<"ACTIVE" | "CRITICAL" | "AUDIT">("ACTIVE");

  const cityKpis = {
    activeRescues: 8,
    criticalCount: 2,
    availableDrivers: 12,
    foodRescuedTodayKg: 1420,
    mealsSupportedToday: 5680,
    avgMatchingTimeMins: 1.4,
  };

  const criticalQueue = [
    {
      id: "RF-10104",
      foodName: "Vegetable Biryani & Dal Makhani Thermal Kettles",
      donor: "Silicon Tech Hub Cafeteria (Bellandur)",
      quantityKg: 55,
      urgency: "CRITICAL",
      remainingMins: 38,
      status: "POSTED",
      suggestedDriver: "Driver Farooq (Refrigerated Van • 2.4 KM)",
      suggestedShelter: "Ananda Community Kitchen",
    },
    {
      id: "RF-10283",
      foodName: "Paneer Butter Masala & Naan",
      donor: "GreenFork Restaurant (Indiranagar)",
      quantityKg: 30,
      urgency: "HIGH",
      remainingMins: 85,
      status: "IN_TRANSIT",
      suggestedDriver: "Rahul Sharma (Car • On Route)",
      suggestedShelter: "Hope Community Shelter",
    },
  ];

  const recentAuditLogs = [
    {
      id: "a1",
      action: "DELIVERY_CONFIRMED",
      entity: "Rescue RF-10088",
      user: "Priya Nair (Driver)",
      time: "12 mins ago",
      details: "Handoff verified at St. Jude Mercy Food Bank (45 KG)",
    },
    {
      id: "a2",
      action: "PICKUP_CONFIRMED",
      entity: "Rescue RF-10283",
      user: "Rahul Sharma (Driver)",
      time: "24 mins ago",
      details: "QR code verified; hot hold temperature 68°C recorded",
    },
    {
      id: "a3",
      action: "AI_MATCH_CALCULATED",
      entity: "Donation RF-10104",
      user: "AI Matching Engine v1",
      time: "32 mins ago",
      details: "Score 96 awarded to Ananda Community Kitchen",
    },
    {
      id: "a4",
      action: "DONATION_CREATED",
      entity: "Donation RF-10104",
      user: "Silicon Tech Cafeteria",
      time: "35 mins ago",
      details: "55 KG fresh biryani entered operational window",
    },
  ];

  const cityMarkers: MapMarker[] = [
    {
      id: "d1",
      type: "DONOR",
      latitude: 12.9784,
      longitude: 77.6408,
      title: "GreenFork Restaurant",
      subtitle: "Active Donation RF-10283",
    },
    {
      id: "d2",
      type: "DONOR",
      latitude: 12.9299,
      longitude: 77.6833,
      title: "Silicon Tech Cafeteria",
      subtitle: "CRITICAL: 38 mins left (55 KG)",
    },
    {
      id: "s1",
      type: "RECIPIENT",
      latitude: 12.9612,
      longitude: 77.6534,
      title: "Hope Community Shelter",
      subtitle: "Incoming Rescue RF-10283",
    },
    {
      id: "s2",
      type: "RECIPIENT",
      latitude: 12.9823,
      longitude: 77.6211,
      title: "Ananda Community Kitchen",
      subtitle: "High Demand: 60 KG Need",
    },
    {
      id: "drv1",
      type: "DRIVER",
      latitude: 12.9701,
      longitude: 77.6432,
      title: "Rahul Sharma (Driver)",
      subtitle: "In Transit on Old Airport Road",
    },
    {
      id: "crit1",
      type: "CRITICAL",
      latitude: 12.9299,
      longitude: 77.6833,
      title: "CRITICAL HOTSPOT",
      subtitle: "Needs immediate driver dispatch",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* City Command Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-resq-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-resq-navy text-white">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              City Operations Command Center
            </span>
          </div>
          <h1 className="text-2xl font-black text-resq-navy mt-1">
            Municipal Food Rescue Authority
          </h1>
          <p className="text-xs text-resq-secondary">
            Live telemetry across 18 certified organizations and 12 active EV dispatch drivers
          </p>
        </div>

        {/* City Filter & Refresh */}
        <div className="flex items-center gap-3">
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="p-2.5 rounded-xl border border-resq-border text-xs font-bold text-resq-navy bg-white shadow-sm"
          >
            <option value="Bengaluru">Bengaluru Hub (18 Orgs)</option>
            <option value="Mumbai">Mumbai Hub (Expanding)</option>
            <option value="Delhi">Delhi NCR Hub (Planned)</option>
            <option value="Hyderabad">Hyderabad Hub (Planned)</option>
          </select>
        </div>
      </div>

      {/* Realtime City Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-resq-border shadow-card">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Rescued Today
          </span>
          <span className="text-xl font-black text-resq-navy mt-0.5 block">
            {cityKpis.foodRescuedTodayKg} KG
          </span>
          <span className="text-[10px] text-resq-green font-semibold block mt-1">
            {cityKpis.mealsSupportedToday} meals supported
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-red-200 shadow-card">
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-500 block">
            Critical Window (&lt;1h)
          </span>
          <span className="text-xl font-black text-red-600 mt-0.5 block flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-red-500" />
            {cityKpis.criticalCount} Donations
          </span>
          <span className="text-[10px] text-red-500 font-semibold block mt-1">
            Priority dispatch queue
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-resq-border shadow-card">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Active Rescues
          </span>
          <span className="text-xl font-black text-resq-blue mt-0.5 block">
            {cityKpis.activeRescues}
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">
            En route right now
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-resq-border shadow-card">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Available Drivers
          </span>
          <span className="text-xl font-black text-emerald-800 mt-0.5 block">
            {cityKpis.availableDrivers}
          </span>
          <span className="text-[10px] text-emerald-600 font-semibold block mt-1">
            GPS connected
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-resq-border shadow-card">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Avg Matching Time
          </span>
          <span className="text-xl font-black text-resq-navy mt-0.5 block">
            {cityKpis.avgMatchingTimeMins} min
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">
            Automated engine
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-resq-border shadow-card">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Zero-Waste Index
          </span>
          <span className="text-xl font-black text-resq-green mt-0.5 block">
            98.8%
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">
            Safe intake audit
          </span>
        </div>
      </div>

      {/* Main Operations Grid: City Map & Operations Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Large City Network Map with Hotspots */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-resq-navy flex items-center gap-2">
              <MapPin className="w-4 h-4 text-resq-blue" />
              Live Bengaluru Metropolitan Rescue Grid
            </h3>
            <span className="text-xs text-slate-400">
              Surplus vs Demand Zone Heatmap
            </span>
          </div>

          <RescueNetworkMap
            markers={cityMarkers}
            heightClass="h-[460px]"
          />
        </div>

        {/* Right: Critical Rescue Queue & Live Audit Logs */}
        <div className="lg:col-span-5 space-y-6">
          {/* Critical Queue */}
          <div className="bg-white rounded-3xl border border-resq-border p-5 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-resq-navy flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-resq-red" />
                Critical Urgency Queue (&lt;1h)
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                {criticalQueue.length} Pending
              </span>
            </div>

            <div className="space-y-3">
              {criticalQueue.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-red-50/50 border border-red-200 space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-bold text-resq-navy block">
                        {item.foodName}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {item.donor} • {item.quantityKg} KG
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-red-500 text-white font-black text-[11px] shrink-0 animate-pulse">
                      {item.remainingMins}m LEFT
                    </span>
                  </div>

                  <div className="pt-2 border-t border-red-200/60 flex items-center justify-between text-[11px]">
                    <span className="text-slate-600">
                      Recommendation: <strong>{item.suggestedShelter}</strong>
                    </span>
                    <Link
                      href="/matching"
                      className="font-bold text-resq-blue hover:underline"
                    >
                      Express Match →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Logs Stream */}
          <div className="bg-white rounded-3xl border border-resq-border p-5 shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-resq-navy">
                Live Cryptographic Audit Trail
              </h3>
              <span className="text-[11px] text-slate-400">Realtime Stream</span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {recentAuditLogs.map((log) => (
                <div key={log.id} className="py-2.5 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-resq-navy">{log.action}</span>
                    <span className="text-[10px] text-slate-400">{log.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">{log.details}</p>
                  <span className="text-[10px] text-resq-blue font-semibold block">
                    {log.user}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
