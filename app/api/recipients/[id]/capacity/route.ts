import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { capacity, availabilityStatus, currentNeeds } = await req.json();

    const data: any = {};
    if (capacity !== undefined) data.capacity = parseFloat(capacity);
    if (availabilityStatus !== undefined) data.availabilityStatus = availabilityStatus;
    if (currentNeeds !== undefined) {
      data.currentNeeds = typeof currentNeeds === "string" ? currentNeeds : JSON.stringify(currentNeeds);
    }

    const updated = await prisma.recipientProfile.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: "MATCHING OPPORTUNITIES UPDATED",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
