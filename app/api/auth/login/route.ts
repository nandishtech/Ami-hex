import { NextRequest, NextResponse } from "next/server";
import { DEMO_USERS, getRoleRedirectPath } from "@/lib/auth";
import { UserRole } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, role } = body;

    // Check if matching a demo user
    let userSession = null;
    const allDemoUsers = Object.values(DEMO_USERS);

    if (email) {
      userSession = allDemoUsers.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
    }

    if (!userSession && role) {
      userSession = DEMO_USERS[role as UserRole];
    }

    if (!userSession) {
      // Create ad-hoc user for credentials
      const assignedRole: UserRole = (role as UserRole) || "DONOR";
      userSession = {
        id: `user-${Date.now().toString(36)}`,
        name: email ? email.split("@")[0] : "Verified User",
        email: email || "user@resqfood.org",
        role: assignedRole,
        avatar:
          assignedRole === "DONOR"
            ? "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150"
            : assignedRole === "DRIVER"
            ? "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150"
            : assignedRole === "RECIPIENT"
            ? "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150"
            : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
        organizationName:
          assignedRole === "DONOR"
            ? "GreenFork Banquets"
            : assignedRole === "RECIPIENT"
            ? "Hope Community Shelter"
            : assignedRole === "DRIVER"
            ? "EV Rescue Fleet"
            : "City Rescue Authority",
      };
    }

    const redirectPath = getRoleRedirectPath(userSession.role);

    return NextResponse.json({
      success: true,
      message: `Welcome back, ${userSession.name}!`,
      user: userSession,
      redirectPath,
      token: `jwt_resqfood_${Date.now()}`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Login authentication failed" },
      { status: 500 }
    );
  }
}
