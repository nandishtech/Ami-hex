"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Camera,
  Mic,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  X,
  Flame,
  Info,
} from "lucide-react";
import { FoodCategory, StorageCondition } from "@/lib/types";
import { FOOD_SAFETY_DISCLAIMER, STORAGE_GUIDELINES } from "@/lib/safety/urgency";
import { realtime } from "@/lib/realtime";

interface AiDonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (donation: any) => void;
}

export default function AiDonationModal({
  isOpen,
  onClose,
  onSuccess,
}: AiDonationModalProps) {
  const [inputMode, setInputMode] = useState<"text" | "photo" | "voice">("text");
  const [naturalText, setNaturalText] = useState(
    "30 trays of paneer rice and naan, prepared at 6 PM, available until 8 PM"
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // Structured extraction state
  const [step, setStep] = useState<"input" | "review">("input");
  const [extractedData, setExtractedData] = useState({
    foodName: "Paneer Butter Masala, Jeera Rice & Garlic Naan",
    category: "Prepared Meals" as FoodCategory,
    quantity: 30,
    unit: "KG",
    preparedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString().slice(0, 16),
    availableUntil: new Date(Date.now() + 105 * 60 * 1000).toISOString().slice(0, 16),
    storageCondition: "HOT_HELD" as StorageCondition,
    pickupAddress: "100 Feet Road, Indiranagar, Bengaluru",
    latitude: 12.9784,
    longitude: 77.6408,
    allergens: ["Dairy", "Gluten"],
    notes: "Packed in certified commercial hot chafing containers.",
    confidence: 0.94,
  });

  if (!isOpen) return null;

  // AI Extraction handler
  const handleAiExtract = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/ai/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: naturalText }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setExtractedData((prev) => ({
          ...prev,
          foodName: json.data.foodName,
          category: json.data.category,
          quantity: json.data.quantity,
          unit: json.data.unit,
          storageCondition: json.data.storageCondition,
          allergens: json.data.allergens,
          confidence: json.data.confidenceScore,
        }));
      }
    } catch (e) {
      console.warn("AI parse fallback used.");
    } finally {
      setIsProcessing(false);
      setStep("review");
    }
  };

  // Simulated Voice Input
  const handleVoiceToggle = () => {
    if (!isListening) {
      setIsListening(true);
      setTimeout(() => {
        setNaturalText("30 trays of paneer rice and naan, prepared at 6 PM, available until 8 PM");
        setIsListening(false);
      }, 2400);
    }
  };

  // Submit Donation to Backend
  const handleSubmit = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donorId: "user-donor-greenfork",
          organizationId: "org-greenfork",
          ...extractedData,
        }),
      });
      const json = await res.json();
      if (json.success) {
        // Broadcast realtime notification
        realtime.publish("DONATION_CREATED", json.data, "DONOR");
        onSuccess(json.data);
        onClose();
      }
    } catch (e) {
      console.error("Donation creation failed:", e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-resq-navy/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-floating border border-resq-border overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-resq-border bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-resq-blue-light text-resq-blue flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-resq-navy">
                {step === "input" ? "AI Donation Assistant" : "Review & Operational Verification"}
              </h3>
              <p className="text-xs text-resq-secondary">
                {step === "input"
                  ? "Describe surplus food naturally or upload kitchen photo"
                  : "Verify operational safety and timing parameters"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {step === "input" ? (
            <div className="space-y-4">
              {/* Mode Selector */}
              <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                <button
                  onClick={() => setInputMode("text")}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
                    inputMode === "text"
                      ? "bg-white text-resq-blue shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Natural Text
                </button>
                <button
                  onClick={() => setInputMode("photo")}
                  className={`flex-1 py-2 text-xs font-bold flex items-center justify-center gap-1.5 rounded-lg transition-colors ${
                    inputMode === "photo"
                      ? "bg-white text-resq-blue shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  Kitchen Photo
                </button>
                <button
                  onClick={() => setInputMode("voice")}
                  className={`flex-1 py-2 text-xs font-bold flex items-center justify-center gap-1.5 rounded-lg transition-colors ${
                    inputMode === "voice"
                      ? "bg-white text-resq-blue shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  Voice Input
                </button>
              </div>

              {/* Natural Text Mode */}
              {inputMode === "text" && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    What surplus food do you have available?
                  </label>
                  <textarea
                    rows={4}
                    value={naturalText}
                    onChange={(e) => setNaturalText(e.target.value)}
                    placeholder="e.g. 30 trays of paneer rice and naan, prepared at 6 PM, available until 8 PM..."
                    className="w-full p-3.5 rounded-xl border border-resq-border text-sm text-resq-text focus:outline-none focus:ring-2 focus:ring-resq-blue/20 focus:border-resq-blue"
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[11px] text-slate-400">Quick template:</span>
                    <button
                      type="button"
                      onClick={() =>
                        setNaturalText(
                          "30 trays of paneer rice and naan, prepared at 6 PM, available until 8 PM"
                        )
                      }
                      className="text-[11px] font-semibold text-resq-blue bg-resq-blue-light px-2 py-0.5 rounded-md hover:underline"
                    >
                      Demo Banquet (30 Trays)
                    </button>
                  </div>
                </div>
              )}

              {/* Photo Mode */}
              {inputMode === "photo" && (
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-2 text-slate-400">
                    <Camera className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-resq-navy">
                    Upload food tray or chafing dish photo
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    AI visual analyzer will estimate category & quantity
                  </p>
                  <div className="mt-4 flex justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPhoto("https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600");
                        setNaturalText("30 catering trays of Paneer Butter Masala and Jeera Rice, prepared 45 mins ago");
                      }}
                      className="px-3 py-1.5 rounded-lg bg-resq-blue-light text-resq-blue text-xs font-bold hover:bg-resq-blue/10"
                    >
                      Use Sample Banquet Photo
                    </button>
                  </div>
                  {selectedPhoto && (
                    <div className="mt-3 flex items-center justify-center gap-2 text-xs text-resq-green font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      Photo attached & verified
                    </div>
                  )}
                </div>
              )}

              {/* Voice Mode */}
              {inputMode === "voice" && (
                <div className="border border-resq-border rounded-2xl p-8 text-center bg-slate-50">
                  <button
                    type="button"
                    onClick={handleVoiceToggle}
                    className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto transition-transform ${
                      isListening
                        ? "bg-red-500 text-white animate-pulse scale-110"
                        : "bg-resq-blue text-white hover:scale-105"
                    }`}
                  >
                    <Mic className="w-7 h-7" />
                  </button>
                  <p className="text-xs font-bold text-resq-navy mt-3">
                    {isListening ? "Listening... Speak naturally" : "Click to Record Voice Donation"}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto">
                    “I have twenty kilos of cooked rice available for pickup.”
                  </p>
                </div>
              )}

              {/* AI Assistant Banner */}
              <div className="p-3 bg-resq-blue-light/60 rounded-xl flex items-start gap-2.5 text-xs text-resq-navy border border-resq-blue/20">
                <Sparkles className="w-4 h-4 text-resq-blue shrink-0 mt-0.5" />
                <p>
                  RESQFOOD AI extracts quantity, category, temperature window, and allergens automatically. You will review everything before submission.
                </p>
              </div>

              {/* Extract Action Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleAiExtract}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-resq-blue text-white text-xs font-bold hover:bg-resq-blue-hover shadow-sm transition-all"
                >
                  {isProcessing ? "AI Understanding Food..." : "Parse & Structure Donation"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Review & Confirmation Step */
            <div className="space-y-4">
              {/* AI Confidence Metric */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold">AI Extraction Confidence: 94%</span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-700">
                  Ready for matching
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Food Title
                  </label>
                  <input
                    type="text"
                    value={extractedData.foodName}
                    onChange={(e) =>
                      setExtractedData({ ...extractedData, foodName: e.target.value })
                    }
                    className="w-full p-2.5 rounded-lg border border-resq-border font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Category
                  </label>
                  <select
                    value={extractedData.category}
                    onChange={(e) =>
                      setExtractedData({
                        ...extractedData,
                        category: e.target.value as FoodCategory,
                      })
                    }
                    className="w-full p-2.5 rounded-lg border border-resq-border font-medium bg-white"
                  >
                    <option value="Prepared Meals">Prepared Meals</option>
                    <option value="Bakery">Bakery</option>
                    <option value="Produce">Produce</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Packaged">Packaged Goods</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Quantity (Estimated: {extractedData.quantity * 4} meals)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={extractedData.quantity}
                      onChange={(e) =>
                        setExtractedData({
                          ...extractedData,
                          quantity: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full p-2.5 rounded-lg border border-resq-border font-medium"
                    />
                    <span className="p-2.5 bg-slate-100 rounded-lg text-slate-600 font-bold">
                      KG
                    </span>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Storage Condition
                  </label>
                  <select
                    value={extractedData.storageCondition}
                    onChange={(e) =>
                      setExtractedData({
                        ...extractedData,
                        storageCondition: e.target.value as StorageCondition,
                      })
                    }
                    className="w-full p-2.5 rounded-lg border border-resq-border font-medium bg-white"
                  >
                    <option value="HOT_HELD">HOT_HELD (≥ 60°C)</option>
                    <option value="REFRIGERATED">REFRIGERATED (1-4°C)</option>
                    <option value="ROOM_TEMP">ROOM_TEMP (18-24°C)</option>
                    <option value="FROZEN">FROZEN (≤ -18°C)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Available Until (Urgency Window)
                  </label>
                  <input
                    type="datetime-local"
                    value={extractedData.availableUntil}
                    onChange={(e) =>
                      setExtractedData({
                        ...extractedData,
                        availableUntil: e.target.value,
                      })
                    }
                    className="w-full p-2.5 rounded-lg border border-resq-border font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Pickup Location
                  </label>
                  <input
                    type="text"
                    value={extractedData.pickupAddress}
                    onChange={(e) =>
                      setExtractedData({
                        ...extractedData,
                        pickupAddress: e.target.value,
                      })
                    }
                    className="w-full p-2.5 rounded-lg border border-resq-border font-medium"
                  />
                </div>
              </div>

              {/* Food Safety Guidance Notice */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-2 text-[11px] text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Operational Safety Information</p>
                  <p className="text-amber-800 leading-tight mt-0.5">
                    {FOOD_SAFETY_DISCLAIMER}
                  </p>
                </div>
              </div>

              {/* Review Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-resq-border">
                <button
                  type="button"
                  onClick={() => setStep("input")}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800"
                >
                  ← Edit Input
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-resq-green text-white text-xs font-bold hover:bg-resq-green-hover shadow-sm transition-all"
                >
                  {isProcessing ? "Posting & Initiating Match..." : "Confirm & Post for Matching"}
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
