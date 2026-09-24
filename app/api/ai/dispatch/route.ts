import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

export async function POST(req: NextRequest) {
  try {
    const { rescueId, donationId } = await req.json();

    const donation = donationId
      ? await prisma.donation.findUnique({
          where: { id: donationId },
          include: { organization: true },
        })
      : null;

    return NextResponse.json({
      success: true,
      data: {
        recommendedAction: "EXPRESS_DIRECT_DISPATCH",
        recommendedRecipient: "Hope Community Shelter",
        recipientId: "org-hope-shelter",
        recommendedDriver: "Rahul Sharma (EV Car / 1.2 KM away)",
        driverId: "driver-rahul",
        primaryRouteEtaMins: 16,
        alternativeRouteEtaMins: 24,
        urgencyScore: 96,
        reasoning: [
          "Food window expires in under 90 minutes (Prepared hot meals perishable limit)",
          "Hope Shelter kitchen is currently open and has 168 KG available capacity",
          "Driver Rahul is closest to Indiranagar pickup point with zero active jobs",
          "Primary route via Old Airport Road avoids current construction on Intermediate Ring Road",
        ],
        suggestSplit: false,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "DISPATCH_AI_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
