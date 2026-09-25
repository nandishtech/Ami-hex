"use client";

import React, { useState } from "react";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Truck,
  Sparkles,
  Info,
  CheckCheck,
} from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";

export default function NotificationsPage() {
  const [filter, setFilter] = useState("ALL");
  const [notifications, setNotifications] = useState([
    {
      id: "n1",
      title: "Driver Rahul Sharma accepted RF-10283",
      message: "Driver is 1.2 KM away and en route for pickup at GreenFork Restaurant.",
      type: "RESCUE",
      time: "2 mins ago",
      read: false,
    },
    {
      id: "n2",
      title: "Critical rescue window: 42 minutes remaining",
      message: "Silicon Tech Hub cafeteria donation RF-10104 needs immediate driver dispatch.",
      type: "CRITICAL",
      time: "10 mins ago",
      read: false,
    },
    {
      id: "n3",
      title: "Delivery Confirmed: +120 meals to Hope Shelter",
      message: "Sister Teresa Mathews confirmed receipt of 30 KG Paneer Butter Masala.",
      type: "IMPACT",
      time: "25 mins ago",
      read: true,
    },
    {
      id: "n4",
      title: "Intake Capacity Recalculated for St. Jude Food Bank",
      message: "Capacity updated to 350 KG. 4 compatible surplus donations matched.",
      type: "SYSTEM",
      time: "1 hour ago",
      read: true,
    },
    {
      id: "n5",
      title: "Rescue Delivery Completed: RF-10203",
      message: "45 KG continental breakfast buffet successfully routed to St. Jude Mercy Food Bank.",
      type: "IMPACT",
      time: "6 hours ago",
      read: true,
    },
  ]);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const filtered = notifications.filter((n) => {
    if (filter === "ALL") return true;
    return n.type === filter;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-resq-border">
        <div>
          <h1 className="text-2xl font-black text-resq-navy">
            Operations & Real-Time Alerts
          </h1>
          <p className="text-xs text-resq-secondary mt-0.5">
            Logistical alerts, critical rescue countdowns, and handoff verification receipts
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="px-4 py-2 rounded-xl bg-white border border-resq-border hover:bg-slate-50 text-xs font-bold text-resq-navy flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <CheckCheck className="w-4 h-4 text-resq-blue" />
          Mark All Read
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs font-bold">
        {["ALL", "CRITICAL", "RESCUE", "IMPACT", "SYSTEM"].map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3 py-1.5 rounded-xl transition-colors whitespace-nowrap ${
              filter === t
                ? "bg-resq-navy text-white"
                : "bg-white border border-resq-border text-slate-600 hover:bg-slate-50"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
              item.read
                ? "bg-white border-resq-border"
                : "bg-resq-blue-light/20 border-resq-blue/40 shadow-sm"
            }`}
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                item.type === "CRITICAL"
                  ? "bg-red-100 text-red-600"
                  : item.type === "IMPACT"
                  ? "bg-emerald-100 text-emerald-600"
                  : item.type === "RESCUE"
                  ? "bg-resq-blue-light text-resq-blue"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {item.type === "CRITICAL" && <Flame className="w-5 h-5" />}
              {item.type === "IMPACT" && <Sparkles className="w-5 h-5" />}
              {item.type === "RESCUE" && <Truck className="w-5 h-5" />}
              {item.type === "SYSTEM" && <Info className="w-5 h-5" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-resq-navy">{item.title}</h4>
                <span className="text-[11px] text-slate-400 shrink-0">{item.time}</span>
              </div>
              <p className="text-xs text-resq-secondary mt-1 leading-relaxed">
                {item.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
