"use client";

import React from "react";
import Link from "next/link";
import { Code, Terminal, Key, Webhook, ArrowRight, ExternalLink } from "lucide-react";

export default function DevelopersPage() {
  const endpoints = [
    {
      method: "POST",
      path: "/api/donations",
      desc: "Post surplus food donation with AI extraction or manual inputs",
      sampleBody: JSON.stringify(
        {
          donorId: "user-donor-greenfork",
          foodName: "30 trays of paneer rice and naan",
          quantity: 30,
          unit: "KG",
          category: "Prepared Meals",
          preparedAt: "2026-09-24T18:00:00Z",
          availableUntil: "2026-09-24T20:00:00Z",
          storageCondition: "HOT_HELD",
        },
        null,
        2
      ),
    },
    {
      method: "POST",
      path: "/api/matches",
      desc: "Run multi-parameter matching algorithm for an active donation",
      sampleBody: JSON.stringify({ donationId: "donation-demo-101" }, null, 2),
    },
    {
      method: "GET",
      path: "/api/matches/:id/explanation",
      desc: "Retrieve operational explainability reasons ('Why this match?')",
      sampleBody: null,
    },
    {
      method: "POST",
      path: "/api/rescues",
      desc: "Dispatch confirmed match into an active tracked rescue",
      sampleBody: JSON.stringify(
        {
          donationId: "donation-demo-101",
          recipientId: "org-hope-shelter",
          driverId: "driver-rahul",
        },
        null,
        2
      ),
    },
    {
      method: "POST",
      path: "/api/rescues/:id/pickup",
      desc: "Dual custody handoff verification at pickup location (QR + photo)",
      sampleBody: JSON.stringify(
        {
          qrCode: "RESQ-PICKUP-RF10283-GF01",
          latitude: 12.9784,
          longitude: 77.6408,
          photoUrl: "https://...",
        },
        null,
        2
      ),
    },
    {
      method: "POST",
      path: "/api/rescues/:id/delivery",
      desc: "Confirm delivery handoff at recipient shelter and trigger impact ripple",
      sampleBody: JSON.stringify(
        {
          qrCode: "RESQ-DELIVERY-RF10283-HOPE01",
          recipientConfirmation: "Sister Teresa Mathews",
          latitude: 12.9612,
          longitude: 77.6534,
        },
        null,
        2
      ),
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-resq-border">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-resq-blue" />
          <h1 className="text-2xl font-black text-resq-navy">
            Developer API & Webhook Specifications
          </h1>
        </div>
        <p className="text-xs text-resq-secondary mt-1">
          Complete REST API documentation and payload schemas for institutional integrations
        </p>
      </div>

      {/* Endpoints Table */}
      <div className="space-y-6">
        {endpoints.map((ep, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-white border border-resq-border shadow-sm space-y-3"
          >
            <div className="flex items-center gap-3">
              <span
                className={`px-2.5 py-1 rounded-md text-xs font-black font-mono ${
                  ep.method === "POST"
                    ? "bg-emerald-100 text-emerald-800"
                    : ep.method === "GET"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {ep.method}
              </span>
              <span className="font-mono text-sm font-bold text-resq-navy">
                {ep.path}
              </span>
            </div>

            <p className="text-xs text-resq-secondary">{ep.desc}</p>

            {ep.sampleBody && (
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Request Payload Example
                </span>
                <pre className="p-3 bg-slate-900 text-emerald-400 rounded-xl font-mono text-[11px] overflow-x-auto">
                  {ep.sampleBody}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
