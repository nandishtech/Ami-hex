// ============================================================
// RESQFOOD Authentication & Role-Based Access Control (RBAC)
// ============================================================

import { UserRole, UserSession } from "@/lib/types";

// Pre-defined demo persona users for instant role-switching and evaluation
export const DEMO_USERS: Record<UserRole, UserSession> = {
  DONOR: {
    id: "user-donor-greenfork",
    name: "Chef Vikram Adiga",
    email: "vikram@greenfork.com",
    role: "DONOR",
    avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150",
    organizationId: "org-greenfork",
    organizationName: "GreenFork Restaurant",
  },
  RECIPIENT: {
    id: "user-recipient-hope",
    name: "Sister Teresa Mathews",
    email: "teresa@hopeshelter.org",
    role: "RECIPIENT",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    organizationId: "org-hope-shelter",
    organizationName: "Hope Community Shelter",
  },
  DRIVER: {
    id: "driver-rahul",
    name: "Rahul Sharma",
    email: "rahul.driver@resqfood.org",
    role: "DRIVER",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150",
  },
  ADMIN: {
    id: "user-admin-1",
    name: "Super Admin (City Ops)",
    email: "admin@resqfood.org",
    role: "ADMIN",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    organizationId: "org-city-ops",
    organizationName: "City Food Rescue Authority",
  },
};

export const AUTH_STORAGE_KEY = "resqfood_active_session";

/**
 * Retrieves the currently active user session from client storage
 */
export function getActiveSession(): UserSession {
  if (typeof window === "undefined") {
    return DEMO_USERS.DONOR;
  }

  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn("Session read failed, defaulting to DONOR");
  }

  return DEMO_USERS.DONOR;
}

/**
 * Sets the active session (e.g. during login or role switcher)
 */
export function setActiveSession(session: UserSession) {
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  }
}

/**
 * Switch role easily for demo and presentation
 */
export function switchDemoRole(role: UserRole): UserSession {
  const session = DEMO_USERS[role];
  setActiveSession(session);
  return session;
}
