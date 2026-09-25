"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Heart, Utensils } from "lucide-react";

export default function BreadDonationAnimation() {
  const [step, setStep] = useState<number>(0);
  const [isPaused, setIsPaused] = useState(false);

  // 4-phase storytelling loop:
  // 0: Knife slicing bread on cutting board
  // 1: Hand lifting the fresh warm slice of bread
  // 2: Extending hand across to give bread to recipient hands
  // 3: Warm bread received in hands with rising heart glow
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % 4);
    }, 2800);
    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <div
      className="relative w-full max-w-xl mx-auto rounded-3xl p-5 sm:p-6 overflow-hidden transition-all duration-500 backdrop-blur-xl bg-white/[0.05] border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]"
      style={{
        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Ambient background glows */}
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Badge */}
      <div className="flex items-center justify-between gap-3 mb-3 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
          <Heart className="w-3.5 h-3.5 fill-amber-400 text-amber-400 animate-pulse" />
          <span>Charity Food Action • Slicing & Sharing Bread</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Step {step + 1} of 4</span>
        </div>
      </div>

      {/* Main Animated SVG Canvas */}
      <div className="relative w-full h-56 sm:h-64 flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/60 to-slate-950/80 border border-white/10 z-10">
        <svg
          viewBox="0 0 600 320"
          className="w-full h-full select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="loafGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#D97706" />
              <stop offset="50%" stopColor="#B45309" />
              <stop offset="100%" stopColor="#78350F" />
            </linearGradient>

            <linearGradient id="crustGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>

            <linearGradient id="sliceGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FEF3C7" />
              <stop offset="60%" stopColor="#FDE68A" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>

            <linearGradient id="donorHandGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#EA580C" />
              <stop offset="100%" stopColor="#C2410C" />
            </linearGradient>

            <linearGradient id="poorHandGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#0369A1" />
            </linearGradient>

            <linearGradient id="knifeBlade" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="50%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#94A3B8" />
            </linearGradient>

            <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Table / Surface Line */}
          <line
            x1="40"
            y1="250"
            x2="560"
            y2="250"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="3"
            strokeDasharray="6 6"
          />

          {/* Wooden Cutting Board (Donor Side: Left) */}
          <g transform="translate(60, 220)">
            <rect
              x="0"
              y="0"
              width="210"
              height="24"
              rx="8"
              fill="#78350F"
              stroke="#B45309"
              strokeWidth="2"
            />
            {/* Board handle */}
            <rect x="-24" y="6" width="26" height="12" rx="4" fill="#78350F" stroke="#B45309" />
            <circle cx="-12" cy="12" r="3" fill="#0C2138" />
            {/* Board grain accents */}
            <line x1="20" y1="8" x2="190" y2="8" stroke="#92400E" strokeWidth="1" />
            <line x1="30" y1="16" x2="180" y2="16" stroke="#92400E" strokeWidth="1" />
          </g>

          {/* Loaf of Bread on the Board */}
          <g transform="translate(85, 140)">
            {/* Main loaf body */}
            <path
              d="M 10 75 C 10 30, 40 10, 85 10 C 130 10, 160 30, 160 75 Z"
              fill="url(#loafGrad)"
              stroke="#F59E0B"
              strokeWidth="2"
            />
            {/* Loaf decorative slash marks */}
            <path d="M 45 40 Q 55 50 60 70" stroke="#FDE68A" strokeWidth="3" strokeLinecap="round" />
            <path d="M 85 30 Q 95 45 98 70" stroke="#FDE68A" strokeWidth="3" strokeLinecap="round" />
            <path d="M 125 40 Q 130 52 132 70" stroke="#FDE68A" strokeWidth="3" strokeLinecap="round" />

            {/* Fresh Steam Wisps Rising from warm bread */}
            <g opacity="0.75" className="transition-all duration-700">
              <path
                d="M 70 5 Q 65 -15 75 -25 Q 85 -35 80 -45"
                fill="none"
                stroke="#FEF3C7"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="4 4"
                opacity={step === 0 ? "0.9" : "0.3"}
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="0"
                  to="16"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
              </path>
              <path
                d="M 100 0 Q 110 -20 100 -30 Q 90 -40 105 -50"
                fill="none"
                stroke="#FEF3C7"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="4 4"
                opacity={step === 0 ? "0.9" : "0.3"}
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="0"
                  to="16"
                  dur="1.8s"
                  repeatCount="indefinite"
                />
              </path>
            </g>
          </g>

          {/* Slicing Knife with Donor Hand */}
          <g
            className="transition-all duration-700 ease-in-out"
            style={{
              transform:
                step === 0
                  ? "translate(175px, 120px) rotate(18deg)"
                  : "translate(140px, 60px) rotate(-12deg) scale(0.85)",
              opacity: step === 0 ? 1 : 0.35,
            }}
          >
            {/* Knife Blade */}
            <path
              d="M 0 0 L 85 10 L 80 24 L 0 16 Z"
              fill="url(#knifeBlade)"
              stroke="#CBD5E1"
              strokeWidth="1.5"
            />
            {/* Knife Handle */}
            <rect x="-45" y="-3" width="48" height="22" rx="4" fill="#334155" stroke="#475569" />
            <circle cx="-32" cy="8" r="2.5" fill="#94A3B8" />
            <circle cx="-12" cy="8" r="2.5" fill="#94A3B8" />

            {/* Bread Crumbs Particle Effect when cutting */}
            {step === 0 && (
              <g fill="#FDE68A" opacity="0.85">
                <circle cx="60" cy="30" r="2.5" />
                <circle cx="75" cy="36" r="1.8" />
                <circle cx="50" cy="38" r="2" />
                <circle cx="85" cy="40" r="2.2" />
              </g>
            )}
          </g>

          {/* THE CUT PIECE OF BREAD (Dynamic Motion across the steps) */}
          <g
            className="transition-all duration-1000 ease-out"
            style={{
              transform:
                step === 0
                  ? "translate(225px, 165px) scale(0.95)"
                  : step === 1
                  ? "translate(245px, 120px) scale(1.05) rotate(8deg)"
                  : step === 2
                  ? "translate(350px, 140px) scale(1.1) rotate(4deg)"
                  : "translate(440px, 175px) scale(1.05) rotate(-2deg)",
            }}
          >
            {/* Glowing aura around bread when being shared */}
            <ellipse
              cx="25"
              cy="35"
              rx="36"
              ry="42"
              fill="rgba(251, 191, 36, 0.35)"
              filter="url(#glowFilter)"
              opacity={step >= 1 ? 0.9 : 0}
            />

            {/* Fresh Bread Slice Shape */}
            <path
              d="M 5 60 C 0 35, 10 10, 25 10 C 40 10, 50 35, 45 60 Z"
              fill="url(#sliceGrad)"
              stroke="#B45309"
              strokeWidth="2.5"
            />
            {/* Slice texture / airy holes */}
            <circle cx="20" cy="32" r="3.5" fill="#D97706" opacity="0.4" />
            <circle cx="30" cy="44" r="2.5" fill="#D97706" opacity="0.4" />
            <circle cx="18" cy="48" r="3" fill="#D97706" opacity="0.35" />
            <circle cx="28" cy="24" r="2" fill="#D97706" opacity="0.4" />
            {/* Golden crust rim */}
            <path
              d="M 5 60 C 0 35, 10 10, 25 10 C 40 10, 50 35, 45 60"
              fill="none"
              stroke="#92400E"
              strokeWidth="4"
            />
          </g>

          {/* DONOR GIVING HAND (Warm Terracotta / Orange - matching logo) */}
          <g
            className="transition-all duration-1000 ease-in-out"
            style={{
              transform:
                step === 0
                  ? "translate(180px, 100px) rotate(10deg)"
                  : step === 1
                  ? "translate(210px, 105px) rotate(5deg)"
                  : step === 2
                  ? "translate(310px, 130px) rotate(0deg)"
                  : "translate(370px, 150px) rotate(-5deg)",
              opacity: step === 3 ? 0.4 : 1,
            }}
          >
            {/* Arm extending */}
            <path
              d="M -90 -10 L 0 5 C 15 10, 25 20, 35 25 C 45 28, 55 25, 60 18 L 45 10 C 35 5, 20 -2, 0 -8 Z"
              fill="url(#donorHandGrad)"
            />
            {/* Palm & fingers gently offering bread */}
            <path
              d="M 15 8 C 25 8, 35 12, 48 18 C 58 22, 65 24, 68 18 C 70 12, 60 5, 48 0 C 35 -5, 20 -5, 12 0 Z"
              fill="url(#donorHandGrad)"
              stroke="#FB923C"
              strokeWidth="1.5"
            />
          </g>

          {/* RECIPIENT CUPPED HANDS (Ocean Blue - matching logo) */}
          <g
            className="transition-all duration-1000 ease-in-out"
            style={{
              transform:
                step < 2
                  ? "translate(460px, 210px) scale(0.92)"
                  : "translate(435px, 195px) scale(1)",
            }}
          >
            {/* Receiving cupped hand 1 */}
            <path
              d="M 50 40 C 25 35, 5 25, -15 15 C -25 10, -28 5, -22 0 C -15 -5, -5 5, 12 18 C 28 28, 45 32, 60 34 Z"
              fill="url(#poorHandGrad)"
              stroke="#38BDF8"
              strokeWidth="1.5"
            />
            {/* Receiving cupped hand 2 (supporting underside) */}
            <path
              d="M 65 52 C 35 48, 15 36, -5 24 C -14 18, -16 12, -10 8 C -4 3, 5 12, 22 24 C 38 34, 55 42, 70 44 Z"
              fill="#0369A1"
              stroke="#0284C7"
              strokeWidth="1.2"
            />
          </g>

          {/* Rising Heart Glow & Hope Rays (When Bread is Given & Received) */}
          <g
            className="transition-all duration-700 ease-out"
            style={{
              opacity: step === 3 ? 1 : step === 2 ? 0.6 : 0,
              transform: step === 3 ? "translate(450px, 110px) scale(1)" : "translate(450px, 140px) scale(0.6)",
            }}
          >
            {/* Floating Heart Icon */}
            <path
              d="M 0 -10 C -10 -25, -30 -15, -30 5 C -30 25, 0 45, 0 45 C 0 45, 30 25, 30 5 C 30 -15, 10 -25, 0 -10 Z"
              fill="#F43F5E"
              filter="url(#glowFilter)"
            />
            <path
              d="M 0 -8 C -8 -22, -26 -13, -26 4 C -26 22, 0 40, 0 40 C 0 40, 26 22, 26 4 C 26 -13, 8 -22, 0 -8 Z"
              fill="#FB7185"
            />
            {/* Floating Sparkles around heart */}
            <circle cx="-32" cy="-10" r="3" fill="#FDE68A">
              <animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" repeatCount="indefinite" />
            </circle>
            <circle cx="34" cy="-5" r="2.5" fill="#FDE68A">
              <animate attributeName="opacity" values="1;0.4;1" dur="1.4s" repeatCount="indefinite" />
            </circle>
            <circle cx="0" cy="-35" r="3.5" fill="#FDE68A">
              <animate attributeName="opacity" values="0.4;1;0.4" dur="1s" repeatCount="indefinite" />
            </circle>
          </g>
        </svg>
      </div>

      {/* Dynamic Subtitle Caption */}
      <div className="mt-3 flex items-center justify-between text-xs text-slate-300 relative z-10">
        <p className="font-semibold text-white flex items-center gap-1.5">
          <Utensils className="w-3.5 h-3.5 text-amber-400" />
          <span>
            {step === 0 && "1. Cutting fresh, nutritious bread with care on the donor board"}
            {step === 1 && "2. Lifting the warm bread slice to pack for rescue transit"}
            {step === 2 && "3. Extending a compassionate hand to offer the bread"}
            {step === 3 && "4. Hope restored: Bread received gratefully by community in need"}
          </span>
        </p>

        {/* Step dots */}
        <div className="flex items-center gap-1.5 shrink-0">
          {[0, 1, 2, 3].map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => setStep(i)}
              className={`h-2 rounded-full transition-all ${
                step === i ? "w-6 bg-gradient-to-r from-amber-400 to-orange-500" : "w-2 bg-slate-700 hover:bg-slate-600"
              }`}
              title={`Jump to step ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
