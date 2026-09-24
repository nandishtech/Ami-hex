"use client";

import React, { useState, useEffect, Suspense } from "react";
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
} from "lucide-react";
import { UserRole } from "@/lib/types";
import { DEMO_USERS, registerUser, setActiveSession, getRoleRedirectPath } from "@/lib/auth";

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultMode = searchParams.get("mode") === "register" ? "REGISTER" : "LOGIN";
  const defaultRole = (searchParams.get("role")?.toUpperCase() as UserRole) || "DONOR";

  const [mode, setMode] = useState<"LOGIN" | "REGISTER">(defaultMode);
  const [selectedRole, setSelectedRole] = useState<UserRole>(defaultRole);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Common fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("••••••••");
  const [phone, setPhone] = useState("+91 98450 12839");
  const [organizationName, setOrganizationName] = useState("");

  // Role-specific fields: DONOR
  const [fssaiLicense, setFssaiLicense] = useState("FSSAI-11223344556677");
  const [kitchenType, setKitchenType] = useState("Restaurant & Banquet Hall");
  const [dailySurplusKg, setDailySurplusKg] = useState("30-50 KG");
  const [storageType, setStorageType] = useState("Commercial Hot Chafing Tables (>60°C)");
  const [pickupAddress, setPickupAddress] = useState("100 Feet Road, Indiranagar, Bengaluru");

  // Role-specific fields: DRIVER
  const [vehicleType, setVehicleType] = useState("Tata Nexon EV (Electric Car)");
  const [plateNumber, setPlateNumber] = useState("KA-01-EQ-8291");
  const [payloadCapacityKg, setPayloadCapacityKg] = useState("85");
  const [thermalEquipment, setThermalEquipment] = useState("Insulated Heated Cargo Box (68°C)");
  const [drivingLicense, setDrivingLicense] = useState("DL-0420220019283");
  const [operatingZone, setOperatingZone] = useState("East Bengaluru (Indiranagar / Koramangala)");

  // Role-specific fields: RECIPIENT SHELTER
  const [facilityType, setFacilityType] = useState("Night Shelter & Community Kitchen");
  const [dailyMealsNeeded, setDailyMealsNeeded] = useState("200 meals daily");
  const [intakeCapacityKg, setIntakeCapacityKg] = useState("180");
  const [receivingHours, setReceivingHours] = useState("08:00 AM - 10:00 PM");
  const [gateInstructions, setGateInstructions] = useState("Gate 2, Kitchen Receiving Dock on Left");

  // Role-specific fields: ADMIN
  const [department, setDepartment] = useState("Metropolitan Urban Food & Waste Authority");
  const [jurisdiction, setJurisdiction] = useState("Bengaluru City Central Sector");
  const [staffId, setStaffId] = useState("BBMP-RESQ-991");

  // Update default placeholders when role changes in register mode
  useEffect(() => {
    if (selectedRole === "DONOR") {
      setName("Chef Vikram Adiga");
      setEmail("vikram@greenfork.com");
      setOrganizationName("GreenFork Restaurant & Banquets");
    } else if (selectedRole === "DRIVER") {
      setName("Rahul Sharma");
      setEmail("rahul.driver@resqfood.org");
      setOrganizationName("Independent Green Courier");
    } else if (selectedRole === "RECIPIENT") {
      setName("Sister Teresa Mathews");
      setEmail("teresa@hopeshelter.org");
      setOrganizationName("Hope Community Shelter & Kitchen");
    } else if (selectedRole === "ADMIN") {
      setName("Dr. Aarti Raman");
      setEmail("admin@resqfood.org");
      setOrganizationName("Metropolitan Rescue Logistics");
    }
  }, [selectedRole]);

  // Handle Instant Demo Login
  const handleQuickDemoLogin = (role: UserRole) => {
    setIsLoading(true);
    setErrorMessage(null);
    const demoUser = DEMO_USERS[role];
    setActiveSession(demoUser);
    setSuccessMessage(`Welcome back, ${demoUser.name}! Routing to your portal...`);

    setTimeout(() => {
      const redirectPath = getRoleRedirectPath(role);
      router.push(redirectPath);
    }, 900);
  };

  // Handle Standard Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role: selectedRole }),
      });

      const data = await res.json();
      if (data.success && data.user) {
        setActiveSession(data.user);
        setSuccessMessage(`Authenticated as ${data.user.name}. Redirecting...`);
        setTimeout(() => {
          router.push(data.redirectPath || getRoleRedirectPath(data.user.role));
        }, 900);
      } else {
        setErrorMessage(data.message || "Invalid credentials.");
        setIsLoading(false);
      }
    } catch (err: any) {
      // Fallback direct login
      const fallbackUser = DEMO_USERS[selectedRole];
      setActiveSession(fallbackUser);
      setSuccessMessage(`Welcome back, ${fallbackUser.name}!`);
      setTimeout(() => {
        router.push(getRoleRedirectPath(selectedRole));
      }, 900);
    }
  };

  // Handle Full Registration
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
      payloadCapacityKg: Number(payloadCapacityKg) || 85,
      thermalEquipment,
      drivingLicense,
      operatingZone,
      facilityType,
      dailyMealsNeeded,
      intakeCapacityKg: Number(intakeCapacityKg) || 180,
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

        setSuccessMessage(`Account created for ${data.user.name}! Entering ${selectedRole} Command...`);
        setTimeout(() => {
          router.push(data.redirectPath || getRoleRedirectPath(selectedRole));
        }, 1200);
      } else {
        setErrorMessage(data.message || "Registration encountered an issue.");
        setIsLoading(false);
      }
    } catch (err) {
      // Fallback register
      const localUser = registerUser({
        name,
        email,
        role: selectedRole,
        organizationName,
        phone,
        details: payload,
      });

      setSuccessMessage(`Registration complete! Welcome, ${localUser.name}.`);
      setTimeout(() => {
        router.push(getRoleRedirectPath(selectedRole));
      }, 1000);
    }
  };

  return (
    <div className="min-h-[92vh] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-slate-900 via-resq-navy to-[#07192d] text-white">
      <div className="w-full max-w-4xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-resq-blue to-resq-green flex items-center justify-center text-white font-black text-base shadow-glow">
              RQ
            </div>
            <span className="text-2xl font-black tracking-tight text-white group-hover:text-resq-green-bright transition-colors">
              RESQFOOD
            </span>
          </Link>
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            Unified Stakeholder Authentication & Operational Gate
          </p>
        </div>

        {/* Success / Error Banners */}
        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center gap-3 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs font-bold flex items-center gap-3 animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Main Card Container */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl text-slate-900">
          {/* Top Switcher: REGISTER vs LOGIN */}
          <div className="flex p-1.5 bg-slate-100 rounded-2xl mb-8">
            <button
              onClick={() => {
                setMode("REGISTER");
                setErrorMessage(null);
              }}
              className={`flex-1 py-3 rounded-xl text-xs sm:text-sm font-black transition-all ${
                mode === "REGISTER"
                  ? "bg-resq-navy text-white shadow-md scale-[1.01]"
                  : "text-slate-600 hover:text-resq-navy"
              }`}
            >
              1. REGISTER NEW ACCOUNT
            </button>
            <button
              onClick={() => {
                setMode("LOGIN");
                setErrorMessage(null);
              }}
              className={`flex-1 py-3 rounded-xl text-xs sm:text-sm font-black transition-all ${
                mode === "LOGIN"
                  ? "bg-resq-blue text-white shadow-md scale-[1.01]"
                  : "text-slate-600 hover:text-resq-navy"
              }`}
            >
              2. SIGN IN / QUICK LOGIN
            </button>
          </div>

          {/* Role Picker Banner (4 Interactive Cards) */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                Select Your Operational Stakeholder Role:
              </span>
              <span className="text-[11px] text-resq-blue font-bold">
                Automated Role-Based Routing
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Role 1: DONOR */}
              <div
                onClick={() => setSelectedRole("DONOR")}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedRole === "DONOR"
                    ? "border-resq-blue bg-blue-50/80 shadow-md ring-2 ring-resq-blue/20"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="p-2 rounded-xl bg-blue-100 text-resq-blue">
                    <Utensils className="w-5 h-5" />
                  </span>
                  {selectedRole === "DONOR" && (
                    <span className="w-2 h-2 rounded-full bg-resq-blue animate-ping" />
                  )}
                </div>
                <h4 className="text-sm font-black text-resq-navy">Food Donor</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                  Restaurants, banquets, hotels, bakeries & caterers.
                </p>
                <span className="mt-2 inline-block text-[10px] font-bold text-resq-blue bg-blue-100/60 px-2 py-0.5 rounded-full">
                  Routes to /donor
                </span>
              </div>

              {/* Role 2: DRIVER */}
              <div
                onClick={() => setSelectedRole("DRIVER")}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedRole === "DRIVER"
                    ? "border-resq-green bg-emerald-50/80 shadow-md ring-2 ring-resq-green/20"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="p-2 rounded-xl bg-emerald-100 text-resq-green">
                    <Truck className="w-5 h-5" />
                  </span>
                  {selectedRole === "DRIVER" && (
                    <span className="w-2 h-2 rounded-full bg-resq-green animate-ping" />
                  )}
                </div>
                <h4 className="text-sm font-black text-emerald-950">Rescue Driver</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                  Electric vehicles, courier vans, volunteer fleets.
                </p>
                <span className="mt-2 inline-block text-[10px] font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-full">
                  Routes to /driver
                </span>
              </div>

              {/* Role 3: RECIPIENT */}
              <div
                onClick={() => setSelectedRole("RECIPIENT")}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedRole === "RECIPIENT"
                    ? "border-purple-600 bg-purple-50/80 shadow-md ring-2 ring-purple-500/20"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
                    <HeartHandshake className="w-5 h-5" />
                  </span>
                  {selectedRole === "RECIPIENT" && (
                    <span className="w-2 h-2 rounded-full bg-purple-600 animate-ping" />
                  )}
                </div>
                <h4 className="text-sm font-black text-purple-950">Shelter / NGO</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                  Night shelters, soup kitchens, orphanages, food banks.
                </p>
                <span className="mt-2 inline-block text-[10px] font-bold text-purple-700 bg-purple-100/60 px-2 py-0.5 rounded-full">
                  Routes to /recipient
                </span>
              </div>

              {/* Role 4: ADMIN */}
              <div
                onClick={() => setSelectedRole("ADMIN")}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedRole === "ADMIN"
                    ? "border-amber-500 bg-amber-50/80 shadow-md ring-2 ring-amber-500/20"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="p-2 rounded-xl bg-amber-100 text-amber-700">
                    <ShieldCheck className="w-5 h-5" />
                  </span>
                  {selectedRole === "ADMIN" && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  )}
                </div>
                <h4 className="text-sm font-black text-amber-950">City Command</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                  Municipal authorities, regulators & audit supervisors.
                </p>
                <span className="mt-2 inline-block text-[10px] font-bold text-amber-700 bg-amber-100/60 px-2 py-0.5 rounded-full">
                  Routes to /admin
                </span>
              </div>
            </div>
          </div>

          {/* ===================== MODE 1: REGISTRATION ===================== */}
          {mode === "REGISTER" && (
            <form onSubmit={handleRegisterSubmit} className="space-y-5 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black text-resq-navy flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-resq-gold" />
                    Required Profile Parameters for {selectedRole}:
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedRole === "DONOR") {
                        setName("Chef Vikram Adiga");
                        setEmail("vikram@greenfork.com");
                        setOrganizationName("GreenFork Restaurant & Banquets");
                        setFssaiLicense("FSSAI-11223344556677");
                        setDailySurplusKg("30-50 KG");
                      } else if (selectedRole === "DRIVER") {
                        setName("Rahul Sharma");
                        setEmail("rahul.driver@resqfood.org");
                        setVehicleType("Tata Nexon EV (Electric Car)");
                        setPlateNumber("KA-01-EQ-8291");
                      } else if (selectedRole === "RECIPIENT") {
                        setName("Sister Teresa Mathews");
                        setEmail("teresa@hopeshelter.org");
                        setOrganizationName("Hope Community Shelter");
                        setIntakeCapacityKg("180");
                      } else {
                        setName("Dr. Aarti Raman");
                        setEmail("admin@resqfood.org");
                        setOrganizationName("Metropolitan Rescue Authority");
                      }
                    }}
                    className="text-[11px] font-bold text-resq-blue hover:underline"
                  >
                    ⚡ Auto-fill Demo {selectedRole}
                  </button>
                </div>

                {/* Common Identity Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      {selectedRole === "DRIVER" ? "Driver Full Name" : "Contact Person / Lead Officer"}
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Chef Vikram Adiga"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-resq-blue font-semibold text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Work / Official Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. vikram@greenfork.com"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-resq-blue font-semibold text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Phone Number (SMS / OTP alerts)
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98450 12839"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-resq-blue font-semibold text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      {selectedRole === "DRIVER" ? "Affiliated Fleet / Co-op" : "Organization / Facility Name"}
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={organizationName}
                        onChange={(e) => setOrganizationName(e.target.value)}
                        placeholder="e.g. GreenFork Restaurant & Banquets"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-resq-blue font-semibold text-slate-800"
                      />
                    </div>
                  </div>
                </div>

                {/* ROLE-SPECIFIC DIFFERENTIATING FIELDS */}
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <span className="text-[11px] font-black uppercase text-slate-400 block mb-2">
                    Role Verification & Capacity Specifics:
                  </span>

                  {/* 1. DONOR SPECIFIC FIELDS */}
                  {selectedRole === "DONOR" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          FSSAI Food License / Registration #
                        </label>
                        <input
                          type="text"
                          required
                          value={fssaiLicense}
                          onChange={(e) => setFssaiLicense(e.target.value)}
                          placeholder="FSSAI-11223344556677"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          Kitchen Category
                        </label>
                        <select
                          value={kitchenType}
                          onChange={(e) => setKitchenType(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold bg-white"
                        >
                          <option>Fine Dining & Restaurant</option>
                          <option>Banquet & Wedding Hall</option>
                          <option>Artisan Bakery & Cafe</option>
                          <option>Corporate Tech Cafeteria</option>
                          <option>Supermarket Produce Hub</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          Average Daily Surplus Volume
                        </label>
                        <input
                          type="text"
                          value={dailySurplusKg}
                          onChange={(e) => setDailySurplusKg(e.target.value)}
                          placeholder="30-50 KG / day"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          Storage & Thermal Holding Gear
                        </label>
                        <input
                          type="text"
                          value={storageType}
                          onChange={(e) => setStorageType(e.target.value)}
                          placeholder="Commercial Hot Chafing Tables (>60°C)"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="font-bold text-slate-700 block mb-1">
                          Physical Kitchen Pickup Address (for EV Drivers)
                        </label>
                        <input
                          type="text"
                          value={pickupAddress}
                          onChange={(e) => setPickupAddress(e.target.value)}
                          placeholder="100 Feet Road, Indiranagar, Bengaluru"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold"
                        />
                      </div>
                    </div>
                  )}

                  {/* 2. DRIVER SPECIFIC FIELDS */}
                  {selectedRole === "DRIVER" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          Electric Vehicle Model & Type
                        </label>
                        <select
                          value={vehicleType}
                          onChange={(e) => setVehicleType(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold bg-white"
                        >
                          <option>Tata Nexon EV (Electric Car)</option>
                          <option>Piaggio Ape E-Xtra (3-Wheeler Auto)</option>
                          <option>Mahindra Electric Cargo Van</option>
                          <option>Ather / Ola Electric Scooter</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          Vehicle License Plate Number
                        </label>
                        <input
                          type="text"
                          required
                          value={plateNumber}
                          onChange={(e) => setPlateNumber(e.target.value)}
                          placeholder="KA-01-EQ-8291"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          Max Payload Capacity (KG)
                        </label>
                        <input
                          type="number"
                          value={payloadCapacityKg}
                          onChange={(e) => setPayloadCapacityKg(e.target.value)}
                          placeholder="85"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          Thermal Transit Equipment
                        </label>
                        <input
                          type="text"
                          value={thermalEquipment}
                          onChange={(e) => setThermalEquipment(e.target.value)}
                          placeholder="Insulated Heated Cargo Box (68°C)"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          Driver License Number
                        </label>
                        <input
                          type="text"
                          value={drivingLicense}
                          onChange={(e) => setDrivingLicense(e.target.value)}
                          placeholder="DL-0420220019283"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          Preferred Operating Sector
                        </label>
                        <input
                          type="text"
                          value={operatingZone}
                          onChange={(e) => setOperatingZone(e.target.value)}
                          placeholder="East Bengaluru (Indiranagar / Koramangala)"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold"
                        />
                      </div>
                    </div>
                  )}

                  {/* 3. RECIPIENT SHELTER SPECIFIC FIELDS */}
                  {selectedRole === "RECIPIENT" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          Facility Type
                        </label>
                        <select
                          value={facilityType}
                          onChange={(e) => setFacilityType(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold bg-white"
                        >
                          <option>Night Shelter & Community Kitchen</option>
                          <option>Soup Kitchen & Food Pantry</option>
                          <option>Children Foster Home</option>
                          <option>Senior Citizen Nutrition Center</option>
                          <option>Regional Food Bank Redistribution</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          Certified Intake Storage Capacity (KG)
                        </label>
                        <input
                          type="number"
                          value={intakeCapacityKg}
                          onChange={(e) => setIntakeCapacityKg(e.target.value)}
                          placeholder="180"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          Daily Resident Meals Served
                        </label>
                        <input
                          type="text"
                          value={dailyMealsNeeded}
                          onChange={(e) => setDailyMealsNeeded(e.target.value)}
                          placeholder="200 meals daily"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          Receiving Dock Hours
                        </label>
                        <input
                          type="text"
                          value={receivingHours}
                          onChange={(e) => setReceivingHours(e.target.value)}
                          placeholder="08:00 AM - 10:00 PM"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="font-bold text-slate-700 block mb-1">
                          Delivery Gate Unloading Instructions
                        </label>
                        <input
                          type="text"
                          value={gateInstructions}
                          onChange={(e) => setGateInstructions(e.target.value)}
                          placeholder="Gate 2, Kitchen Receiving Dock on Left"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold"
                        />
                      </div>
                    </div>
                  )}

                  {/* 4. ADMIN SPECIFIC FIELDS */}
                  {selectedRole === "ADMIN" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          Municipal Department
                        </label>
                        <input
                          type="text"
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          placeholder="Metropolitan Urban Food & Waste Authority"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          Jurisdiction Sector
                        </label>
                        <input
                          type="text"
                          value={jurisdiction}
                          onChange={(e) => setJurisdiction(e.target.value)}
                          placeholder="Bengaluru City Central Sector"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-2xl bg-resq-navy hover:bg-resq-navy-dark text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all disabled:opacity-50"
              >
                <span>
                  {isLoading
                    ? "CREATING ACCOUNT & PROVISIONING ROLE..."
                    : `REGISTER & OPEN ${selectedRole} DASHBOARD →`}
                </span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          )}

          {/* ===================== MODE 2: LOGIN ===================== */}
          {mode === "LOGIN" && (
            <div className="space-y-6 animate-in fade-in">
              {/* Quick 1-Click Role Direct Login Cards */}
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-slate-500 block mb-3">
                  Instant 1-Click Persona Login (Pre-Configured Environments):
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin("DONOR")}
                    className="p-4 rounded-2xl border border-resq-border hover:border-resq-blue bg-slate-50 hover:bg-blue-50/60 text-left transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 text-resq-blue flex items-center justify-center font-bold">
                        <Utensils className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-resq-navy group-hover:text-resq-blue">
                          Chef Vikram Adiga
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          GreenFork Restaurant • Donor Command
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-resq-blue group-hover:translate-x-1 transition-all" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin("DRIVER")}
                    className="p-4 rounded-2xl border border-resq-border hover:border-resq-green bg-slate-50 hover:bg-emerald-50/60 text-left transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-resq-green flex items-center justify-center font-bold">
                        <Truck className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-emerald-950 group-hover:text-resq-green">
                          Rahul Sharma
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Tata Nexon EV • Driver Radar
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-resq-green group-hover:translate-x-1 transition-all" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin("RECIPIENT")}
                    className="p-4 rounded-2xl border border-resq-border hover:border-purple-600 bg-slate-50 hover:bg-purple-50/60 text-left transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                        <HeartHandshake className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-purple-950 group-hover:text-purple-600">
                          Sister Teresa Mathews
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Hope Shelter • Intake Terminal
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin("ADMIN")}
                    className="p-4 rounded-2xl border border-resq-border hover:border-amber-500 bg-slate-50 hover:bg-amber-50/60 text-left transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-amber-950 group-hover:text-amber-600">
                          City Ops Command
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Metropolitan Radar & Fleet Command
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
                  </button>
                </div>
              </div>

              {/* Standard Credentials Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4 pt-4 border-t border-slate-200">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500 block">
                  Or Sign In With Email & Password:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Account Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. vikram@greenfork.com"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-resq-blue"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Security Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-resq-blue"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 rounded-2xl bg-resq-blue hover:bg-resq-blue-hover text-white font-black text-sm flex items-center justify-center gap-2 shadow-glow active:scale-95 transition-all disabled:opacity-50"
                >
                  <span>
                    {isLoading ? "AUTHENTICATING..." : `SIGN IN AS ${selectedRole} →`}
                  </span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white font-bold text-sm">
          Loading Authentication Portal...
        </div>
      }
    >
      <AuthContent />
    </Suspense>
  );
}
