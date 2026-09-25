"use client";

import React, { useState } from "react";
import {
  Award,
  Trophy,
  Coins,
  Utensils,
  Truck,
  Sparkles,
  QrCode,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  MapPin,
  Flame,
  Leaf,
  Clock,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { UserRole } from "@/lib/types";

interface LeaderboardAndTokenHubProps {
  currentRole?: UserRole;
}

export default function LeaderboardAndTokenHub({ currentRole = "DONOR" }: LeaderboardAndTokenHubProps) {
  const [activeTab, setActiveTab] = useState<"RESTAURANTS" | "DRIVERS" | "MARKETPLACE">("RESTAURANTS");
  const [userTokens, setUserTokens] = useState(380);
  const [tokenErrorMessage, setTokenErrorMessage] = useState<string | null>(null);
  const [redeemedVoucher, setRedeemedVoucher] = useState<{
    id: string;
    restaurant: string;
    item: string;
    code: string;
    tokensSpent: number;
  } | null>(null);

  // 1. Restaurant / Food Donor Leaderboard
  const restaurantRankings = [
    {
      rank: 1,
      name: "GreenFork Banquets & Kitchens",
      location: "100ft Rd, Indiranagar",
      meals: 1940,
      kgRescued: 485,
      tokensEarned: 1940,
      co2SavedKg: 1212,
      tier: "Platinum Champion",
      tierColor: "bg-purple-100 text-purple-700 border-purple-300",
      avatar: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100",
    },
    {
      rank: 2,
      name: "Adiga Grand Heritage Kitchen",
      location: "9th Block, Jayanagar",
      meals: 1640,
      kgRescued: 410,
      tokensEarned: 1640,
      co2SavedKg: 1025,
      tier: "Gold Partner",
      tierColor: "bg-amber-100 text-amber-800 border-amber-300",
      avatar: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100",
    },
    {
      rank: 3,
      name: "Toit Kitchens & Brewpub",
      location: "100 Feet Rd, Indiranagar",
      meals: 1360,
      kgRescued: 340,
      tokensEarned: 1360,
      co2SavedKg: 850,
      tier: "Gold Partner",
      tierColor: "bg-amber-100 text-amber-800 border-amber-300",
      avatar: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=100",
    },
    {
      rank: 4,
      name: "Empire Gourmet Koramangala",
      location: "80 Feet Rd, Koramangala",
      meals: 1160,
      kgRescued: 290,
      tokensEarned: 1160,
      co2SavedKg: 725,
      tier: "Silver Partner",
      tierColor: "bg-slate-100 text-slate-700 border-slate-300",
      avatar: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=100",
    },
    {
      rank: 5,
      name: "Vidyarthi Bhavan indiranagar Kitchen",
      location: "CMH Road, Indiranagar",
      meals: 980,
      kgRescued: 245,
      tokensEarned: 980,
      co2SavedKg: 612,
      tier: "Bronze Partner",
      tierColor: "bg-orange-100 text-orange-800 border-orange-300",
      avatar: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=100",
    },
  ];

  // 2. Delivery Partner / Courier Leaderboard
  const driverRankings = [
    {
      rank: 1,
      name: "Rahul Sharma",
      vehicle: "Tata Nexon EV • DL-04-E-8291",
      rescuesCompleted: 48,
      evKm: 365,
      tokensEarned: 480,
      badge: "Fleet Leader",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100",
    },
    {
      rank: 2,
      name: "Priya Nair",
      vehicle: "Ather 450X EV Scooter",
      rescuesCompleted: 41,
      evKm: 310,
      tokensEarned: 410,
      badge: "Express Courier",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
    },
    {
      rank: 3,
      name: "Farooq Ahmed",
      vehicle: "Mahindra Treo EV Cargo",
      rescuesCompleted: 37,
      evKm: 280,
      tokensEarned: 370,
      badge: "Heavy Cargo Hero",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    },
    {
      rank: 4,
      name: "Amit Verma",
      vehicle: "Tata Ace EV Van",
      rescuesCompleted: 32,
      evKm: 245,
      tokensEarned: 320,
      badge: "Night Relief Star",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
    },
  ];

  // 3. Redeemable Partner Vouchers for Delivery Couriers
  const restaurantVouchers = [
    {
      id: "vouch-1",
      restaurant: "GreenFork Restaurant & Banquets",
      item: "Executive South Indian Hot Thali + Sweet",
      costTokens: 40,
      availableAt: "100ft Road, Indiranagar",
      validHours: "12:00 PM - 10:30 PM",
      category: "Full Meal",
      badgeColor: "bg-emerald-500",
    },
    {
      id: "vouch-2",
      restaurant: "Adiga Grand Heritage Kitchen",
      item: "Ghee Roast Masala Dosa + Special Filter Coffee",
      costTokens: 25,
      availableAt: "Jayanagar 9th Block",
      validHours: "07:30 AM - 09:00 PM",
      category: "Snack & Drink",
      badgeColor: "bg-amber-500",
    },
    {
      id: "vouch-3",
      restaurant: "Empire Gourmet Kitchens",
      item: "High-Protein Rice Bowl + Cold Pressed Juice",
      costTokens: 50,
      availableAt: "Koramangala 80ft Road",
      validHours: "11:00 AM - 11:00 PM",
      category: "Power Combo",
      badgeColor: "bg-blue-500",
    },
    {
      id: "vouch-4",
      restaurant: "Toit Kitchens",
      item: "Artisanal Woodfired Flatbread & Cooler",
      costTokens: 60,
      availableAt: "Indiranagar 100ft Road",
      validHours: "01:00 PM - 09:00 PM",
      category: "Chef Special",
      badgeColor: "bg-purple-500",
    },
  ];

  const handleRedeemVoucher = (v: typeof restaurantVouchers[0]) => {
    if (userTokens < v.costTokens) {
      setTokenErrorMessage(`Insufficient tokens! You need ${v.costTokens} tokens (Balance: ${userTokens}). Complete more verified rescue deliveries to earn tokens.`);
      setTimeout(() => setTokenErrorMessage(null), 4000);
      return;
    }
    setTokenErrorMessage(null);
    const spent = v.costTokens;
    setUserTokens((prev) => prev - spent);
    const code = `HP-DINE-${Math.floor(1000 + Math.random() * 9000)}`;
    setRedeemedVoucher({
      id: v.id,
      restaurant: v.restaurant,
      item: v.item,
      code,
      tokensSpent: spent,
    });
  };

  return (
    <div className="space-y-6">
      {/* Hero Token HUD */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-amber-500 via-orange-600 to-emerald-600 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black tracking-wide text-white">
              <Coins className="w-3.5 h-3.5 text-amber-200" />
              <span>HopePlate Token Economy & Restaurant Network</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Community Leaderboard & Token Vouchers
            </h2>
            <p className="text-sm text-amber-100 max-w-xl">
              Nearby restaurants earn Green Impact Tokens for donating surplus. Delivery partners earn Meal Tokens on verified rescues and can redeem them for free hot meals at participating restaurants!
            </p>
          </div>

          {/* Token Wallet Card */}
          <div className="p-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center gap-4 shrink-0 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-black text-xl shadow-md">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-amber-100 uppercase tracking-wider">
                Your Token Balance
              </div>
              <div className="text-2xl font-black text-white">{userTokens} Tokens</div>
              <div className="text-[10px] text-emerald-200 font-semibold">
                ✓ Redeemable at 12 Nearby Kitchens
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Insufficient Tokens Warning Banner */}
      {tokenErrorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-300 text-red-900 shadow-md flex items-center gap-3 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <span className="text-xs font-bold">{tokenErrorMessage}</span>
        </div>
      )}

      {/* Redeemed Voucher Success Banner */}
      {redeemedVoucher && (
        <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-emerald-950 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-black text-sm text-emerald-900">
                🎉 Voucher Generated: {redeemedVoucher.item}
              </div>
              <p className="text-xs text-emerald-700">
                Show this digital voucher code to the cashier at <strong>{redeemedVoucher.restaurant}</strong> for your free meal!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-2 rounded-xl bg-white border border-emerald-300 font-mono font-black text-base text-emerald-800 tracking-wider">
              {redeemedVoucher.code}
            </div>
            <button
              onClick={() => setRedeemedVoucher(null)}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-800 underline"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-resq-border pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("RESTAURANTS")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === "RESTAURANTS"
              ? "bg-amber-500 text-white shadow-md"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>Nearby Restaurants Leaderboard</span>
        </button>

        <button
          onClick={() => setActiveTab("DRIVERS")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === "DRIVERS"
              ? "bg-emerald-600 text-white shadow-md"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Delivery Partners Leaderboard</span>
        </button>

        <button
          onClick={() => setActiveTab("MARKETPLACE")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === "MARKETPLACE"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Coins className="w-4 h-4" />
          <span>Redeem Tokens for Meals (Delivery Partners)</span>
        </button>
      </div>

      {/* TAB 1: RESTAURANT LEADERBOARD */}
      {activeTab === "RESTAURANTS" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-resq-navy uppercase tracking-wider">
              Top Donating Restaurants & Commercial Kitchens (Bengaluru East Corridor)
            </h3>
            <span className="text-xs text-slate-500">Updated Real-Time • Based on verified intake logs</span>
          </div>

          <div className="bg-white rounded-3xl border border-resq-border shadow-sm overflow-hidden divide-y divide-slate-100">
            {restaurantRankings.map((r) => (
              <div
                key={r.rank}
                className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shrink-0 ${
                      r.rank === 1
                        ? "bg-amber-400 text-amber-950 shadow-md ring-2 ring-amber-300"
                        : r.rank === 2
                        ? "bg-slate-200 text-slate-800"
                        : r.rank === 3
                        ? "bg-orange-200 text-orange-900"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    #{r.rank}
                  </div>

                  <img
                    src={r.avatar}
                    alt={r.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shrink-0"
                  />

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-black text-resq-navy">{r.name}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${r.tierColor}`}>
                        {r.tier}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{r.location}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 self-end sm:self-auto flex-wrap">
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-400">Total Donated</div>
                    <div className="text-sm font-black text-resq-navy">{r.kgRescued} KG ({r.meals} Meals)</div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-400">Carbon Prevented</div>
                    <div className="text-sm font-black text-emerald-600 flex items-center gap-1 justify-end">
                      <Leaf className="w-3.5 h-3.5" />
                      <span>{r.co2SavedKg} kg CO₂</span>
                    </div>
                  </div>

                  <div className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-right">
                    <div className="text-[10px] font-bold uppercase text-amber-700">Tokens Earned</div>
                    <div className="text-sm font-black flex items-center gap-1 justify-end">
                      <Coins className="w-3.5 h-3.5 text-amber-600" />
                      <span>{r.tokensEarned}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: DELIVERY PARTNER LEADERBOARD */}
      {activeTab === "DRIVERS" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-resq-navy uppercase tracking-wider">
              Top Rescue Delivery Partners (Zero-Emission Fleet)
            </h3>
            <span className="text-xs text-slate-500">Ranked by verified OTP delivery handoffs</span>
          </div>

          <div className="bg-white rounded-3xl border border-resq-border shadow-sm overflow-hidden divide-y divide-slate-100">
            {driverRankings.map((d) => (
              <div
                key={d.rank}
                className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shrink-0 ${
                      d.rank === 1
                        ? "bg-emerald-500 text-white shadow-md ring-2 ring-emerald-300"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    #{d.rank}
                  </div>

                  <img
                    src={d.avatar}
                    alt={d.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shrink-0"
                  />

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-resq-navy">{d.name}</h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {d.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{d.vehicle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 self-end sm:self-auto flex-wrap">
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-400">Rescues Verified</div>
                    <div className="text-sm font-black text-resq-navy">{d.rescuesCompleted} Completed</div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-400">EV Clean Distance</div>
                    <div className="text-sm font-black text-emerald-600">{d.evKm} KM Traveled</div>
                  </div>

                  <div className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-right">
                    <div className="text-[10px] font-bold uppercase text-emerald-700">Meal Tokens</div>
                    <div className="text-sm font-black flex items-center gap-1 justify-end">
                      <Coins className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{d.tokensEarned}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: TOKEN MARKETPLACE */}
      {activeTab === "MARKETPLACE" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-resq-navy uppercase tracking-wider">
                Restaurant Partner Token Redemption Marketplace
              </h3>
              <p className="text-xs text-slate-500">
                Delivery drivers can exchange earned tokens for hot meals, refreshments, and beverages at participating restaurants.
              </p>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-bold text-xs flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-amber-600" />
              <span>Balance: {userTokens} Tokens</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {restaurantVouchers.map((v) => (
              <div
                key={v.id}
                className="p-5 rounded-3xl bg-white border border-resq-border shadow-sm flex flex-col justify-between hover:shadow-md transition-all space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <Utensils className="w-3.5 h-3.5 text-amber-500" />
                      <span>{v.restaurant}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase text-white bg-amber-500">
                      {v.category}
                    </span>
                  </div>

                  <h4 className="text-base font-black text-resq-navy">{v.item}</h4>

                  <div className="space-y-1 text-xs text-slate-500 mt-2">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{v.availableAt}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Valid: {v.validHours}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm font-black text-amber-600">
                    <Coins className="w-4 h-4" />
                    <span>{v.costTokens} Tokens</span>
                  </div>

                  <button
                    onClick={() => handleRedeemVoucher(v)}
                    disabled={userTokens < v.costTokens}
                    className="px-4 py-2 rounded-xl bg-resq-navy hover:bg-resq-navy-dark disabled:opacity-40 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all active:scale-95"
                  >
                    <span>Redeem Voucher</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
