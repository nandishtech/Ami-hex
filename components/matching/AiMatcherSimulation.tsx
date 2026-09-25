"use client";

import React, { useState, useMemo } from "react";
import {
  Sparkles,
  ShieldCheck,
  MapPin,
  Clock,
  Truck,
  HeartHandshake,
  CheckCircle2,
  Sliders,
  ChevronRight,
  Split,
  Info,
  AlertCircle,
  RefreshCw,
  Send,
  Zap,
  Flame,
} from "lucide-react";
import { realtime } from "@/lib/realtime";

interface AiMatcherSimulationProps {
  initialDonation?: {
    id: string;
    foodName: string;
    quantityKg: number;
    category: string;
    donorName?: string;
    location?: string;
  };
  onRescueDispatched?: (rescueId: string) => void;
}

interface Candidate {
  id: string;
  name: string;
  type: string;
  address: string;
  distanceKm: number;
  driveTimeMins: number;
  intakeCapacityKg: number;
  neededCategory: string;
  driver: {
    id: string;
    name: string;
    vehicle: string;
    distKm: number;
  };
  scores: {
    urgency: number;
    distance: number;
    capacity: number;
    compatibility: number;
    driver: number;
  };
  reasons: string[];
}

export default function AiMatcherSimulation({
  initialDonation = {
    id: "donation-demo-101",
    foodName: "Paneer Butter Masala, Jeera Rice & Garlic Naan",
    quantityKg: 30,
    category: "Prepared Meals",
    donorName: "GreenFork Banquets",
    location: "Indiranagar 100 Ft Rd",
  },
  onRescueDispatched,
}: AiMatcherSimulationProps) {
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>("org-hope-shelter");
  const [isSplittingMode, setIsSplittingMode] = useState<boolean>(false);
  const [isDispatching, setIsDispatching] = useState<boolean>(false);
  const [dispatchedRescueId, setDispatchedRescueId] = useState<string | null>(null);

  // Dynamic weight sliders
  const [weightUrgency, setWeightUrgency] = useState<number>(25);
  const [weightDistance, setWeightDistance] = useState<number>(25);
  const [weightCapacity, setWeightCapacity] = useState<number>(20);
  const [weightCompat, setWeightCompat] = useState<number>(15);
  const [weightDriver, setWeightDriver] = useState<number>(15);

  const rawCandidates: Candidate[] = [
    {
      id: "org-hope-shelter",
      name: "Hope Community Shelter",
      type: "Night Shelter & Community Kitchen",
      address: "Old Airport Road, Kodihalli",
      distanceKm: 3.8,
      driveTimeMins: 14,
      intakeCapacityKg: 180,
      neededCategory: "Prepared Meals",
      driver: {
        id: "driver-rahul",
        name: "Rahul Sharma",
        vehicle: "Tata Nexon EV (85 KG)",
        distKm: 1.2,
      },
      scores: {
        urgency: 25,
        distance: 23,
        capacity: 20,
        compatibility: 15,
        driver: 13,
      },
      reasons: [
        "Immediate hunger need: Serving 200 hot dinners at 8:00 PM",
        "Shelter has verified 180 KG dry & warm intake storage",
        "EV Driver Rahul is only 1.2 KM away on 100 Ft Road",
        "Travel time 14 mins preserves safe hot-holding temperature",
      ],
    },
    {
      id: "org-st-jude",
      name: "St. Jude Mercy Food Bank",
      type: "Regional Redistribution Depot",
      address: "Victoria Road, Bengaluru",
      distanceKm: 4.6,
      driveTimeMins: 19,
      intakeCapacityKg: 320,
      neededCategory: "Bakery & Prepared Meals",
      driver: {
        id: "driver-priya",
        name: "Priya Nair",
        vehicle: "Piaggio Ape EV (150 KG)",
        distKm: 2.1,
      },
      scores: {
        urgency: 24,
        distance: 20,
        capacity: 20,
        compatibility: 13,
        driver: 12,
      },
      reasons: [
        "Large commercial storage capacity (320 KG available)",
        "Secondary need for prepared meals this evening",
        "Transit distance is 4.6 KM via Victoria Road",
        "Driver Priya Nair available 2.1 KM away",
      ],
    },
    {
      id: "org-ananda-kitchen",
      name: "Ananda Community Kitchen",
      type: "Soup Kitchen & Day Center",
      address: "Ulsoor Lake Road",
      distanceKm: 5.2,
      driveTimeMins: 22,
      intakeCapacityKg: 120,
      neededCategory: "Hot Cooked Food",
      driver: {
        id: "driver-amit",
        name: "Amit Patel",
        vehicle: "Mahindra Treo EV (70 KG)",
        distKm: 3.4,
      },
      scores: {
        urgency: 24,
        distance: 18,
        capacity: 18,
        compatibility: 11,
        driver: 10,
      },
      reasons: [
        "High evening meal need for migrant workers near Ulsoor",
        "Moderate traffic on Old Madras Road adds 8 mins",
        "Driver Amit is currently completing another dropoff",
      ],
    },
    {
      id: "org-blossom-home",
      name: "Blossom Children's Home",
      type: "Youth Shelter & Foster Center",
      address: "Koramangala 4th Block",
      distanceKm: 7.1,
      driveTimeMins: 28,
      intakeCapacityKg: 65,
      neededCategory: "Breakfast & Dairy",
      driver: {
        id: "driver-farooq",
        name: "Farooq Ahmed",
        vehicle: "Insulated Van (250 KG)",
        distKm: 4.8,
      },
      scores: {
        urgency: 20,
        distance: 14,
        capacity: 16,
        compatibility: 12,
        driver: 12,
      },
      reasons: [
        "Prefers breakfast items and dairy over spicy curries",
        "Higher distance (7.1 KM) incurs minor latency score deduction",
      ],
    },
  ];

  // Dynamically calculate scores based on slider weights
  const candidates = useMemo(() => {
    return rawCandidates
      .map((c) => {
        const u = Math.round((c.scores.urgency / 25) * weightUrgency);
        const d = Math.round((c.scores.distance / 25) * weightDistance);
        const cp = Math.round((c.scores.capacity / 20) * weightCapacity);
        const cm = Math.round((c.scores.compatibility / 15) * weightCompat);
        const dr = Math.round((c.scores.driver / 15) * weightDriver);
        const total = u + d + cp + cm + dr;
        return {
          ...c,
          dynamicScore: Math.min(100, total),
          calculatedBreakdown: { urgency: u, distance: d, capacity: cp, compatibility: cm, driver: dr },
        };
      })
      .sort((a, b) => b.dynamicScore - a.dynamicScore);
  }, [weightUrgency, weightDistance, weightCapacity, weightCompat, weightDriver]);

  const activeCandidate =
    candidates.find((c) => c.id === selectedCandidateId) || candidates[0];

  const handleDispatch = async () => {
    setIsDispatching(true);
    try {
      const res = await fetch("/api/rescues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donationId: initialDonation.id,
          recipientId: activeCandidate.id,
          driverId: activeCandidate.driver.id,
          rescueScore: activeCandidate.dynamicScore,
        }),
      });

      const json = await res.json();
      const rescueId = json.data?.id || "RF-10283";
      setDispatchedRescueId(rescueId);

      realtime.publish(
        "DRIVER_ACCEPTED",
        {
          rescueId,
          driverName: activeCandidate.driver.name,
          recipientName: activeCandidate.name,
        },
        "DRIVER"
      );

      if (onRescueDispatched) onRescueDispatched(rescueId);
    } catch (e) {
      setDispatchedRescueId("RF-10283");
    } finally {
      setIsDispatching(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Central Constellation / Interactive Node Graph */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-resq-navy-dark via-resq-navy to-[#0b2138] border border-white/10 p-6 sm:p-8 text-white shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-resq-green-bright mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              AUTONOMOUS MATCHING CONSTELLATION
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Surplus-To-Shelter Resonance Field
            </h2>
            <p className="text-xs text-slate-300">
              Select any candidate node to preview route friction, capacity intake, and driver readiness.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSplittingMode(!isSplittingMode)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 border transition-all ${
                isSplittingMode
                  ? "bg-purple-500 text-white border-purple-400 shadow-glow"
                  : "bg-white/10 hover:bg-white/20 text-white border-white/20"
              }`}
            >
              <Split className="w-4 h-4" />
              {isSplittingMode ? "Splitting Active" : "Simulate Donation Split (100 KG)"}
            </button>
          </div>
        </div>

        {/* Visual Graph Area */}
        <div className="relative py-10 flex flex-col lg:flex-row items-center justify-around gap-8 min-h-[380px]">
          {/* Animated SVG Connection Lines between center and candidate nodes */}
          <div className="hidden lg:block absolute inset-0 pointer-events-none">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="grad-active" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1769FF" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#25C982" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient id="grad-dim" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
                </linearGradient>
              </defs>
              {/* Lines from center (x: 25%, y: 50%) to candidate nodes on right (x: 75%) */}
              {candidates.map((c, i) => {
                const isSel = c.id === activeCandidate.id;
                const startY = 50;
                const targetY = 15 + i * 23;
                return (
                  <path
                    key={c.id}
                    d={`M 350,190 C 500,190 550,${targetY * 3.8} 720,${targetY * 3.8}`}
                    fill="none"
                    stroke={isSel ? "url(#grad-active)" : "url(#grad-dim)"}
                    strokeWidth={isSel ? 3.5 : 1}
                    strokeDasharray={isSel ? "6 4" : "none"}
                    className={isSel ? "animate-pulse" : ""}
                  />
                );
              })}
            </svg>
          </div>

          {/* Central Donation Node */}
          <div className="relative z-10 flex flex-col items-center text-center max-w-xs p-6 rounded-3xl bg-gradient-to-b from-white/15 to-white/5 backdrop-blur-md border border-white/20 shadow-2xl">
            {/* Pulse rings */}
            <div className="absolute -inset-2 rounded-3xl border border-resq-blue/40 animate-ping pointer-events-none opacity-30" />
            
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-resq-blue to-resq-green-bright p-0.5 shadow-glow mb-3 flex items-center justify-center">
              <div className="w-full h-full bg-resq-navy rounded-2xl flex items-center justify-center">
                <Flame className="w-8 h-8 text-amber-400" />
              </div>
            </div>

            <span className="text-[10px] font-black uppercase tracking-wider text-resq-green-bright">
              Active Surplus Batch
            </span>
            <h3 className="text-base font-black text-white mt-1 leading-snug">
              {initialDonation.foodName}
            </h3>
            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-mono font-bold text-resq-gold">
              {initialDonation.quantityKg} KG • Hot Hold 68°C
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              From: {initialDonation.donorName} ({initialDonation.location})
            </p>
          </div>

          {/* Candidate Orbit Nodes */}
          <div className="relative z-10 w-full lg:max-w-md space-y-3">
            {candidates.map((cand, idx) => {
              const isSelected = cand.id === activeCandidate.id;
              return (
                <div
                  key={cand.id}
                  onClick={() => setSelectedCandidateId(cand.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-white/20 border-resq-green-bright shadow-glow-green ring-1 ring-resq-green-bright scale-[1.02]"
                      : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black ${
                          idx === 0
                            ? "bg-resq-green-bright text-resq-navy"
                            : "bg-white/10 text-white"
                        }`}
                      >
                        #{idx + 1}
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-white">
                          {cand.name}
                        </h4>
                        <p className="text-[11px] text-slate-300">
                          {cand.distanceKm} KM • {cand.driveTimeMins}m ETA
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className={`inline-block px-2.5 py-1 rounded-xl text-xs font-black ${
                          cand.dynamicScore >= 90
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                            : "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                        }`}
                      >
                        {cand.dynamicScore} / 100
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        Capacity: {cand.intakeCapacityKg} KG
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Donation Split Simulation Panel */}
        {isSplittingMode && (
          <div className="mt-4 p-5 rounded-2xl bg-purple-950/70 border border-purple-500/40 text-xs text-purple-200 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="font-black text-white flex items-center gap-2">
                <Split className="w-4 h-4 text-purple-400" />
                Multi-Shelter Dynamic Split Optimization (100 KG Bulk Payload)
              </span>
              <span className="font-bold text-purple-300 bg-purple-900/60 px-2.5 py-1 rounded-full border border-purple-400/30">
                Route Efficiency: 94%
              </span>
            </div>
            <p className="text-purple-300 text-[11px]">
              When batch surplus exceeds single-recipient capacity, the routing engine chains dropoffs along a single optimal corridor:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-purple-900/40 border border-purple-400/30">
                <span className="text-[10px] uppercase font-bold text-purple-300">Stop 1</span>
                <p className="font-black text-white">Hope Shelter</p>
                <p className="text-base font-black text-emerald-400 mt-1">40 KG</p>
                <p className="text-[10px] text-purple-300">160 Meals • 3.8 KM</p>
              </div>
              <div className="p-3 rounded-xl bg-purple-900/40 border border-purple-400/30">
                <span className="text-[10px] uppercase font-bold text-purple-300">Stop 2</span>
                <p className="font-black text-white">St. Jude Food Bank</p>
                <p className="text-base font-black text-emerald-400 mt-1">35 KG</p>
                <p className="text-[10px] text-purple-300">140 Meals • +1.4 KM</p>
              </div>
              <div className="p-3 rounded-xl bg-purple-900/40 border border-purple-400/30">
                <span className="text-[10px] uppercase font-bold text-purple-300">Stop 3</span>
                <p className="font-black text-white">Ananda Kitchen</p>
                <p className="text-base font-black text-emerald-400 mt-1">25 KG</p>
                <p className="text-[10px] text-purple-300">100 Meals • +2.1 KM</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Interactive Algorithmic Weight Sliders */}
      <div className="bg-white rounded-3xl border border-resq-border p-6 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-resq-border pb-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 text-resq-blue">
              <Sliders className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-black text-resq-navy">
                Autonomous Weight Simulator
              </h3>
              <p className="text-xs text-slate-500">
                Drag logistical priorities to watch the algorithm re-rank regional shelters in real time
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setWeightUrgency(25);
              setWeightDistance(25);
              setWeightCapacity(20);
              setWeightCompat(15);
              setWeightDriver(15);
            }}
            className="text-xs font-bold text-slate-400 hover:text-resq-navy flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="space-y-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-red-700">Urgency</span>
              <span className="text-resq-navy font-black">{weightUrgency}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={50}
              value={weightUrgency}
              onChange={(e) => setWeightUrgency(Number(e.target.value))}
              className="w-full accent-red-500 cursor-pointer"
            />
          </div>

          <div className="space-y-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-blue-700">Distance</span>
              <span className="text-resq-navy font-black">{weightDistance}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={50}
              value={weightDistance}
              onChange={(e) => setWeightDistance(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>

          <div className="space-y-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-emerald-700">Capacity Intake</span>
              <span className="text-resq-navy font-black">{weightCapacity}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={40}
              value={weightCapacity}
              onChange={(e) => setWeightCapacity(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          <div className="space-y-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-purple-700">Compatibility</span>
              <span className="text-resq-navy font-black">{weightCompat}%</span>
            </div>
            <input
              type="range"
              min={5}
              max={30}
              value={weightCompat}
              onChange={(e) => setWeightCompat(Number(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>

          <div className="space-y-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-amber-700">Driver Proximity</span>
              <span className="text-resq-navy font-black">{weightDriver}%</span>
            </div>
            <input
              type="range"
              min={5}
              max={30}
              value={weightDriver}
              onChange={(e) => setWeightDriver(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 3. Deep Explainability Report & Direct Dispatch CTA */}
      <div className="bg-white rounded-3xl border border-resq-border p-6 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-resq-border pb-3">
          <div>
            <h3 className="text-base font-black text-resq-navy">
              Autonomous Match Report: {activeCandidate.name}
            </h3>
            <p className="text-xs text-slate-500">
              Rank Score: <strong className="text-resq-blue">{activeCandidate.dynamicScore}/100</strong> • Distance: {activeCandidate.distanceKm} KM ({activeCandidate.driveTimeMins}m ETA)
            </p>
          </div>

          {dispatchedRescueId ? (
            <div className="flex items-center gap-2 text-xs font-bold text-resq-green bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
              <span>Rescue {dispatchedRescueId} Dispatched! Driver notified.</span>
            </div>
          ) : (
            <button
              onClick={handleDispatch}
              disabled={isDispatching}
              className="px-6 py-3 rounded-2xl bg-resq-blue hover:bg-resq-blue-hover text-white text-xs font-bold shadow-glow flex items-center gap-2 active:scale-95 transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {isDispatching ? "Dispatching Fleet..." : `Confirm Rescue & Dispatch (${activeCandidate.dynamicScore}/100)`}
            </button>
          )}
        </div>

        {/* 5 Dimensional Score Meters */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Urgency</span>
            <span className="text-base font-black text-red-600 mt-0.5 block">
              {activeCandidate.calculatedBreakdown.urgency}
              <span className="text-xs font-normal text-slate-400">/{weightUrgency}</span>
            </span>
            <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-red-500 rounded-full"
                style={{ width: `${(activeCandidate.calculatedBreakdown.urgency / weightUrgency) * 100}%` }}
              />
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Distance</span>
            <span className="text-base font-black text-blue-600 mt-0.5 block">
              {activeCandidate.calculatedBreakdown.distance}
              <span className="text-xs font-normal text-slate-400">/{weightDistance}</span>
            </span>
            <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${(activeCandidate.calculatedBreakdown.distance / weightDistance) * 100}%` }}
              />
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Capacity</span>
            <span className="text-base font-black text-emerald-600 mt-0.5 block">
              {activeCandidate.calculatedBreakdown.capacity}
              <span className="text-xs font-normal text-slate-400">/{weightCapacity}</span>
            </span>
            <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${(activeCandidate.calculatedBreakdown.capacity / weightCapacity) * 100}%` }}
              />
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Compatibility</span>
            <span className="text-base font-black text-purple-600 mt-0.5 block">
              {activeCandidate.calculatedBreakdown.compatibility}
              <span className="text-xs font-normal text-slate-400">/{weightCompat}</span>
            </span>
            <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full"
                style={{ width: `${(activeCandidate.calculatedBreakdown.compatibility / weightCompat) * 100}%` }}
              />
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Driver Proximity</span>
            <span className="text-base font-black text-amber-600 mt-0.5 block">
              {activeCandidate.calculatedBreakdown.driver}
              <span className="text-xs font-normal text-slate-400">/{weightDriver}</span>
            </span>
            <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full"
                style={{ width: `${(activeCandidate.calculatedBreakdown.driver / weightDriver) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Explainability factors */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-2">
          <span className="font-bold text-resq-navy block">Algorithmic Match Verification:</span>
          <ul className="space-y-1.5 text-slate-600">
            {activeCandidate.reasons.map((r, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-resq-green font-bold shrink-0">✓</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
