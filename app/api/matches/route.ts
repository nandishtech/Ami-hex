import { NextRequest, NextResponse } from "next/server";
import { ResqFoodService } from "@/server/services";

export async function POST(req: NextRequest) {
  try {
    const { donationId } = await req.json();
    if (!donationId) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "donationId is required" } },
        { status: 400 }
      );
    }

    const matches = await ResqFoodService.calculateMatchesForDonation(donationId);
    return NextResponse.json({ success: true, data: matches });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "MATCHING_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
