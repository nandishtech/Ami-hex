"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
  Thermometer,
  ShieldCheck,
  Phone,
  Info,
  Calendar,
  ChevronRight,
  FileSpreadsheet,
  Coins,
} from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import AiDonationModal from "@/components/donor/AiDonationModal";
import RescueNetworkMap from "@/components/maps/RescueNetworkMap";
import StakeholderAccessGate from "@/components/auth/StakeholderAccessGate";
import LeaderboardAndTokenHub from "@/components/leaderboard/LeaderboardAndTokenHub";
import { MapMarker } from "@/lib/maps";

function DonorDashboardContent() {
  const searchParams = useSearchParams();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"ACTIVE" | "HISTORY" | "LEADERBOARD">("ACTIVE");
  const [selectedRescueId, setSelectedRescueId] = useState<string>("RF-10283");
  const [showMatchModal, setShowMatchModal] = useState(false);

  useEffect(() => {
    if (searchParams?.get("action") === "create") {
      setIsCreateModalOpen(true);
    }
    const tab = searchParams?.get("tab")?.toUpperCase();
    if (tab === "LEADERBOARD" || tab === "HISTORY" || tab === "ACTIVE") {
      setActiveTab(tab as any);
    }
  }, [searchParams]);

  // 4 Distinct KPI Modules
  const kpis = {
    foodRescuedKg: 345,
    weeklyTargetKg: 500,
    mealsSupported: 1380,
    partnerShelters: 4,
    co2eAvoidedKg: 862,
    treesEquivalent: 42,
    successRate: "98.5%",
    avgDispatchMins: 14,
  };

  const [rescues, setRescues] = useState([
    {
      id: "RF-10283",
      foodName: "Paneer Butter Masala, Jeera Rice & Garlic Naan",
      category: "Prepared Meals",
      quantity: 30,
      unit: "KG",
      status: "IN_TRANSIT",
      urgency: "HIGH",
      recipient: "Hope Community Shelter",
      recipientAddress: "Old Airport Road, Kodihalli",
      driver: "Rahul Sharma",
      driverVehicle: "Tata Nexon EV • DL-04-E-8291",
      driverPhone: "+91 98450 12839",
      deliveryPin: "8492",
      eta: "12 mins",
      speed: "34 km/h",
      temperature: "68°C (Hot Hold)",
      time: "45 mins ago",
      step: 4,
      totalSteps: 5,
      score: 96,
      matchRationale: {
        urgency: 25,
        distance: 23,
        capacity: 20,
        compatibility: 15,
        driver: 13,
        reasons: [
          "Hope Shelter requested 40 KG Prepared Meals within 1h window",
          "Distance is 3.8 KM along low-traffic Old Airport Road corridor",
          "EV Driver Rahul was stationed only 1.2 KM from GreenFork",
          "Hot food transit safety certified at 68°C",
        ],
      },
    },
    {
      id: "RF-10104",
      foodName: "Steamed Vegetable Biryani & Dal Kettles",
      category: "Prepared Meals",
      quantity: 25,
      unit: "KG",
      status: "POSTED",
      urgency: "CRITICAL",
      recipient: "AI Matching in progress...",
      recipientAddress: "Indiranagar Hub Depot",
      driver: "Dispatching nearby driver (<10 KM)...",
      driverVehicle: "Refrigerated / Insulated EV",
      driverPhone: "--",
      deliveryPin: "3917",
      eta: "Express window (<38m)",
      speed: "--",
      temperature: "72°C (Insulated Kettle)",
      time: "14 mins ago",
      step: 1,
      totalSteps: 5,
      score: 94,
      matchRationale: {
        urgency: 25,
        distance: 22,
        capacity: 20,
        compatibility: 14,
        driver: 13,
        reasons: [
          "Critical urgency: Hot food window expires at 8:30 PM",
          "Candidate: Ananda Community Kitchen (3.2 KM) ready for batch intake",
          "Top available driver within 10 KM range assigned",
        ],
      },
    },
    {
      id: "RF-10319",
      foodName: "Chilled Greek Yogurt, Milk & Fruit Salads",
      category: "Dairy & Produce",
      quantity: 18,
      unit: "KG",
      status: "MATCHED",
      urgency: "MEDIUM",
      recipient: "St. Jude Mercy Food Bank",
      recipientAddress: "Victoria Road, Bengaluru",
      driver: "Priya Nair",
      driverVehicle: "Piaggio Ape E-Xtra EV",
      driverPhone: "+91 99201 44820",
      deliveryPin: "5208",
      eta: "Pickup in 8 mins",
      speed: "Stationary",
      temperature: "4°C (Cold Chain)",
      time: "28 mins ago",
      step: 2,
      totalSteps: 5,
      score: 91,
      matchRationale: {
        urgency: 22,
        distance: 24,
        capacity: 20,
        compatibility: 13,
        driver: 12,
        reasons: [
          "St. Jude has commercial cold refrigeration unit verified online",
          "Short direct route via Inner Ring Road",
        ],
      },
    },
  ]);

  const completedHistory = [
    {
      id: "RF-10088",
      foodName: "Assorted Breakfast Pastries, Croissants & Baguettes",
      category: "Bakery",
      quantity: 20,
      unit: "KG",
      status: "DELIVERED",
      urgency: "LOW",
      recipient: "St. Jude Mercy Food Bank",
      driver: "Priya Nair",
      eta: "Delivered at 11:42 AM",
      time: "Yesterday",
      step: 5,
      totalSteps: 5,
      score: 95,
    },
    {
      id: "RF-10042",
      foodName: "Basmati Rice & Mixed Vegetable Curry Pots",
      category: "Prepared Meals",
      quantity: 45,
      unit: "KG",
      status: "DELIVERED",
      urgency: "HIGH",
      recipient: "Hope Community Shelter",
      driver: "Rahul Sharma",
      eta: "Delivered at 9:15 PM",
      time: "2 days ago",
      step: 5,
      totalSteps: 5,
      score: 98,
    },
  ];

  const mapMarkers: MapMarker[] = [
    {
      id: "greenfork",
      type: "DONOR",
      latitude: 12.9784,
      longitude: 77.6408,
      title: "GreenFork Banquets (You)",
      subtitle: "30 KG Hot Chafing Batch Active",
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
      title: "Driver Rahul Sharma (EV)",
      subtitle: "In Transit on Old Airport Road • 34 km/h",
    },
    {
      id: "ananda-kitchen",
      type: "RECIPIENT",
      latitude: 12.9823,
      longitude: 77.6211,
      title: "Ananda Community Kitchen",
      subtitle: "Matched Candidate for RF-10104",
    },
  ];

  const activeRescue = rescues.find((d) => d.id === selectedRescueId) || rescues[0];

  return (
    <div className="w-full max-w-[1640px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Stakeholder Access Gate Banner */}
      <StakeholderAccessGate
        requiredRole="DONOR"
        platformName="Food Donor Section (GreenFork Commercial Hub)"
      />

      {/* 1. Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-resq-navy-dark via-resq-navy to-[#133355] text-white p-6 sm:p-8 shadow-xl border border-white/10">
        <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-resq-blue/15 to-transparent pointer-events-none" />
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-resq-green/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/15 text-xs font-semibold text-resq-green-bright">
              <span className="w-2 h-2 rounded-full bg-resq-green-bright animate-ping" />
              YOUR RESCUE NETWORK IS ACTIVE
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Good afternoon, Chef Vikram.
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl font-medium">
              3 active rescues • 1 critical • 2 in transit. GreenFork Zero-Waste Commercial Kitchen Hub is operating at{" "}
              <span className="text-resq-green-bright font-bold">98.5% recovery efficiency</span>.
            </p>
          </div>

          {/* Quick Primary Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-6 py-3.5 rounded-2xl bg-resq-blue hover:bg-resq-blue-hover text-white text-xs font-bold shadow-glow flex items-center gap-2 active:scale-95 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>POST SURPLUS FOOD (AI ASSISTANT)</span>
            </button>

            <Link
              href="/matching"
              className="px-4 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold backdrop-blur border border-white/15 flex items-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4 text-resq-gold" />
              <span>Simulate Matching</span>
            </Link>

            <Link
              href="/impact"
              className="px-4 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold border border-white/10 flex items-center gap-2 transition-all"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>ESG Audit</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Four Distinct KPI Modules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Food Rescued */}
        <div className="bg-white p-5 rounded-3xl border border-resq-border shadow-card hover:border-resq-blue/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Food Rescued
            </span>
            <span className="p-2 rounded-xl bg-blue-50 text-resq-blue">
              <Utensils className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-resq-navy tracking-tight">
              {kpis.foodRescuedKg}
            </span>
            <span className="text-sm font-bold text-slate-500">KG</span>
            <span className="ml-auto text-xs font-bold text-resq-green flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              +18% wk
            </span>
          </div>
          {/* Progress bar towards weekly goal */}
          <div className="mt-3 space-y-1">
            <div className="flex justify-between text-[11px] font-semibold text-slate-400">
              <span>Weekly Target: {kpis.weeklyTargetKg} KG</span>
              <span className="text-resq-navy">69% reached</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-resq-blue rounded-full transition-all duration-700"
                style={{ width: `${(kpis.foodRescuedKg / kpis.weeklyTargetKg) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* KPI 2: Meals Supported */}
        <div className="bg-white p-5 rounded-3xl border border-resq-border shadow-card hover:border-resq-green/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Meals Supported
            </span>
            <span className="p-2 rounded-xl bg-emerald-50 text-resq-green">
              <Leaf className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-900 tracking-tight">
              {kpis.mealsSupported.toLocaleString()}
            </span>
            <span className="text-sm font-bold text-slate-500">portions</span>
            <span className="ml-auto text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              ReFED Standard
            </span>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Delivered directly across <strong className="text-resq-navy">{kpis.partnerShelters} verified shelters</strong> in East Bengaluru.
          </p>
        </div>

        {/* KPI 3: CO2e Avoided */}
        <div className="bg-white p-5 rounded-3xl border border-resq-border shadow-card hover:border-teal-400/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              CO2e Prevented
            </span>
            <span className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-teal-900 tracking-tight">
              {kpis.co2eAvoidedKg}
            </span>
            <span className="text-sm font-bold text-slate-500">KG CO2e</span>
            <span className="ml-auto text-xs font-bold text-teal-700">
              EPA WARM v15
            </span>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Equivalent to planting <strong className="text-resq-navy">{kpis.treesEquivalent} urban trees</strong> or avoiding 1,940 car kilometers.
          </p>
        </div>

        {/* KPI 4: Reliability & Dispatch */}
        <div className="bg-white p-5 rounded-3xl border border-resq-border shadow-card hover:border-amber-400/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Rescue Success Rate
            </span>
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-resq-navy tracking-tight">
              {kpis.successRate}
            </span>
            <span className="ml-auto text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
              Avg {kpis.avgDispatchMins}m dispatch
            </span>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Zero expired food events recorded in the last 90 operational days.
          </p>
        </div>
      </div>

      {/* 3. Operational Section: Split Queue (50%) & High-Fidelity Live Map (50%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Active Queue & History (Col 6) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-resq-navy">
                Rescue Operations Queue
              </h2>
              <p className="text-xs text-slate-500">
                Track active transit chains, temperatures, and driver dispatch
              </p>
            </div>

            <div className="flex gap-1 p-1 bg-slate-100 rounded-xl text-xs font-bold">
              <button
                onClick={() => setActiveTab("ACTIVE")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === "ACTIVE" ? "bg-white text-resq-navy shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Active ({rescues.length})
              </button>
              <button
                onClick={() => setActiveTab("HISTORY")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === "HISTORY" ? "bg-white text-resq-navy shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Delivered ({completedHistory.length})
              </button>
              <button
                onClick={() => setActiveTab("LEADERBOARD")}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === "LEADERBOARD" ? "bg-amber-500 text-white shadow-sm" : "text-amber-700 hover:text-amber-900"
                }`}
              >
                <Coins className="w-3.5 h-3.5" />
                Leaderboard & Tokens
              </button>
            </div>
          </div>

          {activeTab === "LEADERBOARD" ? (
            <div className="space-y-4">
              <LeaderboardAndTokenHub currentRole="DONOR" />
            </div>
          ) : activeTab === "ACTIVE" ? (
            <div className="space-y-3">
              {rescues.map((donation) => {
                const isSelected = selectedRescueId === donation.id;
                return (
                  <div
                    key={donation.id}
                    onClick={() => setSelectedRescueId(donation.id)}
                    className={`p-5 rounded-3xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-white border-resq-blue shadow-lg ring-2 ring-resq-blue/15"
                        : "bg-white border-resq-border hover:border-slate-300 shadow-sm"
                    }`}
                  >
                    {/* Top Row */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-resq-navy">
                            {donation.id}
                          </span>
                          <StatusBadge status={donation.status as any} />
                          {donation.urgency === "CRITICAL" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-black animate-pulse">
                              <Flame className="w-3 h-3 text-red-500" />
                              CRITICAL
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-black text-resq-navy mt-1">
                          {donation.foodName}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {donation.quantity} {donation.unit} • {donation.category}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-black text-resq-blue block">
                          ETA {donation.eta}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {donation.time}
                        </span>
                      </div>
                    </div>

                    {/* Stepper Progress Bar */}
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1.5">
                        <span>
                          Step {donation.step} of {donation.totalSteps}:{" "}
                          <strong className="text-resq-navy">
                            {donation.step === 1 && "AI Match Calculation"}
                            {donation.step === 2 && "Driver Assigned"}
                            {donation.step === 3 && "Pickup Verified"}
                            {donation.step === 4 && "In Transit to Shelter"}
                            {donation.step === 5 && "Delivered & Verified"}
                          </strong>
                        </span>
                        <span className="text-resq-blue font-bold">
                          {Math.round((donation.step / donation.totalSteps) * 100)}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            donation.urgency === "CRITICAL" ? "bg-red-500" : "bg-resq-blue"
                          }`}
                          style={{ width: `${(donation.step / donation.totalSteps) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Logistics Telemetry Strip */}
                    <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-2 text-slate-600">
                        <MapPin className="w-3.5 h-3.5 text-resq-blue shrink-0" />
                        <span className="truncate">
                          Shelter: <strong className="text-resq-navy">{donation.recipient}</strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Truck className="w-3.5 h-3.5 text-resq-green shrink-0" />
                        <span className="truncate">
                          Driver: <strong className="text-resq-navy">{donation.driver}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Handshake Verification PIN Security Badge */}
                    <div className="mt-3.5 p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                        <div>
                          <span className="text-[11px] font-bold text-amber-900 block">
                            Recipient Dropoff Handshake PIN
                          </span>
                          <span className="text-[10px] text-amber-700">
                            Auto-sent to recipient shelter. Courier enters this to confirm delivery.
                          </span>
                        </div>
                      </div>
                      <span className="font-mono text-base font-black px-3 py-1 rounded-xl bg-amber-500 text-white tracking-widest shadow-sm">
                        {donation.deliveryPin || "8492"}
                      </span>
                    </div>

                    {/* Card Actions */}
                    <div className="mt-3.5 flex items-center justify-between text-xs pt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRescueId(donation.id);
                          setShowMatchModal(true);
                        }}
                        className="font-bold text-resq-blue hover:text-resq-blue-hover flex items-center gap-1"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Why this match? ({donation.score}/100)</span>
                      </button>

                      <div className="flex items-center gap-2 text-slate-400">
                        <span className="text-[11px] flex items-center gap-1 font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/50">
                          <Thermometer className="w-3 h-3 text-amber-600" />
                          {donation.temperature}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3">
              {completedHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-3xl bg-white border border-resq-border shadow-sm flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-resq-navy">{item.id}</span>
                      <StatusBadge status="DELIVERED" />
                    </div>
                    <h4 className="text-sm font-bold text-resq-navy">{item.foodName}</h4>
                    <p className="text-xs text-slate-400">
                      {item.quantity} {item.unit} • Delivered to {item.recipient} by {item.driver}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-resq-green flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      100% Verified
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-1">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Live Map (50%) with Floating Telemetry Card */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-resq-navy">
                Live Regional Rescue Corridor
              </h2>
              <p className="text-xs text-slate-500">
                Real-time GPS telemetry, cold/hot chain status, and EV driver path
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-resq-blue-light text-resq-blue text-[11px] font-bold">
              GPS Synchronized (1.2s ping)
            </span>
          </div>

          <div className="relative rounded-3xl overflow-hidden border border-resq-border shadow-card bg-slate-900">
            {/* The Map Component */}
            <div className="h-[480px] w-full">
              <RescueNetworkMap
                markers={mapMarkers}
                centerLat={12.971}
                centerLng={77.647}
                zoomLevel={14}
                interactive={true}
              />
            </div>

            {/* Floating Telemetry Card for Selected Active Rescue */}
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-resq-border shadow-xl space-y-3 pointer-events-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-resq-blue animate-pulse" />
                  <span className="text-xs font-black text-resq-navy tracking-wide">
                    {activeRescue.id} • {activeRescue.quantity} {activeRescue.unit} • {activeRescue.status.replace("_", " ")}
                  </span>
                </div>
                <span className="text-xs font-black text-resq-green-bright bg-resq-navy px-2.5 py-0.5 rounded-lg">
                  ETA {activeRescue.eta}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-semibold">Driver</span>
                  <span className="font-bold text-resq-navy truncate block">
                    {activeRescue.driver}
                  </span>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-semibold">Speed</span>
                  <span className="font-bold text-resq-navy block">
                    {activeRescue.speed}
                  </span>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-semibold">Temperature</span>
                  <span className="font-bold text-amber-700 block">
                    {activeRescue.temperature}
                  </span>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-semibold">Destination</span>
                  <span className="font-bold text-resq-navy truncate block">
                    {activeRescue.recipient}
                  </span>
                </div>
              </div>

              {activeRescue.driverPhone !== "--" && (
                <div className="flex items-center justify-between text-xs pt-1 text-slate-500">
                  <span className="truncate">Vehicle: {activeRescue.driverVehicle}</span>
                  <a
                    href={`tel:${activeRescue.driverPhone}`}
                    className="font-bold text-resq-blue hover:underline flex items-center gap-1 shrink-0"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Call Driver
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Explainability Dialog */}
      {showMatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-resq-navy-dark/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl border border-resq-border p-6 max-w-xl w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-resq-border pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-resq-blue-light text-resq-blue">
                  <Sparkles className="w-4 h-4" />
                </span>
                <h3 className="text-base font-black text-resq-navy">
                  AI Match Explainability Breakdown
                </h3>
              </div>
              <button
                onClick={() => setShowMatchModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-500">
                Match evaluated for <strong>{activeRescue.foodName}</strong> ({activeRescue.quantity} KG)
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-resq-navy">{activeRescue.score}</span>
                <span className="text-xs text-slate-400">/ 100 Autonomous Score</span>
                <span className="ml-auto text-xs font-bold text-resq-green bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  Rank #1 Fit
                </span>
              </div>
            </div>

            {/* Score Weights */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-semibold block">Urgency</span>
                <span className="text-sm font-black text-red-600">
                  {activeRescue.matchRationale.urgency}/25
                </span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-semibold block">Distance</span>
                <span className="text-sm font-black text-blue-600">
                  {activeRescue.matchRationale.distance}/25
                </span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-semibold block">Capacity</span>
                <span className="text-sm font-black text-emerald-600">
                  {activeRescue.matchRationale.capacity}/20
                </span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-semibold block">Compatibility</span>
                <span className="text-sm font-black text-purple-600">
                  {activeRescue.matchRationale.compatibility}/15
                </span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-semibold block">Driver</span>
                <span className="text-sm font-black text-amber-600">
                  {activeRescue.matchRationale.driver}/15
                </span>
              </div>
            </div>

            {/* Specific AI Reasons */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 text-xs">
              <span className="font-bold text-resq-navy block">Algorithmic Factors:</span>
              <ul className="space-y-1.5 text-slate-600">
                {activeRescue.matchRationale.reasons.map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-resq-green font-bold shrink-0">✓</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowMatchModal(false)}
                className="px-5 py-2 rounded-xl bg-resq-navy text-white text-xs font-bold hover:bg-resq-navy-dark transition-colors"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Create Donation Modal */}
      <AiDonationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={(newDonation: any) => {
          setIsCreateModalOpen(false);
          const formattedDonation = {
            id: newDonation.id || `RF-${Math.floor(10000 + Math.random() * 90000)}`,
            foodName: newDonation.foodName || "Surplus Kitchen Batch",
            category: newDonation.category || "Prepared Meals",
            quantity: Number(newDonation.quantity) || 25,
            unit: newDonation.unit || "KG",
            status: "POSTED",
            urgency: newDonation.urgency || "HIGH",
            recipient: "AI Matching with nearest verified shelter (<10 KM)...",
            recipientAddress: "Indiranagar / Old Airport Road Corridor",
            driver: "Searching available couriers in 10 KM range...",
            driverVehicle: "Insulated / Cold-Chain EV Fleet",
            driverPhone: "--",
            deliveryPin: newDonation.deliveryPin || String(Math.floor(1000 + Math.random() * 9000)),
            eta: "Dispatching (<25m)",
            speed: "--",
            temperature: newDonation.temperature || "65°C (Safe Hot Hold)",
            time: "Just now",
            step: 1,
            totalSteps: 5,
            score: 96,
            matchRationale: {
              urgency: 25,
              distance: 24,
              capacity: 22,
              compatibility: 15,
              driver: 10,
              reasons: [
                "Fresh surplus batch logged in HopePlate real-time ledger",
                "Proximity scan restricted to couriers within 10 KM range",
                "Direct recipient handshake verification PIN generated",
              ],
            },
          };
          setRescues((prev) => [formattedDonation, ...prev]);
          setSelectedRescueId(formattedDonation.id);
          setActiveTab("ACTIVE");
        }}
      />
    </div>
  );
}

export default function DonorDashboardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading donor operations...</div>}>
      <DonorDashboardContent />
    </Suspense>
  );
}
