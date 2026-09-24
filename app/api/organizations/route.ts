import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

export async function GET() {
  try {
    const orgs = await prisma.organization.findMany({
      include: { branches: true, donorProfiles: true, recipientProfiles: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: orgs });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
