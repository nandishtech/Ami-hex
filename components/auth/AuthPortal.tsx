"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Utensils,
  Truck,
  HeartHandshake,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Lock,
  Mail,
  User,
  Phone,
  Building,
  CheckCircle2,
  AlertCircle,
  FileText,
  Thermometer,
  Zap,
  Flame,
  Layers,
  ChevronRight,
  MapPin,
  Clock,
  Shield,
  Check,
  RefreshCw,
} from "lucide-react";
import { UserRole, UserSession } from "@/lib/types";
import { DEMO_USERS, registerUser, setActiveSession, getRoleRedirectPath, PERMANENT_ADMIN } from "@/lib/auth";
import BreadDonationAnimation from "@/components/illustrations/BreadDonationAnimation";

interface AuthPortalProps {
  initialRole?: UserRole;
  initialMode?: "LOGIN" | "REGISTER";
  compact?: boolean;
}

function AuthPortalContent({ initialRole, initialMode, compact = false }: AuthPortalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryRole = (searchParams?.get("role")?.toUpperCase() as UserRole) || "DONOR";

  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole || queryRole);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Common Identity Fields
  const [name, setName] = useState("Chef Vikram Adiga");
  const [email, setEmail] = useState("vikram@greenfork.com");
  const [password, setPassword] = useState("••••••••");
  const [phone, setPhone] = useState("+91 98450 12839");
  const [organizationName, setOrganizationName] = useState("GreenFork Restaurant & Banquets");

  // Differentiating Fields for 1: FOOD DONOR
  const [fssaiLicense, setFssaiLicense] = useState("FSSAI-11223344556677");
  const [kitchenType, setKitchenType] = useState("Restaurant & Banquet Hall");
  const [dailySurplusKg, setDailySurplusKg] = useState("25 - 50 KG (100-200 meals)");
  const [storageType, setStorageType] = useState("Commercial Hot Chafing Tables (>60°C)");
  const [pickupAddress, setPickupAddress] = useState("100 Feet Road, Indiranagar, Bengaluru");

  // Differentiating Fields for 2: DELIVERY PERSON (DRIVER)
  const [vehicleType, setVehicleType] = useState("Tata Nexon EV (Electric Car)");
  const [plateNumber, setPlateNumber] = useState("KA-01-EQ-8291");
  const [payloadCapacityKg, setPayloadCapacityKg] = useState("85 KG (Standard Cargo)");
  const [thermalEquipment, setThermalEquipment] = useState("Insulated Heated Box (Maintains 65°C+)");
  const [drivingLicense, setDrivingLicense] = useState("DL-0420220019283");
  const [operatingZone, setOperatingZone] = useState("East Bengaluru (Indiranagar / Koramangala)");

  // Differentiating Fields for 3: RECIPIENT SHELTER / NGO
  const [facilityType, setFacilityType] = useState("Night Shelter & Community Kitchen");
  const [dailyMealsNeeded, setDailyMealsNeeded] = useState("150 - 250 meals/day");
  const [intakeCapacityKg, setIntakeCapacityKg] = useState("180 KG Storage");
  const [receivingHours, setReceivingHours] = useState("08:00 AM - 10:00 PM");
  const [gateInstructions, setGateInstructions] = useState("Gate 2, Kitchen Dock on Left");

  // Differentiating Fields for 4: CITY ADMIN
  const [department, setDepartment] = useState("Metropolitan Urban Food & Waste Authority");
  const [jurisdiction, setJurisdiction] = useState("Bengaluru Metropolitan Central Sector");
  const [staffId, setStaffId] = useState("BBMP-RESQ-991");

  // Login form state
  const [loginEmail, setLoginEmail] = useState("vikram@greenfork.com");
  const [loginPassword, setLoginPassword] = useState("••••••••");
  const [loginRole, setLoginRole] = useState<UserRole>("DONOR");

  // Update default placeholders when role changes
  useEffect(() => {
    if (selectedRole === "DONOR") {
      setName("Chef Vikram Adiga");
      setEmail("vikram@greenfork.com");
      setOrganizationName("GreenFork Restaurant & Banquets");
      setLoginEmail("vikram@greenfork.com");
      setLoginRole("DONOR");
    } else if (selectedRole === "DRIVER") {
      setName("Rahul Sharma");
      setEmail("rahul.driver@resqfood.org");
      setOrganizationName("Zero-Emission EV Rescue Fleet");
      setLoginEmail("rahul.driver@resqfood.org");
      setLoginRole("DRIVER");
    } else if (selectedRole === "RECIPIENT") {
      setName("Sister Teresa Mathews");
      setEmail("teresa@hopeshelter.org");
      setOrganizationName("Hope Community Shelter & Kitchen");
      setLoginEmail("teresa@hopeshelter.org");
      setLoginRole("RECIPIENT");
    } else if (selectedRole === "ADMIN") {
      setName("Dr. Aarti Raman");
      setEmail("admin@resqfood.org");
      setOrganizationName("Metropolitan Rescue Logistics");
      setLoginEmail("admin@resqfood.org");
      setLoginRole("ADMIN");
    }
  }, [selectedRole]);

  // Autofill helpers for rapid testing
  const autofillDonor = () => {
    setSelectedRole("DONOR");
    setName("Chef Vikram Adiga");
    setEmail("vikram@greenfork.com");
    setPhone("+91 98450 12839");
    setOrganizationName("GreenFork Restaurant & Banquets");
    setFssaiLicense("FSSAI-11223344556677");
    setKitchenType("Restaurant & Banquet Hall");
    setDailySurplusKg("25 - 50 KG (100-200 meals)");
    setStorageType("Commercial Hot Chafing Tables (>60°C)");
    setPickupAddress("100 Feet Road, Indiranagar, Bengaluru");
  };

  const autofillDriver = () => {
    setSelectedRole("DRIVER");
    setName("Rahul Sharma");
    setEmail("rahul.driver@resqfood.org");
    setPhone("+91 98765 43210");
    setOrganizationName("Zero-Emission EV Rescue Fleet");
    setVehicleType("Tata Nexon EV (Electric Car)");
    setPlateNumber("KA-01-EQ-8291");
    setPayloadCapacityKg("85 KG (Standard Cargo)");
    setThermalEquipment("Insulated Heated Box (Maintains 65°C+)");
    setDrivingLicense("DL-0420220019283");
    setOperatingZone("East Bengaluru (Indiranagar / Koramangala)");
  };

  const autofillRecipient = () => {
    setSelectedRole("RECIPIENT");
    setName("Sister Teresa Mathews");
    setEmail("teresa@hopeshelter.org");
    setPhone("+91 98123 45678");
    setOrganizationName("Hope Community Shelter & Kitchen");
    setFacilityType("Night Shelter & Community Kitchen");
    setDailyMealsNeeded("150 - 250 meals/day");
    setIntakeCapacityKg("180 KG Storage");
    setReceivingHours("08:00 AM - 10:00 PM");
    setGateInstructions("Gate 2, Kitchen Dock on Left");
  };

  // Instant 1-Click Profile Launcher (Directly opens that role's platform)
  const handleLaunchProfile = (role: UserRole) => {
    setIsLoading(true);
    setErrorMessage(null);
    const demoUser = DEMO_USERS[role];
    setActiveSession(demoUser);

    const roleName =
      role === "DONOR"
        ? "Food Donor Section"
        : role === "DRIVER"
        ? "Rescue Delivery Platform"
        : role === "RECIPIENT"
        ? "Recipient Shelter Platform"
        : "City Admin Command";

    setSuccessMessage(`✓ Logged in as ${demoUser.name} (${role})! Launching ${roleName}...`);

    setTimeout(() => {
      const redirectPath = getRoleRedirectPath(role);
      router.push(redirectPath);
    }, 600);
  };

  // Handle Standard Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    // Direct check for permanent administrator credentials (admin / admin123)
    const cleanEmail = loginEmail.trim().toLowerCase();
    if (
      (cleanEmail === "admin" || cleanEmail === "admin@hopeplate.org" || cleanEmail === "admin@resqfood.org") &&
      loginPassword === "admin123"
    ) {
      setActiveSession(PERMANENT_ADMIN.user);
      setSuccessMessage("✓ Permanent Administrator credentials verified! Opening City Admin Command...");
      setTimeout(() => {
        router.push("/admin");
      }, 500);
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword, role: loginRole }),
      });

      const data = await res.json();
      if (data.success && data.user) {
        setActiveSession(data.user);
        setSuccessMessage(`✓ Authenticated as ${data.user.name}. Opening ${loginRole} platform...`);
        setTimeout(() => {
          router.push(data.redirectPath || getRoleRedirectPath(data.user.role));
        }, 700);
      } else {
        // Fallback for demo convenience
        const fallback = DEMO_USERS[loginRole];
        setActiveSession(fallback);
        setSuccessMessage(`✓ Signed in as ${fallback.name}. Opening platform...`);
        setTimeout(() => {
          router.push(getRoleRedirectPath(loginRole));
        }, 700);
      }
    } catch (err) {
      const fallback = DEMO_USERS[loginRole];
      setActiveSession(fallback);
      setSuccessMessage(`✓ Signed in as ${fallback.name}. Opening platform...`);
      setTimeout(() => {
        router.push(getRoleRedirectPath(loginRole));
      }, 700);
    }
  };

  // Handle Full Registration Form Submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    const payload = {
      role: selectedRole,
      name,
      email,
      phone,
      password,
      organizationName,
      fssaiLicense,
      kitchenType,
      dailySurplusKg,
      storageType,
      pickupAddress,
      vehicleType,
      plateNumber,
      payloadCapacityKg: parseInt(payloadCapacityKg) || 85,
      thermalEquipment,
      drivingLicense,
      operatingZone,
      facilityType,
      dailyMealsNeeded,
      intakeCapacityKg: parseInt(intakeCapacityKg) || 180,
      receivingHours,
      department,
      jurisdiction,
    };

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.user) {
        registerUser({
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          organizationName: data.user.organizationName,
          phone,
          details: payload,
        });

        const targetName =
          selectedRole === "DONOR"
            ? "Food Donor Section"
            : selectedRole === "DRIVER"
            ? "Rescue Delivery Platform"
            : selectedRole === "RECIPIENT"
            ? "Recipient Shelter Platform"
            : "City Admin Command";

        setSuccessMessage(`✓ Account Registered for ${data.user.name}! Entering ${targetName}...`);
        setTimeout(() => {
          router.push(data.redirectPath || getRoleRedirectPath(selectedRole));
        }, 700);
      } else {
        // Fallback local registration
        const localUser = registerUser({
          name,
          email,
          role: selectedRole,
          organizationName,
          phone,
          details: payload,
        });

        setSuccessMessage(`✓ Registration successful! Entering ${selectedRole} platform...`);
        setTimeout(() => {
          router.push(getRoleRedirectPath(selectedRole));
        }, 700);
      }
    } catch (err) {
      const localUser = registerUser({
        name,
        email,
        role: selectedRole,
        organizationName,
        phone,
        details: payload,
      });

      setSuccessMessage(`✓ Registration complete! Entering ${selectedRole} platform...`);
      setTimeout(() => {
        router.push(getRoleRedirectPath(selectedRole));
      }, 700);
    }
  };

  return (
    <div
      className="w-full text-slate-100"
      style={{
        backgroundColor: "#071626",
        color: "#F1F5F9",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
        {/* Brand Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <img
              src="/logo.png"
              alt="HopePlate Charity Food Distribution"
              className="h-20 sm:h-24 w-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform"
            />
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            HOPEPLATE AI Food Rescue & Direct Relief Network
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Share Food.{" "}
            <span
              style={{
                background: "linear-gradient(to right, #F59E0B, #10B981, #3B82F6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Nourish Lives.
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            Connecting commercial kitchens, volunteer EV drivers, and verified shelters in real-time. Choose your stakeholder role below to create an account or sign in.
          </p>

          {/* Bread Donation Storytelling Animation */}
          <div className="pt-2">
            <BreadDonationAnimation />
          </div>
        </div>

        {/* Global Notifications */}
        {successMessage && (
          <div
            className="p-4 rounded-2xl flex items-center gap-3 text-sm font-bold shadow-lg animate-in fade-in backdrop-blur-xl"
            style={{
              backgroundColor: "rgba(16, 185, 129, 0.2)",
              border: "1px solid rgba(16, 185, 129, 0.5)",
              color: "#34D399",
            }}
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div
            className="p-4 rounded-2xl flex items-center gap-3 text-sm font-bold shadow-lg animate-in fade-in backdrop-blur-xl"
            style={{
              backgroundColor: "rgba(239, 68, 68, 0.2)",
              border: "1px solid rgba(239, 68, 68, 0.5)",
              color: "#F87171",
            }}
          >
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* ============================================================ */}
        {/* BOX 1: REGISTRATION BOX (Frosted Glass Look)                  */}
        {/* ============================================================ */}
        <div
          id="registration-section"
          className="rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-2xl bg-white/[0.04] border border-white/20"
          style={{
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
          }}
        >
          {/* Looping Video Background Layer */}
          <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
            <iframe
              src="https://www.youtube-nocookie.com/embed/TZGWNH-iaHk?autoplay=1&mute=1&loop=1&playlist=TZGWNH-iaHk&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[160%] min-w-full min-h-full object-cover pointer-events-none opacity-20"
              allow="autoplay; encrypted-media; picture-in-picture"
              title="Registration Section Video Background"
            />
            {/* Contrast-preserving dark glassmorphic gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#071626]/90 via-[#0A1E35]/80 to-[#071626]/90 backdrop-blur-[2px]" />
          </div>

          <div className="relative z-10">
            {/* Section Indicator Badge */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <span
                className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm text-white shadow-md bg-amber-500"
              >
                1
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Registration Box: Create Stakeholder Account
                </h2>
                <p className="text-xs text-slate-300">
                  Select your profile category and register with required operational credentials (Admin is registered internally)
                </p>
              </div>
            </div>

            {/* Quick Autofill shortcuts */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] text-slate-400 font-medium">Quick Autofill:</span>
              <button
                type="button"
                onClick={autofillDonor}
                className="px-2.5 py-1 rounded-lg text-xs font-bold text-amber-300 hover:text-white bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 transition-all"
              >
                🍱 Donor
              </button>
              <button
                type="button"
                onClick={autofillDriver}
                className="px-2.5 py-1 rounded-lg text-xs font-bold text-emerald-300 hover:text-white bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 transition-all"
              >
                🚚 Driver
              </button>
              <button
                type="button"
                onClick={autofillRecipient}
                className="px-2.5 py-1 rounded-lg text-xs font-bold text-purple-300 hover:text-white bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 transition-all"
              >
                🏠 Shelter
              </button>
            </div>
          </div>

          {/* Role Differentiator Selector (3 Stakeholder Roles Only - Admin Removed) */}
          <div className="space-y-3 mb-8">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Step 1 • Select Stakeholder Role To Register:
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* ROLE 1: DONOR */}
              <div
                onClick={() => setSelectedRole("DONOR")}
                className="p-4 rounded-2xl cursor-pointer transition-all duration-200 text-left relative"
                style={{
                  backgroundColor: selectedRole === "DONOR" ? "rgba(245, 158, 11, 0.2)" : "rgba(255, 255, 255, 0.04)",
                  border:
                    selectedRole === "DONOR"
                      ? "2px solid #F59E0B"
                      : "1px solid rgba(255, 255, 255, 0.1)",
                  boxShadow:
                    selectedRole === "DONOR" ? "0 0 20px rgba(245, 158, 11, 0.35)" : "none",
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white bg-amber-500"
                  >
                    <Utensils className="w-5 h-5" />
                  </div>
                  {selectedRole === "DONOR" && (
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                  )}
                </div>
                <h3 className="text-base font-black text-white">1. Food Donor</h3>
                <p className="text-xs text-slate-300 mt-1">
                  Restaurants, banquets, hotels, caterers, bakeries & supermarkets.
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-amber-400">
                  <span>Routes to Donor Section</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* ROLE 2: DRIVER */}
              <div
                onClick={() => setSelectedRole("DRIVER")}
                className="p-4 rounded-2xl cursor-pointer transition-all duration-200 text-left relative"
                style={{
                  backgroundColor: selectedRole === "DRIVER" ? "rgba(16, 185, 129, 0.2)" : "rgba(255, 255, 255, 0.04)",
                  border:
                    selectedRole === "DRIVER"
                      ? "2px solid #10B981"
                      : "1px solid rgba(255, 255, 255, 0.1)",
                  boxShadow:
                    selectedRole === "DRIVER" ? "0 0 20px rgba(16, 185, 129, 0.35)" : "none",
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white bg-emerald-500"
                  >
                    <Truck className="w-5 h-5" />
                  </div>
                  {selectedRole === "DRIVER" && (
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  )}
                </div>
                <h3 className="text-base font-black text-white">2. Delivery Person</h3>
                <p className="text-xs text-slate-300 mt-1">
                  EV drivers, volunteer couriers, fleets with heated/cooled cargo.
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
                  <span>Opens Delivery Platform</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* ROLE 3: RECIPIENT */}
              <div
                onClick={() => setSelectedRole("RECIPIENT")}
                className="p-4 rounded-2xl cursor-pointer transition-all duration-200 text-left relative"
                style={{
                  backgroundColor: selectedRole === "RECIPIENT" ? "rgba(168, 85, 247, 0.2)" : "rgba(255, 255, 255, 0.04)",
                  border:
                    selectedRole === "RECIPIENT"
                      ? "2px solid #A855F7"
                      : "1px solid rgba(255, 255, 255, 0.1)",
                  boxShadow:
                    selectedRole === "RECIPIENT" ? "0 0 20px rgba(168, 85, 247, 0.35)" : "none",
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white bg-purple-500"
                  >
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  {selectedRole === "RECIPIENT" && (
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping" />
                  )}
                </div>
                <h3 className="text-base font-black text-white">3. Recipient Shelter</h3>
                <p className="text-xs text-slate-300 mt-1">
                  Night shelters, soup kitchens, orphanages, elder care & food banks.
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-purple-400">
                  <span>Opens Shelter Platform</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>

          {/* Registration Form with Dynamic Differentiating Parameters */}
          <form onSubmit={handleRegisterSubmit} className="space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Step 2 • Complete Registration Details for:{" "}
                <span className="text-white font-black">{selectedRole}</span>
              </span>
              <span className="text-[11px] text-slate-400">
                * All data encrypted and verified via RESQFOOD Identity Protocol
              </span>
            </div>

            {/* Common Credentials Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Full Name / Contact Person
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                    placeholder="e.g. Chef Vikram Adiga"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Official Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                    placeholder="name@organization.com"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Direct Phone / WhatsApp
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                    placeholder="+91 98450 12839"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Organization / Entity Name
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                    placeholder="e.g. GreenFork Banquets"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                    placeholder="Create a strong password"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Target Dynamic Platform
                </label>
                <div className="w-full px-3 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs sm:text-sm font-bold flex items-center justify-between text-blue-300">
                  <span>
                    {selectedRole === "DONOR"
                      ? "🍱 /donor (Food Donor Section)"
                      : selectedRole === "DRIVER"
                      ? "🚚 /driver (Delivery Platform)"
                      : selectedRole === "RECIPIENT"
                      ? "🏠 /recipient (Shelter Platform)"
                      : "🛡️ /admin (Admin Command)"}
                  </span>
                  <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-extrabold">
                    Auto-Route
                  </span>
                </div>
              </div>
            </div>

            {/* ======================================================= */}
            {/* DIFFERENTIATING FIELDS ACCORDING TO ROLE               */}
            {/* ======================================================= */}
            <div
              className="p-5 rounded-2xl space-y-4"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.25)",
                border: "1px dashed rgba(255, 255, 255, 0.15)",
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    backgroundColor:
                      selectedRole === "DONOR"
                        ? "#1769FF"
                        : selectedRole === "DRIVER"
                        ? "#10B981"
                        : selectedRole === "RECIPIENT"
                        ? "#A855F7"
                        : "#F59E0B",
                  }}
                />
                <span className="text-xs font-black uppercase tracking-wider text-slate-200">
                  Role-Specific Operational Parameters ({selectedRole}):
                </span>
              </div>

              {/* 1. DONOR DIFFERENTIATION */}
              {selectedRole === "DONOR" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      FSSAI Food Safety License No.
                    </label>
                    <input
                      type="text"
                      required
                      value={fssaiLicense}
                      onChange={(e) => setFssaiLicense(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-blue-500"
                      placeholder="e.g. FSSAI-11223344556677"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Enables tax deduction certificate & safe food liability protection.
                    </span>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Kitchen / Business Category
                    </label>
                    <select
                      value={kitchenType}
                      onChange={(e) => setKitchenType(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-blue-500"
                    >
                      <option>Restaurant & Banquet Hall</option>
                      <option>Hotel & Resort Kitchen</option>
                      <option>Corporate IT Campus Cafeteria</option>
                      <option>Catering & Wedding Operations</option>
                      <option>Bakery, Confectionery & Cafe</option>
                      <option>Supermarket & Fresh Grocer</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Estimated Daily Surplus Volume
                    </label>
                    <select
                      value={dailySurplusKg}
                      onChange={(e) => setDailySurplusKg(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-blue-500"
                    >
                      <option>10 - 25 KG (40 - 100 meals)</option>
                      <option>25 - 50 KG (100 - 200 meals)</option>
                      <option>50 - 100 KG (200 - 400 meals)</option>
                      <option>100+ KG (Large Commercial Events)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Food Holding & Storage Equipment
                    </label>
                    <select
                      value={storageType}
                      onChange={(e) => setStorageType(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-blue-500"
                    >
                      <option>Commercial Hot Chafing Tables (&gt; 60°C)</option>
                      <option>Walk-in Commercial Chiller (2°C - 4°C)</option>
                      <option>Deep Freezer (-18°C)</option>
                      <option>Ambient Insulated Dry Storage</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Kitchen Dispatch Bay / Pickup Address
                    </label>
                    <input
                      type="text"
                      required
                      value={pickupAddress}
                      onChange={(e) => setPickupAddress(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-blue-500"
                      placeholder="e.g. 100 Feet Road, Indiranagar, Bengaluru"
                    />
                  </div>
                </div>
              )}

              {/* 2. DRIVER DIFFERENTIATION */}
              {selectedRole === "DRIVER" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Vehicle Classification & Model
                    </label>
                    <select
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-emerald-500"
                    >
                      <option>Tata Nexon EV (Electric Car)</option>
                      <option>Ather 450X / Ola S1 (Cargo Electric Scooter)</option>
                      <option>Electric Cargo 3-Wheeler (Mahindra Treo)</option>
                      <option>Insulated EV Van (Tata Ace EV)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Vehicle License Plate Number
                    </label>
                    <input
                      type="text"
                      required
                      value={plateNumber}
                      onChange={(e) => setPlateNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-emerald-500"
                      placeholder="e.g. KA-01-EQ-8291"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Payload Capacity
                    </label>
                    <select
                      value={payloadCapacityKg}
                      onChange={(e) => setPayloadCapacityKg(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-emerald-500"
                    >
                      <option>40 KG (Mini EV Cargo)</option>
                      <option>85 KG (Standard Cargo)</option>
                      <option>150 KG (Heavy EV Cargo)</option>
                      <option>350 KG (Commercial Van Cargo)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Thermal Preservation Gear
                    </label>
                    <select
                      value={thermalEquipment}
                      onChange={(e) => setThermalEquipment(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-emerald-500"
                    >
                      <option>Insulated Heated Box (Maintains 65°C+)</option>
                      <option>Insulated Cool Box with Cold Gel Packs (4°C)</option>
                      <option>Digital Bluetooth Thermal Probe Included</option>
                      <option>Heavy-Duty Insulated Food Pouch</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Commercial Driving License
                    </label>
                    <input
                      type="text"
                      required
                      value={drivingLicense}
                      onChange={(e) => setDrivingLicense(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-emerald-500"
                      placeholder="e.g. DL-0420220019283"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Preferred Base Operating Zone
                    </label>
                    <select
                      value={operatingZone}
                      onChange={(e) => setOperatingZone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-emerald-500"
                    >
                      <option>East Bengaluru (Indiranagar / Koramangala)</option>
                      <option>Central Bengaluru (MG Road / Richmond Town)</option>
                      <option>South Bengaluru (Jayanagar / JP Nagar)</option>
                      <option>North Bengaluru (Hebbal / Yelahanka)</option>
                      <option>Tech Corridor (Whitefield / Bellandur)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* 3. RECIPIENT DIFFERENTIATION */}
              {selectedRole === "RECIPIENT" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Shelter / Facility Classification
                    </label>
                    <select
                      value={facilityType}
                      onChange={(e) => setFacilityType(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-purple-500"
                    >
                      <option>Night Shelter & Community Kitchen</option>
                      <option>Children Orphanage & Learning Center</option>
                      <option>Senior Citizen Care Home</option>
                      <option>Destitute Support & Relief Kitchen</option>
                      <option>Community Food Pantry</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Daily Beneficiary Meal Requirement
                    </label>
                    <select
                      value={dailyMealsNeeded}
                      onChange={(e) => setDailyMealsNeeded(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-purple-500"
                    >
                      <option>100 - 150 meals/day</option>
                      <option>150 - 250 meals/day</option>
                      <option>250 - 400 meals/day</option>
                      <option>500+ meals/day</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Safe Food Storage / Intake Capacity
                    </label>
                    <select
                      value={intakeCapacityKg}
                      onChange={(e) => setIntakeCapacityKg(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-purple-500"
                    >
                      <option>80 KG Storage</option>
                      <option>180 KG Storage</option>
                      <option>300 KG Storage</option>
                      <option>500+ KG Commercial Walk-in Chiller</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Receiving / Intake Operating Hours
                    </label>
                    <input
                      type="text"
                      required
                      value={receivingHours}
                      onChange={(e) => setReceivingHours(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-purple-500"
                      placeholder="e.g. 08:00 AM - 10:00 PM"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Unloading Bay / Gate Instructions
                    </label>
                    <input
                      type="text"
                      required
                      value={gateInstructions}
                      onChange={(e) => setGateInstructions(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-purple-500"
                      placeholder="e.g. Gate 2, Kitchen Receiving Dock on Left side"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Registration Action Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-400">
                Registering establishes your cryptographic record in the local ledger & routes you directly to your platform.
              </p>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl text-white font-black text-sm shadow-xl flex items-center justify-center gap-2.5 transition-all transform active:scale-95 disabled:opacity-50"
                style={{
                  backgroundColor:
                    selectedRole === "DONOR"
                      ? "#F59E0B"
                      : selectedRole === "DRIVER"
                      ? "#10B981"
                      : "#A855F7",
                }}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing Registration...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {selectedRole === "DONOR"
                        ? "Register & Enter Food Donor Section"
                        : selectedRole === "DRIVER"
                        ? "Register & Open Delivery Platform"
                        : "Register & Open Recipient Platform"}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
          </div>
        </div>

        {/* ============================================================ */}
        {/* BOX 2: SIGN IN SECTION (Frosted Glass Look + Permanent Admin) */}
        {/* ============================================================ */}
        <div
          id="login-section"
          className="rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-2xl bg-white/[0.04] border border-white/20"
          style={{
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
          }}
        >
          {/* Section Indicator Badge */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <span
                className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm text-white shadow-md bg-emerald-500"
              >
                2
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Sign In Section: Access Your Stakeholder Portal
                </h2>
                <p className="text-xs text-slate-300">
                  Select your role and enter your registered credentials to launch your operational dashboard
                </p>
              </div>
            </div>

            {/* Quick Demo Credentials Autofill */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] text-slate-400 font-medium">Quick Credentials:</span>
              <button
                type="button"
                onClick={() => {
                  setLoginRole("DONOR");
                  setLoginEmail("vikram@greenfork.com");
                  setLoginPassword("••••••••");
                }}
                className="px-2.5 py-1 rounded-lg text-xs font-bold text-amber-300 hover:text-white bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 transition-all"
              >
                🍱 Donor
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginRole("DRIVER");
                  setLoginEmail("rahul.driver@resqfood.org");
                  setLoginPassword("••••••••");
                }}
                className="px-2.5 py-1 rounded-lg text-xs font-bold text-emerald-300 hover:text-white bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 transition-all"
              >
                🚚 Driver
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginRole("RECIPIENT");
                  setLoginEmail("teresa@hopeshelter.org");
                  setLoginPassword("••••••••");
                }}
                className="px-2.5 py-1 rounded-lg text-xs font-bold text-purple-300 hover:text-white bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 transition-all"
              >
                🏠 Shelter
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginRole("ADMIN");
                  setLoginEmail("admin");
                  setLoginPassword("admin123");
                }}
                className="px-2.5 py-1 rounded-lg text-xs font-bold text-amber-300 hover:text-white bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 transition-all"
              >
                🛡️ Admin (admin/admin123)
              </button>
            </div>
          </div>

          {/* PERMANENT ADMIN CREDENTIALS BANNER */}
          <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">Permanent System Administrator Access</span>
                  <span className="text-[10px] bg-amber-400/20 text-amber-300 font-mono px-2 py-0.5 rounded-full font-bold">PERMANENT CREDENTIALS</span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Admin Username: <strong className="text-white font-mono bg-black/40 px-1.5 py-0.5 rounded">admin</strong> • Password: <strong className="text-white font-mono bg-black/40 px-1.5 py-0.5 rounded">admin123</strong>
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setLoginRole("ADMIN");
                setLoginEmail("admin");
                setLoginPassword("admin123");
                handleLaunchProfile("ADMIN");
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Instant Admin Login (admin / admin123)</span>
            </button>
          </div>

          {/* Role Selection Tabs for Sign In */}
          <div className="space-y-3 mb-6">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Step 1 • Select Your Account Role:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* DONOR TAB */}
              <button
                type="button"
                onClick={() => {
                  setLoginRole("DONOR");
                  if (!loginEmail || loginEmail.includes("@resqfood.org") || loginEmail.includes("teresa@")) {
                    setLoginEmail("vikram@greenfork.com");
                  }
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                  loginRole === "DONOR"
                    ? "bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/10 ring-1 ring-blue-500"
                    : "bg-slate-900/60 border-slate-700/80 text-slate-300 hover:border-slate-600 hover:bg-slate-900"
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${loginRole === "DONOR" ? "bg-blue-500 text-white" : "bg-slate-800 text-slate-400"}`}>
                  <Utensils className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black">Food Donor</div>
                  <div className="text-[10px] text-slate-400">Routes to /donor</div>
                </div>
              </button>

              {/* DRIVER TAB */}
              <button
                type="button"
                onClick={() => {
                  setLoginRole("DRIVER");
                  if (!loginEmail || loginEmail.includes("vikram@") || loginEmail.includes("teresa@") || loginEmail.includes("admin@")) {
                    setLoginEmail("rahul.driver@resqfood.org");
                  }
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                  loginRole === "DRIVER"
                    ? "bg-emerald-600/20 border-emerald-500 text-white shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500"
                    : "bg-slate-900/60 border-slate-700/80 text-slate-300 hover:border-slate-600 hover:bg-slate-900"
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${loginRole === "DRIVER" ? "bg-emerald-500 text-white" : "bg-slate-800 text-slate-400"}`}>
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black">Delivery Driver</div>
                  <div className="text-[10px] text-slate-400">Opens /driver</div>
                </div>
              </button>

              {/* RECIPIENT TAB */}
              <button
                type="button"
                onClick={() => {
                  setLoginRole("RECIPIENT");
                  if (!loginEmail || loginEmail.includes("vikram@") || loginEmail.includes("rahul.") || loginEmail.includes("admin@")) {
                    setLoginEmail("teresa@hopeshelter.org");
                  }
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                  loginRole === "RECIPIENT"
                    ? "bg-purple-600/20 border-purple-500 text-white shadow-lg shadow-purple-500/10 ring-1 ring-purple-500"
                    : "bg-slate-900/60 border-slate-700/80 text-slate-300 hover:border-slate-600 hover:bg-slate-900"
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${loginRole === "RECIPIENT" ? "bg-purple-500 text-white" : "bg-slate-800 text-slate-400"}`}>
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black">Recipient Shelter</div>
                  <div className="text-[10px] text-slate-400">Opens /recipient</div>
                </div>
              </button>

              {/* ADMIN TAB */}
              <button
                type="button"
                onClick={() => {
                  setLoginRole("ADMIN");
                  if (!loginEmail || loginEmail.includes("vikram@") || loginEmail.includes("rahul.") || loginEmail.includes("teresa@")) {
                    setLoginEmail("admin@resqfood.org");
                  }
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                  loginRole === "ADMIN"
                    ? "bg-amber-600/20 border-amber-500 text-white shadow-lg shadow-amber-500/10 ring-1 ring-amber-500"
                    : "bg-slate-900/60 border-slate-700/80 text-slate-300 hover:border-slate-600 hover:bg-slate-900"
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${loginRole === "ADMIN" ? "bg-amber-500 text-white" : "bg-slate-800 text-slate-400"}`}>
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black">City Operations</div>
                  <div className="text-[10px] text-slate-400">Opens /admin</div>
                </div>
              </button>
            </div>
          </div>

          {/* Sign In Form */}
          <form
            onSubmit={handleLoginSubmit}
            className="p-5 sm:p-6 rounded-2xl space-y-5 bg-slate-900/50 border border-slate-800"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Registered Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="name@organization.com"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="Enter password"
                  />
                </div>
              </div>
            </div>

            {/* Role Gateway Routing Notice */}
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between gap-3 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <span
                  className="w-2.5 h-2.5 rounded-full animate-pulse"
                  style={{
                    backgroundColor:
                      loginRole === "DONOR"
                        ? "#3B82F6"
                        : loginRole === "DRIVER"
                        ? "#10B981"
                        : loginRole === "RECIPIENT"
                        ? "#A855F7"
                        : "#F59E0B",
                  }}
                />
                <span>
                  Logging in as{" "}
                  <strong className="text-white">
                    {loginRole === "DONOR"
                      ? "Food Donor"
                      : loginRole === "DRIVER"
                      ? "Delivery Driver"
                      : loginRole === "RECIPIENT"
                      ? "Recipient Shelter"
                      : "City Admin"}
                  </strong>{" "}
                  routes you to{" "}
                  <code className="text-blue-300 bg-slate-900 px-1.5 py-0.5 rounded text-[11px]">
                    {loginRole === "DONOR"
                      ? "/donor"
                      : loginRole === "DRIVER"
                      ? "/driver"
                      : loginRole === "RECIPIENT"
                      ? "/recipient"
                      : "/admin"}
                  </code>{" "}
                  with only your role-specific navigation visible.
                </span>
              </div>
              <a
                href="#registration-section"
                className="text-xs text-blue-400 hover:text-blue-300 font-bold shrink-0 hidden sm:inline"
              >
                Register Account ↑
              </a>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
              <span className="text-[11px] text-slate-400">
                Encrypted session authentication with automatic role scoping.
              </span>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-black text-sm text-white shadow-xl flex items-center justify-center gap-2.5 transition-all hover:opacity-95 active:scale-95 disabled:opacity-50"
                style={{
                  backgroundColor:
                    loginRole === "DONOR"
                      ? "#1769FF"
                      : loginRole === "DRIVER"
                      ? "#10B981"
                      : loginRole === "RECIPIENT"
                      ? "#A855F7"
                      : "#F59E0B",
                }}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>
                      Sign In & Enter{" "}
                      {loginRole === "DONOR"
                        ? "Food Donor Section"
                        : loginRole === "DRIVER"
                        ? "Delivery Driver Platform"
                        : loginRole === "RECIPIENT"
                        ? "Recipient Shelter Platform"
                        : "City Admin Command"}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-slate-400 pt-4 flex flex-wrap items-center justify-center gap-6 border-t border-slate-800">
          <Link href="/" className="hover:text-white transition-colors">
            ← Back to RESQFOOD Home
          </Link>
          <span>•</span>
          <Link href="/donor" className="hover:text-blue-400 transition-colors">
            Food Donor Section
          </Link>
          <span>•</span>
          <Link href="/driver" className="hover:text-emerald-400 transition-colors">
            Delivery Driver Platform
          </Link>
          <span>•</span>
          <Link href="/recipient" className="hover:text-purple-400 transition-colors">
            Recipient Shelter Platform
          </Link>
          <span>•</span>
          <Link href="/admin" className="hover:text-amber-400 transition-colors">
            City Admin Command
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AuthPortal(props: AuthPortalProps) {
  return (
    <React.Suspense
      fallback={
        <div
          className="w-full py-16 text-center text-sm font-bold text-slate-300"
          style={{ backgroundColor: "#071626" }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-ping" />
            <span>Loading Stakeholder Registration & Login Gateway...</span>
          </div>
        </div>
      }
    >
      <AuthPortalContent {...props} />
    </React.Suspense>
  );
}

