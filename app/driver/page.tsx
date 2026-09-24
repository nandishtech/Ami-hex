"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Truck,
  MapPin,
  Clock,
  ShieldCheck,
  QrCode,
  CheckCircle2,
  Navigation,
  ArrowRight,
  Phone,
  Flame,
  Award,
  BatteryCharging,
  Thermometer,
  Zap,
  Check,
  RotateCcw,
} from "lucide-react";
import SwipeAcceptCard from "@/components/driver/SwipeAcceptCard";
import PickupVerificationModal from "@/components/rescue/PickupVerificationModal";
import DeliveryHandoffModal from "@/components/rescue/DeliveryHandoffModal";
import DigitalReceiptModal from "@/components/rescue/DigitalReceiptModal";
import RescueNetworkMap from "@/components/maps/RescueNetworkMap";
import { MapMarker } from "@/lib/maps";

export default function DriverDashboardPage() {
  const [isPickupModalOpen, setIsPickupModalOpen] = useState(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [showCelebrationRipple, setShowCelebrationRipple] = useState(false);

  // Driver Telemetry
  const driverStats = {
    name: "Rahul Sharma",
    rescuesCompleted: 42,
    foodDeliveredKg: 890,
    mealsSupported: 3560,
    vehicle: "Tata Nexon EV (85 KG)",
    plate: "KA-01-EQ-8291",
    batteryPercent: 82,
    batteryRangeKm: 148,
    cargoTemp: "68°C (Hot Hold)",
    rating: "4.98 ★",
    shiftEarnings: "₹1,850",
    treesSaved: 28,
  };

  const mapMarkers: MapMarker[] = [
    {
      id: "driver-rahul",
      type: "DRIVER",
      latitude: 12.9701,
      longitude: 77.6432,
      title: "Your Location (Rahul Sharma)",
      subtitle: "EV Nexon • Speed 34 km/h",
    },
    {
      id: "greenfork",
      type: "DONOR",
      latitude: 12.9784,
      longitude: 77.6408,
      title: "GreenFork Restaurant (Pickup)",
      subtitle: "30 KG Hot Chafing Batch Ready",
    },
    {
      id: "hope-shelter",
      type: "RECIPIENT",
      latitude: 12.9612,
      longitude: 77.6534,
      title: "Hope Community Shelter (Dropoff)",
      subtitle: "Arrival Window: 18:45 - 19:15",
    },
  ];

  const handleDeliveryComplete = () => {
    setIsDeliveryModalOpen(false);
    setShowCelebrationRipple(true);
    setTimeout(() => {
      setIsReceiptModalOpen(true);
    }, 1200);
  };

  return (
    <div className="w-full max-w-[1640px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-resq-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-50 text-resq-green">
              <Truck className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Zero-Emission Rescue Fleet Terminal
            </span>
          </div>
          <h1 className="text-2xl font-black text-resq-navy mt-1">
            Driver Command & Dispatch Radar
          </h1>
          <p className="text-xs text-resq-secondary">
            Autonomous route dispatches with continuous hot/cold chain thermal telemetry and dual QR verification.
          </p>
        </div>

        {/* Fleet telemetry chip */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold">
            <BatteryCharging className="w-4 h-4 text-emerald-600" />
            <span>EV Battery: {driverStats.batteryPercent}% ({driverStats.batteryRangeKm} KM)</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Mobile Simulator on Left (5 Cols) + Fleet Logistics on Right (7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Mobile-First Driver Terminal Interface */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-md bg-slate-900 p-3 rounded-[40px] shadow-2xl border-4 border-slate-800 relative">
            {/* Phone Notch */}
            <div className="w-32 h-4 bg-slate-800 mx-auto rounded-b-xl mb-3 flex items-center justify-center">
              <div className="w-8 h-1 bg-slate-700 rounded-full" />
            </div>

            {/* Inner App Container */}
            <div className="bg-slate-50 rounded-[32px] p-4 space-y-4 overflow-hidden relative min-h-[580px]">
              {/* Green Celebration Ripple Overlay */}
              {showCelebrationRipple && (
                <div className="absolute inset-0 z-30 bg-emerald-600/90 backdrop-blur-sm flex flex-col items-center justify-center text-white p-6 text-center animate-in fade-in zoom-in duration-300">
                  <div className="w-20 h-20 rounded-full bg-white text-emerald-600 flex items-center justify-center shadow-2xl mb-4 animate-bounce">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <h3 className="text-2xl font-black">RESCUE COMPLETED!</h3>
                  <p className="text-xs text-emerald-100 mt-2 font-medium">
                    120 hot meals saved and delivered safely to Hope Community Shelter.
                  </p>
                  <span className="mt-3 text-xs font-mono font-bold bg-white/20 px-3 py-1 rounded-full">
                    +₹350 Rescue Stipend Credited
                  </span>
                </div>
              )}

              {/* Driver Mini Profile Header */}
              <div className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-resq-border shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-resq-navy text-white flex items-center justify-center font-bold text-sm">
                    RS
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-resq-navy">
                      {driverStats.name}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      {driverStats.vehicle}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black text-resq-green block">
                    ONLINE
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {driverStats.rating}
                  </span>
                </div>
              </div>

              {/* 3 Mobile KPI Chips */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-white p-2.5 rounded-2xl border border-resq-border shadow-sm">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">
                    Rescues
                  </span>
                  <span className="text-base font-black text-resq-navy">
                    {driverStats.rescuesCompleted}
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-2xl border border-resq-border shadow-sm">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">
                    Food
                  </span>
                  <span className="text-base font-black text-resq-blue">
                    {driverStats.foodDeliveredKg} KG
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-2xl border border-resq-border shadow-sm">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">
                    Meals
                  </span>
                  <span className="text-base font-black text-resq-green">
                    {driverStats.mealsSupported}
                  </span>
                </div>
              </div>

              {/* Interactive Swipe-To-Accept Component */}
              <SwipeAcceptCard
                onOpenPickupModal={() => setIsPickupModalOpen(true)}
                onOpenDeliveryModal={() => setIsDeliveryModalOpen(true)}
              />
            </div>
          </div>
        </div>

        {/* Right: Fleet Telemetry & Turn-by-Turn Map (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Turn-by-turn Navigation Corridor */}
          <div className="bg-white rounded-3xl border border-resq-border p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between border-b border-resq-border pb-3">
              <div>
                <h2 className="text-base font-black text-resq-navy">
                  Active Dispatch Route & Telemetry
                </h2>
                <p className="text-xs text-slate-500">
                  Live corridor: Indiranagar 100 Ft Rd → Old Airport Road (3.8 KM)
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-resq-blue-light text-resq-blue text-xs font-bold flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5" />
                Turn Right in 250m
              </span>
            </div>

            {/* Map */}
            <div className="rounded-2xl overflow-hidden border border-resq-border shadow-sm h-72 bg-slate-900">
              <RescueNetworkMap
                markers={mapMarkers}
                centerLat={12.971}
                centerLng={77.646}
                zoomLevel={14}
                interactive={true}
              />
            </div>

            {/* Route steps */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400">Step 1: Pickup</span>
                <p className="font-bold text-resq-navy mt-1">GreenFork Banquets</p>
                <p className="text-slate-500 text-[11px]">30 KG Hot Chafing Batch • Verified</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-xs">
                <span className="text-[10px] uppercase font-bold text-resq-blue">Step 2: Transit</span>
                <p className="font-bold text-resq-navy mt-1">Old Airport Road</p>
                <p className="text-slate-500 text-[11px]">Speed: 34 km/h • Temp: 68°C</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400">Step 3: Dropoff</span>
                <p className="font-bold text-resq-navy mt-1">Hope Shelter</p>
                <p className="text-slate-500 text-[11px]">ETA 12 mins • Intake open</p>
              </div>
            </div>
          </div>

          {/* Safety & Chain of Custody Checklist */}
          <div className="bg-white rounded-3xl border border-resq-border p-6 shadow-card space-y-4">
            <h3 className="text-base font-black text-resq-navy">
              Thermal Safety & Chain-of-Custody Checklist
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600 shrink-0">
                  <Thermometer className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-resq-navy">Thermal Insulation Check</h4>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Prepared meals must remain &gt;60°C throughout transit. Current cargo sensor reads <strong>68°C</strong>.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-blue-50 text-resq-blue shrink-0">
                  <QrCode className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-resq-navy">Dual QR Custody Handoff</h4>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Scan donor QR at pickup. Show recipient security PIN (8291) at dropoff to release smart contract escrow.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Modals */}
      <PickupVerificationModal
        isOpen={isPickupModalOpen}
        onClose={() => setIsPickupModalOpen(false)}
        onVerified={() => {
          setIsPickupModalOpen(false);
        }}
        rescueId="RF-10283"
        donorName="GreenFork Restaurant"
      />

      <DeliveryHandoffModal
        isOpen={isDeliveryModalOpen}
        onClose={() => setIsDeliveryModalOpen(false)}
        onVerified={handleDeliveryComplete}
        rescueId="RF-10283"
        recipientName="Hope Community Shelter"
      />

      <DigitalReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        rescue={{
          id: "RF-10283",
          foodName: "Paneer Butter Masala, Jeera Rice & Garlic Naan",
          quantityKg: 30,
          donorName: "GreenFork Restaurant",
          recipientName: "Hope Community Shelter",
          driverName: "Rahul Sharma",
          deliveredAt: new Date().toLocaleTimeString(),
          mealsFed: 120,
          co2eAvoidedKg: 75,
        }}
      />
    </div>
  );
}
