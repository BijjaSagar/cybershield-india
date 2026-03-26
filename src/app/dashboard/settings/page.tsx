"use client";

import { useState, useEffect } from "react";
import { Topbar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Bell, Shield, Globe, Key, RefreshCw, CheckCircle2, AlertCircle, Copy } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

interface Integration {
  provider: string;
  status: string;
  adminEmail?: string;
  tenantId?: string;
  lastSyncAt?: string;
  webhookSecret?: string;
}

function SettingsContent() {
  const searchParams = useSearchParams();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [syncLoading, setSyncLoading] = useState<string | null>(null);
  const [disconnectLoading, setDisconnectLoading] = useState<string | null>(null);
  const [copiedSecret, setCopiedSecret] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    fetchIntegrations();
    const success = searchParams.get("integration_success");
    const error = searchParams.get("integration_error");
    if (success) {
      const names: Record<string, string> = { google: "Google Workspace", microsoft: "Microsoft 365" };
      setToast({ message: `${names[success] ?? success} connected successfully!`, type: "success" });
    }
    if (error) {
      setToast({ message: `Failed to connect integration. Please try again.`, type: "error" });
    }
  }, []);

  async function fetchIntegrations() {
    try {
      const res = await fetch("/api/integrations/status");
      if (res.ok) {
        const data = await res.json();
        setIntegrations(data.integrations ?? []);
      }
    } catch (_) {}
  }

  function getIntegration(provider: string) {
    return integrations.find(i => i.provider === provider && i.status === "active");
  }

  async function syncIntegration(provider: string, endpoint: string) {
    setSyncLoading(provider);
    try {
      const res = await fetch(endpoint, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setToast({ message: data.message ?? "Sync complete", type: "success" });
      } else {
        setToast({ message: data.error ?? "Sync failed", type: "error" });
      }
      await fetchIntegrations();
    } catch (_) {
      setToast({ message: "Network error during sync", type: "error" });
    }
    setSyncLoading(null);
  }

  async function disconnectIntegration(provider: string) {
    if (!confirm(`Disconnect ${provider}? This will stop log ingestion from this source.`)) return;
    setDisconnectLoading(provider);
    try {
      await fetch("/api/integrations/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider }),
      });
      setToast({ message: "Integration disconnected", type: "success" });
      await fetchIntegrations();
    } catch (_) {}
    setDisconnectLoading(null);
  }

  async function createWebhook(provider: string) {
    try {
      const res = await fetch("/api/integrations/webhook/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider }),
      });
      const data = await res.json();
      if (res.ok) {
        setToast({ message: `Webhook created for ${provider}`, type: "success" });
        await fetchIntegrations();
      }
    } catch (_) {}
  }

  function copySecret(secret: string, label: string) {
    navigator.clipboard.writeText(secret);
    setCopiedSecret(label);
    setTimeout(() => setCopiedSecret(null), 2000);
  }

  const googleConnected = getIntegration("google_workspace");
  const microsoftConnected = getIntegration("microsoft_365");

  return (
    <div>
      <Topbar title="Settings" subtitle="Organisation, notifications, integrations" />

      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-sm font-medium shadow-lg flex items-center gap-2 ${
          toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
        }`}>
          {toast.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.message}
          <button onClick={() => setToast(null)} className="ml-2 opacity-70 hover:opacity-100">×</button>
        </div>
      )}

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
              <p className="text-xs text-slate-500 mt-1">Connect your tools to automatically ingest security logs</p>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              {/* Google Workspace */}
              <div className="rounded-lg border border-slate-700/50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">G</div>
                    <div>
                      <div className="text-sm font-medium text-white">Google Workspace</div>
                      {googleConnected ? (
                        <div className="text-xs text-emerald-400">✓ Connected · {googleConnected.adminEmail}</div>
                      ) : (
                        <div className="text-xs text-slate-500">Pulls login, admin, drive audit logs</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {googleConnected ? (
                      <>
                        <button
                          onClick={() => syncIntegration("google_workspace", "/api/integrations/google/sync")}
                          disabled={syncLoading === "google_workspace"}
                          className="px-3 py-1.5 rounded-lg text-xs bg-blue-600/20 text-blue-400 border border-blue-500/20 hover:bg-blue-600/30 transition-all disabled:opacity-50 flex items-center gap-1"
                        >
                          <RefreshCw className={`w-3 h-3 ${syncLoading === "google_workspace" ? "animate-spin" : ""}`} />
                          Sync now
                        </button>
                        <button
                          onClick={() => disconnectIntegration("google_workspace")}
                          disabled={disconnectLoading === "google_workspace"}
                          className="px-3 py-1.5 rounded-lg text-xs bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all disabled:opacity-50"
                        >
                          Disconnect
                        </button>
                      </>
                    ) : (
                      <a
                        href="/api/integrations/google/connect"
                        className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 text-white hover:bg-blue-500 transition-all"
                      >
                        Connect →
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Microsoft 365 */}
              <div className="rounded-lg border border-slate-700/50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">M</div>
                    <div>
                      <div className="text-sm font-medium text-white">Microsoft 365</div>
                      {microsoftConnected ? (
                        <div className="text-xs text-emerald-400">✓ Connected · {microsoftConnected.adminEmail}</div>
                      ) : (
                        <div className="text-xs text-slate-500">Pulls sign-in logs, directory audits</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {microsoftConnected ? (
                      <>
                        <button
                          onClick={() => syncIntegration("microsoft_365", "/api/integrations/microsoft/sync")}
                          disabled={syncLoading === "microsoft_365"}
                          className="px-3 py-1.5 rounded-lg text-xs bg-blue-600/20 text-blue-400 border border-blue-500/20 hover:bg-blue-600/30 transition-all disabled:opacity-50 flex items-center gap-1"
                        >
                          <RefreshCw className={`w-3 h-3 ${syncLoading === "microsoft_365" ? "animate-spin" : ""}`} />
                          Sync now
                        </button>
                        <button
                          onClick={() => disconnectIntegration("microsoft_365")}
                          disabled={disconnectLoading === "microsoft_365"}
                          className="px-3 py-1.5 rounded-lg text-xs bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all disabled:opacity-50"
                        >
                          Disconnect
                        </button>
                      </>
                    ) : (
                      <a
                        href="/api/integrations/microsoft/connect"
                        className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 text-white hover:bg-blue-500 transition-all"
                      >
                        Connect →
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Webhook */}
              <div className="rounded-lg border border-slate-700/50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">W</div>
                    <div>
                      <div className="text-sm font-medium text-white">Generic Webhook</div>
                      <div className="text-xs text-slate-500">Push logs from any system via HTTP</div>
                    </div>
                  </div>
                  <button
                    onClick={() => createWebhook("webhook")}
                    className="px-3 py-1.5 rounded-lg text-xs bg-slate-700/60 text-slate-300 border border-slate-600/50 hover:bg-slate-700 transition-all"
                  >
                    Generate Secret
                  </button>
                </div>
                {getIntegration("webhook")?.webhookSecret && (
                  <div className="mt-2 p-2 rounded bg-slate-900/60 border border-slate-700/30">
                    <div className="text-xs text-slate-500 mb-1">POST to: <span className="text-slate-300 font-mono">https://cybershieldindia.com/api/webhooks/ingest</span></div>
                    <div className="flex items-center gap-2">
                      <code className="text-xs text-blue-300 font-mono truncate">{getIntegration("webhook")!.webhookSecret}</code>
                      <button
                        onClick={() => copySecret(getIntegration("webhook")!.webhookSecret!, "webhook")}
                        className="flex-shrink-0 text-slate-400 hover:text-white"
                      >
                        {copiedSecret === "webhook" ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* AWS CloudTrail - static for now */}
              <div className="rounded-lg border border-slate-700/50 p-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">A</div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">AWS CloudTrail</div>
                  <div className="text-xs text-slate-500">S3 bucket + CloudTrail integration (coming soon)</div>
                </div>
                <span className="text-xs text-slate-500">Coming soon</span>
              </div>
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

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="text-slate-500 text-sm p-6">Loading...</div>}>
      <SettingsContent />
    </Suspense>
  );
}
