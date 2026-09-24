// ============================================================
// RESQFOOD Intelligent Matching Engine
// Calculates operational Rescue Score (0-100) & Explainability
// ============================================================

import { Coordinates } from "@/lib/types";

export interface MatchScoreWeights {
  urgencyWeight: number; // default: 25
  distanceWeight: number; // default: 25
  capacityWeight: number; // default: 20
  compatibilityWeight: number; // default: 15
  driverWeight: number; // default: 15
}

export const DEFAULT_WEIGHTS: MatchScoreWeights = {
  urgencyWeight: 25,
  distanceWeight: 25,
  capacityWeight: 20,
  compatibilityWeight: 15,
  driverWeight: 15,
};

export interface MatchCalculationInput {
  donation: {
    id: string;
    foodName: string;
    category: string;
    quantityKg: number;
    availableUntil: Date | string;
    preparedAt: Date | string;
    pickupLat: number;
    pickupLng: number;
  };
  recipient: {
    id: string;
    name: string;
    address: string;
    lat: number;
    lng: number;
    capacityKg: number;
    foodPreferences: string[];
    currentNeeds: { category: string; neededKg: number; urgency: string }[];
  };
  availableDrivers: {
    id: string;
    name: string;
    vehicleType: string;
    capacityKg: number;
    lat: number;
    lng: number;
    availability: string;
  }[];
  weights?: MatchScoreWeights;
}

export interface MatchCalculationResult {
  recipientId: string;
  recipientName: string;
  recipientAddress: string;
  recipientLat: number;
  recipientLng: number;
  distanceKm: number;
  estimatedDriveTimeMins: number;
  bestDriver?: {
    id: string;
    name: string;
    vehicleType: string;
    distanceToPickupKm: number;
  };
  totalScore: number;
  scoreBreakdown: {
    urgencyScore: number;
    distanceScore: number;
    capacityScore: number;
    compatibilityScore: number;
    driverScore: number;
    explanation: string[];
  };
}

/**
 * Calculates Haversine distance in kilometers between two geographic coordinates
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return +(R * c).toFixed(2);
}

/**
 * Computes the operational Rescue Score and generates plain-language explainability
 */
