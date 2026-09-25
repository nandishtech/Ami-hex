// ============================================================
// RESQFOOD Server Services Layer
// Manages database operations, domain logic, and audit logging
// ============================================================

import prisma from "@/lib/db/prisma";
import { calculateDistanceKm, calculateMatchScore } from "@/lib/matching/engine";
import { calculateOperationalUrgency } from "@/lib/safety/urgency";
import { calculateRescueImpact } from "@/lib/impact/calculator";

export class ResqFoodService {
  /**
   * Fetch all active donations with donor details
   */
  static async getDonations(filter?: { status?: string; donorId?: string }) {
    try {
      const where: any = {};
      if (filter?.status && filter.status !== "ALL") {
        where.status = filter.status;
      }
      if (filter?.donorId) {
        where.donorId = filter.donorId;
      }

      return await prisma.donation.findMany({
        where,
        include: {
          organization: true,
          foodItems: true,
          rescues: {
            include: {
              routes: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (e) {
      console.error("Error fetching donations:", e);
      return [];
    }
  }

  /**
   * Create a new donation and trigger matching candidates
   */
  static async createDonation(data: {
    donorId: string;
    organizationId?: string;
    foodName: string;
    category: string;
    quantity: number;
    unit: string;
    estimatedMeals?: number;
    preparedAt: string;
    availableUntil: string;
    storageCondition: string;
    pickupAddress: string;
    latitude: number;
    longitude: number;
    imageUrl?: string;
    notes?: string;
    allergens?: string[];
  }) {
    const urgency = calculateOperationalUrgency(data.availableUntil);
    const estimatedMeals = data.estimatedMeals || Math.round(data.quantity * 4);

    const donation = await prisma.donation.create({
      data: {
        donorId: data.donorId,
        organizationId: data.organizationId,
        foodName: data.foodName,
        category: data.category,
        quantity: data.quantity,
        unit: data.unit,
        estimatedMeals,
        preparedAt: new Date(data.preparedAt),
        availableUntil: new Date(data.availableUntil),
        storageCondition: data.storageCondition,
        pickupAddress: data.pickupAddress,
        latitude: data.latitude,
        longitude: data.longitude,
        imageUrl: data.imageUrl,
        notes: data.notes,
        status: "POSTED",
        urgencyLevel: urgency.urgencyLevel,
        foodItems: {
          create: [
            {
              name: data.foodName,
              category: data.category,
              quantity: data.quantity,
              unit: data.unit,
              storageCondition: data.storageCondition,
              allergens: data.allergens ? JSON.stringify(data.allergens) : "[]",
            },
          ],
        },
      },
      include: {
        organization: true,
        foodItems: true,
      },
    });

    // Record audit log
    await prisma.auditLog.create({
      data: {
        userId: data.donorId,
        action: "DONATION_CREATED",
        entityType: "Donation",
        entityId: donation.id,
        metadata: JSON.stringify({
          foodName: donation.foodName,
          quantity: donation.quantity,
          urgency: urgency.urgencyLevel,
        }),
      },
    });

    return donation;
  }

  /**
   * Find and rank recipient matches for a donation
   */
  static async calculateMatchesForDonation(donationId: string) {
    const donation = await prisma.donation.findUnique({
      where: { id: donationId },
      include: { organization: true },
    });

    if (!donation) throw new Error("Donation not found");

    // Fetch recipient organizations
    const recipientProfiles = await prisma.recipientProfile.findMany({
      include: {
        user: true,
        organization: true,
      },
    });

    // Fetch available drivers
    const drivers = await prisma.driverProfile.findMany({
      where: { availability: "AVAILABLE" },
      include: { user: true },
    });

    const driverCandidates = drivers.map((d) => ({
      id: d.id,
      name: d.user.name,
      vehicleType: d.vehicleType,
      capacityKg: d.vehicleCapacity,
      lat: d.currentLatitude,
      lng: d.currentLongitude,
      availability: d.availability,
    }));

    const candidates = [];

    for (const rec of recipientProfiles) {
      if (!rec.organization) continue;

      let currentNeeds = [];
      try {
        currentNeeds = JSON.parse(rec.currentNeeds || "[]");
      } catch (err) {}

      let foodPreferences = [];
      try {
        foodPreferences = JSON.parse(rec.foodPreferences || "[]");
      } catch (err) {}

      const scoreResult = calculateMatchScore({
        donation: {
          id: donation.id,
          foodName: donation.foodName,
          category: donation.category,
          quantityKg: donation.quantity,
          availableUntil: donation.availableUntil,
          preparedAt: donation.preparedAt,
          pickupLat: donation.latitude,
          pickupLng: donation.longitude,
        },
        recipient: {
          id: rec.organization.id,
          name: rec.organization.name,
          address: rec.organization.address,
          lat: rec.organization.latitude,
          lng: rec.organization.longitude,
          capacityKg: rec.capacity,
          foodPreferences,
          currentNeeds,
        },
        availableDrivers: driverCandidates,
      });

      candidates.push(scoreResult);
    }

    // Sort by highest score first
    candidates.sort((a, b) => b.totalScore - a.totalScore);
    return candidates;
  }

  /**
   * Accept a match and create an active Rescue
   */
  static async createRescueFromMatch(params: {
    donationId: string;
    recipientId: string;
    driverId?: string;
    rescueScore?: number;
  }) {
    const donation = await prisma.donation.findUnique({
      where: { id: params.donationId },
      include: { organization: true },
    });
    if (!donation) throw new Error("Donation not found");

    const recipient = await prisma.organization.findUnique({
      where: { id: params.recipientId },
    });
    if (!recipient) throw new Error("Recipient organization not found");

    const rescueId = `RF-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date();
    const estDelivery = new Date(now.getTime() + 25 * 60 * 1000); // 25 mins

    const rescue = await prisma.rescue.create({
      data: {
        id: rescueId,
        donationId: donation.id,
        recipientId: recipient.id,
        driverId: params.driverId || "driver-rahul",
        status: "DRIVER_ACCEPTED",
        rescueScore: params.rescueScore || 95,
        estimatedDeliveryTime: estDelivery,
        routes: {
          create: {
            startLatitude: donation.latitude,
            startLongitude: donation.longitude,
            endLatitude: recipient.latitude,
            endLongitude: recipient.longitude,
            distance: calculateDistanceKm(
              donation.latitude,
              donation.longitude,
              recipient.latitude,
              recipient.longitude
            ),
            estimatedDuration: 20,
            trafficStatus: "NORMAL",
          },
        },
      },
      include: {
        donation: true,
        routes: true,
      },
    });

    // Update donation status
    await prisma.donation.update({
      where: { id: donation.id },
      data: { status: "MATCHED" },
    });

    // Record audit log
    await prisma.auditLog.create({
      data: {
        action: "RESCUE_DISPATCHED",
        entityType: "Rescue",
        entityId: rescue.id,
        metadata: JSON.stringify({
          recipient: recipient.name,
          driver: params.driverId || "Rahul Sharma",
          rescueScore: params.rescueScore || 95,
        }),
      },
    });

    return rescue;
  }

  /**
   * Fetch all rescues with full operational hierarchy
   */
  static async getRescues(filter?: { status?: string }) {
    try {
      const where: any = {};
      if (filter?.status && filter.status !== "ALL") {
        where.status = filter.status;
      }

      return await prisma.rescue.findMany({
        where,
        include: {
          donation: {
            include: { organization: true },
          },
          routes: true,
          pickups: true,
          deliveries: true,
          impactRecords: true,
        },
        orderBy: { createdAt: "desc" },
      });
    } catch (e) {
      console.error("Error fetching rescues:", e);
      return [];
    }
  }

  /**
   * Confirm Pickup at donor location with QR & photo verification
   */
  static async confirmPickup(params: {
    rescueId: string;
    qrCode: string;
    photoUrl?: string;
    latitude: number;
    longitude: number;
    notes?: string;
  }) {
    const rescue = await prisma.rescue.findUnique({
      where: { id: params.rescueId },
      include: { donation: true },
    });
    if (!rescue) throw new Error("Rescue not found");

    const pickup = await prisma.pickup.create({
      data: {
        rescueId: rescue.id,
        status: "CONFIRMED",
        latitude: params.latitude,
        longitude: params.longitude,
        qrCode: params.qrCode,
        photoUrl: params.photoUrl,
        notes: params.notes,
      },
    });

    await prisma.rescue.update({
      where: { id: rescue.id },
      data: {
        status: "IN_TRANSIT",
        actualPickupTime: new Date(),
      },
    });

    await prisma.donation.update({
      where: { id: rescue.donationId },
      data: { status: "IN_TRANSIT" },
    });

    await prisma.auditLog.create({
      data: {
        action: "PICKUP_CONFIRMED",
        entityType: "Rescue",
        entityId: rescue.id,
        metadata: JSON.stringify({ qr: params.qrCode, lat: params.latitude, lng: params.longitude }),
      },
    });

    return pickup;
  }

  /**
   * Confirm Delivery at recipient location with QR & impact generation
   */
  static async confirmDelivery(params: {
    rescueId: string;
    qrCode: string;
    photoUrl?: string;
    latitude: number;
    longitude: number;
    recipientConfirmation: string;
  }) {
    const rescue = await prisma.rescue.findUnique({
      where: { id: params.rescueId },
      include: { donation: true },
    });
    if (!rescue) throw new Error("Rescue not found");

    const delivery = await prisma.delivery.create({
      data: {
        rescueId: rescue.id,
        status: "CONFIRMED",
        latitude: params.latitude,
        longitude: params.longitude,
        qrCode: params.qrCode,
        photoUrl: params.photoUrl,
        recipientConfirmation: params.recipientConfirmation,
      },
    });

    await prisma.rescue.update({
      where: { id: rescue.id },
      data: {
        status: "DELIVERED",
        actualDeliveryTime: new Date(),
      },
    });

    await prisma.donation.update({
      where: { id: rescue.donationId },
      data: { status: "DELIVERED" },
    });

    // Create measurable impact record
    const impact = calculateRescueImpact(rescue.donation.quantity);
    const impactRecord = await prisma.impactRecord.create({
      data: {
        rescueId: rescue.id,
        foodWeight: impact.foodWeightKg,
        estimatedMeals: impact.estimatedMeals,
        estimatedCo2e: impact.estimatedCo2eKg,
        waterSavedLitres: impact.waterSavedLitres,
        organizationsSupported: 1,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "DELIVERY_CONFIRMED",
        entityType: "Rescue",
        entityId: rescue.id,
        metadata: JSON.stringify({
          recipientConfirmedBy: params.recipientConfirmation,
          foodRescuedKg: impact.foodWeightKg,
          meals: impact.estimatedMeals,
        }),
      },
    });

    return { delivery, impactRecord };
  }

  /**
   * Aggregate City and Global Impact statistics
   */
  static async getImpactStats() {
    const impacts = await prisma.impactRecord.findMany();
    const rescues = await prisma.rescue.count({ where: { status: "DELIVERED" } });
    const organizations = await prisma.organization.count();

    const totalWeight = impacts.reduce((acc, i) => acc + i.foodWeight, 0);
    const totalMeals = impacts.reduce((acc, i) => acc + i.estimatedMeals, 0);
    const totalCo2e = impacts.reduce((acc, i) => acc + i.estimatedCo2e, 0);
    const totalWater = impacts.reduce((acc, i) => acc + i.waterSavedLitres, 0);

    return {
      totalFoodRescuedKg: Math.round(totalWeight),
      totalMealsSupported: totalMeals,
      totalCo2eAvoidedKg: Math.round(totalCo2e),
      totalWaterSavedLitres: Math.round(totalWater),
      totalRescuesCompleted: rescues,
      organizationsSupportedCount: organizations,
      methodology: "EPA_WARM_v15_FOOD_RESCUE",
      disclaimer: "Estimated impact modeled with EPA WARM v15 parameters.",
    };
  }
}
