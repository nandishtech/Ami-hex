import { NextRequest, NextResponse } from "next/server";
import { ResqFoodService } from "@/server/services";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    const pickup = await ResqFoodService.confirmPickup({
      rescueId: params.id,
      qrCode: body.qrCode || `QR-PICKUP-${params.id}`,
      photoUrl: body.photoUrl,
      latitude: body.latitude || 12.9784,
      longitude: body.longitude || 77.6408,
      notes: body.notes,
    });

    return NextResponse.json({ success: true, data: pickup });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "PICKUP_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
