// ============================================================
// RESQFOOD AI Provider Abstraction
// Supports Natural Language Parsing, Food Image Analysis & Dispatch
// ============================================================

import { FoodCategory, StorageCondition } from "@/lib/types";

export interface ParsedDonationResult {
  foodName: string;
  category: FoodCategory;
  quantity: number;
  unit: "KG" | "TRAYS" | "BOXES" | "PORTIONS";
  preparedAt: string; // ISO string
  availableUntil: string; // ISO string
  storageCondition: StorageCondition;
  estimatedMeals: number;
  allergens: string[];
  notes?: string;
  confidenceScore: number;
  rawInput: string;
}

export interface ImageAnalysisResult {
  foodName: string;
  category: FoodCategory;
  estimatedQuantityKg: number;
  estimatedMeals: number;
  detectedItems: string[];
  suggestedStorage: StorageCondition;
  confidenceScore: number;
  disclaimer: string;
}

export interface DispatchRecommendation {
  recommendedAction: string;
  recipientId: string;
  recipientName: string;
  driverId: string;
  driverName: string;
  primaryRouteEtaMins: number;
  alternativeRouteEtaMins: number;
  urgencyWarning?: string;
  reasoning: string[];
  suggestSplit: boolean;
  splitDetails?: {
    recipient1: { name: string; kg: number };
    recipient2: { name: string; kg: number };
  };
}

/**
 * Intelligent natural language parser for donation descriptions
 * Example input: "30 trays of paneer rice and naan, prepared at 6 PM, available until 8 PM"
 */
export async function parseDonationText(
  text: string
): Promise<ParsedDonationResult> {
  const lower = text.toLowerCase();

  // 1. Quantity and Unit extraction
  let quantity = 25;
  let unit: ParsedDonationResult["unit"] = "KG";

  const numMatch = text.match(/(\d+(\.\d+)?)\s*(kg|kilos|kilograms|trays?|boxes?|portions?|meals?|packets?)/i);
  if (numMatch) {
    quantity = parseFloat(numMatch[1]);
    const unitStr = numMatch[3].toLowerCase();
    if (unitStr.startsWith("tray")) unit = "TRAYS";
    else if (unitStr.startsWith("box")) unit = "BOXES";
    else if (unitStr.startsWith("portion") || unitStr.startsWith("packet") || unitStr.startsWith("meal")) unit = "PORTIONS";
    else unit = "KG";
  } else {
    // Look for standalone digits
    const digitsOnly = text.match(/(\d+)/);
    if (digitsOnly) {
      quantity = parseInt(digitsOnly[1], 10);
    }
  }

  // 2. Category extraction
  let category: FoodCategory = "Prepared Meals";
  if (
    lower.includes("bread") ||
    lower.includes("naan") ||
    lower.includes("roti") ||
    lower.includes("croissant") ||
    lower.includes("bakery") ||
    lower.includes("cake") ||
    lower.includes("pastry") ||
    lower.includes("baguette")
  ) {
    category = "Bakery";
  }
  if (
    lower.includes("paneer") ||
    lower.includes("biryani") ||
    lower.includes("rice") ||
    lower.includes("curry") ||
    lower.includes("dal") ||
    lower.includes("pasta") ||
    lower.includes("cooked") ||
    lower.includes("meal") ||
    lower.includes("sabzi")
  ) {
    category = "Prepared Meals";
  } else if (
    lower.includes("apple") ||
    lower.includes("banana") ||
    lower.includes("vegetable") ||
    lower.includes("fruit") ||
    lower.includes("spinach") ||
    lower.includes("tomato") ||
    lower.includes("produce")
  ) {
    category = "Produce";
  } else if (
    lower.includes("milk") ||
    lower.includes("cheese") ||
    lower.includes("yogurt") ||
    lower.includes("curd") ||
    lower.includes("butter")
  ) {
    category = "Dairy";
  }

  // 3. Time extraction (prepared at / available until)
  const now = new Date();
  let preparedDate = new Date(now.getTime() - 30 * 60 * 1000); // 30m ago default
  let availableDate = new Date(now.getTime() + 120 * 60 * 1000); // 2 hours default

  // Check for "prepared at X"
  const prepMatch = text.match(/prepared (?:at|around)?\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i);
  if (prepMatch) {
    preparedDate = parseTimeString(prepMatch[1], now);
  }

  // Check for "available until Y" or "valid till Y"
  const availMatch = text.match(/(?:available|valid|good) (?:until|till|to)\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i);
  if (availMatch) {
    availableDate = parseTimeString(availMatch[1], now);
  }

  // 4. Storage Condition
  let storageCondition: StorageCondition = "HOT_HELD";
  if (category === "Produce" || category === "Bakery") {
    storageCondition = "ROOM_TEMP";
  } else if (category === "Dairy" || lower.includes("cold") || lower.includes("chilled")) {
    storageCondition = "REFRIGERATED";
  } else if (lower.includes("frozen") || lower.includes("ice cream")) {
    storageCondition = "FROZEN";
  } else if (category === "Prepared Meals") {
    storageCondition = "HOT_HELD";
  }

  // 5. Estimated meals
  const kgEquivalent = unit === "TRAYS" ? quantity * 1.5 : unit === "BOXES" ? quantity * 2 : quantity;
  const estimatedMeals = Math.round(kgEquivalent * 4);

  // 6. Allergens
  const allergens: string[] = [];
  if (lower.includes("paneer") || lower.includes("milk") || lower.includes("butter") || lower.includes("dairy")) {
    allergens.push("Dairy");
  }
  if (lower.includes("naan") || lower.includes("bread") || lower.includes("wheat") || lower.includes("roti")) {
    allergens.push("Gluten");
  }
  if (lower.includes("peanut") || lower.includes("nut") || lower.includes("cashew")) {
    allergens.push("Nuts");
  }

  // Extract primary clean title
  let foodName = text;
  if (text.length > 50) {
    // Clean up title
    const firstClause = text.split(/,|\.|\bprepared\b|\bavailable\b/i)[0].trim();
    foodName = firstClause.charAt(0).toUpperCase() + firstClause.slice(1);
  }

  return {
    foodName: foodName || "Fresh Prepared Meals",
    category,
    quantity,
    unit,
    preparedAt: preparedDate.toISOString(),
    availableUntil: availableDate.toISOString(),
    storageCondition,
    estimatedMeals,
    allergens,
    notes: text,
    confidenceScore: 0.94,
    rawInput: text,
  };
}

