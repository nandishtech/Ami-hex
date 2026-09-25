import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const rescue = await prisma.rescue.findUnique({
      where: { id: params.id },
      include: {
        donation: {
          include: { organization: true, foodItems: true },
        },
        routes: true,
        pickups: true,
        deliveries: true,
        impactRecords: true,
      },
    });

    if (!rescue) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Rescue not found" } },
        { status: 404 }
      );
    }

    // Fetch recipient org
    const recipient = await prisma.organization.findUnique({
      where: { id: rescue.recipientId },
    });

    // Fetch driver
    const driver = rescue.driverId
      ? await prisma.driverProfile.findUnique({
          where: { id: rescue.driverId },
          include: { user: true },
        })
      : null;

    return NextResponse.json({
      success: true,
      data: {
        ...rescue,
        recipient,
        driver,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "ERROR", message: error.message } },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const updated = await prisma.rescue.update({
      where: { id: params.id },
      data: body,
      include: { routes: true },
    });
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "UPDATE_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
