// ============================================================
// RESQFOOD Map & Routing Abstraction
// ============================================================

import { Coordinates } from "@/lib/types";

export interface MapMarker {
  id: string;
  type: "DONOR" | "RECIPIENT" | "DRIVER" | "CRITICAL";
  latitude: number;
  longitude: number;
  title: string;
  subtitle?: string;
  status?: string;
  color?: string;
  metadata?: any;
}

export interface MapRoute {
  id: string;
  rescueId: string;
  color: string;
  waypoints: [number, number][]; // [lat, lng]
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  distanceKm: number;
  estimatedMins: number;
}

/**
 * Generate interpolated realistic route waypoints between start and end
 */
export function generateRouteWaypoints(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
  steps: number = 24
): [number, number][] {
  const points: [number, number][] = [];

  // Slight curvature/realistic street jitter
  const midLat = (startLat + endLat) / 2;
  const midLng = (startLng + endLng) / 2;
  const jitterLat = (endLng - startLng) * 0.12;
  const jitterLng = -(endLat - startLat) * 0.12;

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // Quadratic bezier curve simulation
    const lat =
      (1 - t) * (1 - t) * startLat +
      2 * (1 - t) * t * (midLat + jitterLat) +
      t * t * endLat;
    const lng =
      (1 - t) * (1 - t) * startLng +
      2 * (1 - t) * t * (midLng + jitterLng) +
      t * t * endLng;

    points.push([+lat.toFixed(6), +lng.toFixed(6)]);
  }

  return points;
}

/**
 * Get color code for marker type
 */
export function getMarkerColor(type: MapMarker["type"]): string {
  switch (type) {
    case "DONOR":
      return "#1769FF"; // Blue
    case "RECIPIENT":
      return "#18A66A"; // Green
    case "DRIVER":
      return "#071A2F"; // Navy with white/blue
    case "CRITICAL":
      return "#EF4444"; // Red
    default:
      return "#1769FF";
  }
}
