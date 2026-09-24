"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Globe,
  MapPin,
  Truck,
  HeartHandshake,
  Utensils,
  Layers,
  Sparkles,
  Flame,
  ArrowRight,
} from "lucide-react";
import RescueNetworkMap from "@/components/maps/RescueNetworkMap";
import { MapMarker, MapRoute } from "@/lib/maps";

export default function NetworkEcosystemPage() {
  const [selectedNode, setSelectedNode] = useState<MapMarker | null>(null);

  // Network nodes across Bengaluru
  const networkMarkers: MapMarker[] = [
    {
      id: "donor-1",
      type: "DONOR",
      latitude: 12.9784,
      longitude: 77.6408,
      title: "GreenFork Restaurant",
      subtitle: "Indiranagar 100 Ft Rd • 30 KG Surplus Ready",
      status: "Active Rescue RF-10283",
    },
    {
      id: "donor-2",
      type: "DONOR",
      latitude: 12.9742,
      longitude: 77.6085,
      title: "Grand Palace Hotel & Banquets",
      subtitle: "MG Road • 5-Star Luxury Banquet Hub",
      status: "Completed RF-10203",
    },
    {
      id: "donor-3",
      type: "DONOR",
      latitude: 12.9345,
      longitude: 77.6256,
      title: "Organic Earth Supermarket",
      subtitle: "Koramangala 4th Block • Fresh Produce",
      status: "Completed RF-10198",
    },
    {
      id: "donor-4",
      type: "DONOR",
      latitude: 12.9299,
      longitude: 77.6833,
      title: "Silicon Tech Hub Cafeteria",
      subtitle: "Outer Ring Road • 55 KG Biryani Ready",
      status: "CRITICAL WINDOW (<38m)",
    },
    {
      id: "shelter-1",
      type: "RECIPIENT",
      latitude: 12.9612,
      longitude: 77.6534,
      title: "Hope Community Shelter",
      subtitle: "Old Airport Road • 180 KG Capacity",
      status: "Incoming RF-10283",
    },
    {
      id: "shelter-2",
      type: "RECIPIENT",
      latitude: 12.9678,
      longitude: 77.6189,
      title: "St. Jude Mercy Food Bank",
      subtitle: "Victoria Road • 350 KG Capacity",
      status: "Intake Active",
    },
    {
      id: "shelter-3",
      type: "RECIPIENT",
      latitude: 12.9823,
      longitude: 77.6211,
      title: "Ananda Community Kitchen",
      subtitle: "Ulsoor Lake Road • 250 KG Capacity",
      status: "Open Intake",
    },
    {
      id: "driver-1",
      type: "DRIVER",
      latitude: 12.9701,
      longitude: 77.6432,
      title: "Rahul Sharma (EV Car)",
      subtitle: "En Route on Old Airport Road",
      status: "Carrying RF-10283",
    },
    {
      id: "driver-2",
      type: "DRIVER",
      latitude: 12.9645,
      longitude: 77.6412,
      title: "Priya Nair (Van 250 KG)",
      subtitle: "Domlur Flyover Corridor",
      status: "Available",
    },
    {
      id: "driver-3",
      type: "DRIVER",
      latitude: 12.9812,
      longitude: 77.6256,
      title: "Amit Patel (EV Car 70 KG)",
      subtitle: "MG Road Commercial Corridor",
      status: "Available",
    },
    {
      id: "crit-1",
      type: "CRITICAL",
      latitude: 12.9299,
      longitude: 77.6833,
      title: "CRITICAL SURPLUS CORRIDOR",
      subtitle: "Bellandur Tech Zone • Needs Dispatch",
      status: "Expires in 38m",
    },
  ];

  const networkRoutes: MapRoute[] = [
    {
      id: "route-demo",
      rescueId: "RF-10283",
      color: "#1769FF",
      waypoints: [
        [12.9784, 77.6408],
        [12.9752, 77.6415],
        [12.9701, 77.6432],
        [12.9664, 77.6481],
        [12.9612, 77.6534],
      ],
      startLat: 12.9784,
      startLng: 77.6408,
      endLat: 12.9612,
      endLng: 77.6534,
      distanceKm: 3.8,
      estimatedMins: 18,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Network Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-resq-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-resq-blue-light text-resq-blue">
              <Globe className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Metropolitan Logistics Map
            </span>
          </div>
          <h1 className="text-2xl font-black text-resq-navy mt-1">
            Living Rescue Ecosystem Network
          </h1>
          <p className="text-xs text-resq-secondary">
            Click, drag, and zoom through verified donors, recipient kitchens, active EV drivers, and critical corridors.
          </p>
        </div>

        {/* Legend Summary */}
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-resq-blue" />
            <span>Donors (Blue)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-resq-green" />
            <span>Shelters (Green)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-800" />
            <span>Drivers</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-resq-red" />
            <span>Critical</span>
          </div>
        </div>
      </div>

      {/* Main Full-Screen Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-9">
          <RescueNetworkMap
            markers={networkMarkers}
            routes={networkRoutes}
            heightClass="h-[600px]"
            onMarkerClick={(m) => setSelectedNode(m)}
          />
        </div>

        {/* Right Contextual Inspection Drawer */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-3xl border border-resq-border p-5 shadow-card space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Node Inspector
            </span>

            {selectedNode ? (
              <div className="space-y-3 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor:
                        selectedNode.type === "DONOR"
                          ? "#1769FF"
                          : selectedNode.type === "RECIPIENT"
                          ? "#18A66A"
                          : selectedNode.type === "CRITICAL"
                          ? "#EF4444"
                          : "#071A2F",
                    }}
                  />
                  <span className="text-xs font-bold uppercase text-slate-500">
                    {selectedNode.type}
                  </span>
                </div>

                <h3 className="text-sm font-black text-resq-navy">
                  {selectedNode.title}
                </h3>
                <p className="text-xs text-resq-secondary leading-relaxed">
                  {selectedNode.subtitle}
                </p>

                {selectedNode.status && (
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <span className="text-slate-400 text-[10px] block">Telemetry Status</span>
                    <span className="font-bold text-resq-navy">
                      {selectedNode.status}
                    </span>
                  </div>
                )}

                <Link
                  href="/matching"
                  className="w-full py-2.5 rounded-xl bg-resq-blue hover:bg-resq-blue-hover text-white text-xs font-bold text-center block transition-colors shadow-sm"
                >
                  Initiate AI Match →
                </Link>
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-slate-400 space-y-1">
                <MapPin className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="font-bold text-slate-600">No node selected</p>
                <p className="text-[11px]">Click any pin on the map to inspect details.</p>
              </div>
            )}
          </div>

          {/* Quick Metrics */}
          <div className="bg-slate-50 rounded-3xl border border-resq-border p-4 text-xs space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Total Network Nodes</span>
              <span className="font-black text-resq-navy">18 Organizations</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Active EV Fleets</span>
              <span className="font-black text-resq-blue">12 Drivers</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Zero-Waste Corridor</span>
              <span className="font-black text-resq-green">East Bengaluru Hub</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
