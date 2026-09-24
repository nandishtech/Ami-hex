"use client";

import React, { useState, useEffect } from "react";
import {
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  Navigation,
  Crosshair,
  Sparkles,
  Phone,
  ShieldCheck,
  Flame,
} from "lucide-react";
import RescueNetworkMap from "@/components/maps/RescueNetworkMap";
import { MapMarker, MapRoute, generateRouteWaypoints } from "@/lib/maps";
import { RescueStatus } from "@/lib/types";

interface LiveTrackingViewProps {
  rescueId?: string;
  initialStatus?: RescueStatus;
  donorName?: string;
  donorAddress?: string;
  donorCoords?: [number, number];
  recipientName?: string;
  recipientAddress?: string;
  recipientCoords?: [number, number];
  driverName?: string;
  driverPhone?: string;
  foodName?: string;
  quantityKg?: number;
}

export default function LiveTrackingView({
  rescueId = "RF-10283",
  initialStatus = "IN_TRANSIT",
  donorName = "GreenFork Restaurant",
  donorAddress = "100 Feet Road, Indiranagar",
  donorCoords = [12.9784, 77.6408],
  recipientName = "Hope Community Shelter",
  recipientAddress = "Old Airport Road, Kodihalli",
  recipientCoords = [12.9612, 77.6534],
  driverName = "Rahul Sharma",
  driverPhone = "+91 98765 43210",
  foodName = "30 KG Paneer Butter Masala, Jeera Rice & Naan",
  quantityKg = 30,
}: LiveTrackingViewProps) {
  const [status, setStatus] = useState<RescueStatus>(initialStatus);
  const [followDriver, setFollowDriver] = useState(true);
  const [etaMins, setEtaMins] = useState(12);

  // Pre-generate smooth waypoints along the route
  const waypoints = generateRouteWaypoints(
    donorCoords[0],
    donorCoords[1],
    recipientCoords[0],
    recipientCoords[1],
    30
  );

  const [waypointIndex, setWaypointIndex] = useState(12); // Start midway in transit

  // Simulate smooth real-time driver movement
  useEffect(() => {
    if (status !== "IN_TRANSIT") return;

    const interval = setInterval(() => {
      setWaypointIndex((idx) => {
        if (idx < waypoints.length - 1) {
          const next = idx + 1;
          const remaining = Math.max(1, Math.round(18 * (1 - next / waypoints.length)));
          setEtaMins(remaining);
          return next;
        } else {
          setStatus("ARRIVED_DESTINATION");
          return idx;
        }
      });
    }, 2800);

    return () => clearInterval(interval);
  }, [status, waypoints.length]);

  const currentDriverPos = {
    lat: waypoints[waypointIndex][0],
    lng: waypoints[waypointIndex][1],
  };

  const markers: MapMarker[] = [
    {
      id: "donor",
      type: "DONOR",
      latitude: donorCoords[0],
      longitude: donorCoords[1],
      title: donorName,
      subtitle: `${foodName} (${quantityKg} KG)`,
    },
    {
      id: "recipient",
      type: "RECIPIENT",
      latitude: recipientCoords[0],
      longitude: recipientCoords[1],
      title: recipientName,
      subtitle: recipientAddress,
    },
    {
      id: "driver",
      type: "DRIVER",
      latitude: currentDriverPos.lat,
      longitude: currentDriverPos.lng,
      title: `${driverName} (Live GPS)`,
      subtitle: `${etaMins} mins ETA to Shelter`,
    },
  ];

  const routes: MapRoute[] = [
    {
      id: `route-${rescueId}`,
      rescueId,
      color: "#1769FF",
      waypoints,
      startLat: donorCoords[0],
      startLng: donorCoords[1],
      endLat: recipientCoords[0],
      endLng: recipientCoords[1],
      distanceKm: 3.8,
      estimatedMins: 18,
    },
  ];

  // Lifecycle steps
  const steps = [
    { key: "POSTED", label: "Donation Created" },
    { key: "MATCHED", label: "AI Matched" },
    { key: "DRIVER_ACCEPTED", label: "Driver Dispatched" },
    { key: "PICKED_UP", label: "Picked Up" },
    { key: "IN_TRANSIT", label: "In Transit" },
    { key: "DELIVERED", label: "Delivered" },
  ];

  const getStepStatus = (stepKey: string) => {
    const order = ["POSTED", "MATCHED", "DRIVER_ACCEPTED", "PICKED_UP", "IN_TRANSIT", "DELIVERED"];
    const currentIndex = order.indexOf(status === "ARRIVED_DESTINATION" ? "IN_TRANSIT" : status);
    const stepIndex = order.indexOf(stepKey);

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";
    return "upcoming";
  };

  return (
    <div className="bg-white rounded-3xl border border-resq-border p-6 shadow-card space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-resq-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-resq-blue-light text-resq-blue font-bold text-xs">
              {rescueId}
            </span>
            <span className="w-2 h-2 rounded-full bg-resq-blue animate-ping" />
            <span className="text-xs font-bold text-resq-navy uppercase tracking-wider">
              {status.replace(/_/g, " ")}
            </span>
          </div>
          <h3 className="text-base font-bold text-resq-navy mt-1">
            {foodName}
          </h3>
        </div>

        {/* Telemetry Pill */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-resq-border text-xs">
            <span className="text-slate-400 block text-[10px]">Estimated Arrival</span>
            <span className="font-black text-resq-blue text-sm">{etaMins} Minutes</span>
          </div>
          <button
            onClick={() => setFollowDriver(!followDriver)}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
              followDriver
                ? "bg-resq-blue text-white shadow-sm"
                : "border border-resq-border text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
            {followDriver ? "Following Driver" : "Follow Driver"}
          </button>
        </div>
      </div>

      {/* Interactive Live Map View */}
      <RescueNetworkMap
        markers={markers}
        routes={routes}
        driverPosition={currentDriverPos}
        heightClass="h-[420px]"
      />

      {/* Driver & Logistics Detail Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Driver Card */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-resq-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-200 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120"
                alt={driverName}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-xs font-bold text-resq-navy">{driverName}</p>
              <p className="text-[11px] text-slate-400">EV Fleet Dispatch • Verified Volunteer</p>
            </div>
          </div>

          <a
            href={`tel:${driverPhone}`}
            className="p-2 rounded-xl bg-white border border-resq-border text-resq-blue hover:bg-resq-blue-light transition-colors text-xs font-bold flex items-center gap-1"
          >
            <Phone className="w-3.5 h-3.5" />
            Call
          </a>
        </div>

        {/* Route Telemetry */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-resq-border flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">
              Destination
            </span>
            <p className="font-bold text-resq-navy">{recipientName}</p>
            <p className="text-[11px] text-slate-500">{recipientAddress}</p>
          </div>
          <div className="text-right">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">
              Transit Progress
            </span>
            <span className="font-black text-resq-green text-sm">
              {Math.round((waypointIndex / (waypoints.length - 1)) * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Operational Lifecycle Timeline */}
      <div className="pt-2">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
          Rescue Operational Timeline
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
          {steps.map((st) => {
            const stepState = getStepStatus(st.key);
            return (
              <div
                key={st.key}
                className={`p-2.5 rounded-xl border transition-all ${
                  stepState === "completed"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : stepState === "current"
                    ? "bg-blue-50 border-blue-300 text-resq-blue ring-2 ring-resq-blue/20 font-bold"
                    : "bg-slate-50 border-slate-200 text-slate-400 opacity-60"
                }`}
              >
                <div className="w-2 h-2 rounded-full mx-auto mb-1.5 bg-current" />
                <span className="text-[11px] leading-tight block">{st.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
