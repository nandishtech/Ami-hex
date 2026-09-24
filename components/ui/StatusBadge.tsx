import React from "react";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Flame,
  Truck,
  Sparkles,
  XCircle,
} from "lucide-react";
import { UrgencyLevel, RescueStatus, DonationStatus } from "@/lib/types";

interface StatusBadgeProps {
  status: string;
  type?: "status" | "urgency";
  size?: "sm" | "md" | "lg";
}

export default function StatusBadge({
  status,
  type = "status",
  size = "md",
}: StatusBadgeProps) {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
    lg: "px-3 py-1.5 text-sm gap-2",
  }[size];

  // URGENCY BADGES
  if (type === "urgency" || ["LOW", "MEDIUM", "HIGH", "CRITICAL"].includes(status)) {
    switch (status as UrgencyLevel) {
      case "CRITICAL":
        return (
          <span
            className={`inline-flex items-center font-medium rounded-full bg-red-100 text-red-700 border border-red-200 animate-urgency-glow ${sizeClasses}`}
          >
            <Flame className="w-3.5 h-3.5 text-red-600 animate-bounce" />
            CRITICAL (&lt;1h)
          </span>
        );
      case "HIGH":
        return (
          <span
            className={`inline-flex items-center font-medium rounded-full bg-amber-100 text-amber-800 border border-amber-200 ${sizeClasses}`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            HIGH (1-2h)
          </span>
        );
      case "MEDIUM":
        return (
          <span
            className={`inline-flex items-center font-medium rounded-full bg-blue-100 text-blue-800 border border-blue-200 ${sizeClasses}`}
          >
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            MEDIUM (2-4h)
          </span>
        );
      case "LOW":
      default:
        return (
          <span
            className={`inline-flex items-center font-medium rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 ${sizeClasses}`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            LOW (&gt;4h)
          </span>
        );
    }
  }

  // OPERATIONAL STATUS BADGES
  switch (status as RescueStatus | DonationStatus) {
    case "DELIVERED":
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 ${sizeClasses}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Delivered
        </span>
      );
    case "IN_TRANSIT":
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-blue-100 text-blue-800 border border-blue-200 ${sizeClasses}`}
        >
          <Truck className="w-3.5 h-3.5 text-blue-600" />
          In Transit
        </span>
      );
    case "DRIVER_ACCEPTED":
    case "ASSIGNED":
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200 ${sizeClasses}`}
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          Driver Accepted
        </span>
      );
    case "MATCHED":
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-cyan-100 text-cyan-800 border border-cyan-200 ${sizeClasses}`}
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
          Matched
        </span>
      );
    case "MATCHING":
    case "POSTED":
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-amber-100 text-amber-800 border border-amber-200 ${sizeClasses}`}
        >
          <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
          Matching Active
        </span>
      );
    case "ARRIVED_PICKUP":
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-blue-100 text-blue-800 border border-blue-200 ${sizeClasses}`}
        >
          <Truck className="w-3.5 h-3.5 text-blue-600" />
          Arrived at Pickup
        </span>
      );
    case "CANCELLED":
    case "EXPIRED":
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-gray-100 text-gray-700 border border-gray-200 ${sizeClasses}`}
        >
          <XCircle className="w-3.5 h-3.5 text-gray-500" />
          {status}
        </span>
      );
    default:
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-slate-100 text-slate-800 border border-slate-200 ${sizeClasses}`}
        >
          {status}
        </span>
      );
  }
}
