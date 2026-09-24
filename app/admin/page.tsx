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
  Activity,
  Zap,
  RefreshCw,
  Sliders,
  Send,
  BatteryCharging,
} from "lucide-react";
import RescueNetworkMap from "@/components/maps/RescueNetworkMap";
import StatusBadge from "@/components/ui/StatusBadge";
import { MapMarker } from "@/lib/maps";

export default function AdminCommandCenterPage() {
  const [selectedCity, setSelectedCity] = useState("Bengaluru");
  const [activeTab, setActiveTab] = useState<"ACTIVE" | "CRITICAL" | "DRIVERS" | "AUDIT">("CRITICAL");
  const [searchTerm, setSearchTerm] = useState("");
  const [overrideModalRescue, setOverrideModalRescue] = useState<any | null>(null);

  const cityKpis = {
    activeRescues: 8,
    criticalCount: 2,
    availableDrivers: 12,
    foodRescuedTodayKg: 1420,
    mealsSupportedToday: 5680,
    avgMatchingTimeMins: 1.4,
    fleetBatteryAvg: 79,
  };

  const criticalQueue = [
    {
      id: "RF-10104",
      foodName: "Vegetable Biryani & Dal Makhani Thermal Kettles",
      donor: "Silicon Tech Hub Cafeteria",
      donorLocation: "Bellandur Outer Ring Rd",
      quantityKg: 55,
      urgency: "CRITICAL",
      remainingMins: 38,
      status: "POSTED",
      temperature: "72°C Hot Hold",
      suggestedDriver: "Farooq Ahmed (Refrigerated Van • 2.4 KM)",
      suggestedShelter: "Ananda Community Kitchen",
    },
    {
      id: "RF-10283",
      foodName: "Paneer Butter Masala & Naan",
      donor: "GreenFork Restaurant",
      donorLocation: "100 Feet Road, Indiranagar",
      quantityKg: 30,
      urgency: "HIGH",
      remainingMins: 85,
      status: "IN_TRANSIT",
      temperature: "68°C Hot Hold",
      suggestedDriver: "Rahul Sharma (Tata Nexon EV • On Route)",
      suggestedShelter: "Hope Community Shelter",
    },
    {
      id: "RF-10319",
      foodName: "Chilled Greek Yogurt & Fresh Cut Fruit",
      donor: "Nilgiri Dairy & Grocery Hub",
      donorLocation: "MG Road, Central",
      quantityKg: 18,
      urgency: "MEDIUM",
      remainingMins: 110,
      status: "MATCHED",
      temperature: "4°C Cold Chain",
      suggestedDriver: "Priya Nair (Piaggio Ape EV • 1.8 KM)",
      suggestedShelter: "St. Jude Mercy Food Bank",
    },
  ];

  const driverFleet = [
    {
      id: "d1",
      name: "Rahul Sharma",
      vehicle: "Tata Nexon EV",
      battery: 82,
      status: "EN_ROUTE",
      assignedRescue: "RF-10283",
      speed: "34 km/h",
      location: "Old Airport Road",
    },
    {
      id: "d2",
      name: "Priya Nair",
      vehicle: "Piaggio Ape EV",
      battery: 74,
      status: "DISPATCHED",
      assignedRescue: "RF-10319",
      speed: "22 km/h",
      location: "Victoria Road",
    },
    {
      id: "d3",
      name: "Farooq Ahmed",
      vehicle: "Mahindra Electric Van",
      battery: 91,
      status: "STANDBY",
      assignedRescue: "Available",
      speed: "0 km/h",
      location: "Bellandur Depot",
    },
    {
      id: "d4",
      name: "Amit Patel",
      vehicle: "Treo Zor EV",
      battery: 68,
      status: "STANDBY",
      assignedRescue: "Available",
      speed: "0 km/h",
      location: "Ulsoor Lake Hub",
    },
  ];

  const recentAuditLogs = [
    {
      id: "a1",
      action: "DELIVERY_CONFIRMED",
      entity: "Rescue RF-10088",
      user: "Priya Nair (Driver)",
      time: "12 mins ago",
      details: "Dual-pin verification executed at St. Jude Mercy Food Bank (45 KG)",
      statusColor: "text-resq-green",
    },
    {
      id: "a2",
      action: "PICKUP_CONFIRMED",
      entity: "Rescue RF-10283",
      user: "Rahul Sharma (Driver)",
      time: "24 mins ago",
      details: "QR code verified; hot hold temperature 68°C recorded",
      statusColor: "text-resq-blue",
    },
    {
      id: "a3",
      action: "AI_MATCH_CALCULATED",
      entity: "Donation RF-10104",
      user: "AI Logistics Engine v1",
      time: "32 mins ago",
      details: "Score 96 awarded to Ananda Community Kitchen",
      statusColor: "text-purple-600",
    },
    {
      id: "a4",
      action: "DONATION_CREATED",
      entity: "Donation RF-10104",
      user: "Silicon Tech Cafeteria",
      time: "35 mins ago",
      details: "55 KG fresh biryani entered operational rescue corridor",
      statusColor: "text-amber-600",
    },
  ];

  const cityMarkers: MapMarker[] = [
    {
      id: "d1",
      type: "DONOR",
      latitude: 12.9784,
      longitude: 77.6408,
      title: "GreenFork Banquets",
      subtitle: "RF-10283 (30 KG) Picked Up",
    },
    {
      id: "d2",
      type: "DONOR",
      latitude: 12.9352,
      longitude: 77.6245,
      title: "Silicon Tech Hub",
      subtitle: "RF-10104 (55 KG) Critical Window (<38m)",
    },
    {
      id: "s1",
      type: "RECIPIENT",
      latitude: 12.9612,
      longitude: 77.6534,
      title: "Hope Community Shelter",
      subtitle: "Incoming RF-10283 • ETA 12m",
    },
    {
      id: "s2",
      type: "RECIPIENT",
      latitude: 12.9823,
      longitude: 77.6211,
      title: "Ananda Community Kitchen",
      subtitle: "Target Intake for RF-10104",
    },
    {
      id: "dr1",
      type: "DRIVER",
      latitude: 12.9701,
      longitude: 77.6432,
      title: "Driver Rahul Sharma (EV)",
      subtitle: "34 km/h • Carrying RF-10283",
    },
    {
      id: "dr2",
      type: "DRIVER",
      latitude: 12.941,
      longitude: 77.631,
      title: "Driver Farooq Ahmed (EV)",
      subtitle: "Standby Bellandur Corridor",
    },
  ];

  return (
    <div className="w-full max-w-[1640px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* 1. City Command Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-resq-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-resq-blue-light text-resq-blue">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Metropolitan Operations Command
            </span>
          </div>
          <h1 className="text-2xl font-black text-resq-navy mt-1">
            City Logistics Command Center
          </h1>
          <p className="text-xs text-resq-secondary">
            Autonomous fleet orchestration, &lt;1h critical perishability queues, and real-time audit ledger.
          </p>
        </div>

        {/* City Filter & System Pulse */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-2xl text-xs font-bold text-emerald-900">
            <span className="w-2.5 h-2.5 rounded-full bg-resq-green animate-ping" />
            <span>18 Orgs Connected • 100% Healthy</span>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-2xl text-xs font-bold">
            {["Bengaluru", "Mumbai", "Delhi-NCR", "Hyderabad"].map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  selectedCity === city
                    ? "bg-white text-resq-navy shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. City KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-3xl border border-resq-border shadow-card">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Active Rescues
          </span>
          <span className="text-2xl font-black text-resq-blue mt-0.5 block">
            {cityKpis.activeRescues}
          </span>
          <span className="text-[11px] text-slate-400 font-semibold block mt-1">
            Across 4 corridors
          </span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-red-200 shadow-card">
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-500 block">
            Critical (&lt;1h)
          </span>
          <span className="text-2xl font-black text-red-600 mt-0.5 flex items-center gap-1">
            <Flame className="w-5 h-5 text-red-500 animate-pulse" />
            {cityKpis.criticalCount}
          </span>
          <span className="text-[11px] text-red-500 font-semibold block mt-1">
            Auto-dispatch active
          </span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-resq-border shadow-card">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Diverted Today
          </span>
          <span className="text-2xl font-black text-resq-navy mt-0.5 block">
            {cityKpis.foodRescuedTodayKg} KG
          </span>
          <span className="text-[11px] text-resq-green font-semibold block mt-1">
            ≈ {cityKpis.mealsSupportedToday} meals
          </span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-resq-border shadow-card">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            EV Drivers Active
          </span>
          <span className="text-2xl font-black text-emerald-800 mt-0.5 block">
            {cityKpis.availableDrivers}
          </span>
          <span className="text-[11px] text-slate-400 font-semibold block mt-1">
            Avg {cityKpis.fleetBatteryAvg}% battery
          </span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-resq-border shadow-card">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Avg Match Latency
          </span>
          <span className="text-2xl font-black text-purple-700 mt-0.5 block">
            {cityKpis.avgMatchingTimeMins}m
          </span>
          <span className="text-[11px] text-slate-400 font-semibold block mt-1">
            Multi-criteria AI
          </span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-resq-border shadow-card">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Zero-Waste Rate
          </span>
          <span className="text-2xl font-black text-resq-green mt-0.5 block">
            99.2%
          </span>
          <span className="text-[11px] text-slate-400 font-semibold block mt-1">
            Past 30 days
          </span>
        </div>
      </div>

      {/* 3. Operational Section: City Map Radar (55%) & Tabbed Management Console (45%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Large City Radar Map (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-resq-navy">
                Bengaluru Metropolitan Radar Map
              </h2>
              <p className="text-xs text-slate-500">
                Live monitoring of donor kitchens, recipient shelters, and electric vehicles
              </p>
            </div>
            <span className="text-xs font-bold text-resq-navy bg-slate-100 px-3 py-1 rounded-full">
              GPS Ping: 1.2s
            </span>
          </div>

          <div className="rounded-3xl overflow-hidden border border-resq-border shadow-card h-[520px] bg-slate-900 relative">
            <RescueNetworkMap
              markers={cityMarkers}
              centerLat={12.968}
              centerLng={77.638}
              zoomLevel={13}
              interactive={true}
            />

            {/* Floating City Summary Pill */}
            <div className="absolute top-4 left-4 bg-resq-navy/90 backdrop-blur-md text-white p-3 rounded-2xl border border-white/20 shadow-xl text-xs space-y-1">
              <div className="flex items-center gap-2 font-bold text-resq-green-bright">
                <span className="w-2 h-2 rounded-full bg-resq-green-bright animate-ping" />
                Bengaluru Operational Radius: 15 KM
              </div>
              <p className="text-[11px] text-slate-300">
                18 Partner Orgs • 12 Active EV Fleets • 2 Critical Windows
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Critical Queue, Driver Fleet & Audit Log (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-resq-border p-6 shadow-card space-y-4">
          {/* Tabs */}
          <div className="flex items-center justify-between border-b border-resq-border pb-3">
            <div className="flex gap-1 bg-slate-100 p-1 rounded-2xl text-xs font-bold">
              <button
                onClick={() => setActiveTab("CRITICAL")}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeTab === "CRITICAL"
                    ? "bg-white text-red-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Critical (&lt;1h)
              </button>
              <button
                onClick={() => setActiveTab("DRIVERS")}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeTab === "DRIVERS"
                    ? "bg-white text-resq-navy shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                EV Fleet ({driverFleet.length})
              </button>
              <button
                onClick={() => setActiveTab("AUDIT")}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeTab === "AUDIT"
                    ? "bg-white text-resq-navy shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Live Audit
              </button>
            </div>
          </div>

          {/* Tab 1: Critical Urgency Queue */}
          {activeTab === "CRITICAL" && (
            <div className="space-y-3">
              {criticalQueue.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl border border-red-200 bg-red-50/40 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-resq-navy">
                          {item.id}
                        </span>
                        <StatusBadge status={item.status as any} />
                      </div>
                      <h4 className="text-sm font-bold text-resq-navy mt-1">
                        {item.foodName}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {item.quantityKg} KG • {item.donor} ({item.donorLocation})
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-black text-red-600 bg-red-100 px-2.5 py-1 rounded-xl block">
                        {item.remainingMins} MINS REMAINING
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-1">
                        {item.temperature}
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-white rounded-xl border border-red-100 text-xs space-y-1">
                    <p className="text-slate-600">
                      Suggested Shelter: <strong className="text-resq-navy">{item.suggestedShelter}</strong>
                    </p>
                    <p className="text-slate-600">
                      Assigned Fleet: <strong className="text-resq-navy">{item.suggestedDriver}</strong>
                    </p>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() => setOverrideModalRescue(item)}
                      className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      Emergency Dispatch Override
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: Driver Fleet Radar */}
          {activeTab === "DRIVERS" && (
            <div className="space-y-3">
              {driverFleet.map((driver) => (
                <div
                  key={driver.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-resq-navy">{driver.name}</h4>
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          driver.status === "EN_ROUTE"
                            ? "bg-blue-100 text-blue-800"
                            : driver.status === "DISPATCHED"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {driver.status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px]">
                      {driver.vehicle} • {driver.location} ({driver.speed})
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="font-black text-resq-navy block">
                      {driver.battery}% EV Battery
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Job: {driver.assignedRescue}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Live System Audit Ledger */}
          {activeTab === "AUDIT" && (
            <div className="space-y-3">
              {recentAuditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-black text-[11px] ${log.statusColor}`}>
                      {log.action}
                    </span>
                    <span className="text-slate-400 text-[10px]">{log.time}</span>
                  </div>
                  <p className="font-bold text-resq-navy">{log.entity} — {log.user}</p>
                  <p className="text-slate-500 text-[11px]">{log.details}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4. Emergency Dispatch Override Modal */}
      {overrideModalRescue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-resq-navy-dark/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl border border-resq-border p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-resq-border pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-red-100 text-red-600">
                  <Flame className="w-4 h-4" />
                </span>
                <h3 className="text-base font-black text-resq-navy">
                  Manual Dispatch Override ({overrideModalRescue.id})
                </h3>
              </div>
              <button
                onClick={() => setOverrideModalRescue(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-slate-600">
                You are executing an administrator priority override for <strong>{overrideModalRescue.foodName}</strong> ({overrideModalRescue.quantityKg} KG).
              </p>
              <div className="p-3 bg-red-50 text-red-900 rounded-xl space-y-1">
                <p className="font-bold">⚠️ Perishability Deadline: {overrideModalRescue.remainingMins} mins</p>
                <p className="text-[11px]">
                  Manual override will directly re-route nearest EV Driver Farooq Ahmed and notify Ananda Kitchen intake staff via push notifications.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setOverrideModalRescue(null)}
                className="px-4 py-2 rounded-xl border border-resq-border text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert(`Override dispatched! Driver Farooq Ahmed assigned to rescue ${overrideModalRescue.id}.`);
                  setOverrideModalRescue(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-glow"
              >
                Confirm Priority Override
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
