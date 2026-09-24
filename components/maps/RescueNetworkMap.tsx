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
} from "lucide-react";
import { MapMarker, MapRoute, getMarkerColor } from "@/lib/maps";

interface RescueNetworkMapProps {
  markers?: MapMarker[];
  routes?: MapRoute[];
  activeRescueId?: string;
  followDriverId?: string;
  driverPosition?: { lat: number; lng: number };
  onMarkerClick?: (marker: MapMarker) => void;
  heightClass?: string;
}

export default function RescueNetworkMap({
  markers = [],
  routes = [],
  activeRescueId,
  followDriverId,
  driverPosition,
  onMarkerClick,
  heightClass = "h-[500px]",
}: RescueNetworkMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [filter, setFilter] = useState<"ALL" | "DONOR" | "RECIPIENT" | "DRIVER" | "CRITICAL">("ALL");
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Map geographic center (Bengaluru urban region: ~12.9716, 77.5946)
  const CENTER_LAT = 12.9716;
  const CENTER_LNG = 77.635;
  const SCALE = 24000; // Base projection multiplier

  // Coordinate projection helper
  const project = (lat: number, lng: number, width: number, height: number) => {
    const x = width / 2 + (lng - CENTER_LNG) * SCALE * zoom + pan.x;
    const y = height / 2 - (lat - CENTER_LAT) * SCALE * zoom + pan.y;
    return { x, y };
  };

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

    // Subtle city grid lines
    ctx.strokeStyle = "#E2E8F0";
    ctx.lineWidth = 1;
    const gridSize = 40 * zoom;
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

    // 2. Draw Routes
    routes.forEach((route) => {
      if (route.waypoints && route.waypoints.length > 1) {
        ctx.beginPath();
        const start = project(route.waypoints[0][0], route.waypoints[0][1], width, height);
        ctx.moveTo(start.x, start.y);

        for (let i = 1; i < route.waypoints.length; i++) {
          const pt = project(route.waypoints[i][0], route.waypoints[i][1], width, height);
          ctx.lineTo(pt.x, pt.y);
        }

        // Active route glowing stroke
        ctx.strokeStyle = route.color || "#1769FF";
        ctx.lineWidth = 4 * Math.min(2, zoom);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.setLineDash([8, 4]);
        ctx.stroke();
        ctx.setLineDash([]); // Reset
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
      if (x < -20 || x > width + 20 || y < -20 || y > height + 20) return;

      const isSelected = selectedMarker?.id === m.id;
      const isCritical = m.type === "CRITICAL";

      // Pulsing outer ripple for critical / active
      if (isCritical || isSelected) {
        ctx.beginPath();
        ctx.arc(x, y, 18, 0, Math.PI * 2);
        ctx.fillStyle = isCritical ? "rgba(239, 68, 68, 0.25)" : "rgba(23, 105, 255, 0.25)";
        ctx.fill();
      }

      // Marker pin body
      ctx.beginPath();
      ctx.arc(x, y, isSelected ? 12 : 9, 0, Math.PI * 2);
      ctx.fillStyle = getMarkerColor(m.type);
      ctx.fill();
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Mini text label above marker
      if (zoom >= 1) {
        ctx.font = "bold 11px Inter, sans-serif";
        ctx.fillStyle = "#071A2F";
        ctx.textAlign = "center";
        ctx.fillText(m.title, x, y - 14);
      }
    });

    // 4. Live Driver Position
    if (driverPosition) {
      const drv = project(driverPosition.lat, driverPosition.lng, width, height);
      ctx.beginPath();
      ctx.arc(drv.x, drv.y, 14, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(23, 105, 255, 0.3)";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(drv.x, drv.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = "#1769FF";
      ctx.fill();
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }, [markers, routes, filter, zoom, pan, selectedMarker, driverPosition]);

  // Handle Mouse / Touch Dragging
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
      if (dist < 18) found = m;
    });

    setSelectedMarker(found);
    if (found && onMarkerClick) onMarkerClick(found);
  };

  return (
    <div className={`relative w-full ${heightClass} rounded-2xl overflow-hidden border border-resq-border bg-slate-50 shadow-sm`}>
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
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-1.5 bg-white/90 backdrop-blur p-1.5 rounded-xl border border-resq-border shadow-sm">
        <button
          onClick={() => setFilter("ALL")}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
            filter === "ALL" ? "bg-resq-navy text-white" : "text-resq-secondary hover:text-resq-text"
          }`}
        >
          All Layers
        </button>
        <button
          onClick={() => setFilter("DONOR")}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
            filter === "DONOR" ? "bg-resq-blue text-white" : "text-resq-secondary hover:text-resq-text"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-resq-blue" />
          Donors
        </button>
        <button
          onClick={() => setFilter("RECIPIENT")}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
            filter === "RECIPIENT" ? "bg-resq-green text-white" : "text-resq-secondary hover:text-resq-text"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-resq-green" />
          Shelters
        </button>
        <button
          onClick={() => setFilter("DRIVER")}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
            filter === "DRIVER" ? "bg-slate-800 text-white" : "text-resq-secondary hover:text-resq-text"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-slate-800" />
          Drivers
        </button>
        <button
          onClick={() => setFilter("CRITICAL")}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
            filter === "CRITICAL" ? "bg-resq-red text-white" : "text-resq-secondary hover:text-resq-text"
          }`}
        >
          <Flame className="w-3 h-3 text-resq-red" />
          Critical
        </button>
      </div>

      {/* Map Zoom & Recenter Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-1 bg-white/90 backdrop-blur p-1 rounded-xl border border-resq-border shadow-sm">
        <button
          onClick={() => setZoom((z) => Math.min(3, z * 1.25))}
          className="p-2 text-slate-600 hover:text-resq-navy hover:bg-slate-100 rounded-lg transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(0.6, z * 0.8))}
          className="p-2 text-slate-600 hover:text-resq-navy hover:bg-slate-100 rounded-lg transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            setZoom(1);
            setPan({ x: 0, y: 0 });
          }}
          className="p-2 text-slate-600 hover:text-resq-navy hover:bg-slate-100 rounded-lg transition-colors"
          title="Recenter Map"
        >
          <Crosshair className="w-4 h-4" />
        </button>
      </div>

      {/* Selected Marker Detail Card / Drawer */}
      {selectedMarker && (
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-80 z-20 bg-white rounded-2xl p-4 shadow-floating border border-resq-border animate-in fade-in slide-in-from-bottom-2">
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
              className="text-slate-400 hover:text-slate-600 text-xs"
            >
              ✕
            </button>
          </div>
          <h4 className="text-sm font-bold text-resq-navy mt-1">
            {selectedMarker.title}
          </h4>
          <p className="text-xs text-resq-secondary mt-0.5">
            {selectedMarker.subtitle}
          </p>
          {selectedMarker.status && (
            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Status:</span>
              <span className="font-semibold text-resq-navy">
                {selectedMarker.status}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
