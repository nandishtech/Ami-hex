import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

export async function GET() {
  try {
    const drivers = await prisma.driverProfile.findMany({
      include: { user: true },
    });
    return NextResponse.json({ success: true, data: drivers });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
