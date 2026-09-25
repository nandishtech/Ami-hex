import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || undefined;

    const notifications = await prisma.notification.findMany({
      where: userId ? { userId } : undefined,
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json({ success: true, data: notifications });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "ERROR", message: error.message } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, type, title, message } = await req.json();

    const notif = await prisma.notification.create({
      data: {
        userId: userId || "user-donor-greenfork",
        type: type || "RESCUE",
        title,
        message,
      },
    });

    return NextResponse.json({ success: true, data: notif });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
