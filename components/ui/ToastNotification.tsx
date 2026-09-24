"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Truck, CheckCircle2, AlertTriangle, X, Sparkles } from "lucide-react";
import { realtime, RealtimeMessage } from "@/lib/realtime";

interface ToastItem {
  id: string;
  title: string;
  description: string;
  type: string;
  actionUrl?: string;
  actionLabel?: string;
}

export default function ToastNotification() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const unsub = realtime.subscribe("*", (msg: RealtimeMessage) => {
      let title = "Network Event";
      let description = "Food rescue network updated";
      let actionUrl: string | undefined = undefined;
      let actionLabel = "View";

      switch (msg.type) {
        case "DONATION_CREATED":
          title = "New Donation Posted";
          description = `${msg.payload?.foodName || "Surplus food"} (${msg.payload?.quantity || 30} KG) ready for matching.`;
          actionUrl = "/matching";
          actionLabel = "Match Now";
          break;
        case "DRIVER_ACCEPTED":
          title = "Driver Accepted Rescue";
          description = `Driver ${msg.payload?.driverName || "Rahul"} accepted rescue ${msg.payload?.rescueId || "RF-10283"}.`;
          actionUrl = `/rescues/${msg.payload?.rescueId || "RF-10283"}`;
          actionLabel = "Live GPS";
          break;
        case "PICKUP_CONFIRMED":
          title = "Pickup Verified";
          description = `Cargo QR scanned & verified hot. Driver in transit.`;
          actionUrl = `/rescues/${msg.payload?.rescueId || "RF-10283"}`;
          actionLabel = "Track Route";
          break;
        case "DELIVERY_COMPLETED":
          title = "Rescue Delivered!";
          description = `Delivery verified at recipient shelter. Impact recorded!`;
          actionUrl = "/impact";
          actionLabel = "See Impact";
          break;
        case "CAPACITY_UPDATED":
          title = "Capacity Recalculated";
          description = `Recipient capacity updated: MATCHING OPPORTUNITIES UPDATED!`;
          actionUrl = "/matching";
          actionLabel = "View Matches";
          break;
        default:
          title = msg.type.replace(/_/g, " ");
          description = "Operational telemetry broadcast.";
      }

      const newToast: ToastItem = {
        id: `toast-${Date.now()}-${Math.random()}`,
        title,
        description,
        type: msg.type,
        actionUrl,
        actionLabel,
      };

      setToasts((prev) => [newToast, ...prev.slice(0, 2)]);

      // Auto dismiss after 6 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 6000);
    });

    return () => {
      unsub();
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-white rounded-2xl shadow-floating border border-resq-border p-3.5 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          <div className="w-8 h-8 rounded-xl bg-resq-blue-light text-resq-blue flex items-center justify-center shrink-0 mt-0.5">
            {toast.type === "DELIVERY_COMPLETED" ? (
              <CheckCircle2 className="w-4 h-4 text-resq-green" />
            ) : toast.type === "DONATION_CREATED" ? (
              <Sparkles className="w-4 h-4 text-resq-blue" />
            ) : (
              <Truck className="w-4 h-4 text-resq-blue" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-resq-navy">{toast.title}</h4>
            <p className="text-[11px] text-resq-secondary leading-snug mt-0.5">
              {toast.description}
            </p>
            {toast.actionUrl && (
              <Link
                href={toast.actionUrl}
                className="inline-block mt-2 text-xs font-bold text-resq-blue hover:underline"
              >
                {toast.actionLabel} →
              </Link>
            )}
          </div>
          <button
            onClick={() =>
              setToasts((prev) => prev.filter((t) => t.id !== toast.id))
            }
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
