"use client";

import React, { useState } from "react";
import {
  Leaf,
  Droplets,
  Heart,
  Download,
  Calendar,
  Building2,
  TrendingUp,
  Award,
  Sparkles,
  Printer,
  FileSpreadsheet,
} from "lucide-react";
import { IMPACT_METHODOLOGY_VERSION, IMPACT_DISCLAIMER } from "@/lib/impact/calculator";

export default function ImpactPage() {
  const [timeframe, setTimeframe] = useState<"MONTH" | "QUARTER" | "YEAR">("QUARTER");

  const impactData = {
    totalFoodKg: 1420,
    totalMeals: 5680,
    totalCo2eKg: 3550,
    totalWaterLitres: 738400,
    totalRescues: 48,
    organizationsSupported: 18,
  };

  const handleExportCsv = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Metric,Value,Unit,Methodology\n" +
      `Food Rescued,${impactData.totalFoodKg},KG,${IMPACT_METHODOLOGY_VERSION}\n` +
      `Meals Supported,${impactData.totalMeals},Portions,ReFED 1kg=4meals\n` +
      `CO2e Avoided,${impactData.totalCo2eKg},KG CO2e,EPA WARM v15\n` +
      `Water Saved,${impactData.totalWaterLitres},Litres,Lifecycle Factor 520L/kg\n` +
      `Rescues Completed,${impactData.totalRescues},Count,Dual-Verified Custody\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `RESQFOOD_ESG_Report_${timeframe}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-[1640px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-resq-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-resq-green-light text-resq-green">
              <Leaf className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Corporate ESG & Impact Verification
            </span>
          </div>
          <h1 className="text-2xl font-black text-resq-navy mt-1">
            Measurable Community & Ecological Impact
          </h1>
          <p className="text-xs text-resq-secondary">
            Audited lifecycle metrics modeled via {IMPACT_METHODOLOGY_VERSION}
          </p>
        </div>

        {/* Timeframe Filter & Export Buttons */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
            {(["MONTH", "QUARTER", "YEAR"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  timeframe === t ? "bg-white text-resq-navy shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCsv}
            className="px-4 py-2 rounded-xl bg-resq-navy hover:bg-resq-navy-dark text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Export ESG CSV
          </button>
        </div>
      </div>

      {/* Primary Impact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Food Rescued */}
        <div className="bg-white p-6 rounded-3xl border border-resq-border shadow-card space-y-2">
          <div className="w-10 h-10 rounded-xl bg-resq-blue-light text-resq-blue flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Food Rescued
          </span>
          <span className="text-3xl font-black text-resq-navy block">
            {impactData.totalFoodKg.toLocaleString()} KG
          </span>
          <span className="text-xs text-resq-green font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            100% diverted from municipal landfills
          </span>
        </div>

        {/* Meals Supported */}
        <div className="bg-white p-6 rounded-3xl border border-emerald-200 shadow-card space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Heart className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block">
            Meals Supported
          </span>
          <span className="text-3xl font-black text-emerald-950 block">
            {impactData.totalMeals.toLocaleString()}
          </span>
          <span className="text-xs text-slate-500 block">
            Across 18 regional community shelters
          </span>
        </div>

        {/* CO2e Prevented */}
        <div className="bg-white p-6 rounded-3xl border border-blue-200 shadow-card space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <Leaf className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block">
            CO2e Prevented (Estimated)
          </span>
          <span className="text-3xl font-black text-blue-950 block">
            {impactData.totalCo2eKg.toLocaleString()} KG
          </span>
          <span className="text-xs text-slate-500 block">
            Equivalent to 15,200 km vehicle travel
          </span>
        </div>

        {/* Water Conserved */}
        <div className="bg-white p-6 rounded-3xl border border-cyan-200 shadow-card space-y-2">
          <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center">
            <Droplets className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 block">
            Embedded Water Saved
          </span>
          <span className="text-3xl font-black text-cyan-950 block">
            {(impactData.totalWaterLitres / 1000).toFixed(0)}k Litres
          </span>
          <span className="text-xs text-slate-500 block">
            Agricultural production water preserved
          </span>
        </div>
      </div>

      {/* Methodology & Disclaimer Notice */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-resq-border text-xs text-resq-secondary space-y-1">
        <p className="font-bold text-resq-navy">Scientific Methodology Disclosure:</p>
        <p className="leading-relaxed">{IMPACT_DISCLAIMER}</p>
        <p className="text-[11px] text-slate-400 font-mono">
          Methodology Identifier: {IMPACT_METHODOLOGY_VERSION}
        </p>
      </div>

      {/* Recipient Distribution Table */}
      <div className="bg-white rounded-3xl border border-resq-border p-6 shadow-card space-y-4">
        <h3 className="text-sm font-bold text-resq-navy">
          Shelter Food Allocation Distribution (Last 90 Days)
        </h3>

        <div className="divide-y divide-slate-100 text-xs">
          <div className="py-3 flex items-center justify-between font-bold text-slate-400 uppercase text-[10px]">
            <span>Recipient Organization</span>
            <span>Food Delivered</span>
            <span>Meals Supported</span>
            <span>Status</span>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="font-bold text-resq-navy">Hope Community Shelter</p>
              <p className="text-slate-400 text-[11px]">Old Airport Road</p>
            </div>
            <span className="font-bold text-resq-navy">420 KG</span>
            <span className="font-bold text-emerald-700">1,680 Meals</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Verified
            </span>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="font-bold text-resq-navy">St. Jude Mercy Food Bank</p>
              <p className="text-slate-400 text-[11px]">Victoria Road</p>
            </div>
            <span className="font-bold text-resq-navy">560 KG</span>
            <span className="font-bold text-emerald-700">2,240 Meals</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Verified
            </span>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="font-bold text-resq-navy">Ananda Community Kitchen</p>
              <p className="text-slate-400 text-[11px]">Ulsoor Lake Road</p>
            </div>
            <span className="font-bold text-resq-navy">440 KG</span>
            <span className="font-bold text-emerald-700">1,760 Meals</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Verified
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
