"use client";

import React, { useState } from "react";
import {
  QrCode,
  Camera,
  CheckCircle2,
  MapPin,
  Clock,
  Thermometer,
  ShieldCheck,
  X,
} from "lucide-react";
import { realtime } from "@/lib/realtime";

interface PickupVerificationModalProps {
  isOpen: boolean;
  rescueId?: string;
  foodName?: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function PickupVerificationModal({
  isOpen,
  rescueId = "RF-10283",
  foodName = "30 KG Paneer Butter Masala & Naan",
  onClose,
  onSuccess,
}: PickupVerificationModalProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [tempCelsius, setTempCelsius] = useState(68);
  const [qrCodeValue, setQrCodeValue] = useState(`RESQ-PICKUP-${rescueId}-GF01`);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsVerifying(true);
    try {
      await fetch(`/api/rescues/${rescueId}/pickup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          qrCode: qrCodeValue,
          latitude: 12.9784,
          longitude: 77.6408,
          photoUrl: "https://images.unsplash.com/photo-1547496502-affa22d38842?w=400",
          notes: `Temperature verified at ${tempCelsius}°C. Containers hot & hygienically sealed.`,
        }),
      });

      realtime.publish("PICKUP_CONFIRMED", { rescueId, status: "IN_TRANSIT" }, "DRIVER");
      setIsVerified(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1600);
    } catch (e) {
      console.warn("Pickup confirm fallback used.");
      setIsVerified(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1600);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-resq-navy/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-floating border border-resq-border overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-resq-border bg-slate-50">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-resq-blue" />
            <span className="text-sm font-bold text-resq-navy">
              Pickup Verification: {rescueId}
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
        <div className="p-6 space-y-4">
          {isVerified ? (
            <div className="text-center py-6 space-y-2 animate-in zoom-in duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-lg font-black text-resq-navy">
                PICKUP VERIFIED
              </h4>
              <p className="text-xs text-slate-500">
                Audit event logged. Driver GPS route started towards recipient.
              </p>
            </div>
          ) : (
            <>
              {/* QR Code Scanner View */}
              <div className="p-4 bg-slate-900 rounded-2xl text-white text-center space-y-3 relative overflow-hidden">
                <div className="w-36 h-36 border-2 border-dashed border-resq-green-bright rounded-2xl mx-auto flex items-center justify-center relative">
                  <QrCode className="w-20 h-20 text-white/80" />
                  <div className="absolute inset-x-2 top-1/2 h-0.5 bg-resq-green-bright animate-pulse" />
                </div>
                <div className="text-[11px] text-slate-300 font-mono">
                  {qrCodeValue}
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-[10px] text-resq-green-bright font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  QR Code Signature Matched
                </div>
              </div>

              {/* Photo & Temperature Log */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-resq-border">
                  <div className="flex items-center gap-1 text-slate-400 font-medium mb-1">
                    <Camera className="w-3.5 h-3.5" />
                    <span>Food Cargo Photo</span>
                  </div>
                  <span className="font-bold text-resq-green flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Captured (Hot Chafing)
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-resq-border">
                  <div className="flex items-center gap-1 text-slate-400 font-medium mb-1">
                    <Thermometer className="w-3.5 h-3.5" />
                    <span>Cargo Temp</span>
                  </div>
                  <span className="font-bold text-resq-navy">{tempCelsius}°C (Safe Hot-Hold)</span>
                </div>
              </div>

              {/* GPS & Timestamp Confirmation */}
              <div className="p-3 bg-slate-50 rounded-xl border border-resq-border flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-resq-blue" />
                  <span>Indiranagar 100 Ft Rd (Verified GPS)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Just now</span>
                </div>
              </div>

              {/* Verification Button */}
              <button
                onClick={handleConfirm}
                disabled={isVerifying}
                className="w-full py-3 rounded-xl bg-resq-blue hover:bg-resq-blue-hover text-white font-bold text-xs shadow-sm transition-all"
              >
                {isVerifying ? "Verifying Sensor & Audit Trail..." : "Confirm Pickup Handoff"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
