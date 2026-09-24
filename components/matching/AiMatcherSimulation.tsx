"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { MatchCalculationResult, DEFAULT_WEIGHTS } from "@/lib/matching/engine";
import { realtime } from "@/lib/realtime";

interface AiMatcherSimulationProps {
  initialDonation?: {
    id: string;
    foodName: string;
    quantityKg: number;
    category: string;
  };
  onRescueDispatched?: (rescueId: string) => void;
}

export default function AiMatcherSimulation({
  initialDonation = {
    id: "donation-demo-101",
    foodName: "Paneer Butter Masala, Jeera Rice & Garlic Naan",
    quantityKg: 30,
    category: "Prepared Meals",
  },
  onRescueDispatched,
}: AiMatcherSimulationProps) {
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>("org-hope-shelter");
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [isSplittingMode, setIsSplittingMode] = useState<boolean>(false);
  const [isDispatching, setIsDispatching] = useState<boolean>(false);
  const [dispatchedRescueId, setDispatchedRescueId] = useState<string | null>(null);

  // Weight sliders simulation
  const [weights, setWeights] = useState(DEFAULT_WEIGHTS);

  // Candidate recipients
  const candidates: MatchCalculationResult[] = [
    {
      recipientId: "org-hope-shelter",
      recipientName: "Hope Community Shelter",
      recipientAddress: "Old Airport Road, Kodihalli, Bengaluru",
      recipientLat: 12.9612,
      recipientLng: 77.6534,
      distanceKm: 3.8,
      estimatedDriveTimeMins: 18,
      bestDriver: {
        id: "driver-rahul",
        name: "Rahul Sharma",
        vehicleType: "EV Car (85 KG)",
        distanceToPickupKm: 1.2,
      },
      totalScore: 96,
      scoreBreakdown: {
        urgencyScore: 25,
        distanceScore: 23,
        capacityScore: 20,
        compatibilityScore: 15,
        driverScore: 13,
        explanation: [
          "Recipient has enough capacity (Hope Shelter intake available: 168 KG)",
          "Food category matches current critical need (Prepared Meals needed: 40 KG)",
          "Recipient is only 3.8 KM away via Old Airport Road",
          "Driver Rahul Sharma is available and only 1.2 KM from pickup point",
          "Food remains within active rescue window (1h 45m remaining)",
        ],
      },
    },
    {
      recipientId: "org-st-jude",
      recipientName: "St. Jude Mercy Food Bank",
      recipientAddress: "Victoria Road, Bengaluru",
      recipientLat: 12.9678,
      recipientLng: 77.6189,
      distanceKm: 4.6,
      estimatedDriveTimeMins: 22,
      bestDriver: {
        id: "driver-priya",
        name: "Priya Nair",
        vehicleType: "Van (250 KG)",
        distanceToPickupKm: 2.1,
      },
      totalScore: 89,
      scoreBreakdown: {
        urgencyScore: 24,
        distanceScore: 20,
        capacityScore: 20,
        compatibilityScore: 13,
        driverScore: 12,
        explanation: [
          "Large capacity available (320 KG available)",
          "Prepared meals requested as secondary item",
          "Transit distance is 4.6 KM through Victoria Road",
          "Driver Priya available 2.1 KM away",
        ],
      },
    },
    {
      recipientId: "org-ananda-kitchen",
      recipientName: "Ananda Community Kitchen",
      recipientAddress: "Ulsoor Lake Road, Bengaluru",
      recipientLat: 12.9823,
      recipientLng: 77.6211,
      distanceKm: 5.2,
      estimatedDriveTimeMins: 25,
      bestDriver: {
        id: "driver-amit",
        name: "Amit Patel",
        vehicleType: "EV Car (70 KG)",
        distanceToPickupKm: 3.4,
      },
      totalScore: 81,
      scoreBreakdown: {
        urgencyScore: 24,
        distanceScore: 18,
        capacityScore: 18,
        compatibilityScore: 11,
        driverScore: 10,
        explanation: [
          "High hunger need for immediate evening serving",
          "Distance 5.2 KM with moderate traffic near Ulsoor",
          "Driver Amit available 3.4 KM away",
        ],
      },
    },
  ];

  const activeCandidate =
    candidates.find((c) => c.recipientId === selectedCandidateId) || candidates[0];

  // Dispatch candidate rescue
  const handleDispatch = async () => {
    setIsDispatching(true);
    try {
      const res = await fetch("/api/rescues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donationId: initialDonation.id,
          recipientId: activeCandidate.recipientId,
          driverId: activeCandidate.bestDriver?.id || "driver-rahul",
          rescueScore: activeCandidate.totalScore,
        }),
      });

      const json = await res.json();
      const rescueId = json.data?.id || "RF-10283";
      setDispatchedRescueId(rescueId);

      // Publish realtime driver notification
      realtime.publish(
        "DRIVER_ACCEPTED",
        {
          rescueId,
          driverName: activeCandidate.bestDriver?.name || "Rahul Sharma",
          recipientName: activeCandidate.recipientName,
        },
        "DRIVER"
      );

      if (onRescueDispatched) onRescueDispatched(rescueId);
    } catch (e) {
      console.warn("Rescue dispatch fallback triggered.");
      setDispatchedRescueId("RF-10283");
    } finally {
      setIsDispatching(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-resq-border p-6 shadow-card space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-resq-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-resq-blue-light text-resq-blue">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-resq-navy">
              AI Rescue Matcher & Candidate Simulation
            </h3>
          </div>
          <p className="text-xs text-resq-secondary mt-1">
            Analyzing {initialDonation.foodName} ({initialDonation.quantityKg} KG) across 8 certified recipient shelters.
          </p>
        </div>

        {/* Action Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSplittingMode(!isSplittingMode)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-colors ${
              isSplittingMode
                ? "bg-purple-50 text-purple-700 border-purple-200"
                : "border-resq-border text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Split className="w-3.5 h-3.5" />
            {isSplittingMode ? "Splitting Active" : "Simulate Donation Split"}
          </button>
        </div>
      </div>

      {/* Donation Split Simulation View */}
      {isSplittingMode ? (
        <div className="p-5 rounded-2xl bg-purple-50/60 border border-purple-200 text-xs text-purple-900 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-purple-950 flex items-center gap-2">
              <Split className="w-4 h-4 text-purple-600" />
              Proposed Multi-Shelter Route Allocation (Total: 100 KG)
            </span>
            <span className="font-semibold text-purple-700">
              Route Efficiency: 94%
            </span>
          </div>
          <p className="text-purple-800 text-[11px]">
            When donation bulk exceeds single shelter intake capacity, the algorithm groups nearby destinations along one continuous route:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-white p-3 rounded-xl border border-purple-200 shadow-sm">
              <p className="font-bold text-resq-navy">1. Hope Shelter</p>
              <p className="text-xs font-black text-resq-blue mt-1">40 KG (160 Meals)</p>
              <p className="text-[11px] text-slate-400">Stop 1 • 3.8 KM</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-purple-200 shadow-sm">
              <p className="font-bold text-resq-navy">2. St. Jude Food Bank</p>
              <p className="text-xs font-black text-resq-blue mt-1">35 KG (140 Meals)</p>
              <p className="text-[11px] text-slate-400">Stop 2 • +1.4 KM</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-purple-200 shadow-sm">
              <p className="font-bold text-resq-navy">3. Ananda Kitchen</p>
              <p className="text-xs font-black text-resq-blue mt-1">25 KG (100 Meals)</p>
              <p className="text-[11px] text-slate-400">Stop 3 • +2.1 KM</p>
            </div>
          </div>
        </div>
      ) : null}

      {/* Candidate Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {candidates.map((cand) => {
          const isSelected = selectedCandidateId === cand.recipientId;
          return (
            <div
              key={cand.recipientId}
              onClick={() => setSelectedCandidateId(cand.recipientId)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                isSelected
                  ? "border-resq-blue bg-resq-blue-light/30 shadow-md ring-2 ring-resq-blue/20"
                  : "border-resq-border hover:border-slate-300 bg-white"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Recipient Candidate
                  </span>
                  <h4 className="text-sm font-bold text-resq-navy mt-0.5">
                    {cand.recipientName}
                  </h4>
                </div>
                {/* Score badge */}
                <div
                  className={`px-2.5 py-1 rounded-xl text-center font-black text-sm ${
                    cand.totalScore >= 90
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {cand.totalScore}
                  <span className="text-[10px] font-normal text-slate-500">/100</span>
                </div>
              </div>

              <div className="mt-3 space-y-1.5 text-xs text-resq-secondary">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {cand.distanceKm} KM ({cand.estimatedDriveTimeMins} mins ETA)
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-slate-400" />
                  <span>Driver: {cand.bestDriver?.name} ({cand.bestDriver?.distanceToPickupKm} KM)</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-resq-blue">
                  {isSelected ? "Selected Match" : "Select Candidate"}
                </span>
                <ChevronRight className="w-4 h-4 text-resq-blue" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Match Operational Breakdown & Explainability */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-resq-border space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-resq-navy">
              Operational Criteria: {activeCandidate.recipientName}
            </span>
            <p className="text-[11px] text-slate-400">
              Evaluated using 5 real-time logistical dimensions
            </p>
          </div>

          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="text-xs font-bold text-resq-blue hover:underline flex items-center gap-1"
          >
            <Info className="w-3.5 h-3.5" />
            {showExplanation ? "Hide Explanation" : "Why This Match?"}
          </button>
        </div>

        {/* Score Meters */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div className="bg-white p-2.5 rounded-xl border border-resq-border">
            <span className="text-[10px] text-slate-400 font-semibold block">Urgency</span>
            <span className="text-sm font-bold text-resq-navy">
              {activeCandidate.scoreBreakdown.urgencyScore}
              <span className="text-[10px] font-normal text-slate-400">/25</span>
            </span>
            <div className="w-full h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
              <div
                className="h-full bg-red-500 rounded-full"
                style={{ width: `${(activeCandidate.scoreBreakdown.urgencyScore / 25) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-white p-2.5 rounded-xl border border-resq-border">
            <span className="text-[10px] text-slate-400 font-semibold block">Distance</span>
            <span className="text-sm font-bold text-resq-navy">
              {activeCandidate.scoreBreakdown.distanceScore}
              <span className="text-[10px] font-normal text-slate-400">/25</span>
            </span>
            <div className="w-full h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${(activeCandidate.scoreBreakdown.distanceScore / 25) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-white p-2.5 rounded-xl border border-resq-border">
            <span className="text-[10px] text-slate-400 font-semibold block">Capacity</span>
            <span className="text-sm font-bold text-resq-navy">
              {activeCandidate.scoreBreakdown.capacityScore}
              <span className="text-[10px] font-normal text-slate-400">/20</span>
            </span>
            <div className="w-full h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${(activeCandidate.scoreBreakdown.capacityScore / 20) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-white p-2.5 rounded-xl border border-resq-border">
            <span className="text-[10px] text-slate-400 font-semibold block">Compatibility</span>
            <span className="text-sm font-bold text-resq-navy">
              {activeCandidate.scoreBreakdown.compatibilityScore}
              <span className="text-[10px] font-normal text-slate-400">/15</span>
            </span>
            <div className="w-full h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full"
                style={{ width: `${(activeCandidate.scoreBreakdown.compatibilityScore / 15) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-white p-2.5 rounded-xl border border-resq-border">
            <span className="text-[10px] text-slate-400 font-semibold block">Driver Proximity</span>
            <span className="text-sm font-bold text-resq-navy">
              {activeCandidate.scoreBreakdown.driverScore}
              <span className="text-[10px] font-normal text-slate-400">/15</span>
            </span>
            <div className="w-full h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full"
                style={{ width: `${(activeCandidate.scoreBreakdown.driverScore / 15) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Explainability Accordion / Box */}
        {showExplanation && (
          <div className="p-4 rounded-xl bg-white border border-resq-border text-xs space-y-2 animate-in fade-in">
            <span className="font-bold text-resq-navy block">
              Operational Explainability Report:
            </span>
            <ul className="space-y-1 text-slate-600">
              {activeCandidate.scoreBreakdown.explanation.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-resq-green font-bold shrink-0">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-100 italic">
              Note: Rescue Score reflects dynamic logistics and food-rescue capacity, not statutory food certification.
            </p>
          </div>
        )}

        {/* Final Dispatch Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          {dispatchedRescueId ? (
            <div className="flex items-center gap-2 text-xs font-bold text-resq-green">
              <CheckCircle2 className="w-4 h-4" />
              <span>Rescue {dispatchedRescueId} Dispatched! Driver notified in real time.</span>
            </div>
          ) : (
            <span className="text-xs text-slate-500">
              Assigned Driver: <strong className="text-resq-navy">{activeCandidate.bestDriver?.name}</strong> (ETA: {activeCandidate.estimatedDriveTimeMins} mins)
            </span>
          )}

          <button
            onClick={handleDispatch}
            disabled={isDispatching || !!dispatchedRescueId}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-resq-blue text-white text-xs font-bold hover:bg-resq-blue-hover shadow-sm transition-all disabled:opacity-50"
          >
            {isDispatching
              ? "Dispatching Driver..."
              : dispatchedRescueId
              ? "Rescue Active"
              : `Confirm Rescue & Dispatch (${activeCandidate.totalScore}/100)`}
          </button>
        </div>
      </div>
    </div>
  );
}
