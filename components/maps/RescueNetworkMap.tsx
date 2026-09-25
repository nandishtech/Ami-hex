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
  Sun,
  Moon,
  Compass,
  Maximize2,
  Navigation,
  ShieldCheck,
  Phone,
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

// Default vibrant Bengaluru operational nodes if none supplied
const DEFAULT_MARKERS: MapMarker[] = [
  {
    id: "m-donor-greenfork",
    type: "DONOR",
    latitude: 12.9784,
    longitude: 77.6408,
    title: "GreenFork Banquets & Kitchen",
    subtitle: "30 KG Hot Meals • Ready for EV Pickup",
  },
  {
    id: "m-recipient-hope",
    type: "RECIPIENT",
    latitude: 12.9662,
    longitude: 77.6534,
    title: "Hope Community Shelter & Kitchen",
    subtitle: "Receiving Dock 2 • Needs 40 KG",
  },
  {
    id: "m-driver-rahul",
    type: "DRIVER",
    latitude: 12.9718,
    longitude: 77.6449,
    title: "Rahul Sharma (EV Nexon)",
    subtitle: "Speed: 34 km/h • Temp: 68°C • ETA 12m",
  },
  {
    id: "m-recipient-ananda",
    type: "RECIPIENT",
    latitude: 12.9823,
    longitude: 77.6211,
    title: "Ananda Relief Kitchen",
    subtitle: "Intake Capacity: 150 KG Open",
  },
  {
    id: "m-donor-techpark",
    type: "CRITICAL",
    latitude: 12.9352,
    longitude: 77.6845,
    title: "Bellandur Tech Cafeteria",
    subtitle: "🚨 CRITICAL: 55 KG Biryani • 38m Window",
  },
  {
    id: "m-driver-farooq",
    type: "DRIVER",
    latitude: 12.9412,
    longitude: 77.671,
    title: "Farooq Ahmed (Refrigerated Van)",
    subtitle: "Speed: 28 km/h • Standby Bellandur",
  },
];

// Key arterial road network coordinates across Bengaluru
const BENGALURU_ROADS = [
  // Old Airport Road Corridor (Indiranagar to Kodihalli to HAL)
  [
    [12.9784, 77.6408],
    [12.9745, 77.6425],
    [12.9718, 77.6449],
    [12.9685, 77.6492],
    [12.9662, 77.6534],
    [12.962, 77.661],
  ],
  // 100 Feet Road Corridor (Indiranagar to Koramangala Link)
  [
    [12.985, 77.6408],
    [12.9784, 77.6408],
    [12.971, 77.6405],
    [12.963, 77.6395],
    [12.955, 77.636],
  ],
  // Inner Ring Road / Koramangala
  [
    [12.963, 77.6395],
    [12.955, 77.631],
    [12.948, 77.625],
    [12.935, 77.62],
  ],
  // Outer Ring Road to Bellandur Corridor
  [
    [12.9685, 77.6492],
    [12.958, 77.668],
    [12.945, 77.678],
    [12.9352, 77.6845],
  ],
];

