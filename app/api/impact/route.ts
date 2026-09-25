import { NextResponse } from "next/server";
import { ResqFoodService } from "@/server/services";

export async function GET() {
  try {
    const stats = await ResqFoodService.getImpactStats();
    return NextResponse.json({ success: true, data: stats });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
