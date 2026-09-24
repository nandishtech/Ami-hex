"use client";

import React, { useRef } from "react";
import {
  Printer,
  Download,
  CheckCircle2,
  ShieldCheck,
  X,
  Leaf,
  Droplets,
  Heart,
  QrCode,
} from "lucide-react";

interface DigitalReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: {
    rescueId: string;
    foodName: string;
    quantityKg: number;
    donorName: string;
    donorAddress: string;
    recipientName: string;
    recipientAddress: string;
    driverName: string;
    pickupTime?: string;
    deliveryTime?: string;
    meals?: number;
    co2eKg?: number;
    waterL?: number;
    verificationHash?: string;
  };
}

export default function DigitalReceiptModal({
  isOpen,
  onClose,
  data = {
    rescueId: "RF-10283",
    foodName: "30 KG Paneer Butter Masala, Jeera Rice & Garlic Naan",
    quantityKg: 30,
    donorName: "GreenFork Restaurant (Indiranagar)",
    donorAddress: "100 Feet Road, Indiranagar, Bengaluru",
    recipientName: "Hope Community Shelter",
    recipientAddress: "Old Airport Road, Kodihalli, Bengaluru",
    driverName: "Rahul Sharma (EV Car)",
    pickupTime: "6:28 PM",
    deliveryTime: "6:46 PM",
    meals: 120,
    co2eKg: 75,
    waterL: 15600,
    verificationHash: "RESQ-TX-RF10283-96SC-2026",
  },
}: DigitalReceiptModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-resq-navy/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-floating border border-resq-border overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-resq-border bg-slate-50 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-resq-blue" />
            <span className="text-xs font-bold text-resq-navy">
              Certified Rescue Receipt
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 rounded-lg text-slate-500 hover:text-resq-navy hover:bg-slate-200 text-xs flex items-center gap-1 font-semibold"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div
          ref={printRef}
          className="p-8 overflow-y-auto space-y-6 text-resq-navy font-sans bg-white"
        >
          {/* Receipt Brand Banner */}
          <div className="flex items-start justify-between border-b border-resq-border pb-6">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-resq-navy flex items-center justify-center text-white font-black text-xs">
                  RQ
                </div>
                <span className="text-base font-black tracking-tight text-resq-navy">
                  RESQFOOD
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 font-medium">
                Official Digital Food Rescue Certificate
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-resq-blue block">
                {data.rescueId}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {data.verificationHash}
              </span>
            </div>
          </div>

          {/* Rescue Summary Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                Food Rescued
              </span>
              <p className="font-bold text-sm text-resq-navy mt-0.5">
                {data.foodName}
              </p>
              <p className="text-slate-500 mt-0.5 font-semibold">
                Weight: {data.quantityKg} KG ({data.meals} Meals Supported)
              </p>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                Transit Logistics
              </span>
              <p className="font-bold text-resq-navy mt-0.5">
                Driver: {data.driverName}
              </p>
              <p className="text-slate-500 mt-0.5">
                Pickup: {data.pickupTime} • Delivered: {data.deliveryTime}
              </p>
            </div>
          </div>

          {/* Parties Involved */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-resq-border space-y-3 text-xs">
            <div className="flex items-start gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-resq-blue mt-1 shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  Donor Organization
                </span>
                <p className="font-bold text-resq-navy">{data.donorName}</p>
                <p className="text-[11px] text-slate-500">{data.donorAddress}</p>
              </div>
            </div>

            <div className="flex items-start gap-2 pt-2 border-t border-slate-200">
              <span className="w-2.5 h-2.5 rounded-full bg-resq-green mt-1 shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  Recipient Organization
                </span>
                <p className="font-bold text-resq-navy">{data.recipientName}</p>
                <p className="text-[11px] text-slate-500">{data.recipientAddress}</p>
              </div>
            </div>
          </div>

          {/* Environmental Impact Metrics (EPA WARM) */}
          <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-emerald-600" />
                Estimated Environmental Savings
              </span>
              <span className="text-[10px] text-emerald-700 font-mono">
                Methodology: EPA WARM v15
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <div className="bg-white/80 p-2 rounded-xl">
                <span className="text-[10px] text-slate-400 block font-medium">Meals</span>
                <span className="font-bold text-emerald-800 text-sm">+{data.meals}</span>
              </div>
              <div className="bg-white/80 p-2 rounded-xl">
                <span className="text-[10px] text-slate-400 block font-medium">CO2e Avoided</span>
                <span className="font-bold text-emerald-800 text-sm">+{data.co2eKg} KG</span>
              </div>
              <div className="bg-white/80 p-2 rounded-xl">
                <span className="text-[10px] text-slate-400 block font-medium">Water Saved</span>
                <span className="font-bold text-emerald-800 text-sm">+{data.waterL?.toLocaleString()} L</span>
              </div>
            </div>
          </div>

          {/* Footer & QR Stamp */}
          <div className="flex items-center justify-between pt-4 border-t border-resq-border text-[10px] text-slate-400">
            <div>
              <p className="font-bold text-slate-600">Verified by RESQFOOD Cryptographic Audit Log</p>
              <p className="mt-0.5">
                Timestamp: {new Date().toLocaleString()} • Zero-waste certified
              </p>
            </div>
            <div className="p-2 border border-slate-200 rounded-lg">
              <QrCode className="w-8 h-8 text-slate-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
