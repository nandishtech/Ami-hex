// ============================================================
// RESQFOOD Impact Calculation & ESG Reporting Engine
// Methodology: EPA WARM v15 Food Rescue Factors
// ============================================================

export interface ImpactSummary {
  totalFoodRescuedKg: number;
  totalMealsSupported: number;
  totalCo2eAvoidedKg: number;
  totalWaterSavedLitres: number;
  totalRescuesCompleted: number;
  organizationsSupportedCount: number;
  methodology: string;
  disclaimer: string;
}

export const IMPACT_METHODOLOGY_VERSION = "EPA_WARM_v15_FOOD_RESCUE";

export const IMPACT_DISCLAIMER =
  "Environmental metrics are estimates modeled using standard EPA WARM v15 and ReFED lifecycle emissions factors (2.5 kg CO2e / kg edible food; 520 L water / kg food). Not intended as legally certified carbon credits.";

/**
 * Calculates environmental and community impact for a rescue
 */
export function calculateRescueImpact(foodWeightKg: number) {
  const estimatedMeals = Math.round(foodWeightKg * 4);
  const estimatedCo2e = +(foodWeightKg * 2.5).toFixed(1);
  const waterSavedLitres = Math.round(foodWeightKg * 520);

  return {
    foodWeightKg,
    estimatedMeals,
    estimatedCo2eKg: estimatedCo2e,
    waterSavedLitres,
    methodologyVersion: IMPACT_METHODOLOGY_VERSION,
  };
}

export interface RescueReceiptData {
  rescueId: string;
  foodName: string;
  quantityKg: number;
  estimatedMeals: number;
  donorName: string;
  donorAddress: string;
  recipientName: string;
  recipientAddress: string;
  driverName: string;
  pickupTime: string;
  deliveryTime: string;
  estimatedCo2eSavedKg: number;
  waterSavedLitres: number;
  verificationHash: string;
}

export function generateRescueReceipt(
  rescueId: string,
  foodName: string,
  quantityKg: number,
  donorName: string,
  donorAddress: string,
  recipientName: string,
  recipientAddress: string,
  driverName: string,
  pickupTime: string,
  deliveryTime: string
): RescueReceiptData {
  const impact = calculateRescueImpact(quantityKg);
  return {
    rescueId,
    foodName,
    quantityKg,
    estimatedMeals: impact.estimatedMeals,
    donorName,
    donorAddress,
    recipientName,
    recipientAddress,
    driverName,
    pickupTime,
    deliveryTime,
    estimatedCo2eSavedKg: impact.estimatedCo2eKg,
    waterSavedLitres: impact.waterSavedLitres,
    verificationHash: `RESQ-TX-${rescueId.replace(/[^a-zA-Z0-9]/g, "")}-${Date.now().toString(36).toUpperCase()}`,
  };
}