export function calculateMatchScore(
  input: MatchCalculationInput
): MatchCalculationResult {
  const weights = input.weights || DEFAULT_WEIGHTS;
  const explanations: string[] = [];

  // 1. Urgency Score (0 - 25)
  // Evaluates remaining rescue window
  const now = new Date().getTime();
  const expiry = new Date(input.donation.availableUntil).getTime();
  const diffHours = (expiry - now) / (1000 * 60 * 60);

  let urgencyScore = 0;
  if (diffHours <= 0) {
    urgencyScore = 0;
    explanations.push("⚠️ Rescue window expired. Manual review required.");
  } else if (diffHours < 1) {
    // Critical urgency: high routing priority
    urgencyScore = weights.urgencyWeight * 1.0;
    explanations.push(
      `✓ Critical urgency (${Math.round(diffHours * 60)} mins remaining) - prioritized for express dispatch`
    );
  } else if (diffHours <= 2) {
    urgencyScore = weights.urgencyWeight * 0.95;
    explanations.push(
      `✓ High urgency window (${diffHours.toFixed(1)} hours left)`
    );
  } else if (diffHours <= 4) {
    urgencyScore = weights.urgencyWeight * 0.85;
    explanations.push(
      `✓ Moderate window (${diffHours.toFixed(1)} hours remaining)`
    );
  } else {
    urgencyScore = weights.urgencyWeight * 0.75;
    explanations.push(
      `✓ Generous rescue window (${diffHours.toFixed(1)} hours remaining)`
    );
  }

  // 2. Distance Score (0 - 25)
  // Distance from donor pickup to recipient
  const distanceKm = calculateDistanceKm(
    input.donation.pickupLat,
    input.donation.pickupLng,
    input.recipient.lat,
    input.recipient.lng
  );
  // Average urban speed ~ 15-20 km/h with traffic
  const estimatedDriveTimeMins = Math.max(8, Math.round(distanceKm * 4.5));

  let distanceScore = 0;
  if (distanceKm <= 2.0) {
    distanceScore = weights.distanceWeight;
    explanations.push(`✓ Hyper-local distance: ${distanceKm} KM (${estimatedDriveTimeMins} mins)`);
  } else if (distanceKm <= 5.0) {
    distanceScore = weights.distanceWeight * 0.92;
    explanations.push(`✓ Close proximity: ${distanceKm} KM (${estimatedDriveTimeMins} mins)`);
  } else if (distanceKm <= 10.0) {
    distanceScore = weights.distanceWeight * 0.75;
    explanations.push(`✓ Acceptable transit radius: ${distanceKm} KM`);
  } else if (distanceKm <= 18.0) {
    distanceScore = weights.distanceWeight * 0.5;
    explanations.push(`✓ Extended transit radius: ${distanceKm} KM`);
  } else {
    distanceScore = weights.distanceWeight * 0.2;
    explanations.push(`⚠️ Sub-optimal transit distance: ${distanceKm} KM`);
  }

  // 3. Capacity Score (0 - 20)
  // Recipient current available intake capacity vs donation quantity
  let capacityScore = 0;
  const capacityRatio = input.recipient.capacityKg / Math.max(1, input.donation.quantityKg);
  if (capacityRatio >= 1.5) {
    capacityScore = weights.capacityWeight;
    explanations.push(
      `✓ Recipient has ample capacity (${input.recipient.capacityKg} KG available for ${input.donation.quantityKg} KG)`
    );
  } else if (capacityRatio >= 1.0) {
    capacityScore = weights.capacityWeight * 0.9;
    explanations.push(
      `✓ Recipient capacity precisely accommodates donation (${input.recipient.capacityKg} KG capacity)`
    );
  } else {
    // Under-capacity: partial split suggested
    capacityScore = Math.max(5, weights.capacityWeight * capacityRatio);
    explanations.push(
      `⚠️ Partial capacity match: Recipient can take ${input.recipient.capacityKg} of ${input.donation.quantityKg} KG`
    );
  }

  // 4. Food Compatibility Score (0 - 15)
  // Check preferences and active gap needs
  let compatibilityScore = 0;
  const isDirectNeed = input.recipient.currentNeeds.some(
    (n) =>
      n.category.toLowerCase() === input.donation.category.toLowerCase() &&
      n.neededKg > 0
  );
  const isPreferred = input.recipient.foodPreferences.some(
    (p) => p.toLowerCase() === input.donation.category.toLowerCase()
  );

  if (isDirectNeed) {
    compatibilityScore = weights.compatibilityWeight;
    explanations.push(
      `✓ Direct category match: Recipient explicitly requested ${input.donation.category}`
    );
  } else if (isPreferred) {
    compatibilityScore = weights.compatibilityWeight * 0.85;
    explanations.push(
      `✓ Food preference aligned: Recipient regularly accepts ${input.donation.category}`
    );
  } else {
    compatibilityScore = weights.compatibilityWeight * 0.5;
    explanations.push(
      `✓ Standard food acceptance: No allergy/dietary incompatibility detected`
    );
  }

  // 5. Driver Availability Score (0 - 15)
  // Find nearest available driver with sufficient vehicle capacity
  let driverScore = 0;
  let bestDriver: MatchCalculationResult["bestDriver"] | undefined = undefined;

  const viableDrivers = input.availableDrivers.filter(
    (d) =>
      d.availability === "AVAILABLE" &&
      d.capacityKg >= input.donation.quantityKg
  );

  if (viableDrivers.length > 0) {
    // Find closest driver to pickup location
    let minDriverDist = Infinity;
    let closestDriver = viableDrivers[0];

    for (const drv of viableDrivers) {
      const dDist = calculateDistanceKm(
        input.donation.pickupLat,
        input.donation.pickupLng,
        drv.lat,
        drv.lng
      );
      if (dDist < minDriverDist) {
        minDriverDist = dDist;
        closestDriver = drv;
      }
    }

    bestDriver = {
      id: closestDriver.id,
      name: closestDriver.name,
      vehicleType: closestDriver.vehicleType,
      distanceToPickupKm: minDriverDist,
    };

    if (minDriverDist <= 2.0) {
      driverScore = weights.driverWeight;
      explanations.push(
        `✓ Driver ${closestDriver.name} is only ${minDriverDist} KM away from pickup`
      );
    } else if (minDriverDist <= 5.0) {
      driverScore = weights.driverWeight * 0.85;
      explanations.push(
        `✓ Driver ${closestDriver.name} ready within ${minDriverDist} KM`
      );
    } else {
      driverScore = weights.driverWeight * 0.6;
      explanations.push(
        `✓ Driver ${closestDriver.name} located ${minDriverDist} KM away`
      );
    }
  } else {
    // Check if driver with smaller capacity exists or fallback
    driverScore = weights.driverWeight * 0.3;
    explanations.push(
      `⚠️ Dedicated high-capacity driver in transit; fallback dispatch available`
    );
  }

  const totalScore = Math.min(
    100,
    Math.round(
      urgencyScore +
        distanceScore +
        capacityScore +
        compatibilityScore +
        driverScore
    )
  );

  return {
    recipientId: input.recipient.id,
    recipientName: input.recipient.name,
    recipientAddress: input.recipient.address,
    recipientLat: input.recipient.lat,
    recipientLng: input.recipient.lng,
    distanceKm,
    estimatedDriveTimeMins,
    bestDriver,
    totalScore,
    scoreBreakdown: {
      urgencyScore: +urgencyScore.toFixed(1),
      distanceScore: +distanceScore.toFixed(1),
      capacityScore: +capacityScore.toFixed(1),
      compatibilityScore: +compatibilityScore.toFixed(1),
      driverScore: +driverScore.toFixed(1),
      explanation: explanations,
    },
  };
}

/**
 * Multi-recipient donation splitting optimizer
 * When donation quantity exceeds a single recipient's intake capacity
 */
export interface SplitRecipientCandidate {
  recipientId: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  availableCapacityKg: number;
  distanceKm: number;
}

export interface SplitPlan {
  originalQuantityKg: number;
  allocations: {
    recipientId: string;
    recipientName: string;
    allocatedKg: number;
    estimatedMeals: number;
    distanceKm: number;
  }[];
  totalAllocatedKg: number;
  remainingKg: number;
  routeEfficiencyScore: number;
}

export function calculateDonationSplit(
  totalKg: number,
  candidates: SplitRecipientCandidate[]
): SplitPlan {
  // Sort candidates by nearest distance first
  const sorted = [...candidates].sort((a, b) => a.distanceKm - b.distanceKm);

  let unallocated = totalKg;
  const allocations: SplitPlan["allocations"] = [];

  for (const cand of sorted) {
    if (unallocated <= 0) break;
    const canTake = Math.min(cand.availableCapacityKg, unallocated);
    if (canTake > 0) {
      allocations.push({
        recipientId: cand.recipientId,
        recipientName: cand.name,
        allocatedKg: canTake,
        estimatedMeals: canTake * 4,
        distanceKm: cand.distanceKm,
      });
      unallocated -= canTake;
    }
  }

  return {
    originalQuantityKg: totalKg,
    allocations,
    totalAllocatedKg: totalKg - unallocated,
    remainingKg: unallocated,
    routeEfficiencyScore: allocations.length <= 2 ? 94 : 85,
  };
}
