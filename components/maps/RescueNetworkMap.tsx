"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Truck,
  HeartHandshake,
  Utensils,
  Layers,
  Crosshair,
  ZoomIn,
  ZoomOut,
  Info,
  ExternalLink,
  Flame,
  Clock,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { MapMarker, MapRoute, getMarkerColor } from "@/lib/maps";

export interface ActiveRescueCardData {
  id: string;
  foodName: string;
  quantityKg: number;
  status: string;
  etaMinutes: number | string;
  donorName: string;
  recipientName: string;
  driverName: string;
}

interface RescueNetworkMapProps {
  markers?: MapMarker[];
  routes?: MapRoute[];
  activeRescueId?: string;
  activeRescueData?: ActiveRescueCardData;
  followDriverId?: string;
  driverPosition?: { lat: number; lng: number };
  onMarkerClick?: (marker: MapMarker) => void;
  heightClass?: string;
  centerLat?: number;
  centerLng?: number;
  zoomLevel?: number;
  interactive?: boolean;
}

export default function RescueNetworkMap({
  markers = [],
  routes = [],
  activeRescueId,
  activeRescueData,
  followDriverId,
  driverPosition,
  onMarkerClick,
  heightClass = "h-[500px]",
  centerLat,
  centerLng,
  zoomLevel,
  interactive = true,
}: RescueNetworkMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [filter, setFilter] = useState<"ALL" | "DONOR" | "RECIPIENT" | "DRIVER" | "CRITICAL">("ALL");
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [animDashOffset, setAnimDashOffset] = useState(0);

  // Map geographic center (Bengaluru urban region: ~12.9716, 77.6350)
  const CENTER_LAT = 12.9716;
  const CENTER_LNG = 77.635;
  const SCALE = 25000;

  // Coordinate projection helper
  const project = (lat: number, lng: number, width: number, height: number) => {
    const x = width / 2 + (lng - CENTER_LNG) * SCALE * zoom + pan.x;
    const y = height / 2 - (lat - CENTER_LAT) * SCALE * zoom + pan.y;
    return { x, y };
  };

  // Dash animation for active routes
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimDashOffset((prev) => (prev - 1.5) % 32);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle high DPI
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // 1. Draw Map Background & Grid
    ctx.fillStyle = "#F8FAFC";
    ctx.fillRect(0, 0, width, height);

    // Subtle modern city grid lines
    ctx.strokeStyle = "#E8EDF5";
    ctx.lineWidth = 1;
    const gridSize = 44 * zoom;
    for (let x = (pan.x % gridSize); x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = (pan.y % gridSize); y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // 2. Draw Routes with Animated Pulse
    routes.forEach((route) => {
      if (route.waypoints && route.waypoints.length > 1) {
        // Outer glow
        ctx.beginPath();
        const start = project(route.waypoints[0][0], route.waypoints[0][1], width, height);
        ctx.moveTo(start.x, start.y);
        for (let i = 1; i < route.waypoints.length; i++) {
          const pt = project(route.waypoints[i][0], route.waypoints[i][1], width, height);
          ctx.lineTo(pt.x, pt.y);
        }
        ctx.strokeStyle = "rgba(23, 105, 255, 0.18)";
        ctx.lineWidth = 10 * Math.min(2, zoom);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();

        // Main animated dashed route
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        for (let i = 1; i < route.waypoints.length; i++) {
          const pt = project(route.waypoints[i][0], route.waypoints[i][1], width, height);
          ctx.lineTo(pt.x, pt.y);
        }
        ctx.strokeStyle = route.color || "#1769FF";
        ctx.lineWidth = 4 * Math.min(2, zoom);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.setLineDash([10, 6]);
        ctx.lineDashOffset = animDashOffset;
        ctx.stroke();
        ctx.setLineDash([]);
      }
    });

    // 3. Draw Markers
    const filteredMarkers = markers.filter((m) => {
      if (filter === "ALL") return true;
      return m.type === filter;
    });

    filteredMarkers.forEach((m) => {
      const { x, y } = project(m.latitude, m.longitude, width, height);

      // Skip off-screen markers
      if (x < -30 || x > width + 30 || y < -30 || y > height + 30) return;

      const isSelected = selectedMarker?.id === m.id;
      const isCritical = m.type === "CRITICAL";

      // Pulsing outer ripple for critical / active
      if (isCritical || isSelected) {
        ctx.beginPath();
        ctx.arc(x, y, 22, 0, Math.PI * 2);
        ctx.fillStyle = isCritical ? "rgba(239, 68, 68, 0.22)" : "rgba(23, 105, 255, 0.22)";
        ctx.fill();
      }

      // Marker pin body
      ctx.beginPath();
      ctx.arc(x, y, isSelected ? 13 : 9.5, 0, Math.PI * 2);
      ctx.fillStyle = getMarkerColor(m.type);
      ctx.fill();
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Mini text label above marker
      if (zoom >= 0.9) {
        ctx.font = "bold 11px Inter, sans-serif";
        ctx.fillStyle = "#071A2F";
        ctx.textAlign = "center";
        ctx.fillText(m.title, x, y - 15);
      }
    });

    // 4. Live Driver Position
    if (driverPosition) {
      const drv = project(driverPosition.lat, driverPosition.lng, width, height);
      ctx.beginPath();
      ctx.arc(drv.x, drv.y, 16, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(23, 105, 255, 0.25)";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(drv.x, drv.y, 9, 0, Math.PI * 2);
      ctx.fillStyle = "#1769FF";
      ctx.fill();
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Pulsing beacon center
      ctx.beginPath();
      ctx.arc(drv.x, drv.y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();
    }
  }, [markers, routes, filter, zoom, pan, selectedMarker, driverPosition, animDashOffset]);

  // Handle Mouse Dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Click marker selection
  const handleCanvasClick = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    let found: MapMarker | null = null;
    markers.forEach((m) => {
      const { x, y } = project(m.latitude, m.longitude, rect.width, rect.height);
      const dist = Math.hypot(x - clickX, y - clickY);
      if (dist < 20) found = m;
    });

    setSelectedMarker(found);
    if (found && onMarkerClick) onMarkerClick(found);
  };

  return (
    <div className={`relative w-full ${heightClass} rounded-3xl overflow-hidden border border-resq-border bg-slate-50 shadow-card`}>
      {/* Interactive Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing block"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleCanvasClick}
      />

      {/* Layer Filter Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-1.5 bg-white/95 backdrop-blur p-1.5 rounded-2xl border border-resq-border shadow-xs">
        <button
          onClick={() => setFilter("ALL")}
          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
            filter === "ALL" ? "bg-resq-navy text-white shadow-xs" : "text-slate-600 hover:text-resq-navy"
          }`}
        >
          All Layers
        </button>
        <button
          onClick={() => setFilter("DONOR")}
          className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            filter === "DONOR" ? "bg-resq-blue text-white shadow-xs" : "text-slate-600 hover:text-resq-navy"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-resq-blue" />
          Donors
        </button>
        <button
          onClick={() => setFilter("RECIPIENT")}
          className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            filter === "RECIPIENT" ? "bg-resq-green text-white shadow-xs" : "text-slate-600 hover:text-resq-navy"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-resq-green" />
          Shelters
        </button>
        <button
          onClick={() => setFilter("DRIVER")}
          className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            filter === "DRIVER" ? "bg-slate-800 text-white shadow-xs" : "text-slate-600 hover:text-resq-navy"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-slate-800" />
          Drivers
        </button>
        <button
          onClick={() => setFilter("CRITICAL")}
          className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            filter === "CRITICAL" ? "bg-resq-red text-white shadow-xs" : "text-slate-600 hover:text-resq-navy"
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-resq-red" />
          Critical
        </button>
      </div>

      {/* Map Zoom & Recenter Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5 bg-white/95 backdrop-blur p-1 rounded-2xl border border-resq-border shadow-xs">
        <button
          onClick={() => setZoom((z) => Math.min(3.2, z * 1.25))}
          className="p-2 text-slate-600 hover:text-resq-navy hover:bg-slate-100 rounded-xl transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(0.6, z * 0.8))}
          className="p-2 text-slate-600 hover:text-resq-navy hover:bg-slate-100 rounded-xl transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            setZoom(1);
            setPan({ x: 0, y: 0 });
          }}
          className="p-2 text-slate-600 hover:text-resq-navy hover:bg-slate-100 rounded-xl transition-colors"
          title="Recenter Map"
        >
          <Crosshair className="w-4 h-4" />
        </button>
      </div>

      {/* Floating Active Rescue Telemetry Card on Map (as requested by spec!) */}
      {activeRescueData && (
        <div className="absolute top-16 left-4 z-10 hidden sm:flex items-center gap-3 p-3 rounded-2xl bg-white/95 backdrop-blur shadow-floating border border-resq-border max-w-sm animate-in fade-in slide-in-from-top-2">
          <div className="w-10 h-10 rounded-xl bg-resq-blue-light text-resq-blue flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5 animate-pulse" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-resq-blue">{activeRescueData.id}</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                {activeRescueData.status}
              </span>
            </div>
            <p className="text-xs font-bold text-resq-navy truncate mt-0.5">{activeRescueData.foodName}</p>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
              <span>{activeRescueData.quantityKg} KG</span>
              <span>•</span>
              <span className="font-bold text-resq-blue">ETA {activeRescueData.etaMinutes}m</span>
              <span>•</span>
              <span className="truncate">{activeRescueData.driverName}</span>
            </div>
          </div>
        </div>
      )}

      {/* Selected Marker Detail Card / Drawer */}
      {selectedMarker && (
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-84 z-20 bg-white rounded-3xl p-5 shadow-floating border border-resq-border animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: getMarkerColor(selectedMarker.type) }}
              />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {selectedMarker.type}
              </span>
            </div>
            <button
              onClick={() => setSelectedMarker(null)}
              className="text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ✕
            </button>
          </div>
          <h4 className="text-sm font-black text-resq-navy mt-1.5 leading-snug">
            {selectedMarker.title}
          </h4>
          <p className="text-xs text-resq-secondary mt-0.5 leading-relaxed">
            {selectedMarker.subtitle}
          </p>
          {selectedMarker.status && (
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Logistical Status:</span>
              <span className="font-bold text-resq-navy">
                {selectedMarker.status}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