export default function RescueNetworkMap({
  markers: propMarkers,
  routes = [],
  activeRescueId,
  activeRescueData,
  followDriverId,
  driverPosition,
  onMarkerClick,
  heightClass = "h-[500px]",
  centerLat = 12.9716,
  centerLng = 77.645,
  zoomLevel = 1,
  interactive = true,
}: RescueNetworkMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const markers = propMarkers && propMarkers.length > 0 ? propMarkers : DEFAULT_MARKERS;

  const [filter, setFilter] = useState<"ALL" | "DONOR" | "RECIPIENT" | "DRIVER" | "CRITICAL">("ALL");
  const [theme, setTheme] = useState<"DARK" | "LIGHT">("DARK");
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const initialZoom = zoomLevel > 4 ? 1.2 : (zoomLevel || 1);
  const [zoom, setZoom] = useState(initialZoom);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [animProgress, setAnimProgress] = useState(0);

  // Geographic center constants
  const SCALE = 24000;

  // Coordinate projection helper
  const project = (lat: number, lng: number, width: number, height: number) => {
    const x = width / 2 + (lng - centerLng) * SCALE * zoom + pan.x;
    const y = height / 2 - (lat - centerLat) * SCALE * zoom + pan.y;
    return { x, y };
  };

  // Continuous animation ticker for vehicle motion & radar sweep
  useEffect(() => {
    let animId: number;
    const update = () => {
      setAnimProgress((prev) => (prev + 0.006) % 1);
      animId = requestAnimationFrame(update);
    };
    animId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Main Canvas Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    const isDark = theme === "DARK";

    // 1. Draw Map Background
    if (isDark) {
      // Tactical Dark Blueprint Cartography
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, "#071626");
      grad.addColorStop(0.5, "#0A1D33");
      grad.addColorStop(1, "#061320");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Radial city density glow around center
      const centerPt = project(centerLat, centerLng, width, height);
      const radGlow = ctx.createRadialGradient(
        centerPt.x,
        centerPt.y,
        10,
        centerPt.x,
        centerPt.y,
        width * 0.7
      );
      radGlow.addColorStop(0, "rgba(23, 105, 255, 0.12)");
      radGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = radGlow;
      ctx.fillRect(0, 0, width, height);

      // High-tech subtle grid
      ctx.strokeStyle = "rgba(255, 255, 255, 0.035)";
      ctx.lineWidth = 1;
      const gridSize = 48 * zoom;
      for (let x = pan.x % gridSize; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = pan.y % gridSize; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    } else {
      // Clean SaaS Day Cartography
      ctx.fillStyle = "#F8FAFC";
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = "#E2E8F0";
      ctx.lineWidth = 1;
      const gridSize = 48 * zoom;
      for (let x = pan.x % gridSize; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = pan.y % gridSize; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }

    // 2. Draw Arterial Road Corridors
    BENGALURU_ROADS.forEach((road) => {
      ctx.beginPath();
      const p0 = project(road[0][0], road[0][1], width, height);
      ctx.moveTo(p0.x, p0.y);
      for (let i = 1; i < road.length; i++) {
        const pt = project(road[i][0], road[i][1], width, height);
        ctx.lineTo(pt.x, pt.y);
      }
      // Outer arterial boundary
      ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(100, 116, 139, 0.14)";
      ctx.lineWidth = 9 * zoom;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();

      // Road centerline
      ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(255, 255, 255, 0.85)";
      ctx.lineWidth = 5 * zoom;
      ctx.stroke();
    });

    // 3. Draw Active Rescue Routes (Only active when food has actually been picked up by a rider and is IN_TRANSIT)
    const isInTransit = !activeRescueData || activeRescueData.status === "IN_TRANSIT";

    if (isInTransit) {
      const activeRouteCoords = [
        [12.9784, 77.6408], // GreenFork Pickup
        [12.9745, 77.6425],
        [12.9718, 77.6449], // Driver Rahul
        [12.9685, 77.6492],
        [12.9662, 77.6534], // Hope Shelter Dropoff
      ];

      // Glow trace
      ctx.beginPath();
      const rStart = project(activeRouteCoords[0][0], activeRouteCoords[0][1], width, height);
      ctx.moveTo(rStart.x, rStart.y);
      for (let i = 1; i < activeRouteCoords.length; i++) {
        const pt = project(activeRouteCoords[i][0], activeRouteCoords[i][1], width, height);
        ctx.lineTo(pt.x, pt.y);
      }
      ctx.strokeStyle = "rgba(23, 105, 255, 0.28)";
      ctx.lineWidth = 10 * zoom;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();

      // Animated dashed pulse route
      ctx.beginPath();
      ctx.moveTo(rStart.x, rStart.y);
      for (let i = 1; i < activeRouteCoords.length; i++) {
        const pt = project(activeRouteCoords[i][0], activeRouteCoords[i][1], width, height);
        ctx.lineTo(pt.x, pt.y);
      }
      ctx.strokeStyle = "#1769FF";
      ctx.lineWidth = 4 * zoom;
      ctx.setLineDash([12, 8]);
      ctx.lineDashOffset = -animProgress * 120;
      ctx.stroke();
      ctx.setLineDash([]);

      // Moving Vehicle Animation on Active Route
      const totalSegments = activeRouteCoords.length - 1;
      const currentProgress = animProgress * totalSegments;
      const segIndex = Math.min(Math.floor(currentProgress), totalSegments - 1);
      const segT = currentProgress - segIndex;
      const pA = activeRouteCoords[segIndex];
      const pB = activeRouteCoords[segIndex + 1];
      const movingLat = pA[0] + (pB[0] - pA[0]) * segT;
      const movingLng = pA[1] + (pB[1] - pA[1]) * segT;
      const movingPt = project(movingLat, movingLng, width, height);

      // Glowing motion ring around vehicle
      ctx.beginPath();
      ctx.arc(movingPt.x, movingPt.y, 14 * zoom, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(16, 185, 129, 0.25)";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(movingPt.x, movingPt.y, 6.5 * zoom, 0, Math.PI * 2);
      ctx.fillStyle = "#10B981";
      ctx.fill();
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // 4. Draw Markers
    const filteredMarkers = markers.filter((m) => {
      if (filter === "ALL") return true;
      if (filter === "CRITICAL") return m.type === "CRITICAL";
      return m.type === filter;
    });

    filteredMarkers.forEach((m) => {
      const { x, y } = project(m.latitude, m.longitude, width, height);

      // Skip off-screen markers
      if (x < -60 || x > width + 60 || y < -60 || y > height + 60) return;

      const isSelected = selectedMarker?.id === m.id;
      const isCritical = m.type === "CRITICAL";

      // Pulsing outer ripple for critical / active
      if (isCritical || isSelected) {
        ctx.beginPath();
        const pulseSize = 22 + Math.sin(animProgress * Math.PI * 4) * 5;
        ctx.arc(x, y, pulseSize, 0, Math.PI * 2);
        ctx.fillStyle = isCritical ? "rgba(239, 68, 68, 0.28)" : "rgba(23, 105, 255, 0.28)";
        ctx.fill();
      }

      // Marker Shadow
      ctx.beginPath();
      ctx.arc(x, y + 2, isSelected ? 14 : 11, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
      ctx.fill();

      // Marker Pin Body
      ctx.beginPath();
      ctx.arc(x, y, isSelected ? 13 : 10, 0, Math.PI * 2);
      ctx.fillStyle = getMarkerColor(m.type);
      ctx.fill();
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Inner Icon Glyph / Core
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();

      // Text Label Pill Above Pin
      if (zoom >= 0.8) {
        ctx.font = "bold 10px Inter, system-ui, sans-serif";
        const labelText = m.title.length > 22 ? m.title.substring(0, 20) + "…" : m.title;
        const textWidth = ctx.measureText(labelText).width;

        // Label pill background
        const boxX = x - textWidth / 2 - 6;
        const boxY = y - 30;
        ctx.fillStyle = isDark ? "rgba(10, 29, 50, 0.92)" : "rgba(255, 255, 255, 0.95)";
        ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.15)" : "#CBD5E1";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(boxX, boxY, textWidth + 12, 18, 6);
        ctx.fill();
        ctx.stroke();

        // Label text
        ctx.fillStyle = isDark ? "#FFFFFF" : "#0F172A";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(labelText, x, boxY + 9);
      }
    });

    // 5. Radar scan line overlay for tactical dark theme
    if (isDark) {
      const centerPt = project(centerLat, centerLng, width, height);
      const sweepAngle = animProgress * Math.PI * 2;
      const sweepRadius = 180 * zoom;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(centerPt.x, centerPt.y);
      ctx.arc(centerPt.x, centerPt.y, sweepRadius, sweepAngle - 0.25, sweepAngle);
      ctx.closePath();
      const sweepGrad = ctx.createRadialGradient(
        centerPt.x,
        centerPt.y,
        0,
        centerPt.x,
        centerPt.y,
        sweepRadius
      );
      sweepGrad.addColorStop(0, "rgba(23, 105, 255, 0.0)");
      sweepGrad.addColorStop(1, "rgba(23, 105, 255, 0.12)");
      ctx.fillStyle = sweepGrad;
      ctx.fill();
      ctx.restore();
    }
  }, [
    markers,
    routes,
    filter,
    theme,
    zoom,
    pan,
    selectedMarker,
    driverPosition,
    animProgress,
    centerLat,
    centerLng,
  ]);

  // Mouse Dragging for Pan
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

  // Wheel Zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.15 : 0.88;
    setZoom((z) => Math.min(4, Math.max(0.5, z * factor)));
  };

  // Marker click detection
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
      if (dist < 22) found = m;
    });

    setSelectedMarker(found);
    if (found && onMarkerClick) onMarkerClick(found);
  };

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      className={`relative w-full ${heightClass} rounded-3xl overflow-hidden border border-slate-700/60 shadow-2xl select-none`}
      style={{ backgroundColor: theme === "DARK" ? "#071626" : "#F8FAFC" }}
    >
      {/* Interactive WebGL/Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing block"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleCanvasClick}
      />

      {/* Top Left: Filter Chips with Dynamic Counts */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700/70 shadow-lg">
        <button
          type="button"
          onClick={() => setFilter("ALL")}
          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
            filter === "ALL"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-300 hover:text-white"
          }`}
        >
          All Nodes ({markers.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter("DONOR")}
          className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            filter === "DONOR"
              ? "bg-blue-500 text-white shadow-sm"
              : "text-slate-300 hover:text-white"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-blue-400" />
          Donors
        </button>
        <button
          type="button"
          onClick={() => setFilter("DRIVER")}
          className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            filter === "DRIVER"
              ? "bg-emerald-600 text-white shadow-sm"
              : "text-slate-300 hover:text-white"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          EV Drivers
        </button>
        <button
          type="button"
          onClick={() => setFilter("RECIPIENT")}
          className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            filter === "RECIPIENT"
              ? "bg-purple-600 text-white shadow-sm"
              : "text-slate-300 hover:text-white"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-purple-400" />
          Shelters
        </button>
        <button
          type="button"
          onClick={() => setFilter("CRITICAL")}
          className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            filter === "CRITICAL"
              ? "bg-red-600 text-white shadow-sm"
              : "text-red-400 hover:text-red-300"
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-red-400" />
          Critical
        </button>
      </div>

      {/* Top Right: Theme Switcher & Zoom Controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setTheme(theme === "DARK" ? "LIGHT" : "DARK")}
          className="p-2 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700/70 text-slate-300 hover:text-white transition-colors shadow-lg"
          title={`Switch to ${theme === "DARK" ? "Light" : "Tactical Dark"} Map`}
        >
          {theme === "DARK" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-400" />}
        </button>

        <div className="flex flex-col gap-1 bg-slate-900/90 backdrop-blur-md p-1 rounded-2xl border border-slate-700/70 shadow-lg">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(4, z * 1.25))}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.5, z * 0.8))}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setZoom(1);
              setPan({ x: 0, y: 0 });
            }}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            title="Reset Center"
          >
            <Crosshair className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Left: Live Telemetry Status HUD */}
      <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-full bg-slate-900/85 backdrop-blur-md border border-slate-700/60 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-bold text-white">Bengaluru Live Radar</span>
        </div>
        <span>•</span>
        <span>Corridor: Old Airport Rd</span>
        <span>•</span>
        <span className="font-mono text-blue-400 text-[11px]">12.9716° N, 77.6450° E</span>
      </div>

      {/* Floating Active Rescue Telemetry Card on Map */}
      {activeRescueData && (
        <div className="absolute top-16 left-4 z-10 hidden sm:flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/95 backdrop-blur-md shadow-2xl border border-blue-500/30 max-w-sm animate-in fade-in slide-in-from-top-2 text-white">
          <div className="w-10 h-10 rounded-xl bg-blue-600/30 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/40">
            <Truck className="w-5 h-5 animate-pulse" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-xs text-blue-400">{activeRescueData.id}</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {activeRescueData.status}
              </span>
            </div>
            <p className="text-xs font-bold text-white truncate mt-0.5">{activeRescueData.foodName}</p>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
              <span>{activeRescueData.quantityKg} KG</span>
              <span>•</span>
              <span className="font-bold text-emerald-400">ETA {activeRescueData.etaMinutes}m</span>
              <span>•</span>
              <span className="truncate">{activeRescueData.driverName}</span>
            </div>
          </div>
        </div>
      )}

      {/* Selected Marker Detail Card / Drawer */}
      {selectedMarker && (
        <div className="absolute bottom-4 right-4 left-4 sm:left-auto sm:w-80 z-20 bg-slate-900/95 backdrop-blur-md rounded-3xl p-5 shadow-2xl border border-slate-700 text-white animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white"
                style={{ backgroundColor: getMarkerColor(selectedMarker.type) }}
              >
                {selectedMarker.type === "DONOR" && <Utensils className="w-4 h-4" />}
                {selectedMarker.type === "DRIVER" && <Truck className="w-4 h-4" />}
                {selectedMarker.type === "RECIPIENT" && <HeartHandshake className="w-4 h-4" />}
                {selectedMarker.type === "CRITICAL" && <Flame className="w-4 h-4" />}
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                {selectedMarker.type}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedMarker(null)}
              className="text-slate-400 hover:text-white p-1 text-xs"
            >
              ✕
            </button>
          </div>

          <h4 className="text-sm font-black text-white">{selectedMarker.title}</h4>
          <p className="text-xs text-slate-300 mt-1">{selectedMarker.subtitle}</p>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="font-mono text-[11px] text-slate-400">
              {selectedMarker.latitude.toFixed(4)}, {selectedMarker.longitude.toFixed(4)}
            </span>
            <span className="font-bold text-blue-400 flex items-center gap-1">
              <span>Inspect Hub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
