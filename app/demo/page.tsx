"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Play,
  Sparkles,
  Utensils,
  Truck,
  HeartHandshake,
  QrCode,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Download,
  Info,
} from "lucide-react";
import AiDonationModal from "@/components/donor/AiDonationModal";
import AiMatcherSimulation from "@/components/matching/AiMatcherSimulation";
import SwipeAcceptCard from "@/components/driver/SwipeAcceptCard";
import LiveTrackingView from "@/components/rescue/LiveTrackingView";
import PickupVerificationModal from "@/components/rescue/PickupVerificationModal";
import DeliveryHandoffModal from "@/components/rescue/DeliveryHandoffModal";
import DigitalReceiptModal from "@/components/rescue/DigitalReceiptModal";

export default function DemoPage() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [isPickupModalOpen, setIsPickupModalOpen] = useState<boolean>(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState<boolean>(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState<boolean>(false);

  const [demoState, setDemoState] = useState({
    donationCreated: false,
    matched: false,
    driverAccepted: false,
    pickedUp: false,
    delivered: false,
  });

  const steps = [
    { num: 1, title: "Create Donation", desc: "Chef Vikram Adiga at GreenFork" },
    { num: 2, title: "AI Extraction", desc: "30 KG Paneer Rice parsed" },
    { num: 3, title: "AI Matching", desc: "Hope Shelter (Score: 96)" },
    { num: 4, title: "Driver Dispatch", desc: "Rahul Sharma (EV Car)" },
    { num: 5, title: "Pickup QR", desc: "Temp audit & custody handoff" },
    { num: 6, title: "Live Transit", desc: "3.8 KM Old Airport Road route" },
    { num: 7, title: "Delivery Ripple", desc: "Shelter verification & meals" },
    { num: 8, title: "Digital Receipt", desc: "EPA WARM certified record" },
  ];

  const handleReset = () => {
    setCurrentStep(1);
    setDemoState({
      donationCreated: false,
      matched: false,
      driverAccepted: false,
      pickedUp: false,
      delivered: false,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-resq-navy text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-floating">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-resq-green-bright border border-white/20 mb-2">
              <Play className="w-3.5 h-3.5 fill-current" />
              Connected Hackathon Showcase Walkthrough
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              End-to-End Food Rescue Demo Flow
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Experience the entire journey of one donation as specified in Requirement 67 & 89. Click each step or follow the guided prompts below.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors border border-white/20"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Demo
            </button>
            <Link
              href="/donor"
              className="px-4 py-2 rounded-xl bg-resq-blue hover:bg-resq-blue-hover text-white text-xs font-bold transition-colors"
            >
              Exit to Dashboard
            </Link>
          </div>
        </div>

        {/* Step Progression Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 pt-6 mt-6 border-t border-white/10 text-xs">
          {steps.map((st) => {
            const isPassed = currentStep > st.num;
            const isCurrent = currentStep === st.num;

            return (
              <button
                key={st.num}
                onClick={() => setCurrentStep(st.num)}
                className={`p-2.5 rounded-xl text-left transition-all ${
                  isCurrent
                    ? "bg-resq-blue text-white shadow-glow"
                    : isPassed
                    ? "bg-white/10 text-resq-green-bright"
                    : "bg-white/5 text-slate-400 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold">0{st.num}</span>
                  {isPassed && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
                <p className="font-bold text-xs truncate">{st.title}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Stage Container */}
      <div className="space-y-6">
        {/* STEP 1 & 2: DONATION INTAKE & AI EXTRACTION */}
        {(currentStep === 1 || currentStep === 2) && (
          <div className="bg-white rounded-3xl border border-resq-border p-6 shadow-card space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-resq-blue">
                  Step 1 & 2 • Donor Intake
                </span>
                <h3 className="text-lg font-black text-resq-navy mt-0.5">
                  GreenFork Restaurant (Indiranagar)
                </h3>
              </div>
              <span className="text-xs font-semibold px-3 py-1 bg-resq-blue-light text-resq-blue rounded-full">
                Persona: Chef Vikram Adiga
              </span>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-resq-border space-y-3">
              <span className="text-xs font-bold text-resq-navy block">
                Chef Types Natural Description:
              </span>
              <blockquote className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-resq-text italic">
                “30 trays of paneer rice and naan, prepared at 6 PM, available until 8 PM.”
              </blockquote>
              <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-slate-200">
                <span>Indiranagar 100 Feet Road Kitchen</span>
                <span className="font-bold text-resq-navy">Estimated: 30 KG (120 Meals)</span>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsAiModalOpen(true)}
                className="px-6 py-3 rounded-xl bg-resq-blue hover:bg-resq-blue-hover text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
              >
                <Sparkles className="w-4 h-4" />
                Launch AI Assistant Modal
              </button>

              <button
                onClick={() => {
                  setDemoState({ ...demoState, donationCreated: true });
                  setCurrentStep(3);
                }}
                className="px-6 py-3 rounded-xl bg-resq-green hover:bg-resq-green-hover text-white text-xs font-bold flex items-center gap-2 transition-all"
              >
                <span>Fast Forward to Matching</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: AI MATCHER SIMULATION */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Step 3 • Intelligent Matching Calculation
              </h3>
              <button
                onClick={() => setCurrentStep(4)}
                className="text-xs font-bold text-resq-blue hover:underline flex items-center gap-1"
              >
                Proceed to Driver Dispatch →
              </button>
            </div>
            <AiMatcherSimulation
              onRescueDispatched={(id) => {
                setDemoState({ ...demoState, matched: true });
                setCurrentStep(4);
              }}
            />
          </div>
        )}

        {/* STEP 4 & 5: DRIVER ACCEPTANCE & PICKUP VERIFICATION */}
        {(currentStep === 4 || currentStep === 5) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block px-2">
                Step 4 • Driver Mobile Experience (Rahul Sharma)
              </span>
              <SwipeAcceptCard
                onAccept={() => {
                  setDemoState({ ...demoState, driverAccepted: true });
                }}
                onOpenPickupModal={() => setIsPickupModalOpen(true)}
                onOpenDeliveryModal={() => setIsDeliveryModalOpen(true)}
              />
            </div>

            <div className="bg-white rounded-3xl border border-resq-border p-6 shadow-card space-y-4">
              <div className="flex items-center gap-2 text-resq-blue">
                <QrCode className="w-5 h-5" />
                <h4 className="text-sm font-bold text-resq-navy">
                  Step 5 • Verification & Temperature Custody
                </h4>
              </div>
              <p className="text-xs text-resq-secondary leading-relaxed">
                When driver arrives at GreenFork Restaurant, cargo custody is cryptographically validated using QR codes, photo capture, temperature log (68°C hot-held), and GPS verification.
              </p>

              <div className="pt-2">
                <button
                  onClick={() => setIsPickupModalOpen(true)}
                  className="w-full py-3 rounded-xl bg-resq-blue text-white text-xs font-bold hover:bg-resq-blue-hover transition-colors flex items-center justify-center gap-2"
                >
                  <QrCode className="w-4 h-4" />
                  Open QR & Photo Pickup Modal
                </button>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setCurrentStep(6)}
                  className="text-xs font-bold text-resq-blue hover:underline flex items-center gap-1"
                >
                  Advance to Live GPS Tracking →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: LIVE ROUTE & FOLLOW DRIVER */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Step 6 • Live GPS Routing & Follow Driver Camera
              </h3>
              <button
                onClick={() => {
                  setIsDeliveryModalOpen(true);
                  setCurrentStep(7);
                }}
                className="text-xs font-bold text-resq-green hover:underline flex items-center gap-1"
              >
                Arrive at Shelter & Deliver →
              </button>
            </div>
            <LiveTrackingView />
          </div>
        )}

        {/* STEP 7 & 8: DELIVERY HANDOFF RIPPLE & DIGITAL RECEIPT */}
        {(currentStep === 7 || currentStep === 8) && (
          <div className="bg-white rounded-3xl border border-resq-border p-8 shadow-card text-center max-w-xl mx-auto space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold text-resq-green uppercase tracking-wider">
                Step 7 & 8 • Complete Connected Impact
              </span>
              <h3 className="text-2xl font-black text-resq-navy mt-1">
                Rescue RF-10283 Successfully Delivered!
              </h3>
              <p className="text-xs text-resq-secondary mt-1">
                Sister Teresa Mathews at Hope Community Shelter verified delivery.
              </p>
            </div>

            {/* Impact Metric Counters */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-slate-50 rounded-2xl border border-resq-border">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">
                  Food Rescued
                </span>
                <span className="text-lg font-black text-resq-navy">+30 KG</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                <span className="text-[10px] text-emerald-600 font-bold block uppercase">
                  Meals Added
                </span>
                <span className="text-lg font-black text-emerald-800">+120 Meals</span>
              </div>
              <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200">
                <span className="text-[10px] text-blue-600 font-bold block uppercase">
                  CO2e Avoided
                </span>
                <span className="text-lg font-black text-blue-800">+75 KG</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => setIsReceiptModalOpen(true)}
                className="flex-1 py-3.5 rounded-xl bg-resq-navy hover:bg-resq-navy-dark text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download Certified Receipt
              </button>
              <button
                onClick={() => setIsDeliveryModalOpen(true)}
                className="flex-1 py-3.5 rounded-xl bg-resq-green hover:bg-resq-green-hover text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                Re-trigger Impact Ripple
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Embedded Modals */}
      <AiDonationModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onSuccess={() => {
          setDemoState({ ...demoState, donationCreated: true });
          setCurrentStep(3);
        }}
      />

      <PickupVerificationModal
        isOpen={isPickupModalOpen}
        onClose={() => setIsPickupModalOpen(false)}
        onSuccess={() => {
          setDemoState({ ...demoState, pickedUp: true });
          setCurrentStep(6);
        }}
      />

      <DeliveryHandoffModal
        isOpen={isDeliveryModalOpen}
        onClose={() => setIsDeliveryModalOpen(false)}
        onReceiptOpen={() => setIsReceiptModalOpen(true)}
      />

      <DigitalReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
      />
    </div>
  );
}
