"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { Topbar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Bell, Shield, Globe, Key, RefreshCw, CheckCircle2, AlertCircle, Copy, Save } from "lucide-react";
import { useSearchParams } from "next/navigation";

interface OrgSettings {
  id: string;
  name: string;
  plan: string;
  industry: string;
  employeeCount: number;
  gstNumber: string;
  nodalOfficer: string;
  nodalEmail: string;
  nodalPhone: string;
  certInId: string;
  subscriptionStatus: string;
  trialEndsAt?: string;
}

interface UserSettings {
  name: string;
  email: string;
  phone: string;
}

interface Integration {
  provider: string;
  status: string;
  adminEmail?: string;
  lastSyncAt?: string;
  webhookSecret?: string;
}

function SettingsContent() {
  const searchParams = useSearchParams();
  const [org, setOrg] = useState<OrgSettings | null>(null);
  const [user, setUser] = useState<UserSettings | null>(null);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncLoading, setSyncLoading] = useState<string | null>(null);
  const [disconnectLoading, setDisconnectLoading] = useState<string | null>(null);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Local editable state
  const [orgForm, setOrgForm] = useState<Partial<OrgSettings>>({});
  const [userForm, setUserForm] = useState<Partial<UserSettings>>({});

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const [settingsRes, intRes] = await Promise.all([
        fetch("/api/settings"),
        fetch("/api/integrations/status"),
      ]);
      if (settingsRes.ok) {
        const d = await settingsRes.json();
        setOrg(d.org);
        setUser(d.user);
        setOrgForm(d.org);
        setUserForm(d.user);
      }
      if (intRes.ok) {
        const d = await intRes.json();
        setIntegrations(d.integrations ?? []);
      }
    } catch (_) {}
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSettings();
    const success = searchParams.get("integration_success");
    const error = searchParams.get("integration_error");
    if (success) showToast(`Integration connected successfully!`, "success");
    if (error) showToast("Failed to connect integration. Please try again.", "error");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function showToast(message: string, type: "success" | "error") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }

  async function saveSettings() {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...orgForm,
          userName: userForm.name,
          userPhone: userForm.phone,
        }),
      });
      if (res.ok) showToast("Settings saved successfully", "success");
      else showToast("Failed to save settings", "error");
    } catch (_) {
      showToast("Network error", "error");
    }
    setSaving(false);
  }

  function getIntegration(provider: string) {
    return integrations.find(i => i.provider === provider && i.status === "active");
  }

  async function syncIntegration(provider: string, endpoint: string) {
    setSyncLoading(provider);
    try {
      const res = await fetch(endpoint, { method: "POST" });
      const data = await res.json();
      showToast(res.ok ? (data.message ?? "Sync complete") : (data.error ?? "Sync failed"), res.ok ? "success" : "error");
      await fetchSettings();
    } catch (_) {
      showToast("Network error during sync", "error");
    }
    setSyncLoading(null);
  }

  async function disconnectIntegration(provider: string) {
    if (!confirm(`Disconnect ${provider}?`)) return;
    setDisconnectLoading(provider);
    await fetch("/api/integrations/disconnect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider }),
    });
    showToast("Integration disconnected", "success");
    await fetchSettings();
    setDisconnectLoading(null);
  }

  async function createWebhook() {
    const res = await fetch("/api/integrations/webhook/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider: "webhook" }),
    });
    if (res.ok) { showToast("Webhook secret generated", "success"); await fetchSettings(); }
  }

  function copySecret(secret: string) {
    navigator.clipboard.writeText(secret);
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2000);
  }

  const googleConn = getIntegration("google_workspace");
  const msConn = getIntegration("microsoft_365");
  const webhookConn = getIntegration("webhook");

  return (
    <div>
      <Topbar title="Settings" subtitle="Organisation, notifications, integrations" />

      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-sm font-medium shadow-lg flex items-center gap-2 ${
          toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
        }`}>
          {toast.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.message}
          <button onClick={() => setToast(null)} className="ml-2 opacity-70 hover:opacity-100 text-lg leading-none">×</button>
        </div>
      )}

      <div className="p-6 space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Organisation */}
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-400" /> Organisation
              </h2>
              {org && (
                <div className="text-xs text-slate-500 mt-1">
                  Plan: <span className="text-blue-400 font-medium">{org.plan}</span> ·
                  Status: <span className={`font-medium ${org.subscriptionStatus === "TRIAL" ? "text-yellow-400" : "text-emerald-400"}`}>
                    {org.subscriptionStatus}
                  </span>
                  {org.trialEndsAt && org.subscriptionStatus === "TRIAL" && (
                    <> · Trial ends {new Date(org.trialEndsAt).toLocaleDateString("en-IN")}</>
                  )}
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              {loading ? (
                <div className="text-slate-500 text-sm py-4 text-center">Loading...</div>
              ) : (
                <>
                  {[
                    { label: "Company Name", key: "name", type: "text" },
                    { label: "Industry / Sector", key: "industry", type: "text" },
                    { label: "Employee Count", key: "employeeCount", type: "number" },
                    { label: "GSTIN", key: "gstNumber", type: "text" },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-xs text-slate-500 mb-1">{f.label}</label>
                      <input type={f.type}
                        value={(orgForm as any)[f.key] ?? ""}
                        onChange={e => setOrgForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                        className="w-full bg-slate-900/60 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500/50" />
                    </div>
                  ))}
                </>
              )}
            </CardContent>
          </Card>

          {/* CERT-In Nodal Officer */}
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" /> CERT-In Nodal Officer
              </h2>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              {loading ? (
                <div className="text-slate-500 text-sm py-4 text-center">Loading...</div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Your Name</label>
                    <input type="text" value={userForm.name ?? ""}
                      onChange={e => setUserForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-slate-900/60 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500/50" />
                  </div>
                  {[
                    { label: "Nodal Officer Name", key: "nodalOfficer" },
                    { label: "Nodal Officer Email", key: "nodalEmail" },
                    { label: "Nodal Officer Mobile", key: "nodalPhone" },
                    { label: "CERT-In Registration ID", key: "certInId" },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-xs text-slate-500 mb-1">{f.label}</label>
                      <input type="text"
                        value={(orgForm as any)[f.key] ?? ""}
                        onChange={e => setOrgForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                        className="w-full bg-slate-900/60 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500/50" />
                    </div>
                  ))}
                </>
              )}
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-400" /> Alert Notifications
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
              ].map(item => (
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
                <Key className="w-4 h-4 text-blue-400" /> Integrations
              </h2>
              <p className="text-xs text-slate-500 mt-1">Connect your tools to auto-ingest security logs</p>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              {/* Google Workspace */}
              <div className="rounded-lg border border-slate-700/50 p-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-xs font-bold text-white">G</div>
                    <div>
                      <div className="text-sm font-medium text-white">Google Workspace</div>
                      {googleConn
                        ? <div className="text-xs text-emerald-400">Connected · {googleConn.adminEmail}</div>
                        : <div className="text-xs text-slate-500">Pulls login, admin, drive audit logs</div>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {googleConn ? (
                      <>
                        <button onClick={() => syncIntegration("google_workspace", "/api/integrations/google/sync")}
                          disabled={syncLoading === "google_workspace"}
                          className="px-3 py-1.5 rounded-lg text-xs bg-blue-600/20 text-blue-400 border border-blue-500/20 hover:bg-blue-600/30 transition-all disabled:opacity-50 flex items-center gap-1">
                          <RefreshCw className={`w-3 h-3 ${syncLoading === "google_workspace" ? "animate-spin" : ""}`} /> Sync
                        </button>
                        <button onClick={() => disconnectIntegration("google_workspace")} disabled={disconnectLoading === "google_workspace"}
                          className="px-3 py-1.5 rounded-lg text-xs bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all disabled:opacity-50">
                          Disconnect
                        </button>
                      </>
                    ) : (
                      <a href="/api/integrations/google/connect"
                        className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 text-white hover:bg-blue-500 transition-all">Connect →</a>
                    )}
                  </div>
                </div>
              </div>

              {/* Microsoft 365 */}
              <div className="rounded-lg border border-slate-700/50 p-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-xs font-bold text-white">M</div>
                    <div>
                      <div className="text-sm font-medium text-white">Microsoft 365</div>
                      {msConn
                        ? <div className="text-xs text-emerald-400">Connected · {msConn.adminEmail}</div>
                        : <div className="text-xs text-slate-500">Pulls sign-in logs, directory audits</div>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {msConn ? (
                      <>
                        <button onClick={() => syncIntegration("microsoft_365", "/api/integrations/microsoft/sync")}
                          disabled={syncLoading === "microsoft_365"}
                          className="px-3 py-1.5 rounded-lg text-xs bg-blue-600/20 text-blue-400 border border-blue-500/20 hover:bg-blue-600/30 transition-all disabled:opacity-50 flex items-center gap-1">
                          <RefreshCw className={`w-3 h-3 ${syncLoading === "microsoft_365" ? "animate-spin" : ""}`} /> Sync
                        </button>
                        <button onClick={() => disconnectIntegration("microsoft_365")} disabled={disconnectLoading === "microsoft_365"}
                          className="px-3 py-1.5 rounded-lg text-xs bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all disabled:opacity-50">
                          Disconnect
                        </button>
                      </>
                    ) : (
                      <a href="/api/integrations/microsoft/connect"
                        className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 text-white hover:bg-blue-500 transition-all">Connect →</a>
                    )}
                  </div>
                </div>
              </div>

              {/* Webhook */}
              <div className="rounded-lg border border-slate-700/50 p-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-xs font-bold text-white">W</div>
                    <div>
                      <div className="text-sm font-medium text-white">Generic Webhook</div>
                      <div className="text-xs text-slate-500">Push logs from any system via HTTP POST</div>
                    </div>
                  </div>
                  <button onClick={createWebhook}
                    className="px-3 py-1.5 rounded-lg text-xs bg-slate-700/60 text-slate-300 border border-slate-600/50 hover:bg-slate-700 transition-all">
                    {webhookConn ? "Regenerate" : "Generate Secret"}
                  </button>
                </div>
                {webhookConn?.webhookSecret && (
                  <div className="mt-3 p-3 rounded bg-slate-900/60 border border-slate-700/30 space-y-1">
                    <div className="text-xs text-slate-500">POST to: <span className="text-slate-300 font-mono text-xs">https://cybershieldindia.com/api/webhooks/ingest</span></div>
                    <div className="flex items-center gap-2">
                      <code className="text-xs text-blue-300 font-mono truncate flex-1">{webhookConn.webhookSecret}</code>
                      <button onClick={() => copySecret(webhookConn.webhookSecret!)} className="text-slate-400 hover:text-white flex-shrink-0">
                        {copiedSecret ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <button onClick={saveSettings} disabled={saving || loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium transition-all">
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Settings"}
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
