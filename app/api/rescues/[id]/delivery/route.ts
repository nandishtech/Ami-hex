import { NextRequest, NextResponse } from "next/server";
import { ResqFoodService } from "@/server/services";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    const result = await ResqFoodService.confirmDelivery({
      rescueId: params.id,
      qrCode: body.qrCode || `QR-DELIVERY-${params.id}`,
      photoUrl: body.photoUrl,
      latitude: body.latitude || 12.9612,
      longitude: body.longitude || 77.6534,
      recipientConfirmation:
        body.recipientConfirmation || "Recipient Verified Handoff",
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "DELIVERY_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
