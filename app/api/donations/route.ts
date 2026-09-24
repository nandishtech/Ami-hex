import { NextRequest, NextResponse } from "next/server";
import { ResqFoodService } from "@/server/services";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || undefined;
    const donorId = searchParams.get("donorId") || undefined;

    const donations = await ResqFoodService.getDonations({ status, donorId });
    return NextResponse.json({ success: true, data: donations });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "DONATION_FETCH_ERROR", message: error.message },
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.foodName || !body.quantity) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "foodName and quantity are required fields.",
          },
        },
        { status: 400 }
      );
    }

    const donation = await ResqFoodService.createDonation(body);
    return NextResponse.json({ success: true, data: donation }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "DONATION_CREATE_ERROR", message: error.message },
      },
      { status: 500 }
    );
  }
}
