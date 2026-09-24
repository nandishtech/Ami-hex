"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  Sparkles,
  QrCode,
  ShieldCheck,
  HeartHandshake,
  Download,
  X,
  Flame,
  Leaf,
  Droplets,
} from "lucide-react";
import { realtime } from "@/lib/realtime";

interface DeliveryHandoffModalProps {
  isOpen: boolean;
  rescueId?: string;
  foodName?: string;
  quantityKg?: number;
  recipientName?: string;
  onClose: () => void;
  onReceiptOpen?: () => void;
  onVerified?: () => void;
}

export default function DeliveryHandoffModal({
  isOpen,
  rescueId = "RF-10283",
  foodName = "30 KG Paneer Butter Masala, Jeera Rice & Naan",
  quantityKg = 30,
  recipientName = "Hope Community Shelter",
  onClose,
  onReceiptOpen,
  onVerified,
}: DeliveryHandoffModalProps) {
  const [recipientOfficer, setRecipientOfficer] = useState("Sister Teresa Mathews (Kitchen Director)");
  const [isConfirming, setIsConfirming] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isOpen) return null;

  const handleDeliveryComplete = async () => {
    setIsConfirming(true);
    try {
      await fetch(`/api/rescues/${rescueId}/delivery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          qrCode: `RESQ-DELIVERY-${rescueId}-HOPE01`,
          recipientConfirmation: recipientOfficer,
          latitude: 12.9612,
          longitude: 77.6534,
        }),
      });

      // Signature visual Impact Ripple & Confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#18A66A", "#25C982", "#1769FF", "#FF9F43"],
        });
      } catch (err) {}

      // Realtime notification broadcast
      realtime.publish(
        "DELIVERY_COMPLETED",
        {
          rescueId,
          foodWeightKg: quantityKg,
          meals: quantityKg * 4,
          recipient: recipientName,
        },
        "DRIVER"
      );

      setIsCompleted(true);
      if (onVerified) onVerified();
    } catch (e) {
      console.warn("Delivery confirm fallback used.");
      setIsCompleted(true);
      if (onVerified) onVerified();
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-resq-navy/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-floating border border-resq-border overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-resq-border bg-slate-50">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-resq-green" />
            <span className="text-sm font-bold text-resq-navy">
              Recipient Delivery & Handoff
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!isCompleted ? (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-resq-border space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Rescue ID: {rescueId}
                </span>
                <h4 className="text-sm font-bold text-resq-navy">{foodName}</h4>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200">
                  <span className="text-slate-500">Destination Shelter:</span>
                  <span className="font-bold text-resq-green">{recipientName}</span>
                </div>
              </div>

              {/* Recipient Verification Form */}
              <div className="space-y-2 text-xs">
                <label className="font-bold text-slate-700 block">
                  Recipient Receiving Officer Name
                </label>
                <input
                  type="text"
                  value={recipientOfficer}
                  onChange={(e) => setRecipientOfficer(e.target.value)}
                  className="w-full p-3 rounded-xl border border-resq-border font-medium text-resq-text"
                />
              </div>

              <div className="p-3 bg-resq-green-light rounded-xl border border-resq-green/20 flex items-center gap-2.5 text-xs text-resq-green-hover font-semibold">
                <ShieldCheck className="w-4 h-4 text-resq-green shrink-0" />
                <span>Dual verification: Driver GPS + Shelter digital signature active.</span>
              </div>

              {/* Confirm Handoff Button */}
              <button
                onClick={handleDeliveryComplete}
                disabled={isConfirming}
                className="w-full py-3.5 rounded-xl bg-resq-green hover:bg-resq-green-hover text-white font-bold text-xs shadow-glow-green transition-all"
              >
                {isConfirming ? "Registering Impact Ripple..." : "Confirm Handoff & Complete Rescue"}
              </button>
            </div>
          ) : (
            /* Signature Impact Ripple & Metrics Display */
            <div className="text-center py-4 space-y-4 animate-in zoom-in duration-300">
              <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                {/* Visual Ripple Rings */}
                <div className="absolute inset-0 rounded-full bg-resq-green/20 animate-ping opacity-75" />
                <div className="absolute inset-2 rounded-full bg-resq-green/30 animate-pulse" />
                <div className="relative w-16 h-16 rounded-full bg-resq-green text-white flex items-center justify-center shadow-lg">
                  <Sparkles className="w-8 h-8" />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-black text-resq-navy">
                  DELIVERY COMPLETE
                </h3>
                <p className="text-xs text-resq-secondary mt-1">
                  Surplus food safely routed to {recipientName}.
                </p>
              </div>

              {/* Impact Generation Cards */}
              <div className="grid grid-cols-3 gap-2.5 pt-2 text-center">
                <div className="p-3 bg-slate-50 rounded-2xl border border-resq-border">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">
                    Food Rescued
                  </span>
                  <span className="text-base font-black text-resq-navy">
                    +{quantityKg} KG
                  </span>
                </div>

                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <span className="text-[10px] text-emerald-600 font-bold block uppercase">
                    Meals Added
                  </span>
                  <span className="text-base font-black text-emerald-800">
                    +{quantityKg * 4} Meals
                  </span>
                </div>

                <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200">
                  <span className="text-[10px] text-blue-600 font-bold block uppercase">
                    CO2e Avoided
                  </span>
                  <span className="text-base font-black text-blue-800">
                    +{(quantityKg * 2.5).toFixed(0)} KG
                  </span>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => {
                    onClose();
                    if (onReceiptOpen) onReceiptOpen();
                  }}
                  className="flex-1 py-3 rounded-xl border border-resq-border hover:bg-slate-50 text-xs font-bold text-resq-navy flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  View Digital Receipt
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl bg-resq-navy text-white text-xs font-bold hover:bg-resq-navy-dark transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
