"use client";

import { Topbar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SeverityBadge } from "@/components/ui/badge";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line
} from "recharts";
import {
  Shield, Activity, AlertTriangle, FileText, Clock, TrendingUp,
  CheckCircle2, XCircle, AlertCircle, ArrowUpRight
} from "lucide-react";
import { mockStats, mockThreats, mockThreatTrend, mockCertInControls } from "@/lib/mock-data";
import { timeAgo } from "@/lib/utils";
import Link from "next/link";

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color = "blue",
  href,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
  href?: string;
}) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    red: "bg-red-500/10 text-red-400 border-red-500/20",
    green: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
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
          {sub && <div className="text-xs text-slate-500 mt-0.5">{sub}</div>}
        </div>
        {href && <ArrowUpRight className="w-4 h-4 text-slate-600 ml-auto flex-shrink-0 mt-1" />}
      </CardContent>
    </Card>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}

function CertInMini() {
  const compliant = mockCertInControls.filter(c => c.status === "compliant").length;
  const partial = mockCertInControls.filter(c => c.status === "partial").length;
  const nonCompliant = mockCertInControls.filter(c => c.status === "non-compliant").length;

  return (
    <div className="flex items-center gap-4 text-sm">
      <div className="flex items-center gap-1.5 text-emerald-400">
        <CheckCircle2 className="w-4 h-4" />
        <span>{compliant} Compliant</span>
      </div>
      <div className="flex items-center gap-1.5 text-yellow-400">
        <AlertCircle className="w-4 h-4" />
        <span>{partial} Partial</span>
      </div>
      <div className="flex items-center gap-1.5 text-red-400">
        <XCircle className="w-4 h-4" />
        <span>{nonCompliant} Failed</span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const activeThreats = mockThreats.filter(t => t.status === "active" || t.status === "investigating");

  return (
    <div>
      <Topbar
        title="Security Overview"
        subtitle={`Last updated: ${new Date().toLocaleString("en-IN")}`}
      />

      <div className="p-6 space-y-6">
        {/* CERT-In Audit Banner */}
        <div className="rounded-xl bg-blue-600/10 border border-blue-500/20 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-blue-400" />
            <div>
              <span className="text-white font-semibold">CERT-In Annual Audit</span>
              <span className="text-slate-400 text-sm ml-2">in {mockStats.daysUntilAudit} days</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{mockStats.certInScore}%</div>
              <div className="text-xs text-slate-400">Audit Ready</div>
            </div>
            <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${mockStats.certInScore}%` }}
              />
            </div>
            <Link href="/dashboard/compliance" className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-all">
              View Report
            </Link>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard icon={Activity} label="Threats Today" value={mockStats.totalThreatsToday} color="red" href="/dashboard/threats" />
          <StatCard icon={AlertTriangle} label="Active Alerts" value={mockStats.activeAlerts} sub="Requires action" color="orange" href="/dashboard/threats" />
          <StatCard icon={Shield} label="CERT-In Score" value={`${mockStats.certInScore}%`} sub="82 / 100 pts" color="blue" href="/dashboard/compliance" />
          <StatCard icon={FileText} label="Logs Retained" value={mockStats.logsRetained.toLocaleString("en-IN")} sub="180-day vault" color="purple" href="/dashboard/logs" />
          <StatCard icon={Clock} label="Incidents Filed" value={`${mockStats.incidentsFiled}/${mockStats.incidentsThisMonth}`} sub="This month" color="green" href="/dashboard/incidents" />
          <StatCard icon={TrendingUp} label="Training Rate" value={`${mockStats.employeeTrainingRate}%`} sub="6/10 employees" color="yellow" href="/dashboard/awareness" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Threat Trend Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-white">Threat Activity — Last 7 Days</h2>
                <Link href="/dashboard/threats" className="text-xs text-blue-400 hover:text-blue-300">
                  View all →
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={mockThreatTrend} barGap={2}>
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
              <div className="flex gap-4 mt-2 text-xs text-slate-500">
                <span className="flex items-center gap-1"><span className="w-3 h-2 rounded bg-red-500/80 inline-block" /> Detected</span>
                <span className="flex items-center gap-1"><span className="w-3 h-2 rounded bg-green-500/80 inline-block" /> Blocked</span>
              </div>
            </CardContent>
          </Card>

          {/* CERT-In Controls Mini */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-white">CERT-In Controls</h2>
                <Link href="/dashboard/compliance" className="text-xs text-blue-400 hover:text-blue-300">
                  Full report →
                </Link>
              </div>
              <CertInMini />
            </CardHeader>
            <CardContent className="space-y-2 pt-3">
              {mockCertInControls.slice(0, 7).map((ctrl) => (
                <div key={ctrl.id} className="flex items-center gap-3">
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    ctrl.status === "compliant" ? "bg-emerald-400" :
                    ctrl.status === "partial" ? "bg-yellow-400" : "bg-red-400"
                  }`} />
                  <span className="text-xs text-slate-400 flex-1 truncate">{ctrl.id}. {ctrl.name}</span>
                  <span className="text-xs text-slate-500">{ctrl.score}%</span>
                </div>
              ))}
              <Link href="/dashboard/compliance" className="block text-xs text-blue-400 hover:text-blue-300 pt-1">
                + 8 more controls
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Active Threats + Recent Activity */}
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
              {activeThreats.length === 0 ? (
                <div className="text-center py-6 text-slate-500 text-sm">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500/50 mx-auto mb-2" />
                  No active threats
                </div>
              ) : (
                activeThreats.map((t) => (
                  <div key={t.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/30">
                    <SeverityBadge severity={t.severity} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">{t.type}</div>
                      <div className="text-xs text-slate-400 truncate">{t.target} · {t.source_country}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{t.description}</div>
                    </div>
                    <span className="text-xs text-slate-500 flex-shrink-0">{timeAgo(t.timestamp)}</span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Recent Incidents */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-white">Incident Response</h2>
                <Link href="/dashboard/incidents" className="text-xs text-blue-400 hover:text-blue-300">
                  All incidents →
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-3">
              <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                <div className="flex items-center justify-between mb-2">
                  <SeverityBadge severity="CRITICAL" />
                  <span className="text-xs text-orange-400 font-semibold">⏱ 4h 12m remaining</span>
                </div>
                <div className="text-sm font-medium text-white">Ransomware attempt detected</div>
                <div className="text-xs text-slate-400 mt-1">CERT-In report auto-drafted. Review & submit to meet 6-hour deadline.</div>
                <Link href="/dashboard/incidents" className="mt-2 inline-block px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/30 transition-all">
                  Review & Submit Report →
                </Link>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/30">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-xs text-emerald-400 font-semibold">Filed on time</span>
                </div>
                <div className="text-sm font-medium text-white">Unauthorised data access</div>
                <div className="text-xs text-slate-400 mt-0.5">Filed to CERT-In · 18h ago</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
