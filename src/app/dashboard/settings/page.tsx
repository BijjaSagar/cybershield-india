"use client";

import { Topbar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Settings, Bell, Shield, Globe, Key, Users } from "lucide-react";

export default function SettingsPage() {
  return (
    <div>
      <Topbar title="Settings" subtitle="Organisation, notifications, integrations" />
      <div className="p-6 space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Organisation */}
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-400" />
                Organisation
              </h2>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              {[
                { label: "Company Name", value: "Your Company Pvt Ltd", type: "text" },
                { label: "GSTIN", value: "27AABCT1332L1ZO", type: "text" },
                { label: "CIN", value: "U72900MH2020PTC123456", type: "text" },
                { label: "Sector", value: "IT Services", type: "text" },
                { label: "Employee Count", value: "34", type: "number" },
              ].map((field) => (
                <div key={field.label}>
                  <label className="block text-xs text-slate-500 mb-1">{field.label}</label>
                  <input
                    type={field.type}
                    defaultValue={field.value}
                    className="w-full bg-slate-900/60 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500/50"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* CERT-In Nodal Officer */}
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" />
                CERT-In Nodal Officer
              </h2>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              {[
                { label: "Nodal Officer Name", value: "Akash Sharma" },
                { label: "Designation", value: "CTO / Security Lead" },
                { label: "Email", value: "akash@yourcompany.com" },
                { label: "Mobile", value: "+91 98765 43210" },
                { label: "CERT-In Registration ID", value: "CERT-IN-2025-XXXX" },
              ].map((field) => (
                <div key={field.label}>
                  <label className="block text-xs text-slate-500 mb-1">{field.label}</label>
                  <input
                    type="text"
                    defaultValue={field.value}
                    className="w-full bg-slate-900/60 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500/50"
                  />
                </div>
              ))}
              <button className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-all">
                Register with CERT-In Portal
              </button>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-400" />
                Alert Notifications
              </h2>
            </CardHeader>
            <CardContent className="space-y-3 pt-2">
              {[
                { label: "WhatsApp alerts (CRITICAL/HIGH)", enabled: true },
                { label: "Email alerts (all severities)", enabled: true },
                { label: "SMS fallback for CRITICAL", enabled: true },
                { label: "Alert language: Hindi", enabled: false },
                { label: "Daily security digest email", enabled: true },
                { label: "Weekly compliance report", enabled: true },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">{item.label}</span>
                  <button className={`w-10 h-5 rounded-full transition-all ${item.enabled ? "bg-blue-600" : "bg-slate-700"}`}>
                    <span className={`block w-4 h-4 rounded-full bg-white mx-0.5 transition-transform ${item.enabled ? "translate-x-5" : "translate-x-0"}`} />
                  </button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Integrations */}
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-blue-400" />
                Integrations
              </h2>
            </CardHeader>
            <CardContent className="space-y-3 pt-2">
              {[
                { name: "Google Workspace", status: "connected", icon: "G" },
                { name: "Microsoft 365", status: "connected", icon: "M" },
                { name: "AWS CloudTrail", status: "connected", icon: "A" },
                { name: "WhatsApp Business API", status: "connected", icon: "W" },
                { name: "Razorpay (Billing)", status: "not connected", icon: "R" },
                { name: "CERT-In Portal API", status: "connected", icon: "C" },
              ].map((int) => (
                <div key={int.name} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 flex-shrink-0">
                    {int.icon}
                  </div>
                  <span className="text-sm text-slate-300 flex-1">{int.name}</span>
                  <span className={`text-xs font-medium ${int.status === "connected" ? "text-emerald-400" : "text-slate-500"}`}>
                    {int.status === "connected" ? "✓ Connected" : "Connect →"}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <button className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-all">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
