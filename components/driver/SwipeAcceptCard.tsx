"use client";

import React, { useState } from "react";
import {
  Truck,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle2,
  Navigation,
  QrCode,
  Sparkles,
  Phone,
  AlertTriangle,
  Radio,
} from "lucide-react";
import { realtime } from "@/lib/realtime";

interface SwipeAcceptCardProps {
  rescue?: {
    id: string;
    foodName: string;
    quantityKg: number;
    donorName: string;
    donorAddress: string;
    recipientName: string;
    recipientAddress: string;
    distanceKm: number;
    etaMinutes: number;
    score: number;
  };
  onAccept?: () => void;
  onArrivedPickup?: () => void;
  onOpenPickupModal?: () => void;
  onOpenDeliveryModal?: () => void;
}

export default function SwipeAcceptCard({
  rescue = {
    id: "RF-10283",
    foodName: "30 KG Paneer Butter Masala, Jeera Rice & Naan",
    quantityKg: 30,
    donorName: "GreenFork Restaurant",
    donorAddress: "100 Feet Road, Indiranagar",
    recipientName: "Hope Community Shelter",
    recipientAddress: "Old Airport Road, Kodihalli",
    distanceKm: 3.8,
    etaMinutes: 18,
    score: 96,
  },
  onAccept,
  onArrivedPickup,
  onOpenPickupModal,
  onOpenDeliveryModal,
}: SwipeAcceptCardProps) {
  const [driverStatus, setDriverStatus] = useState<"AVAILABLE" | "BUSY" | "OFFLINE">("AVAILABLE");
  const [stage, setStage] = useState<"NEW_REQUEST" | "ACCEPTED" | "ARRIVED" | "PICKED_UP" | "DELIVERED">("NEW_REQUEST");
  const [driverDistanceKm, setDriverDistanceKm] = useState<number>(2.4);
  const isWithin10Km = driverDistanceKm <= 10;

  const handleAccept = () => {
    setStage("ACCEPTED");
    setDriverStatus("BUSY");
    realtime.publish("DRIVER_ACCEPTED", { rescueId: rescue.id, driverName: "Rahul Sharma" }, "DRIVER");
    if (onAccept) onAccept();
  };

  const handleArrived = () => {
    setStage("ARRIVED");
    realtime.publish("ARRIVED_PICKUP", { rescueId: rescue.id }, "DRIVER");
    if (onArrivedPickup) onArrivedPickup();
  };

  return (
    <div className="bg-white rounded-3xl border border-resq-border p-5 shadow-floating space-y-4 max-w-md mx-auto">
      {/* Availability Selector (Large touch targets) */}
      <div className="flex items-center justify-between p-1 bg-slate-100 rounded-2xl">
        <button
          onClick={() => setDriverStatus("AVAILABLE")}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
            driverStatus === "AVAILABLE"
              ? "bg-resq-green text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          AVAILABLE
        </button>
        <button
          onClick={() => setDriverStatus("BUSY")}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
            driverStatus === "BUSY"
              ? "bg-amber-500 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          ON RESCUE
        </button>
        <button
          onClick={() => setDriverStatus("OFFLINE")}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
            driverStatus === "OFFLINE"
              ? "bg-slate-700 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          OFFLINE
        </button>
      </div>

      {/* Rescue Dispatch Card */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-resq-border space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-resq-blue-light text-resq-blue font-bold text-xs">
                {rescue.id}
              </span>
              <span className="text-[11px] font-semibold text-slate-500">
                Rescue Score: {rescue.score}/100
              </span>
            </div>
            <h4 className="text-sm font-bold text-resq-navy mt-1.5 leading-snug">
              {rescue.foodName}
            </h4>
          </div>

          <div className="text-right">
            <span className="text-lg font-black text-resq-navy">
              {rescue.quantityKg}
            </span>
            <span className="text-xs font-bold text-slate-400 ml-1">KG</span>
          </div>
        </div>

        {/* Origin & Destination */}
        <div className="space-y-2 text-xs pt-1 border-t border-slate-200">
          <div className="flex items-start gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-resq-blue mt-1 shrink-0" />
            <div>
              <p className="font-bold text-resq-navy">{rescue.donorName}</p>
              <p className="text-[11px] text-slate-400">{rescue.donorAddress}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-resq-green mt-1 shrink-0" />
            <div>
              <p className="font-bold text-resq-navy">{rescue.recipientName}</p>
              <p className="text-[11px] text-slate-400">{rescue.recipientAddress}</p>
            </div>
          </div>
        </div>

        {/* ETA & Distance Telemetry */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs text-resq-secondary font-semibold">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{rescue.distanceKm} KM Corridor</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{rescue.etaMinutes} mins ETA</span>
          </div>
        </div>

        {/* 10 KM Proximity Range Gate Banner */}
        <div className={`p-3 rounded-2xl border text-xs space-y-1.5 ${
          isWithin10Km
            ? "bg-emerald-50 border-emerald-200 text-emerald-950"
            : "bg-red-50 border-red-200 text-red-950"
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold">
              <Radio className={`w-3.5 h-3.5 ${isWithin10Km ? "text-emerald-600 animate-pulse" : "text-red-500"}`} />
              <span>Courier Proximity: {driverDistanceKm} KM away</span>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              isWithin10Km
                ? "bg-emerald-200 text-emerald-900"
                : "bg-red-200 text-red-900"
            }`}>
              {isWithin10Km ? "Eligible (<10 KM)" : "Out of Range (>10 KM)"}
            </span>
          </div>
          <p className="text-[11px] leading-tight opacity-80">
            {isWithin10Km
              ? "✓ You are within the 10 KM rescue dispatch radius and eligible to accept this booking."
              : "⛔ Only couriers stationed within 10 KM can receive this booking to protect hot/cold food safety."}
          </p>

          {/* Quick Range Simulation Buttons for Evaluation */}
          <div className="pt-1 flex items-center gap-2">
            <span className="text-[10px] text-slate-500 font-bold">Test Range:</span>
            <button
              type="button"
              onClick={() => setDriverDistanceKm(2.4)}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                driverDistanceKm <= 10 ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-700"
              }`}
            >
              2.4 KM (In Range)
            </button>
            <button
              type="button"
              onClick={() => setDriverDistanceKm(14.8)}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                driverDistanceKm > 10 ? "bg-red-600 text-white" : "bg-slate-200 text-slate-700"
              }`}
            >
              14.8 KM (Out of Range)
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Stage Actions (Swipe to accept / navigation / verification) */}
      <div className="pt-2">
        {stage === "NEW_REQUEST" && (
          <button
            onClick={handleAccept}
            disabled={!isWithin10Km}
            className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-glow active:scale-95 transition-all ${
              isWithin10Km
                ? "bg-gradient-to-r from-resq-blue to-resq-green text-white hover:opacity-95"
                : "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none"
            }`}
          >
            <span>
              {isWithin10Km
                ? "ACCEPT RESCUE BOOKING (<10 KM)"
                : "CANNOT ACCEPT: OUTSIDE 10 KM RADIUS"}
            </span>
            <ArrowRight className="w-5 h-5" />
          </button>
        )}

        {stage === "ACCEPTED" && (
          <div className="space-y-2">
            <button
              onClick={handleArrived}
              className="w-full py-3.5 rounded-2xl bg-resq-blue text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-resq-blue-hover shadow-sm active:scale-95 transition-all"
            >
              <Navigation className="w-4 h-4" />
              ARRIVED AT PICKUP LOCATION
            </button>
            <p className="text-[11px] text-center text-slate-400">
              GPS Navigation active • Turn left on Old Airport Road
            </p>
          </div>
        )}

        {stage === "ARRIVED" && (
          <button
            onClick={() => {
              if (onOpenPickupModal) onOpenPickupModal();
              setStage("PICKED_UP");
            }}
            className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
          >
            <QrCode className="w-5 h-5" />
            VERIFY PICKUP (SCAN QR & PHOTO)
          </button>
        )}

        {stage === "PICKED_UP" && (
          <button
            onClick={() => {
              if (onOpenDeliveryModal) onOpenDeliveryModal();
            }}
            className="w-full py-3.5 rounded-2xl bg-resq-green hover:bg-resq-green-hover text-white font-bold text-sm flex items-center justify-center gap-2 shadow-glow-green active:scale-95 transition-all"
          >
            <CheckCircle2 className="w-5 h-5" />
            CONFIRM DELIVERY TO SHELTER
          </button>
        )}
      </div>
    </div>
  );
}
