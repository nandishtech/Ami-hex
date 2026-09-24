import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const match = await prisma.match.findUnique({
      where: { id: params.id },
      include: {
        matchScore: true,
        donation: {
          include: { organization: true },
        },
      },
    });

    if (!match) {
      // If not stored in DB, check if it's the demo match
      if (params.id.includes("demo") || params.id === "match-demo-96") {
        return NextResponse.json({
          success: true,
          data: {
            matchId: params.id,
            score: 96,
            breakdown: {
              urgencyScore: 25,
              distanceScore: 23,
              capacityScore: 20,
              compatibilityScore: 15,
              driverScore: 13,
            },
            operationalFactors: [
              "Recipient has enough capacity (Hope Shelter available: 168 KG)",
              "Food category matches current critical need (Prepared Meals needed: 40 KG)",
              "Recipient is only 3.8 KM away via Old Airport Road",
              "Driver Rahul Sharma is available and only 1.2 KM from pickup point",
              "Food remains within active rescue window (1h 45m remaining)",
            ],
            disclaimer: "Operational matching criteria only. Not scientific certainty.",
          },
        });
      }

      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Match not found" } },
        { status: 404 }
      );
    }

    let parsedExplanation = [];
    try {
      parsedExplanation = JSON.parse(match.matchScore?.explanation || "[]");
    } catch (e) {
      parsedExplanation = [match.matchScore?.explanation || "Criteria satisfied."];
    }

    return NextResponse.json({
      success: true,
      data: {
        matchId: match.id,
        score: match.score,
        distanceKm: match.distance,
        estimatedTimeMins: match.estimatedTime,
        breakdown: match.matchScore
          ? {
              urgencyScore: match.matchScore.urgencyScore,
              distanceScore: match.matchScore.distanceScore,
              capacityScore: match.matchScore.capacityScore,
              compatibilityScore: match.matchScore.compatibilityScore,
              driverScore: match.matchScore.driverScore,
            }
          : null,
        operationalFactors: parsedExplanation,
        disclaimer: "Operational matching criteria only.",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "EXPLANATION_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
