import { NextRequest, NextResponse } from "next/server";
import { analyzeFoodImage } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const { imageUrl, categoryHint } = await req.json();
    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "imageUrl is required" } },
        { status: 400 }
      );
    }

    const analysis = await analyzeFoodImage(imageUrl, categoryHint);
    return NextResponse.json({ success: true, data: analysis });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "AI_IMAGE_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
