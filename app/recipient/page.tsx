"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HeartHandshake,
  Sliders,
  Sparkles,
  ClipboardList,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  AlertCircle,
  Plus,
  ArrowRight,
  ShieldCheck,
  Phone,
  QrCode,
  Thermometer,
  PackageCheck,
  Flame,
} from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import RescueNetworkMap from "@/components/maps/RescueNetworkMap";
import StakeholderAccessGate from "@/components/auth/StakeholderAccessGate";
import { MapMarker } from "@/lib/maps";

export default function RecipientDashboardPage() {
  const [capacityKg, setCapacityKg] = useState<number>(180);
  const [capacityUpdatedToast, setCapacityUpdatedToast] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  const [needs, setNeeds] = useState([
    {
      category: "Prepared Meals",
      urgency: "HIGH",
      neededKg: 40,
      receivedKg: 12,
      gapKg: 28,
      temperatureRequired: "HOT_HOLD (>60°C)",
    },
    {
      category: "Bakery & Breads",
      urgency: "MEDIUM",
      neededKg: 20,
      receivedKg: 15,
      gapKg: 5,
      temperatureRequired: "ROOM_TEMP",
    },
    {
      category: "Dairy & Produce",
      urgency: "LOW",
      neededKg: 15,
      receivedKg: 5,
      gapKg: 10,
      temperatureRequired: "COLD_CHAIN (<4°C)",
    },
  ]);

  const incomingRescues = [
    {
      id: "RF-10283",
      foodName: "30 KG Paneer Butter Masala, Jeera Rice & Garlic Naan",
      donorName: "GreenFork Restaurant & Banquets",
      donorAddress: "100 Feet Road, Indiranagar",
      driverName: "Rahul Sharma",
      driverVehicle: "Tata Nexon EV • DL-04-E-8291",
      driverPhone: "+91 98450 12839",
      etaMinutes: 12,
      status: "IN_TRANSIT",
      urgency: "HIGH",
      temperature: "68°C (Safe Hot Hold)",
      pin: "8291",
    },
  ];

  const mapMarkers: MapMarker[] = [
    {
      id: "hope-shelter",
      type: "RECIPIENT",
      latitude: 12.9612,
      longitude: 77.6534,
      title: "Hope Community Shelter (Intake Active)",
      subtitle: `Capacity: ${capacityKg} KG available`,
    },
    {
      id: "driver-rahul",
      type: "DRIVER",
      latitude: 12.9701,
      longitude: 77.6432,
      title: "Driver Rahul Sharma (EV)",
      subtitle: "Carrying RF-10283 • ETA 12 mins",
    },
    {
      id: "greenfork",
      type: "DONOR",
      latitude: 12.9784,
      longitude: 77.6408,
      title: "GreenFork Banquets",
      subtitle: "Pickup completed at 18:15",
    },
  ];

  const handleCapacityChange = (val: number) => {
    setCapacityKg(val);
    setCapacityUpdatedToast(true);
    setTimeout(() => setCapacityUpdatedToast(false), 3000);
  };

  const handleVerifyDropoff = () => {
    if (pinInput === "8291" || pinInput.length >= 4) {
      setIsVerified(true);
      setTimeout(() => {
        setIsVerifyModalOpen(false);
      }, 1500);
    }
  };

  return (
    <div className="w-full max-w-[1640px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Stakeholder Access Gate Banner */}
      <StakeholderAccessGate
        requiredRole="RECIPIENT"
        platformName="Recipient Shelter & NGO Platform (Hope Community Shelter)"
      />

      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-resq-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-resq-green-light text-resq-green">
              <HeartHandshake className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Shelter & NGO Receiving Terminal
            </span>
          </div>
          <h1 className="text-2xl font-black text-resq-navy mt-1">
            Hope Community Shelter & Kitchen
          </h1>
          <p className="text-xs text-resq-secondary">
            Old Airport Road, Kodihalli, Bengaluru • Serving 200 resident hot meals daily
          </p>
        </div>

        {/* Operating status badge */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
              <span className="w-2 h-2 rounded-full bg-resq-green animate-ping" />
              INTAKE GATE OPEN
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              Receiving Window: 08:00 - 22:00
            </span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Capacity Slider & Telemetry Module */}
      <div className="bg-white rounded-3xl border border-resq-border p-6 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-emerald-50 text-resq-green">
              <Sliders className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base font-black text-resq-navy">
                Dynamic Shelter Intake Capacity
              </h2>
              <p className="text-xs text-slate-500">
                AI matching routes food automatically based on your real-time available storage
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {capacityUpdatedToast && (
              <span className="text-xs font-bold text-resq-green bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 animate-in fade-in">
                ✓ MATCH AVAILABILITY UPDATED ({capacityKg} KG)
              </span>
            )}
            <div className="text-right">
              <span className="text-3xl font-black text-resq-navy">{capacityKg}</span>
              <span className="text-sm font-bold text-slate-400 ml-1">KG max</span>
            </div>
          </div>
        </div>

        {/* Slider bar */}
        <div className="space-y-2 pt-2">
          <input
            type="range"
            min={0}
            max={350}
            step={10}
            value={capacityKg}
            onChange={(e) => handleCapacityChange(Number(e.target.value))}
            className="w-full h-3 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-resq-green"
          />
          <div className="flex justify-between text-[11px] font-bold text-slate-400">
            <span>0 KG (Full)</span>
            <span>100 KG (Small Batch)</span>
            <span>200 KG (Standard Dinner)</span>
            <span>350 KG (Maximum Overflow)</span>
          </div>
        </div>

        {/* Capacity Breakdown Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400">Meal Capacity</span>
            <p className="text-lg font-black text-resq-navy mt-0.5">
              ≈ {capacityKg * 4} Portions
            </p>
            <p className="text-[11px] text-slate-400">Supports full evening service</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400">Hot Chafing Storage</span>
            <p className="text-lg font-black text-amber-700 mt-0.5">
              Up to {Math.round(capacityKg * 0.6)} KG
            </p>
            <p className="text-[11px] text-slate-400">Steam tables active</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400">Commercial Cold Unit</span>
            <p className="text-lg font-black text-blue-700 mt-0.5">
              Up to {Math.round(capacityKg * 0.4)} KG
            </p>
            <p className="text-[11px] text-slate-400">Chilled at 3.5°C</p>
          </div>
        </div>
      </div>

      {/* 3. Operational Split: Incoming Rescues & Needs Gap Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Incoming Deliveries Queue (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-resq-navy">
                Incoming Rescue Telemetry
              </h2>
              <p className="text-xs text-slate-500">
                Live EV transit tracking and digital chain-of-custody verification
              </p>
            </div>
            <span className="text-xs font-bold text-resq-blue bg-blue-50 px-2.5 py-1 rounded-full">
              1 Active Handoff
            </span>
          </div>

          {incomingRescues.map((rescue) => (
            <div
              key={rescue.id}
              className="p-6 rounded-3xl bg-white border border-resq-border shadow-card space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-resq-navy">{rescue.id}</span>
                    <StatusBadge status={rescue.status as any} />
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-black">
                      <Flame className="w-3 h-3 text-red-500" />
                      PRIORITY
                    </span>
                  </div>
                  <h3 className="text-base font-black text-resq-navy mt-1.5">
                    {rescue.foodName}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    From: <strong className="text-resq-navy">{rescue.donorName}</strong> ({rescue.donorAddress})
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-base font-black text-resq-green-bright bg-resq-navy px-3 py-1 rounded-xl block">
                    ETA {rescue.etaMinutes} MINS
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-1">
                    On-time corridor
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs font-semibold text-slate-500">
                  <span>Driver in transit: {rescue.driverName}</span>
                  <span className="text-resq-blue font-bold">75% Route Completed</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-resq-blue rounded-full w-3/4 animate-pulse" />
                </div>
              </div>

              {/* Driver & Telemetry details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 text-slate-600">
                  <Truck className="w-4 h-4 text-resq-green shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Assigned Fleet</span>
                    <span className="font-bold text-resq-navy">{rescue.driverVehicle}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-600">
                  <Thermometer className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Sensor Verification</span>
                    <span className="font-bold text-amber-700">{rescue.temperature}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                <a
                  href={`tel:${rescue.driverPhone}`}
                  className="px-4 py-2.5 rounded-xl border border-resq-border hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Call Driver ({rescue.driverName})
                </a>

                <button
                  onClick={() => setIsVerifyModalOpen(true)}
                  className="px-6 py-2.5 rounded-xl bg-resq-green hover:bg-emerald-600 text-white text-xs font-black shadow-glow-green flex items-center gap-2 transition-all active:scale-95"
                >
                  <PackageCheck className="w-4 h-4" />
                  {isVerified ? "Dropoff Verified ✓" : "Verify Dropoff (Enter PIN)"}
                </button>
              </div>
            </div>
          ))}

          {/* Mini Live Map for Recipient */}
          <div className="rounded-3xl overflow-hidden border border-resq-border shadow-card bg-slate-900 h-64">
            <RescueNetworkMap
              markers={mapMarkers}
              centerLat={12.966}
              centerLng={77.648}
              zoomLevel={14}
              interactive={true}
            />
          </div>
        </div>

        {/* Right Side: Needs Gap Analysis (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-resq-border p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-resq-border pb-3">
            <div>
              <h2 className="text-base font-black text-resq-navy">
                Shelter Needs Gap Analysis
              </h2>
              <p className="text-xs text-slate-500">
                Daily food requirements vs received allocations
              </p>
            </div>
            <button
              onClick={() => {
                alert("Need request dialog opened: update your required food types.");
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-resq-navy text-xs font-bold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Category
            </button>
          </div>

          <div className="space-y-4 pt-2">
            {needs.map((item, idx) => {
              const percentFulfilled = Math.min(100, Math.round((item.receivedKg / item.neededKg) * 100));
              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-resq-navy">
                        {item.category}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-semibold block">
                        Requires: {item.temperatureRequired}
                      </span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        item.urgency === "HIGH"
                          ? "bg-red-100 text-red-700"
                          : item.urgency === "MEDIUM"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {item.urgency} DEFICIT
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">
                        Received: <strong>{item.receivedKg} KG</strong> / {item.neededKg} KG
                      </span>
                      <span className="font-black text-resq-navy">{percentFulfilled}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-resq-green rounded-full"
                        style={{ width: `${percentFulfilled}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-red-600 font-bold">
                      Deficit Gap: {item.gapKg} KG needed
                    </span>
                    <span className="text-slate-400">
                      ≈ {item.gapKg * 4} meals remaining
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
            <span className="font-bold flex items-center gap-1.5 text-emerald-950">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Automated Shelter Redistribution
            </span>
            <p className="text-[11px] text-emerald-800">
              If incoming surplus exceeds tonight's dinner intake ({capacityKg} KG), the AI engine will reroute excess portions to Blossom Children's Home (3.3 KM away).
            </p>
          </div>
        </div>
      </div>

      {/* 4. PIN Dropoff Verification Modal */}
      {isVerifyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-resq-navy-dark/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl border border-resq-border p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-resq-border pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-resq-green-light text-resq-green">
                  <QrCode className="w-4 h-4" />
                </span>
                <h3 className="text-base font-black text-resq-navy">
                  Confirm Food Dropoff Handover
                </h3>
              </div>
              <button
                onClick={() => setIsVerifyModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Ask driver <strong>Rahul Sharma</strong> for their 4-digit security PIN or confirm delivery receipt:
            </p>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Driver Security PIN (Demo: 8291)
              </label>
              <input
                type="text"
                maxLength={4}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter 4-digit PIN"
                className="w-full px-4 py-3 rounded-2xl border border-resq-border text-center text-xl font-mono font-black tracking-widest focus:ring-2 focus:ring-resq-green focus:outline-none"
              />
            </div>

            {isVerified && (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Dropoff verified successfully! Receipt generated.</span>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsVerifyModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-resq-border text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyDropoff}
                className="px-5 py-2 rounded-xl bg-resq-green text-white text-xs font-black hover:bg-emerald-600 shadow-glow-green"
              >
                Confirm Custody Transfer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
