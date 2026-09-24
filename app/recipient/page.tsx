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
} from "lucide-react";
import CapacitySlider from "@/components/recipient/CapacitySlider";
import StatusBadge from "@/components/ui/StatusBadge";
import RescueNetworkMap from "@/components/maps/RescueNetworkMap";
import { MapMarker } from "@/lib/maps";

export default function RecipientDashboardPage() {
  const [needs, setNeeds] = useState([
    {
      category: "Prepared Meals",
      urgency: "HIGH",
      neededKg: 40,
      receivedKg: 12,
      gapKg: 28,
    },
    {
      category: "Bakery",
      urgency: "MEDIUM",
      neededKg: 20,
      receivedKg: 15,
      gapKg: 5,
    },
    {
      category: "Dairy",
      urgency: "LOW",
      neededKg: 15,
      receivedKg: 5,
      gapKg: 10,
    },
  ]);

  const incomingRescues = [
    {
      id: "RF-10283",
      foodName: "30 KG Paneer Butter Masala, Jeera Rice & Garlic Naan",
      donorName: "GreenFork Restaurant",
      driverName: "Rahul Sharma (EV Car)",
      etaMinutes: 12,
      status: "IN_TRANSIT",
      urgency: "HIGH",
    },
  ];

  const mapMarkers: MapMarker[] = [
    {
      id: "hope-shelter",
      type: "RECIPIENT",
      latitude: 12.9612,
      longitude: 77.6534,
      title: "Hope Community Shelter",
      subtitle: "Active Intake Center • 180 KG Capacity",
    },
    {
      id: "driver-rahul",
      type: "DRIVER",
      latitude: 12.9701,
      longitude: 77.6432,
      title: "Driver Rahul Sharma",
      subtitle: "Carrying RF-10283 • ETA 12 mins",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-resq-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-resq-green-light text-resq-green">
              <HeartHandshake className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Shelter & NGO Operations
            </span>
          </div>
          <h1 className="text-2xl font-black text-resq-navy mt-1">
            Hope Community Shelter
          </h1>
          <p className="text-xs text-resq-secondary">
            Old Airport Road, Kodihalli • Serving 200 resident hot meals daily
          </p>
        </div>

        {/* Operating Hours & Intake Status */}
        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-resq-green animate-ping" />
            Intake Gate Open (07:00 - 22:30)
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Capacity Slider & Needs Gaps */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Signature Capacity Slider & Needs Gaps */}
        <div className="lg:col-span-7 space-y-6">
          {/* Signature Capacity Slider */}
          <CapacitySlider
            initialCapacityKg={180}
            recipientOrgName="Hope Community Shelter"
          />

          {/* Current Needs & Gaps Section */}
          <div id="needs" className="bg-white rounded-3xl border border-resq-border p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-resq-navy">
                  Current Food Needs & Gap Analysis
                </h3>
                <p className="text-[11px] text-resq-secondary">
                  Prioritizes autonomous matching for items with critical deficit
                </p>
              </div>

              <button className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-resq-navy flex items-center gap-1 transition-colors">
                <Plus className="w-3.5 h-3.5" />
                Add Need
              </button>
            </div>

            <div className="space-y-3">
              {needs.map((item) => (
                <div
                  key={item.category}
                  className="p-4 rounded-2xl bg-slate-50 border border-resq-border space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-resq-navy">
                          {item.category}
                        </span>
                        <StatusBadge status={item.urgency} type="urgency" size="sm" />
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Received {item.receivedKg} KG of {item.neededKg} KG target
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-black text-red-600 block">
                        Gap: -{item.gapKg} KG
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {item.gapKg * 4} meals needed
                      </span>
                    </div>
                  </div>

                  {/* Visual Progress bar */}
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-resq-green rounded-full"
                      style={{
                        width: `${Math.min(100, (item.receivedKg / item.neededKg) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Incoming Rescues & Live Map */}
        <div className="lg:col-span-5 space-y-6">
          {/* Incoming Rescues Box */}
          <div className="bg-white rounded-3xl border border-resq-border p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-resq-navy flex items-center gap-2">
                <Truck className="w-4 h-4 text-resq-blue" />
                Incoming Rescues ({incomingRescues.length})
              </h3>
              <span className="text-xs text-resq-blue font-bold">Live GPS Active</span>
            </div>

            {incomingRescues.map((rescue) => (
              <div
                key={rescue.id}
                className="p-4 rounded-2xl bg-resq-blue-light/30 border border-resq-blue/20 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold text-resq-blue block">
                      {rescue.id}
                    </span>
                    <h4 className="text-xs font-bold text-resq-navy mt-1">
                      {rescue.foodName}
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-resq-blue block">
                      ETA {rescue.etaMinutes}m
                    </span>
                    <StatusBadge status={rescue.status} size="sm" />
                  </div>
                </div>

                <div className="text-xs text-slate-600 pt-2 border-t border-resq-blue/10 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Origin:</span>
                    <span className="font-semibold text-resq-navy">{rescue.donorName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Driver:</span>
                    <span className="font-semibold text-resq-navy">{rescue.driverName}</span>
                  </div>
                </div>

                <Link
                  href={`/rescues/${rescue.id}`}
                  className="block text-center py-2 rounded-xl bg-resq-blue text-white text-xs font-bold hover:bg-resq-blue-hover transition-colors"
                >
                  Track Driver & Prepare Handoff →
                </Link>
              </div>
            ))}
          </div>

          {/* Local Area Map */}
          <RescueNetworkMap
            markers={mapMarkers}
            heightClass="h-[300px]"
          />
        </div>
      </div>
    </div>
  );
}
