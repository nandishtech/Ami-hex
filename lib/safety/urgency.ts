// ============================================================
// RESQFOOD Food Safety & Operational Urgency Engine
// ============================================================

import { StorageCondition, UrgencyLevel } from "@/lib/types";

export interface UrgencyStatus {
  urgencyLevel: UrgencyLevel;
  remainingMinutes: number;
  remainingFormatted: string;
  isExpired: boolean;
  canDispatch: boolean;
  badgeColor: "red" | "orange" | "blue" | "green";
  statusText: string;
}

export interface StorageSafetyGuidelines {
  storageCondition: StorageCondition;
  maxRecommendedSafeHours: number;
  targetTempCelsius: string;
  packagingRequirements: string;
  warningNotice?: string;
}

export const FOOD_SAFETY_DISCLAIMER =
  "Operational safety guidance only. RESQFOOD does not certify statutory food safety. Food donors and recipients must comply with applicable municipal and public health food-handling regulations.";

export const STORAGE_GUIDELINES: Record<StorageCondition, StorageSafetyGuidelines> = {
  HOT_HELD: {
    storageCondition: "HOT_HELD",
    maxRecommendedSafeHours: 4,
    targetTempCelsius: "≥ 60°C (140°F)",
    packagingRequirements: "Food-grade insulated thermal transport boxes.",
    warningNotice: "Must be consumed or refrigerated within the 4-hour operational holding window.",
  },
  REFRIGERATED: {
    storageCondition: "REFRIGERATED",
    maxRecommendedSafeHours: 24,
    targetTempCelsius: "1°C - 4°C (34°F - 40°F)",
    packagingRequirements: "Sealed hygienic containers with cold gel ice packs during transit.",
  },
  FROZEN: {
    storageCondition: "FROZEN",
    maxRecommendedSafeHours: 72,
    targetTempCelsius: "≤ -18°C (0°F)",
    packagingRequirements: "Thermal insulated dry ice or sub-zero transport liners.",
  },
  ROOM_TEMP: {
    storageCondition: "ROOM_TEMP",
    maxRecommendedSafeHours: 48,
    targetTempCelsius: "18°C - 24°C (64°F - 75°F)",
    packagingRequirements: "Clean, dry, pest-resistant food crates or bakery boxes.",
  },
};

/**
 * Calculates operational rescue window and assigns operational urgency label
 */
export function calculateOperationalUrgency(
  availableUntil: Date | string
): UrgencyStatus {
  const now = new Date().getTime();
  const expiry = new Date(availableUntil).getTime();
  const diffMs = expiry - now;
  const remainingMinutes = Math.floor(diffMs / (1000 * 60));

  if (remainingMinutes <= 0) {
    return {
      urgencyLevel: "CRITICAL",
      remainingMinutes: 0,
      remainingFormatted: "Expired",
      isExpired: true,
      canDispatch: false,
      badgeColor: "red",
      statusText: "Rescue Window Closed",
    };
  }

  const hours = Math.floor(remainingMinutes / 60);
  const mins = remainingMinutes % 60;
  const remainingFormatted = hours > 0 ? `${hours}h ${mins}m` : `${mins} mins`;

  if (remainingMinutes < 60) {
    // Under 1 hour
    return {
      urgencyLevel: "CRITICAL",
      remainingMinutes,
      remainingFormatted,
      isExpired: false,
      canDispatch: true,
      badgeColor: "red",
      statusText: "Critical: Immediate Dispatch Required",
    };
  }

  if (remainingMinutes < 120) {
    // 1-2 hours
    return {
      urgencyLevel: "HIGH",
      remainingMinutes,
      remainingFormatted,
      isExpired: false,
      canDispatch: true,
      badgeColor: "orange",
      statusText: "High Urgency: Priority Matching",
    };
  }

  if (remainingMinutes < 240) {
    // 2-4 hours
    return {
      urgencyLevel: "MEDIUM",
      remainingMinutes,
      remainingFormatted,
      isExpired: false,
      canDispatch: true,
      badgeColor: "blue",
      statusText: "Moderate Window",
    };
  }

  // > 4 hours
  return {
    urgencyLevel: "LOW",
    remainingMinutes,
    remainingFormatted,
    isExpired: false,
    canDispatch: true,
    badgeColor: "green",
    statusText: "Standard Rescue Window",
  };
}
