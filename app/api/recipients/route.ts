import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

export async function GET() {
  try {
    const recipients = await prisma.recipientProfile.findMany({
      include: {
        organization: true,
        user: true,
      },
    });
    return NextResponse.json({ success: true, data: recipients });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
