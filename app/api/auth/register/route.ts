import { NextRequest, NextResponse } from "next/server";
import { getRoleRedirectPath } from "@/lib/auth";
import { UserRole } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      role,
      name,
      email,
      phone,
      organizationName,
      password,
      // Role specific fields
      fssaiLicense,
      kitchenType,
      dailySurplusKg,
      storageType,
      pickupAddress,
      vehicleType,
      plateNumber,
      payloadCapacityKg,
      thermalEquipment,
      drivingLicense,
      operatingZone,
      facilityType,
      dailyMealsNeeded,
      intakeCapacityKg,
      receivingHours,
      department,
      jurisdiction,
    } = body;

    if (!name || !email || !role) {
      return NextResponse.json(
        { success: false, message: "Missing required registration parameters" },
        { status: 400 }
      );
    }

    const assignedRole: UserRole = role as UserRole;
    const newUserId = `user-${assignedRole.toLowerCase()}-${Date.now().toString(36)}`;

    const userSession = {
      id: newUserId,
      name,
      email,
      role: assignedRole,
      avatar:
        assignedRole === "DONOR"
          ? "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150"
          : assignedRole === "DRIVER"
          ? "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150"
          : assignedRole === "RECIPIENT"
          ? "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150"
          : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      organizationId: `org-${Date.now().toString(36)}`,
      organizationName:
        organizationName ||
        (assignedRole === "DRIVER"
          ? `${name}'s Rescue Vehicle`
          : `${name}'s Organization`),
      profileDetails: {
        phone,
        fssaiLicense,
        kitchenType,
        dailySurplusKg,
        storageType,
        pickupAddress,
        vehicleType,
        plateNumber,
        payloadCapacityKg,
        thermalEquipment,
        drivingLicense,
        operatingZone,
        facilityType,
        dailyMealsNeeded,
        intakeCapacityKg,
        receivingHours,
        department,
        jurisdiction,
      },
    };

    const redirectPath = getRoleRedirectPath(assignedRole);

    return NextResponse.json({
      success: true,
      message: `Registration successful! Welcome to RESQFOOD, ${name}.`,
      user: userSession,
      redirectPath,
      token: `jwt_resqfood_${Date.now()}`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Registration failed" },
      { status: 500 }
    );
  }
}
