// ============================================================
// RESQFOOD Automated Test Suite
// Unit, Matching Engine, State Machine, Impact & Safety Tests
// ============================================================

import {
  calculateDistanceKm,
  calculateMatchScore,
  calculateDonationSplit,
  DEFAULT_WEIGHTS,
} from "../lib/matching/engine.ts";
import {
  calculateOperationalUrgency,
  STORAGE_GUIDELINES,
} from "../lib/safety/urgency.ts";
import {
  calculateRescueImpact,
  generateRescueReceipt,
} from "../lib/impact/calculator.ts";

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

function runTests() {
  console.log("==================================================");
  console.log("🚀 RUNNING RESQFOOD CORE TEST SUITE");
  console.log("==================================================\n");

  // 1. Haversine Distance Test
  console.log("Test Group 1: Geographic & Spatial Engine");
  {
    // GreenFork Indiranagar (12.9784, 77.6408) to Hope Shelter (12.9612, 77.6534)
    const dist = calculateDistanceKm(12.9784, 77.6408, 12.9612, 77.6534);
    assert(dist >= 2.0 && dist <= 4.5, `Distance calculation between Indiranagar and Kodihalli is accurate (${dist} KM)`);

    // Zero distance
    const zeroDist = calculateDistanceKm(12.9784, 77.6408, 12.9784, 77.6408);
    assert(zeroDist === 0, "Distance to self is 0 KM");
  }

  // 2. Matching Engine & Rescue Score (0-100)
  console.log("\nTest Group 2: Intelligent Matching Engine & Explainability");
  {
    const now = new Date();
    const expiry = new Date(now.getTime() + 105 * 60 * 1000); // 1h 45m window

    const result = calculateMatchScore({
      donation: {
        id: "don-1",
        foodName: "Paneer Rice & Naan",
        category: "Prepared Meals",
        quantityKg: 30,
        availableUntil: expiry,
        preparedAt: new Date(now.getTime() - 40 * 60 * 1000),
        pickupLat: 12.9784,
        pickupLng: 77.6408,
      },
      recipient: {
        id: "org-hope",
        name: "Hope Community Shelter",
        address: "Old Airport Road",
        lat: 12.9612,
        lng: 77.6534,
        capacityKg: 180,
        foodPreferences: ["Prepared Meals", "Dairy"],
        currentNeeds: [{ category: "Prepared Meals", neededKg: 40, urgency: "HIGH" }],
      },
      availableDrivers: [
        {
          id: "drv-rahul",
          name: "Rahul Sharma",
          vehicleType: "EV Car",
          capacityKg: 85,
          lat: 12.9752,
          lng: 77.6354, // 1.2 KM away
          availability: "AVAILABLE",
        },
      ],
      weights: DEFAULT_WEIGHTS,
    });

    assert(result.totalScore >= 90 && result.totalScore <= 100, `High priority match scores between 90-100 (Computed: ${result.totalScore}/100)`);
    assert(result.bestDriver?.name === "Rahul Sharma", "Optimal nearby driver (Rahul Sharma) assigned");
    assert(result.scoreBreakdown.explanation.length >= 4, `Explainability factors generated (Found: ${result.scoreBreakdown.explanation.length} factors)`);
    assert(result.scoreBreakdown.urgencyScore <= 25, "Urgency score respects max 25 weight");
    assert(result.scoreBreakdown.distanceScore <= 25, "Distance score respects max 25 weight");
  }

  // 3. Multi-Recipient Donation Splitting Algorithm
  console.log("\nTest Group 3: Bulk Donation Splitting Algorithm");
  {
    const splitPlan = calculateDonationSplit(100, [
      {
        recipientId: "rec-1",
        name: "Shelter A",
        address: "Stop 1",
        lat: 12.96,
        lng: 77.65,
        availableCapacityKg: 40,
        distanceKm: 3.2,
      },
      {
        recipientId: "rec-2",
        name: "Shelter B",
        address: "Stop 2",
        lat: 12.97,
        lng: 77.62,
        availableCapacityKg: 35,
        distanceKm: 4.5,
      },
      {
        recipientId: "rec-3",
        name: "Shelter C",
        address: "Stop 3",
        lat: 12.98,
        lng: 77.61,
        availableCapacityKg: 50,
        distanceKm: 5.8,
      },
    ]);

    assert(splitPlan.totalAllocatedKg === 100, `Complete 100 KG allocated across candidate shelters (${splitPlan.totalAllocatedKg} KG)`);
    assert(splitPlan.allocations.length === 3, `Donation split into 3 optimal stops (A: 40kg, B: 35kg, C: 25kg)`);
    assert(splitPlan.allocations[0].allocatedKg === 40, "First stop receives 40 KG");
    assert(splitPlan.allocations[1].allocatedKg === 35, "Second stop receives 35 KG");
    assert(splitPlan.allocations[2].allocatedKg === 25, "Third stop receives remainder 25 KG");
  }

  // 4. Food Safety & Operational Urgency Engine
  console.log("\nTest Group 4: Operational Urgency & Food Safety Guidelines");
  {
    const now = new Date().getTime();

    // Critical: < 1 hour
    const critExpiry = new Date(now + 42 * 60 * 1000);
    const critStatus = calculateOperationalUrgency(critExpiry);
    assert(critStatus.urgencyLevel === "CRITICAL", "Under 60 mins evaluates to CRITICAL");
    assert(critStatus.canDispatch === true, "Critical donations can still be dispatched");

    // High: 1-2 hours
    const highExpiry = new Date(now + 90 * 60 * 1000);
    const highStatus = calculateOperationalUrgency(highExpiry);
    assert(highStatus.urgencyLevel === "HIGH", "90 mins evaluates to HIGH urgency");

    // Medium: 2-4 hours
    const medExpiry = new Date(now + 180 * 60 * 1000);
    const medStatus = calculateOperationalUrgency(medExpiry);
    assert(medStatus.urgencyLevel === "MEDIUM", "3 hours evaluates to MEDIUM urgency");

    // Low: > 4 hours
    const lowExpiry = new Date(now + 300 * 60 * 1000);
    const lowStatus = calculateOperationalUrgency(lowExpiry);
    assert(lowStatus.urgencyLevel === "LOW", "5 hours evaluates to LOW urgency");

    // Expired
    const expiredDate = new Date(now - 10 * 60 * 1000);
    const expStatus = calculateOperationalUrgency(expiredDate);
    assert(expStatus.isExpired === true && expStatus.canDispatch === false, "Past availableUntil marked expired and cannot dispatch");

    // Storage guidelines
    assert(STORAGE_GUIDELINES.HOT_HELD.targetTempCelsius.includes("60°C"), "Hot held food requires ≥ 60°C operational holding temperature");
    assert(STORAGE_GUIDELINES.REFRIGERATED.targetTempCelsius.includes("4°C"), "Refrigerated food requires 1-4°C holding temperature");
  }

  // 5. Impact Metrics & ESG Calculations (EPA WARM)
  console.log("\nTest Group 5: Impact Calculations & Digital Receipts");
  {
    const impact = calculateRescueImpact(30); // 30 KG
    assert(impact.estimatedMeals === 120, "30 KG yields 120 meals (4 meals / kg edible food)");
    assert(impact.estimatedCo2eKg === 75, "30 KG yields 75 KG CO2e prevented (2.5 factor)");
    assert(impact.waterSavedLitres === 15600, "30 KG saves 15,600 Litres of embedded water (520 factor)");

    const receipt = generateRescueReceipt(
      "RF-10283",
      "Paneer Rice & Naan",
      30,
      "GreenFork Restaurant",
      "Indiranagar",
      "Hope Community Shelter",
      "Old Airport Road",
      "Rahul Sharma",
      "6:28 PM",
      "6:46 PM"
    );
    assert(receipt.rescueId === "RF-10283", "Receipt retains rescue ID");
    assert(receipt.verificationHash.startsWith("RESQ-TX-"), "Cryptographic audit hash generated for receipt");
  }

  // Summary
  console.log("\n==================================================");
  console.log(`🏁 TEST EXECUTION SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
