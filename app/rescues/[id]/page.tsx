"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Truck,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Download,
  Share2,
} from "lucide-react";
import LiveTrackingView from "@/components/rescue/LiveTrackingView";
import DigitalReceiptModal from "@/components/rescue/DigitalReceiptModal";

export default function RescueDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back button and quick actions */}
      <div className="flex items-center justify-between">
        <Link
          href="/rescues"
          className="text-xs font-bold text-slate-500 hover:text-resq-navy flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Rescues
        </Link>

        <button
          onClick={() => setIsReceiptOpen(true)}
          className="px-4 py-2 rounded-xl bg-white border border-resq-border hover:bg-slate-50 text-xs font-bold text-resq-navy flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          View Digital Certificate
        </button>
      </div>

      {/* Signature Live Tracking Experience */}
      <LiveTrackingView
        rescueId={params.id || "RF-10283"}
        donorName="GreenFork Restaurant (Indiranagar)"
        donorAddress="100 Feet Road, Indiranagar, Bengaluru"
        donorCoords={[12.9784, 77.6408]}
        recipientName="Hope Community Shelter"
        recipientAddress="Old Airport Road, Kodihalli, Bengaluru"
        recipientCoords={[12.9612, 77.6534]}
        driverName="Rahul Sharma (EV Car Dispatch)"
        foodName="30 KG Paneer Butter Masala, Jeera Rice & Garlic Naan"
        quantityKg={30}
      />

      {/* Digital Receipt Modal */}
      <DigitalReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
      />
    </div>
  );
}
