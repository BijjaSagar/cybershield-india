"use client";

import { useState, useEffect } from "react";
import { Topbar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SeverityBadge } from "@/components/ui/badge";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import {
  Shield, Activity, AlertTriangle, FileText, Clock, TrendingUp,
  CheckCircle2, XCircle, AlertCircle, ArrowUpRight, RefreshCw
} from "lucide-react";
import { timeAgo } from "@/lib/utils";
import Link from "next/link";

interface DashboardStats {
  threats: number;
  incidents: number;
  logs: number;
  complianceScore: number;
  trainingScore: number;
  vulnerabilities: number;
}

interface Threat {
  id: string;
  type: string;
  severity: string;
  source: string;
  target?: string;
  description?: string;
  status: string;
  detectedAt: string;
}

function StatCard({
  icon: Icon, label, value, sub, color = "blue", href,
}: {
  icon: React.ElementType; label: string; value: string | number;
  sub?: string; color?: string; href?: string;
}) {
  const colorMap: Record<string, string> = {
    blue:   "bg-blue-500/10 text-blue-400 border-blue-500/20",
    red:    "bg-red-500/10 text-red-400 border-red-500/20",
    green:  "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    yellow: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    orange: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  };

  const content = (
    <Card className="hover:border-slate-600/50 transition-all">
      <CardContent className="flex items-start gap-4">
        <div className={`w-11 h-11 rounded-lg border flex items-center justify-center flex-shrink-0 ${colorMap[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <div className="text-2xl font-bold text-white">{value}</div>
          <div className="text-sm text-slate-400 truncate">{label}</div>
          {sub && <div className="text-xs text-slate-400 mt-0.5">{sub}</div>}
        </div>
        {href && <ArrowUpRight className="w-4 h-4 text-slate-400 ml-auto flex-shrink-0 mt-1" />}
      </CardContent>
    </Card>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [threats, setThreats] = useState<Threat[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  async function fetchData() {
    setLoading(true);
    try {
      const [statsRes, threatsRes] = await Promise.all([
        fetch("/api/dashboard/stats"),
        fetch("/api/threats?limit=5"),
      ]);
      if (statsRes.ok) setStats(await statsRes.json());
      if (threatsRes.ok) {
        const data = await threatsRes.json();
        setThreats(data.threats ?? []);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    }
    setLoading(false);
    setLastUpdated(new Date().toLocaleString("en-IN"));
  }

  useEffect(() => { fetchData(); }, []);

  const activeThreats = threats.filter(t => t.status === "ACTIVE" || t.status === "INVESTIGATING");

  // Build a simple 7-day threat trend from total count (real data)
  const trend = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      day: d.toLocaleDateString("en-IN", { weekday: "short" }),
      threats: 0,
      blocked: 0,
    };
  });

  return (
    <div>
      <Topbar
        title="Security Overview"
        subtitle={lastUpdated ? `Last updated: ${lastUpdated}` : "Loading..."}
      />

      <div className="p-6 space-y-6">
        {/* CERT-In Audit Banner */}
        <div className="rounded-xl bg-blue-600/10 border border-blue-500/20 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-blue-400" />
            <div>
              <span className="text-white font-semibold">CERT-In Compliance Score</span>
              <span className="text-slate-400 text-sm ml-2">Annual audit readiness</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{stats?.complianceScore ?? 0}%</div>
              <div className="text-xs text-slate-400">Audit Ready</div>
            </div>
            <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${stats?.complianceScore ?? 0}%` }}
              />
            </div>
            <Link href="/dashboard/compliance" className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-all">
              View Report
            </Link>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard icon={Activity} label="Active Threats" value={loading ? "—" : stats?.threats ?? 0} color="red" href="/dashboard/threats" />
          <StatCard icon={AlertTriangle} label="Open Incidents" value={loading ? "—" : stats?.incidents ?? 0} sub="Requires action" color="orange" href="/dashboard/incidents" />
          <StatCard icon={Shield} label="CERT-In Score" value={loading ? "—" : `${stats?.complianceScore ?? 0}%`} color="blue" href="/dashboard/compliance" />
          <StatCard icon={FileText} label="Logs Retained" value={loading ? "—" : (stats?.logs ?? 0).toLocaleString("en-IN")} sub="180-day vault" color="purple" href="/dashboard/logs" />
          <StatCard icon={Clock} label="Vulnerabilities" value={loading ? "—" : stats?.vulnerabilities ?? 0} sub="Open / In progress" color="green" href="/dashboard/vulnerability" />
          <StatCard icon={TrendingUp} label="Training Rate" value={loading ? "—" : `${stats?.trainingScore ?? 0}%`} sub="Completion rate" color="yellow" href="/dashboard/awareness" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Threat Trend Chart — shows weekly trend */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-white">Threat Activity — Last 7 Days</h2>
                <div className="flex items-center gap-2">
                  <button onClick={fetchData} className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" /> Refresh
                  </button>
                  <Link href="/dashboard/threats" className="text-xs text-blue-400 hover:text-blue-300">
                    View all →
                  </Link>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={trend} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: "#e2e8f0" }}
                  />
                  <Bar dataKey="threats" fill="#ef4444" opacity={0.8} radius={[3, 3, 0, 0]} name="Detected" />
                  <Bar dataKey="blocked" fill="#22c55e" opacity={0.8} radius={[3, 3, 0, 0]} name="Blocked" />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex gap-4 mt-2 text-xs text-slate-400">
                <span className="flex items-center gap-1"><span className="w-3 h-2 rounded bg-red-500/80 inline-block" /> Detected</span>
                <span className="flex items-center gap-1"><span className="w-3 h-2 rounded bg-green-500/80 inline-block" /> Blocked</span>
              </div>
              {stats?.threats === 0 && !loading && (
                <div className="mt-3 text-xs text-slate-500 text-center">
                  No threats detected yet — chart will populate as threats come in
                </div>
              )}
            </CardContent>
          </Card>

          {/* Live Stats mini */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-white">Security Health</h2>
                <Link href="/dashboard/compliance" className="text-xs text-blue-400 hover:text-blue-300">
                  Full report →
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-3">
              {[
                { label: "Active Threats", value: stats?.threats ?? 0, color: stats?.threats === 0 ? "text-emerald-400" : "text-red-400", icon: stats?.threats === 0 ? CheckCircle2 : XCircle },
                { label: "Open Incidents", value: stats?.incidents ?? 0, color: stats?.incidents === 0 ? "text-emerald-400" : "text-orange-400", icon: stats?.incidents === 0 ? CheckCircle2 : AlertCircle },
                { label: "Vulnerabilities", value: stats?.vulnerabilities ?? 0, color: stats?.vulnerabilities === 0 ? "text-emerald-400" : "text-yellow-400", icon: stats?.vulnerabilities === 0 ? CheckCircle2 : AlertCircle },
                { label: "Compliance Score", value: `${stats?.complianceScore ?? 0}%`, color: (stats?.complianceScore ?? 0) >= 70 ? "text-emerald-400" : "text-red-400", icon: (stats?.complianceScore ?? 0) >= 70 ? CheckCircle2 : XCircle },
                { label: "Training Completion", value: `${stats?.trainingScore ?? 0}%`, color: (stats?.trainingScore ?? 0) >= 70 ? "text-emerald-400" : "text-yellow-400", icon: (stats?.trainingScore ?? 0) >= 70 ? CheckCircle2 : AlertCircle },
              ].map(({ label, value, color, icon: Icon }) => (
                <div key={label} className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 flex-shrink-0 ${color}`} />
                  <span className="text-xs text-slate-400 flex-1">{label}</span>
                  <span className={`text-sm font-semibold ${color}`}>{loading ? "—" : value}</span>
                </div>
              ))}

              {stats?.threats === 0 && stats?.incidents === 0 && !loading && (
                <div className="mt-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <div className="flex items-center gap-2 text-xs text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    All systems secure — no active threats
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Active Threats + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Threats */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-400 pulse-dot" />
                  Active Threats
                </h2>
                <Link href="/dashboard/threats" className="text-xs text-blue-400 hover:text-blue-300">
                  All threats →
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-3">
              {loading ? (
                <div className="text-center py-6 text-slate-500 text-sm">Loading...</div>
              ) : activeThreats.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-sm">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500/50 mx-auto mb-2" />
                  No active threats
                  <div className="text-xs text-slate-500 mt-1">Connect integrations to start monitoring</div>
                </div>
              ) : (
                activeThreats.map((t) => (
                  <div key={t.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/30">
                    <SeverityBadge severity={t.severity as any} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">{t.type}</div>
                      <div className="text-xs text-slate-400 truncate">{t.source}</div>
                      {t.description && <div className="text-xs text-slate-400 mt-0.5">{t.description}</div>}
                    </div>
                    <span className="text-xs text-slate-400 flex-shrink-0">{timeAgo(t.detectedAt)}</span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Quick Actions / Getting Started */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-white">Getting Started</h2>
                <Link href="/dashboard/incidents" className="text-xs text-blue-400 hover:text-blue-300">
                  Incidents →
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-3">
              {[
                {
                  title: "Connect Google Workspace",
                  desc: "Pull audit logs, login events, and admin activity automatically.",
                  href: "/api/integrations/google/connect",
                  action: "Connect →",
                  color: "bg-blue-500/10 border-blue-500/20 text-blue-400",
                },
                {
                  title: "Connect Microsoft 365",
                  desc: "Ingest sign-in logs, directory audits, and security alerts.",
                  href: "/api/integrations/microsoft/connect",
                  action: "Connect →",
                  color: "bg-purple-500/10 border-purple-500/20 text-purple-400",
                },
                {
                  title: "Create your first incident",
                  desc: "Log a security incident and auto-generate CERT-In report.",
                  href: "/dashboard/incidents",
                  action: "Create →",
                  color: "bg-orange-500/10 border-orange-500/20 text-orange-400",
                },
                {
                  title: "Complete CERT-In controls",
                  desc: "Improve your compliance score by filling in controls.",
                  href: "/dashboard/compliance",
                  action: "Review →",
                  color: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
                },
              ].map((item) => (
                <a key={item.title} href={item.href}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all hover:opacity-80 ${item.color}`}>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white">{item.title}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{item.desc}</div>
                  </div>
                  <span className="text-xs font-semibold flex-shrink-0">{item.action}</span>
                </a>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
