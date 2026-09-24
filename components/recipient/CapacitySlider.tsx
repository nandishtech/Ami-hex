"use client";

import React, { useState } from "react";
import { Sliders, Sparkles, AlertCircle, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { realtime } from "@/lib/realtime";

interface CapacitySliderProps {
  initialCapacityKg?: number;
  recipientOrgName?: string;
  onCapacityChange?: (newCapacity: number) => void;
}

export default function CapacitySlider({
  initialCapacityKg = 180,
  recipientOrgName = "Hope Community Shelter",
  onCapacityChange,
}: CapacitySliderProps) {
  const [capacity, setCapacity] = useState(initialCapacityKg);
  const [showUpdateNotice, setShowUpdateNotice] = useState(false);
  const [availableMatchesCount, setAvailableMatchesCount] = useState(4);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setCapacity(val);

    // Calculate dynamic matches available based on capacity
    const newMatches = Math.max(1, Math.floor(val / 35));
    setAvailableMatchesCount(newMatches);

    // Show signature reaction
    setShowUpdateNotice(true);

    // Broadcast realtime event
    realtime.publish("CAPACITY_UPDATED", { capacity: val, recipient: recipientOrgName }, "RECIPIENT");

    if (onCapacityChange) onCapacityChange(val);

    // Auto fade banner after 3 seconds
    setTimeout(() => {
      setShowUpdateNotice(false);
    }, 3200);
  };

  return (
    <div className="bg-white rounded-3xl border border-resq-border p-6 shadow-card space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-resq-green-light text-resq-green flex items-center justify-center">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-resq-navy">
              Intake Capacity Management
            </h3>
            <p className="text-[11px] text-resq-secondary">
              Dynamically scales matching engine candidates for {recipientOrgName}
            </p>
          </div>
        </div>

        {/* Current Available Intake */}
        <div className="text-right">
          <span className="text-2xl font-black text-resq-navy">{capacity}</span>
          <span className="text-xs font-bold text-slate-400 ml-1">KG</span>
        </div>
      </div>

      {/* Signature Reactive Notice: MATCHING OPPORTUNITIES UPDATED */}
      {showUpdateNotice && (
        <div className="p-3 bg-resq-green-light border border-resq-green/30 rounded-xl flex items-center justify-between text-xs text-resq-green-hover font-bold animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-resq-green animate-spin" />
            <span>MATCHING OPPORTUNITIES UPDATED</span>
          </div>
          <span className="text-[11px] font-semibold bg-white/80 px-2 py-0.5 rounded-md">
            {availableMatchesCount} donations compatible
          </span>
        </div>
      )}

      {/* Interactive Slider */}
      <div>
        <input
          type="range"
          min={20}
          max={400}
          step={10}
          value={capacity}
          onChange={handleSliderChange}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-resq-green"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
          <span>20 KG (Minimal)</span>
          <span>100 KG</span>
          <span>200 KG (Standard)</span>
          <span>300 KG</span>
          <span>400 KG (Max Hub)</span>
        </div>
      </div>

      {/* Dynamic Summary Cards */}
      <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
        <div className="bg-slate-50 p-3 rounded-xl border border-resq-border">
          <span className="text-[11px] text-slate-400 block font-medium">Estimated Meals Intake</span>
          <span className="text-base font-black text-resq-navy">{capacity * 4} Meals</span>
        </div>
        <div className="bg-slate-50 p-3 rounded-xl border border-resq-border">
          <span className="text-[11px] text-slate-400 block font-medium">Compatible Surplus Nearby</span>
          <span className="text-base font-black text-resq-green">{availableMatchesCount} Donations</span>
        </div>
      </div>
    </div>
  );
}
