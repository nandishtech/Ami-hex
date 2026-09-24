"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  Filter,
  Search,
  ArrowRight,
  Flame,
  Sparkles,
} from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";

export default function RescuesListPage() {
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const rescues = [
    {
      id: "RF-10283",
      foodName: "30 KG Paneer Butter Masala, Jeera Rice & Garlic Naan",
      donorName: "GreenFork Restaurant (Indiranagar)",
      recipientName: "Hope Community Shelter",
      driverName: "Rahul Sharma (EV Car)",
      status: "IN_TRANSIT",
      score: 96,
      distanceKm: 3.8,
      etaMins: 12,
      createdAt: "45 mins ago",
    },
    {
      id: "RF-10204",
      foodName: "55 KG Vegetable Biryani & Dal Makhani",
      donor: "Silicon Tech Hub Cafeteria",
      recipientName: "Ananda Community Kitchen",
      driverName: "Driver Farooq",
      status: "DRIVER_ACCEPTED",
      score: 92,
      distanceKm: 5.4,
      etaMins: 22,
      createdAt: "20 mins ago",
    },
    {
      id: "RF-10203",
      foodName: "45 KG Continental Breakfast Buffet (Croissants & Quiche)",
      donorName: "Grand Palace Hotel & Banquets",
      recipientName: "St. Jude Mercy Food Bank",
      driverName: "Priya Nair",
      status: "DELIVERED",
      score: 94,
      distanceKm: 4.2,
      etaMins: "Delivered",
      createdAt: "6 hours ago",
    },
    {
      id: "RF-10198",
      foodName: "65 KG Fresh Organic Produce Crates",
      donorName: "Organic Earth Supermarket",
      recipientName: "St. Jude Mercy Food Bank",
      driverName: "Suresh Kumar",
      status: "DELIVERED",
      score: 91,
      distanceKm: 6.1,
      etaMins: "Delivered",
      createdAt: "14 hours ago",
    },
  ];

  const filtered = rescues.filter((r) => {
    if (filter !== "ALL" && r.status !== filter) return false;
    if (
      search &&
      !r.id.toLowerCase().includes(search.toLowerCase()) &&
      !r.foodName.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-resq-border">
        <div>
          <h1 className="text-2xl font-black text-resq-navy">
            Rescue Operations & Telemetry
          </h1>
          <p className="text-xs text-resq-secondary mt-0.5">
            Active and completed food rescue dispatches across Bengaluru
          </p>
        </div>

        <Link
          href="/demo"
          className="px-4 py-2.5 rounded-xl bg-resq-blue text-white font-bold text-xs shadow-sm hover:bg-resq-blue-hover transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Test Interactive Flow
        </Link>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-resq-border shadow-sm">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by rescue ID or food..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-resq-border text-xs text-resq-text focus:outline-none focus:border-resq-blue"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto">
          {["ALL", "IN_TRANSIT", "DRIVER_ACCEPTED", "DELIVERED"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                filter === s
                  ? "bg-resq-navy text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {s.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Rescues Table / Cards */}
      <div className="space-y-3">
        {filtered.map((rescue) => (
          <div
            key={rescue.id}
            className="p-5 rounded-2xl bg-white border border-resq-border shadow-sm hover:border-resq-blue/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs px-2 py-0.5 rounded-md bg-resq-blue-light text-resq-blue">
                  {rescue.id}
                </span>
                <StatusBadge status={rescue.status} />
                <span className="text-xs font-bold text-slate-500">
                  Rescue Score: {rescue.score}/100
                </span>
              </div>
              <h3 className="text-sm font-bold text-resq-navy">{rescue.foodName}</h3>
              <div className="flex flex-wrap items-center gap-4 text-xs text-resq-secondary">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-resq-blue" />
                  <span>{rescue.donorName || "GreenFork Restaurant"}</span>
                </div>
                <span>→</span>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-resq-green" />
                  <span>{rescue.recipientName}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                  <Truck className="w-3.5 h-3.5" />
                  <span>{rescue.driverName}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 shrink-0 justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
              <div className="text-right">
                <span className="text-xs font-bold text-resq-blue block">
                  {typeof rescue.etaMins === "number" ? `${rescue.etaMins} mins ETA` : rescue.etaMins}
                </span>
                <span className="text-[11px] text-slate-400">{rescue.createdAt}</span>
              </div>
              <Link
                href={`/rescues/${rescue.id}`}
                className="px-4 py-2 rounded-xl bg-slate-50 hover:bg-resq-blue hover:text-white text-xs font-bold text-resq-navy transition-colors flex items-center gap-1 border border-resq-border"
              >
                Track Live
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
