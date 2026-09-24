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
} from "lucide-react";
import SwipeAcceptCard from "@/components/driver/SwipeAcceptCard";
import PickupVerificationModal from "@/components/rescue/PickupVerificationModal";
import DeliveryHandoffModal from "@/components/rescue/DeliveryHandoffModal";
import DigitalReceiptModal from "@/components/rescue/DigitalReceiptModal";

export default function DriverDashboardPage() {
  const [isPickupModalOpen, setIsPickupModalOpen] = useState(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  // Driver Stats
  const driverStats = {
    rescuesCompleted: 42,
    foodDeliveredKg: 890,
    mealsSupported: 3560,
    vehicle: "EV Tata Nexon (85 KG)",
    rating: "4.98 ★",
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Mobile Driver Header */}
      <div className="flex items-center justify-between p-4 bg-white rounded-3xl border border-resq-border shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-200 shrink-0">
            <img
              src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150"
              alt="Rahul Sharma"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-sm font-black text-resq-navy">Rahul Sharma</h2>
            <p className="text-[11px] text-resq-secondary">
              {driverStats.vehicle} • {driverStats.rating}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-bold text-resq-green block">
            VERIFIED DRIVER
          </span>
          <span className="text-[10px] text-slate-400">
            Bengaluru East Sector
          </span>
        </div>
      </div>

      {/* Driver Impact Summary */}
      <div className="grid grid-cols-3 gap-2.5 text-center">
        <div className="bg-white p-3 rounded-2xl border border-resq-border shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold block uppercase">
            Rescues
          </span>
          <span className="text-base font-black text-resq-navy">
            {driverStats.rescuesCompleted}
          </span>
        </div>
        <div className="bg-white p-3 rounded-2xl border border-resq-border shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold block uppercase">
            Food Carried
          </span>
          <span className="text-base font-black text-resq-blue">
            {driverStats.foodDeliveredKg} KG
          </span>
        </div>
        <div className="bg-white p-3 rounded-2xl border border-resq-border shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold block uppercase">
            Meals Fed
          </span>
          <span className="text-base font-black text-resq-green">
            {driverStats.mealsSupported}
          </span>
        </div>
      </div>

      {/* Active Rescue Action (Swipe-To-Accept Signature Experience) */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block px-2">
          Dispatch Job Radar
        </span>
        <SwipeAcceptCard
          onOpenPickupModal={() => setIsPickupModalOpen(true)}
          onOpenDeliveryModal={() => setIsDeliveryModalOpen(true)}
        />
      </div>

      {/* Quick Navigation Action & Map Link */}
      <div className="p-4 bg-resq-navy text-white rounded-3xl space-y-3 shadow-floating">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold flex items-center gap-1.5 text-resq-green-bright">
            <Navigation className="w-4 h-4" />
            Live Turn-By-Turn Corridor
          </span>
          <span className="font-mono text-slate-300">18 min route</span>
        </div>
        <p className="text-xs text-slate-300">
          Optimal route: 100 Feet Road → Old Airport Road. Traffic normal.
        </p>
        <Link
          href="/network"
          className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold text-center block transition-colors border border-white/20"
        >
          Open City-Wide Driver Map View →
        </Link>
      </div>

      {/* Verification Modals */}
      <PickupVerificationModal
        isOpen={isPickupModalOpen}
        onClose={() => setIsPickupModalOpen(false)}
      />

      <DeliveryHandoffModal
        isOpen={isDeliveryModalOpen}
        onClose={() => setIsDeliveryModalOpen(false)}
        onReceiptOpen={() => setIsReceiptModalOpen(true)}
      />

      <DigitalReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
      />
    </div>
  );
}
