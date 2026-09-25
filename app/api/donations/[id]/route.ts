import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const donation = await prisma.donation.findUnique({
      where: { id: params.id },
      include: {
        organization: true,
        foodItems: true,
        matches: {
          include: { matchScore: true },
        },
        rescues: {
          include: { routes: true, pickups: true, deliveries: true },
        },
      },
    });

    if (!donation) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Donation not found" } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: donation });
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
    const updated = await prisma.donation.update({
      where: { id: params.id },
      data: body,
    });
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "UPDATE_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
