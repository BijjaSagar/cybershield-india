"use client";

import { useState, useEffect, useCallback } from "react";
import { Topbar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SeverityBadge } from "@/components/ui/badge";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import {
  Shield, Activity, AlertTriangle, FileText, Clock, TrendingUp,
  CheckCircle2, AlertCircle, ArrowUpRight, RefreshCw
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

interface TrendDay {
  day: string;
  threats: number;
  blocked: number;
}

function StatCard({ icon: Icon, label, value, sub, color = "blue", href }: {
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
  const [trend, setTrend] = useState<TrendDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, threatsRes, trendRes] = await Promise.all([
        fetch("/api/dashboard/stats"),
        fetch("/api/threats?limit=5"),
        fetch("/api/threats/trend"),
      ]);
      if (statsRes.ok) setStats(await statsRes.json());
      if (threatsRes.ok) {
        const d = await threatsRes.json();
        setThreats(d.threats ?? []);
      }
      if (trendRes.ok) {
        const d = await trendRes.json();
        setTrend(d.trend ?? []);
      }
    } catch (err) {
      console.error("Dashboard fetch error", err);
    }
    setLoading(false);
    setLastUpdated(new Date().toLocaleString("en-IN"));
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const activeThreats = threats.filter(t => t.status === "ACTIVE" || t.status === "INVESTIGATING");

  return (
    <div>
      <Topbar
        title="Security Overview"
        subtitle={lastUpdated ? `Last updated: ${lastUpdated}` : "Loading..."}
      />
      <div className="p-6 space-y-6">
        {/* CERT-In Audit Banner */}
        <div className="rounded-xl bg-blue-600/10 border border-blue-500/20 px-5 py-4 flex items-center justify-between flex-wrap gap-4">
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
              <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${stats?.complianceScore ?? 0}%` }} />
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
          {/* Threat Trend Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-white">Threat Activity — Last 7 Days</h2>
                <div className="flex items-center gap-3">
                  <button onClick={fetchData} className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1">
                    <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} /> Refresh
                  </button>
                  <Link href="/dashboard/threats" className="text-xs text-blue-400 hover:text-blue-300">View all →</Link>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={trend.length > 0 ? trend : Array.from({ length: 7 }, (_, i) => {
                  const d = new Date(); d.setDate(d.getDate() - (6 - i));
                  return { day: d.toLocaleDateString("en-IN", { weekday: "short" }), threats: 0, blocked: 0 };
                })} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
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
            </CardContent>
          </Card>

          {/* Security Health */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-white">Security Health</h2>
                <Link href="/dashboard/compliance" className="text-xs text-blue-400 hover:text-blue-300">Full report →</Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-3">
              {[
                { label: "Active Threats", value: stats?.threats ?? 0, ok: (stats?.threats ?? 0) === 0 },
                { label: "Open Incidents", value: stats?.incidents ?? 0, ok: (stats?.incidents ?? 0) === 0 },
                { label: "Vulnerabilities", value: stats?.vulnerabilities ?? 0, ok: (stats?.vulnerabilities ?? 0) === 0 },
                { label: "Compliance Score", value: `${stats?.complianceScore ?? 0}%`, ok: (stats?.complianceScore ?? 0) >= 70 },
                { label: "Training Completion", value: `${stats?.trainingScore ?? 0}%`, ok: (stats?.trainingScore ?? 0) >= 70 },
              ].map(({ label, value, ok }) => (
                <div key={label} className="flex items-center gap-3">
                  {ok
                    ? <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    : <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0" />}
                  <span className="text-xs text-slate-400 flex-1">{label}</span>
                  <span className={`text-sm font-semibold ${ok ? "text-emerald-400" : "text-yellow-400"}`}>
                    {loading ? "—" : value}
                  </span>
                </div>
              ))}
              {(stats?.threats === 0 && stats?.incidents === 0 && !loading) && (
                <div className="mt-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <div className="flex items-center gap-2 text-xs text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    All systems secure
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Active Threats + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-400 pulse-dot" />
                  Active Threats
                </h2>
                <Link href="/dashboard/threats" className="text-xs text-blue-400 hover:text-blue-300">All threats →</Link>
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
                activeThreats.map(t => (
                  <div key={t.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/30">
                    <SeverityBadge severity={t.severity as any} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">{t.type}</div>
                      <div className="text-xs text-slate-400 truncate">{t.source}</div>
                      {t.description && <div className="text-xs text-slate-400 mt-0.5 truncate">{t.description}</div>}
                    </div>
                    <span className="text-xs text-slate-400 flex-shrink-0">{timeAgo(t.detectedAt)}</span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="font-semibold text-white">Quick Actions</h2>
            </CardHeader>
            <CardContent className="space-y-3 pt-3">
              {[
                { title: "Connect Google Workspace", desc: "Pull audit logs, login events automatically.", href: "/api/integrations/google/connect", color: "bg-blue-500/10 border-blue-500/20 text-blue-400" },
                { title: "Connect Microsoft 365", desc: "Ingest sign-in logs and directory audits.", href: "/api/integrations/microsoft/connect", color: "bg-purple-500/10 border-purple-500/20 text-purple-400" },
                { title: "Log a new incident", desc: "Create a CERT-In incident report in seconds.", href: "/dashboard/incidents", color: "bg-orange-500/10 border-orange-500/20 text-orange-400" },
                { title: "Complete compliance controls", desc: "Improve your CERT-In audit readiness score.", href: "/dashboard/compliance", color: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" },
              ].map(item => (
                <a key={item.title} href={item.href}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all hover:opacity-80 ${item.color}`}>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white">{item.title}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{item.desc}</div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 flex-shrink-0" />
                </a>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
