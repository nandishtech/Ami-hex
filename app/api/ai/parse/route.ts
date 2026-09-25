import { NextRequest, NextResponse } from "next/server";
import { parseDonationText } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    if (!text || typeof text !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: { code: "VALIDATION_ERROR", message: "text is required" },
        },
        { status: 400 }
      );
    }

    const parsed = await parseDonationText(text);
    return NextResponse.json({ success: true, data: parsed });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "AI_PARSE_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
