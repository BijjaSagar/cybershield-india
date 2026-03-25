"use client";

import { Topbar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ComplianceBadge } from "@/components/ui/badge";
import { mockCertInControls, mockStats } from "@/lib/mock-data";
import {
  Shield, CheckCircle2, AlertCircle, XCircle, Download, Calendar, Award
} from "lucide-react";

function ScoreGauge({ score }: { score: number }) {
  const color = score >= 80 ? "#22c55e" : score >= 60 ? "#eab308" : "#ef4444";
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-32 h-32 mx-auto">
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        <circle cx="60" cy="60" r="54" fill="none" stroke="#1e293b" strokeWidth="10" />
        <circle
          cx="60" cy="60" r="54"
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-white">{score}</span>
        <span className="text-xs text-slate-400">/ 100</span>
      </div>
    </div>
  );
}

export default function CompliancePage() {
  const compliant = mockCertInControls.filter(c => c.status === "compliant").length;
  const partial = mockCertInControls.filter(c => c.status === "partial").length;
  const nonCompliant = mockCertInControls.filter(c => c.status === "non-compliant").length;
  const avgScore = Math.round(mockCertInControls.reduce((s, c) => s + c.score, 0) / mockCertInControls.length);

  return (
    <div>
      <Topbar
        title="Compliance Dashboard"
        subtitle="CERT-In CISG-2024-03 · 15 Elemental Controls for MSMEs · DPDP Act 2023"
      />
      <div className="p-6 space-y-6">
        {/* Summary row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Score gauge */}
          <Card className="md:col-span-1">
            <CardContent className="flex flex-col items-center py-6">
              <ScoreGauge score={avgScore} />
              <div className="mt-3 text-center">
                <div className="text-sm font-semibold text-white">Audit Readiness</div>
                <div className="text-xs text-slate-400 mt-0.5">Audit in {mockStats.daysUntilAudit} days</div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-full py-6">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-2" />
              <div className="text-3xl font-bold text-white">{compliant}</div>
              <div className="text-sm text-slate-400">Compliant</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-full py-6">
              <AlertCircle className="w-8 h-8 text-yellow-400 mb-2" />
              <div className="text-3xl font-bold text-white">{partial}</div>
              <div className="text-sm text-slate-400">Partial</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-full py-6">
              <XCircle className="w-8 h-8 text-red-400 mb-2" />
              <div className="text-3xl font-bold text-white">{nonCompliant}</div>
              <div className="text-sm text-slate-400">Non-Compliant</div>
            </CardContent>
          </Card>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 flex-wrap">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-all">
            <Download className="w-4 h-4" />
            Export Audit Report (PDF)
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-300 text-sm font-medium border border-slate-600/50 transition-all">
            <Calendar className="w-4 h-4" />
            Schedule Audit
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-300 text-sm font-medium border border-slate-600/50 transition-all">
            <Award className="w-4 h-4" />
            Register Nodal Officer
          </button>
        </div>

        {/* 15 Controls */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-400" />
              <h2 className="font-semibold text-white">
                15 Elemental Cyber Defense Controls — CERT-In CISG-2024-03
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Mandatory for all Indian MSMEs · Effective September 1, 2025
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-700/30">
              {mockCertInControls.map((ctrl) => (
                <div key={ctrl.id} className="px-5 py-4 hover:bg-slate-700/20 transition-all">
                  <div className="flex items-start gap-4">
                    {/* Score circle */}
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                      ctrl.status === "compliant"
                        ? "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30"
                        : ctrl.status === "partial"
                        ? "bg-yellow-500/20 text-yellow-400 ring-1 ring-yellow-500/30"
                        : "bg-red-500/20 text-red-400 ring-1 ring-red-500/30"
                    }`}>
                      {ctrl.score}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs text-slate-500 font-mono">Control {ctrl.id}</span>
                        <span className="text-sm font-semibold text-white">{ctrl.name}</span>
                        <ComplianceBadge status={ctrl.status} />
                      </div>
                      <p className="text-sm text-slate-400">{ctrl.details}</p>

                      {/* Progress bar */}
                      <div className="mt-2 flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              ctrl.status === "compliant" ? "bg-emerald-500" :
                              ctrl.status === "partial" ? "bg-yellow-500" : "bg-red-500"
                            }`}
                            style={{ width: `${ctrl.score}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500 flex-shrink-0">{ctrl.score}%</span>
                      </div>
                    </div>

                    {/* Action button */}
                    {ctrl.status !== "compliant" && (
                      <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600/20 text-blue-400 border border-blue-500/20 hover:bg-blue-600/30 transition-all flex-shrink-0">
                        Remediate
                      </button>
                    )}
                    {ctrl.status === "compliant" && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* DPDP Act checklist */}
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-white">DPDP Act 2023 — Compliance Checklist</h2>
            <p className="text-xs text-slate-500 mt-1">Digital Personal Data Protection Act · Enforcement active 2025</p>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {[
              { label: "Data inventory mapping", done: true },
              { label: "Breach detection workflow", done: true },
              { label: "DPB 24-hour notification draft", done: true },
              { label: "Data principal notification template", done: true },
              { label: "Consent log active", done: false },
              { label: "Data deletion request tracker", done: false },
              { label: "Privacy policy DPDP-compliant", done: true },
              { label: "Data Protection Officer (DPO) designated", done: false },
            ].map((item) => (
              <div key={item.label} className={`flex items-center gap-3 p-3 rounded-lg border ${
                item.done
                  ? "bg-emerald-500/5 border-emerald-500/20"
                  : "bg-red-500/5 border-red-500/20"
              }`}>
                {item.done
                  ? <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  : <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                }
                <span className={`text-sm ${item.done ? "text-emerald-300" : "text-slate-400"}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
