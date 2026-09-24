"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  BarChart3,
  Calendar,
  Clock,
  Truck,
  Leaf,
  Users,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  Flame,
  CheckCircle2,
  HelpCircle,
  Eye,
} from "lucide-react";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<"7D" | "30D" | "90D" | "1Y">("30D");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [hoveredDataPoint, setHoveredDataPoint] = useState<{ day: string; kg: number; meals: number } | null>(null);
  const [drilldownRescue, setDrilldownRescue] = useState<any | null>(null);

  // High-level KPIs
  const summaryMetrics = [
    {
      label: "Total Food Diverted",
      value: "14,820 KG",
      change: "+24.5%",
      isPositive: true,
      subtext: "vs prior 30-day window",
      icon: Leaf,
      color: "text-resq-green",
      bg: "bg-emerald-50",
    },
    {
      label: "Meals Created",
      value: "59,280",
      change: "+24.5%",
      isPositive: true,
      subtext: "ReFED 1 KG = 4 meals ratio",
      icon: Users,
      color: "text-resq-blue",
      bg: "bg-blue-50",
    },
    {
      label: "Avg. Match Latency",
      value: "1.4 min",
      change: "-18.2%",
      isPositive: true,
      subtext: "autonomous calculation speed",
      icon: Clock,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Fleet Utilization",
      value: "92.4%",
      change: "+6.1%",
      isPositive: true,
      subtext: "12 active electric delivery units",
      icon: Truck,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  // 30-day area chart data points
  const dailyRescueData = [
    { day: "Day 1", kg: 380, meals: 1520 },
    { day: "Day 4", kg: 420, meals: 1680 },
    { day: "Day 7", kg: 390, meals: 1560 },
    { day: "Day 10", kg: 510, meals: 2040 },
    { day: "Day 13", kg: 480, meals: 1920 },
    { day: "Day 16", kg: 590, meals: 2360 },
    { day: "Day 19", kg: 640, meals: 2560 },
    { day: "Day 22", kg: 580, meals: 2320 },
    { day: "Day 25", kg: 720, meals: 2880 },
    { day: "Day 28", kg: 690, meals: 2760 },
    { day: "Day 30", kg: 810, meals: 3240 },
  ];

  // Category Breakdown
  const categoryBreakdown = [
    { category: "Prepared Meals", kg: 6240, percentage: 42, color: "#1769FF" },
    { category: "Bakery & Breads", kg: 3850, percentage: 26, color: "#F4B942" },
    { category: "Dairy & Produce", kg: 2960, percentage: 20, color: "#25C982" },
    { category: "Packaged Pantry", kg: 1770, percentage: 12, color: "#8B5CF6" },
  ];

  // Heatmap: Day of Week (0-6) x Time Slot (Morning, Noon, Evening, Late Night)
  const heatmapData = [
    { day: "Mon", slots: [20, 55, 85, 40] },
    { day: "Tue", slots: [15, 60, 90, 45] },
    { day: "Wed", slots: [30, 65, 95, 50] },
    { day: "Thu", slots: [25, 70, 92, 55] },
    { day: "Fri", slots: [40, 85, 98, 80] },
    { day: "Sat", slots: [55, 90, 100, 90] },
    { day: "Sun", slots: [50, 95, 96, 75] },
  ];

  // Sample drilldown rescues
  const recentHighImpactRescues = [
    {
      id: "RF-10283",
      food: "Paneer Butter Masala, Jeera Rice & Garlic Naan",
      donor: "GreenFork Banquets",
      recipient: "Hope Community Shelter",
      kg: 30,
      meals: 120,
      date: "Today, 18:30",
      driver: "Rahul Sharma",
      efficiency: "98%",
    },
    {
      id: "RF-10255",
      food: "20 Large Sourdough & Focaccia Breads",
      donor: "Artisan Bakery Hub",
      recipient: "St. Jude Mercy Food Bank",
      kg: 25,
      meals: 100,
      date: "Yesterday, 14:15",
      driver: "Priya Nair",
      efficiency: "96%",
    },
    {
      id: "RF-10190",
      food: "Steamed Vegetable Biryani (60 Portions)",
      donor: "Silicon Tech Cafeteria",
      recipient: "Ananda Community Kitchen",
      kg: 45,
      meals: 180,
      date: "22 Sep, 20:00",
      driver: "Farooq Ahmed",
      efficiency: "99%",
    },
  ];

  return (
    <div className="w-full max-w-[1640px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-resq-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-resq-blue-light text-resq-blue">
              <BarChart3 className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              City-Wide Logistics & Environmental Intelligence
            </span>
          </div>
          <h1 className="text-2xl font-black text-resq-navy mt-1">
            Platform Analytics & Demand Telemetry
          </h1>
          <p className="text-xs text-resq-secondary">
            High-precision operational analytics, supply-demand delta curves, and verified environmental accounting.
          </p>
        </div>

        {/* Time Filter & Export */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-2xl text-xs font-bold">
            {(["7D", "30D", "90D", "1Y"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeRange(t)}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  timeRange === t
                    ? "bg-white text-resq-navy shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-2xl bg-white border border-resq-border hover:bg-slate-50 text-resq-navy text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            Print Analytics
          </button>
        </div>
      </div>

      {/* 1. Summary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryMetrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div
              key={idx}
              className="bg-white p-5 rounded-3xl border border-resq-border shadow-card hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {m.label}
                </span>
                <span className={`p-2 rounded-2xl ${m.bg} ${m.color}`}>
                  <Icon className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-black text-resq-navy tracking-tight">
                  {m.value}
                </span>
                <span
                  className={`text-xs font-bold flex items-center gap-0.5 ${
                    m.isPositive ? "text-resq-green" : "text-red-500"
                  }`}
                >
                  {m.isPositive ? (
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5" />
                  )}
                  {m.change}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-400">{m.subtext}</p>
            </div>
          );
        })}
      </div>

      {/* 2. Primary SVG Analytics Chart: Food Rescued Volume Curve */}
      <div className="bg-white rounded-3xl border border-resq-border p-6 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-resq-border pb-3">
          <div>
            <h3 className="text-base font-black text-resq-navy">
              Food Rescue Velocity & Volume Curve
            </h3>
            <p className="text-xs text-slate-500">
              Daily kilograms diverted from landfills across Bengaluru Urban Sector (Hover for meal portions)
            </p>
          </div>

          {hoveredDataPoint && (
            <div className="bg-resq-navy text-white text-xs px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-2 animate-in fade-in">
              <span>{hoveredDataPoint.day}:</span>
              <span className="text-resq-green-bright font-black">{hoveredDataPoint.kg} KG</span>
              <span className="text-slate-300">({hoveredDataPoint.meals} meals)</span>
            </div>
          )}
        </div>

        {/* Large Readable SVG Chart */}
        <div className="w-full h-72 relative">
          <svg className="w-full h-full" viewBox="0 0 1000 280" preserveAspectRatio="none">
            <defs>
              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1769FF" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#1769FF" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            <line x1="0" y1="40" x2="1000" y2="40" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="0" y1="100" x2="1000" y2="100" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="0" y1="160" x2="1000" y2="160" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="0" y1="220" x2="1000" y2="220" stroke="#f1f5f9" strokeWidth="1" />

            {/* Area Path */}
            <path
              d="M 50,220 L 50,180 L 140,165 L 230,175 L 320,135 L 410,145 L 500,105 L 590,90 L 680,110 L 770,65 L 860,75 L 950,40 L 950,240 L 50,240 Z"
              fill="url(#areaGradient)"
            />

            {/* Stroke Line */}
            <path
              d="M 50,180 L 140,165 L 230,175 L 320,135 L 410,145 L 500,105 L 590,90 L 680,110 L 770,65 L 860,75 L 950,40"
              fill="none"
              stroke="#1769FF"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data Circles */}
            {dailyRescueData.map((pt, i) => {
              const cx = 50 + i * 90;
              const cy = 240 - (pt.kg / 900) * 200;
              return (
                <g key={i}>
                  <circle
                    cx={cx}
                    cy={cy}
                    r="5"
                    fill="#1769FF"
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    className="cursor-pointer hover:r-8 transition-all"
                    onMouseEnter={() => setHoveredDataPoint(pt)}
                    onMouseLeave={() => setHoveredDataPoint(null)}
                  />
                </g>
              );
            })}
          </svg>

          {/* X Axis Labels */}
          <div className="flex justify-between text-[11px] font-bold text-slate-400 mt-2 px-6">
            {dailyRescueData.map((d, i) => (
              <span key={i}>{d.day}</span>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Mid Section: Category Distribution & Supply/Demand Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Breakdown (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-resq-border p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-resq-border pb-3">
            <div>
              <h3 className="text-sm font-black text-resq-navy">
                Food Category Composition
              </h3>
              <p className="text-xs text-slate-500">
                Breakdown by gross weight diverted
              </p>
            </div>
            <span className="text-xs font-bold text-resq-blue">14,820 KG Total</span>
          </div>

          <div className="space-y-4 pt-2">
            {categoryBreakdown.map((cat, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-resq-navy">{cat.category}</span>
                  </div>
                  <span className="text-slate-500">
                    {cat.kg.toLocaleString()} KG ({cat.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${cat.percentage}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-500 mt-4">
            💡 <strong>Logistics Insight:</strong> Prepared meals represent the highest perishability risk. Average rescue dispatch time for this category is maintained under 14 minutes.
          </div>
        </div>

        {/* 7-Day Peak Demand Heatmap (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-resq-border p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-resq-border pb-3">
            <div>
              <h3 className="text-sm font-black text-resq-navy">
                Regional Surplus Demand Heatmap
              </h3>
              <p className="text-xs text-slate-500">
                Hourly shelter intake congestion vs restaurant surplus generation
              </p>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold">
              <span>Low</span>
              <span className="w-3 h-3 rounded bg-blue-100" />
              <span className="w-3 h-3 rounded bg-blue-300" />
              <span className="w-3 h-3 rounded bg-blue-600" />
              <span className="w-3 h-3 rounded bg-amber-500" />
              <span>Critical</span>
            </div>
          </div>

          {/* Heatmap Grid */}
          <div className="space-y-2 pt-2">
            <div className="grid grid-cols-5 gap-2 text-center text-[10px] font-bold text-slate-400 uppercase">
              <span>Day</span>
              <span>Morning (8-12)</span>
              <span>Lunch (12-16)</span>
              <span>Dinner (16-21)</span>
              <span>Late (21-02)</span>
            </div>

            {heatmapData.map((row, idx) => (
              <div key={idx} className="grid grid-cols-5 gap-2 items-center text-xs">
                <span className="font-bold text-resq-navy text-center">{row.day}</span>
                {row.slots.map((val, sIdx) => {
                  let bg = "bg-blue-50 text-blue-800";
                  if (val > 80) bg = "bg-amber-400 text-amber-950 font-black";
                  else if (val > 60) bg = "bg-blue-600 text-white font-bold";
                  else if (val > 30) bg = "bg-blue-300 text-blue-900";
                  return (
                    <div
                      key={sIdx}
                      className={`h-9 rounded-xl flex items-center justify-center font-bold text-[11px] transition-all hover:scale-105 cursor-pointer shadow-sm ${bg}`}
                      title={`${row.day} Slot: ${val}% congestion`}
                    >
                      {val}%
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Click-to-Drill-Down High-Impact Rescues Table */}
      <div className="bg-white rounded-3xl border border-resq-border p-6 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-resq-border pb-3">
          <div>
            <h3 className="text-base font-black text-resq-navy">
              Audited High-Impact Rescues
            </h3>
            <p className="text-xs text-slate-500">
              Click any rescue entry to view chain-of-custody telemetry, thermal proof, and shelter verification.
            </p>
          </div>
          <Link
            href="/donor"
            className="text-xs font-bold text-resq-blue hover:underline flex items-center gap-1"
          >
            <span>View Live Donor Board</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
                <th className="py-3 px-4">Rescue ID</th>
                <th className="py-3 px-4">Surplus Item</th>
                <th className="py-3 px-4">Donor Org</th>
                <th className="py-3 px-4">Recipient Shelter</th>
                <th className="py-3 px-4">Quantity</th>
                <th className="py-3 px-4">Meals Fed</th>
                <th className="py-3 px-4">Driver</th>
                <th className="py-3 px-4">Efficiency</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentHighImpactRescues.map((rescue) => (
                <tr
                  key={rescue.id}
                  onClick={() => setDrilldownRescue(rescue)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4 font-mono font-bold text-resq-navy">
                    {rescue.id}
                  </td>
                  <td className="py-3 px-4 font-bold text-resq-navy">
                    {rescue.food}
                  </td>
                  <td className="py-3 px-4 text-slate-600">{rescue.donor}</td>
                  <td className="py-3 px-4 text-slate-600">{rescue.recipient}</td>
                  <td className="py-3 px-4 font-black text-resq-navy">{rescue.kg} KG</td>
                  <td className="py-3 px-4 font-black text-emerald-700">{rescue.meals}</td>
                  <td className="py-3 px-4 text-slate-600">{rescue.driver}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      {rescue.efficiency}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="text-resq-blue font-bold hover:underline flex items-center gap-1 ml-auto">
                      <Eye className="w-3.5 h-3.5" />
                      Drilldown
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drilldown Modal */}
      {drilldownRescue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-resq-navy-dark/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl border border-resq-border p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-resq-border pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                  Telemetry Verification
                </span>
                <h3 className="text-base font-black text-resq-navy">
                  Rescue {drilldownRescue.id} Audit File
                </h3>
              </div>
              <button
                onClick={() => setDrilldownRescue(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">
                  Item Delivered
                </span>
                <p className="text-sm font-black text-resq-navy">{drilldownRescue.food}</p>
                <p className="text-xs text-slate-500">
                  {drilldownRescue.kg} KG ≈ {drilldownRescue.meals} Hot Portions
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">
                    Donor Hub
                  </span>
                  <p className="font-bold text-resq-navy mt-0.5">{drilldownRescue.donor}</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">
                    Shelter Recipient
                  </span>
                  <p className="font-bold text-resq-navy mt-0.5">{drilldownRescue.recipient}</p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Dual Digital QR Handoff Verified</span>
                </div>
                <p className="text-[11px] text-emerald-800">
                  Food safety temperature of 68°C verified at pickup and dropoff. Carbon offset of {(drilldownRescue.kg * 2.5).toFixed(1)} KG CO2e recorded in public ESG ledger.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setDrilldownRescue(null)}
                className="px-5 py-2.5 rounded-2xl bg-resq-navy text-white text-xs font-bold hover:bg-resq-navy-dark transition-colors"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
