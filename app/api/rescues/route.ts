import { NextRequest, NextResponse } from "next/server";
import { ResqFoodService } from "@/server/services";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || undefined;

    const rescues = await ResqFoodService.getRescues({ status });
    return NextResponse.json({ success: true, data: rescues });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "RESCUES_FETCH_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.donationId || !body.recipientId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "donationId and recipientId are required.",
          },
        },
        { status: 400 }
      );
    }

    const rescue = await ResqFoodService.createRescueFromMatch(body);
    return NextResponse.json({ success: true, data: rescue }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "RESCUE_CREATE_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
