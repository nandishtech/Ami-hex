"use client";

import React, { useState } from "react";
import {
  Settings,
  Building2,
  Key,
  Webhook,
  CreditCard,
  Bell,
  Shield,
  Copy,
  Check,
  Plus,
  Eye,
  EyeOff,
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"ORG" | "API" | "INTEGRATIONS" | "BILLING">("ORG");
  const [copiedKey, setCopiedKey] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  const apiKey = "resq_live_94f8a12e89bc4410a8ef1c098921";

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-resq-border">
        <h1 className="text-2xl font-black text-resq-navy">
          Platform Settings & Tenant Configuration
        </h1>
        <p className="text-xs text-resq-secondary mt-0.5">
          Manage organization profile, multi-branch network, developer API access, and integrations
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-resq-border pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab("ORG")}
          className={`px-4 py-2 rounded-xl transition-colors ${
            activeTab === "ORG" ? "bg-resq-navy text-white" : "text-slate-500 hover:text-slate-900"
          }`}
        >
          Organization & Branches
        </button>
        <button
          onClick={() => setActiveTab("API")}
          className={`px-4 py-2 rounded-xl transition-colors ${
            activeTab === "API" ? "bg-resq-navy text-white" : "text-slate-500 hover:text-slate-900"
          }`}
        >
          API Keys & Webhooks
        </button>
        <button
          onClick={() => setActiveTab("INTEGRATIONS")}
          className={`px-4 py-2 rounded-xl transition-colors ${
            activeTab === "INTEGRATIONS" ? "bg-resq-navy text-white" : "text-slate-500 hover:text-slate-900"
          }`}
        >
          Connected Integrations
        </button>
        <button
          onClick={() => setActiveTab("BILLING")}
          className={`px-4 py-2 rounded-xl transition-colors ${
            activeTab === "BILLING" ? "bg-resq-navy text-white" : "text-slate-500 hover:text-slate-900"
          }`}
        >
          SaaS Billing & Plan
        </button>
      </div>

      {/* TAB 1: ORGANIZATION */}
      {activeTab === "ORG" && (
        <div className="bg-white rounded-3xl border border-resq-border p-6 shadow-card space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-resq-navy">Organization Profile</h3>
              <p className="text-xs text-resq-secondary">Tenant isolation key: org-greenfork</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
              Verified Donor
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Organization Name</label>
              <input
                type="text"
                defaultValue="GreenFork Restaurant & Banquets"
                className="w-full p-2.5 rounded-xl border border-resq-border font-medium"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Category Type</label>
              <input
                type="text"
                defaultValue="RESTAURANT (Commercial Kitchen)"
                disabled
                className="w-full p-2.5 rounded-xl border border-resq-border bg-slate-50 text-slate-500"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Contact Email</label>
              <input
                type="email"
                defaultValue="donations@greenfork.com"
                className="w-full p-2.5 rounded-xl border border-resq-border font-medium"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Direct Hotline</label>
              <input
                type="tel"
                defaultValue="+91 80 4123 4567"
                className="w-full p-2.5 rounded-xl border border-resq-border font-medium"
              />
            </div>
          </div>

          {/* Branches Section */}
          <div className="pt-4 border-t border-resq-border space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Operating Kitchen Branches (2 Active)
              </h4>
              <button className="text-xs font-bold text-resq-blue hover:underline flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" />
                Add Branch
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-resq-border space-y-1">
                <span className="font-bold text-resq-navy block">Branch 1: Indiranagar Central</span>
                <p className="text-[11px] text-slate-500">100 Feet Road, Indiranagar • Capacity: 150 KG</p>
                <span className="text-[10px] text-resq-green font-semibold">● Active Dispatch Hub</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-resq-border space-y-1">
                <span className="font-bold text-resq-navy block">Branch 2: Koramangala Kitchen</span>
                <p className="text-[11px] text-slate-500">80 Feet Road, 4th Block • Capacity: 80 KG</p>
                <span className="text-[10px] text-resq-green font-semibold">● Active Dispatch Hub</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: API KEYS */}
      {activeTab === "API" && (
        <div className="bg-white rounded-3xl border border-resq-border p-6 shadow-card space-y-6">
          <div>
            <h3 className="text-sm font-bold text-resq-navy">Developer API Authentication</h3>
            <p className="text-xs text-resq-secondary">
              Use your programmatic API keys to dispatch donations from POS or ERP software.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-resq-border space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Live Production Secret Key
            </span>
            <div className="flex items-center gap-2">
              <input
                type={showSecret ? "text" : "password"}
                value={apiKey}
                readOnly
                className="w-full p-2.5 rounded-xl border border-resq-border font-mono text-xs bg-white"
              />
              <button
                onClick={() => setShowSecret(!showSecret)}
                className="p-2.5 rounded-xl border border-resq-border hover:bg-white text-slate-600 transition-colors"
              >
                {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button
                onClick={handleCopyKey}
                className="px-4 py-2.5 rounded-xl bg-resq-blue hover:bg-resq-blue-hover text-white text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0"
              >
                {copiedKey ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedKey ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Never share secret API keys in client-side code or public repositories.
            </p>
          </div>

          {/* Webhook Endpoint */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-resq-navy">Webhook Subscription URL</h4>
            <input
              type="url"
              defaultValue="https://api.greenfork.com/webhooks/resqfood-events"
              className="w-full p-2.5 rounded-xl border border-resq-border text-xs"
            />
            <span className="text-[11px] text-slate-400 block">
              Receives HTTP POST payloads for <code>DONATION_MATCHED</code> and <code>DELIVERY_COMPLETED</code>.
            </span>
          </div>
        </div>
      )}

      {/* TAB 3: INTEGRATIONS */}
      {activeTab === "INTEGRATIONS" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-resq-border shadow-card space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-bold text-sm text-resq-navy">Mapbox / MapLibre Engine</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                CONNECTED
              </span>
            </div>
            <p className="text-xs text-resq-secondary leading-relaxed">
              Provides vector tile routing, ETA traffic calculations, and GPS waypoints.
            </p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-resq-border shadow-card space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-bold text-sm text-resq-navy">Twilio / WhatsApp SMS</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                CONNECTED
              </span>
            </div>
            <p className="text-xs text-resq-secondary leading-relaxed">
              Sends urgent SMS dispatch alerts to verified drivers within 15km service radius.
            </p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-resq-border shadow-card space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-bold text-sm text-resq-navy">Oracle Micros / Toast POS</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-500">
                READY TO CONNECT
              </span>
            </div>
            <p className="text-xs text-resq-secondary leading-relaxed">
              Auto-extracts kitchen surplus at closing shifts directly from kitchen display systems.
            </p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-resq-border shadow-card space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-bold text-sm text-resq-navy">Watershed / ESG Reporting API</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                CONNECTED
              </span>
            </div>
            <p className="text-xs text-resq-secondary leading-relaxed">
              Synchronizes verified Scope 3 emissions avoided directly into corporate CSRD and SEC reports.
            </p>
          </div>
        </div>
      )}

      {/* TAB 4: SAAS BILLING */}
      {activeTab === "BILLING" && (
        <div className="bg-white rounded-3xl border border-resq-border p-6 shadow-card space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-resq-blue block">
                Current Subscription Tier
              </span>
              <h3 className="text-xl font-black text-resq-navy mt-0.5">
                Enterprise Sustainable Logistics Tier
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full bg-resq-blue-light text-resq-blue text-xs font-bold">
              Active Plan
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-resq-border space-y-2">
              <span className="font-bold text-resq-navy block">Free Tier</span>
              <p className="text-slate-500">Standard rescue intake and volunteer driver matching.</p>
              <span className="font-bold block text-slate-800">$0 / month</span>
            </div>
            <div className="p-4 rounded-2xl bg-resq-blue-light/40 border border-resq-blue/30 space-y-2">
              <span className="font-bold text-resq-blue block">Pro Tier</span>
              <p className="text-slate-600">AI natural language parsing, temperature logs & multi-branch support.</p>
              <span className="font-bold block text-resq-navy">$49 / month</span>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
              <span className="font-bold text-emerald-800 block">Enterprise ESG</span>
              <p className="text-slate-600">Full API webhooks, Scope 3 CSRD audits & dedicated city operations.</p>
              <span className="font-bold block text-emerald-900">Custom / Municipal</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
