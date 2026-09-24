import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { latitude, longitude, availability } = await req.json();

    const data: any = { lastLocationUpdate: new Date() };
    if (latitude !== undefined) data.currentLatitude = latitude;
    if (longitude !== undefined) data.currentLongitude = longitude;
    if (availability !== undefined) data.availability = availability;

    const updated = await prisma.driverProfile.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