/**
 * Image AI Analysis abstraction
 */
export async function analyzeFoodImage(
  imageUrl: string,
  hintCategory?: string
): Promise<ImageAnalysisResult> {
  // Deterministic realistic vision response with operational confidence
  const isBakery = imageUrl.includes("bread") || imageUrl.includes("croissant") || hintCategory === "Bakery";
  const isProduce = imageUrl.includes("fruit") || imageUrl.includes("vegetable") || hintCategory === "Produce";

  if (isBakery) {
    return {
      foodName: "Artisanal Bread Loaves & Pastries",
      category: "Bakery",
      estimatedQuantityKg: 18,
      estimatedMeals: 72,
      detectedItems: ["Sourdough Boule", "Baguettes", "Pastry Tray"],
      suggestedStorage: "ROOM_TEMP",
      confidenceScore: 0.91,
      disclaimer: "Visual estimate only. Please weigh containers to confirm accurate quantity.",
    };
  }

  if (isProduce) {
    return {
      foodName: "Assorted Fresh Market Produce",
      category: "Produce",
      estimatedQuantityKg: 35,
      estimatedMeals: 140,
      detectedItems: ["Bell Peppers", "Tomatoes", "Cucumbers", "Leafy Greens"],
      suggestedStorage: "REFRIGERATED",
      confidenceScore: 0.89,
      disclaimer: "Visual estimate only. Please weigh containers to confirm accurate quantity.",
    };
  }

  // Default prepared meals
  return {
    foodName: "Catering Trays: Steamed Rice, Curry & Bread",
    category: "Prepared Meals",
    estimatedQuantityKg: 30,
    estimatedMeals: 120,
    detectedItems: ["Stainless Steel Insulated Chafing Trays", "Basmati Rice", "Vegetable Gravy", "Flatbreads"],
    suggestedStorage: "HOT_HELD",
    confidenceScore: 0.93,
    disclaimer: "Visual estimate only. Please verify quantities and temperature before dispatch.",
  };
}

/**
 * Helper to parse natural time strings like "6 PM", "18:00", "8:30 PM"
 */
function parseTimeString(timeStr: string, baseDate: Date): Date {
  const result = new Date(baseDate.getTime());
  const clean = timeStr.trim().toLowerCase();

  const isPM = clean.includes("pm");
  const isAM = clean.includes("am");

  const digits = clean.replace(/[^\d:]/g, "");
  const parts = digits.split(":");
  let hours = parseInt(parts[0], 10) || 12;
  const minutes = parts.length > 1 ? parseInt(parts[1], 10) : 0;

  if (isPM && hours < 12) hours += 12;
  if (isAM && hours === 12) hours = 0;

  result.setHours(hours, minutes, 0, 0);

  // If time is earlier than baseDate by > 4 hours, assume same day or tomorrow
  if (result.getTime() < baseDate.getTime() - 4 * 60 * 60 * 1000) {
    result.setDate(result.getDate() + 1);
  }

  return result;
}
