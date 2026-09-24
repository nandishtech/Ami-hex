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
    organizationName: "GreenFork Restaurant & Banquets",
  },
  RECIPIENT: {
    id: "user-recipient-hope",
    name: "Sister Teresa Mathews",
    email: "teresa@hopeshelter.org",
    role: "RECIPIENT",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    organizationId: "org-hope-shelter",
    organizationName: "Hope Community Shelter & Kitchen",
  },
  DRIVER: {
    id: "driver-rahul",
    name: "Rahul Sharma",
    email: "rahul.driver@resqfood.org",
    role: "DRIVER",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150",
    organizationName: "Zero-Emission EV Rescue Fleet",
  },
  ADMIN: {
    id: "user-admin-1",
    name: "Super Admin (City Ops)",
    email: "admin@resqfood.org",
    role: "ADMIN",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    organizationId: "org-city-ops",
    organizationName: "Metropolitan Food Rescue Authority",
  },
};

export const AUTH_STORAGE_KEY = "resqfood_active_session";
export const REGISTERED_USERS_KEY = "resqfood_registered_users";

/**
 * Returns the canonical redirect URL corresponding to a user role
 */
export function getRoleRedirectPath(role: UserRole): string {
  switch (role) {
    case "DONOR":
      return "/donor";
    case "DRIVER":
      return "/driver";
    case "RECIPIENT":
      return "/recipient";
    case "ADMIN":
      return "/admin";
    default:
      return "/";
  }
}

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
    window.dispatchEvent(new CustomEvent("resqfood-auth-change", { detail: session }));
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

/**
 * Logs the current user out
 */
export function logoutUser() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent("resqfood-auth-change", { detail: null }));
  }
}

/**
 * Saves a new registration and activates the session
 */
export function registerUser(profile: {
  name: string;
  email: string;
  role: UserRole;
  organizationName?: string;
  phone?: string;
  avatar?: string;
  details?: Record<string, any>;
}): UserSession {
  const newSession: UserSession = {
    id: `user-${profile.role.toLowerCase()}-${Date.now().toString(36)}`,
    name: profile.name,
    email: profile.email,
    role: profile.role,
    avatar:
      profile.avatar ||
      (profile.role === "DONOR"
        ? "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150"
        : profile.role === "DRIVER"
        ? "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150"
        : profile.role === "RECIPIENT"
        ? "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150"
        : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"),
    organizationId: `org-${Date.now().toString(36)}`,
    organizationName: profile.organizationName || (profile.role === "DRIVER" ? "Independent Courier" : "Registered Partner"),
  };

  if (typeof window !== "undefined") {
    try {
      const existingRaw = localStorage.getItem(REGISTERED_USERS_KEY);
      const list = existingRaw ? JSON.parse(existingRaw) : [];
      list.push({ ...newSession, ...profile.details, registeredAt: new Date().toISOString() });
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(list));
    } catch (err) {
      console.error("Failed to persist user in registration registry:", err);
    }
  }

  setActiveSession(newSession);
  return newSession;
}
