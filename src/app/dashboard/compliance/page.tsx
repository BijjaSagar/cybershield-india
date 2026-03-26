"use client";

import { useState, useEffect, useCallback } from "react";
import { Topbar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ComplianceBadge } from "@/components/ui/badge";
import {
  Shield, CheckCircle2, AlertCircle, XCircle, Download, RefreshCw
} from "lucide-react";

interface ComplianceItem {
  id: string;
  controlId: string;
  controlName: string;
  status: "COMPLIANT" | "PARTIAL" | "NON_COMPLIANT" | "NOT_STARTED";
  description: string;
  evidence?: string;
  notes?: string;
  score: number;
}

interface ComplianceData {
  certIn: ComplianceItem[];
  dpdp: ComplianceItem[];
  score: number;
}

function ScoreGauge({ score }: { score: number }) {
  const color = score >= 80 ? "#22c55e" : score >= 60 ? "#eab308" : "#ef4444";
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="relative w-32 h-32 mx-auto">
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        <circle cx="60" cy="60" r="54" fill="none" stroke="#1e293b" strokeWidth="10" />
        <circle cx="60" cy="60" r="54" fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          className="transition-all duration-700" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-white">{score}</span>
        <span className="text-xs text-slate-400">/ 100</span>
      </div>
    </div>
  );
}

const STATUS_OPTIONS = ["NOT_STARTED", "PARTIAL", "COMPLIANT", "NON_COMPLIANT"] as const;
const STATUS_LABELS: Record<string, string> = {
  NOT_STARTED: "Not Started",
  PARTIAL: "Partial",
  COMPLIANT: "Compliant",
  NON_COMPLIANT: "Non-Compliant",
};

export default function CompliancePage() {
  const [data, setData] = useState<ComplianceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [evidenceMap, setEvidenceMap] = useState<Record<string, string>>({});

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/compliance");
      if (res.ok) setData(await res.json());
    } catch (err) {
      console.error("Failed to fetch compliance", err);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function updateStatus(id: string, status: string) {
    setUpdating(id);
    try {
      await fetch(`/api/compliance/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, evidence: evidenceMap[id] }),
      });
      await fetchData();
    } catch (err) {
      console.error("Failed to update", err);
    }
    setUpdating(null);
  }

  async function saveEvidence(id: string) {
    setUpdating(id);
    await fetch(`/api/compliance/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ evidence: evidenceMap[id] ?? "" }),
    });
    await fetchData();
    setUpdating(null);
  }

  const certIn = data?.certIn ?? [];
  const dpdp = data?.dpdp ?? [];
  const score = data?.score ?? 0;
  const compliant = certIn.filter(c => c.status === "COMPLIANT").length;
  const partial = certIn.filter(c => c.status === "PARTIAL").length;
  const nonCompliant = certIn.filter(c => c.status === "NON_COMPLIANT").length;
  const notStarted = certIn.filter(c => c.status === "NOT_STARTED").length;

  return (
    <div>
      <Topbar
        title="Compliance Dashboard"
        subtitle="CERT-In CISG-2024-03 · 15 Elemental Controls for MSMEs · DPDP Act 2023"
      />
      <div className="p-6 space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="md:col-span-1">
            <CardContent className="flex flex-col items-center py-6">
              <ScoreGauge score={score} />
              <div className="mt-3 text-center">
                <div className="text-sm font-semibold text-white">Audit Readiness</div>
                <div className="text-xs text-slate-400 mt-0.5">{compliant} / {certIn.length} controls passed</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-full py-6">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-2" />
              <div className="text-3xl font-bold text-white">{loading ? "—" : compliant}</div>
              <div className="text-sm text-slate-400">Compliant</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-full py-6">
              <AlertCircle className="w-8 h-8 text-yellow-400 mb-2" />
              <div className="text-3xl font-bold text-white">{loading ? "—" : partial}</div>
              <div className="text-sm text-slate-400">Partial</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-full py-6">
              <XCircle className="w-8 h-8 text-red-400 mb-2" />
              <div className="text-3xl font-bold text-white">{loading ? "—" : nonCompliant + notStarted}</div>
              <div className="text-sm text-slate-400">Needs Action</div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex gap-3 flex-wrap">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-all">
            <Download className="w-4 h-4" /> Export Audit Report (PDF)
          </button>
          <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-300 text-sm font-medium border border-slate-600/50 transition-all">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>

        {/* 15 CERT-In Controls */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-400" />
              <h2 className="font-semibold text-white">15 Elemental Cyber Defense Controls — CERT-In CISG-2024-03</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">Click a control to update its status and add evidence. Mandatory for all Indian MSMEs.</p>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="text-center py-12 text-slate-500 text-sm">Loading controls...</div>
            ) : certIn.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-sm">No compliance controls found. Register to seed them.</div>
            ) : (
              <div className="divide-y divide-slate-700/30">
                {certIn.map((ctrl) => (
                  <div key={ctrl.id}>
                    <button
                      className="w-full px-5 py-4 hover:bg-slate-700/20 transition-all text-left"
                      onClick={() => setExpandedId(expandedId === ctrl.id ? null : ctrl.id)}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                          ctrl.status === "COMPLIANT" ? "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30" :
                          ctrl.status === "PARTIAL" ? "bg-yellow-500/20 text-yellow-400 ring-1 ring-yellow-500/30" :
                          ctrl.status === "NON_COMPLIANT" ? "bg-red-500/20 text-red-400 ring-1 ring-red-500/30" :
                          "bg-slate-700/50 text-slate-400 ring-1 ring-slate-600/30"
                        }`}>
                          {ctrl.score}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1 flex-wrap">
                            <span className="text-xs text-slate-500 font-mono">{ctrl.controlId}</span>
                            <span className="text-sm font-semibold text-white">{ctrl.controlName}</span>
                            <ComplianceBadge status={ctrl.status.toLowerCase().replace("_", "-") as any} />
                          </div>
                          <p className="text-sm text-slate-400 text-left">{ctrl.description}</p>
                          <div className="mt-2 flex items-center gap-3">
                            <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full transition-all duration-500 ${
                                ctrl.status === "COMPLIANT" ? "bg-emerald-500" :
                                ctrl.status === "PARTIAL" ? "bg-yellow-500" :
                                ctrl.status === "NON_COMPLIANT" ? "bg-red-500" : "bg-slate-600"
                              }`} style={{ width: `${ctrl.score}%` }} />
                            </div>
                            <span className="text-xs text-slate-500 flex-shrink-0">{ctrl.score}%</span>
                          </div>
                        </div>
                        {ctrl.status === "COMPLIANT" && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                        )}
                      </div>
                    </button>

                    {expandedId === ctrl.id && (
                      <div className="px-5 pb-5 pt-2 bg-slate-800/20 border-t border-slate-700/20">
                        <div className="mb-3">
                          <label className="block text-xs text-slate-500 mb-1">Update Status</label>
                          <div className="flex gap-2 flex-wrap">
                            {STATUS_OPTIONS.map(s => (
                              <button
                                key={s}
                                onClick={() => updateStatus(ctrl.id, s)}
                                disabled={updating === ctrl.id}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-50 ${
                                  ctrl.status === s
                                    ? "bg-blue-600 text-white"
                                    : "bg-slate-700/60 text-slate-400 hover:text-slate-200 border border-slate-600/50"
                                }`}
                              >
                                {updating === ctrl.id && ctrl.status !== s ? "..." : STATUS_LABELS[s]}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">Evidence / Notes</label>
                          <textarea
                            rows={2}
                            value={evidenceMap[ctrl.id] ?? ctrl.evidence ?? ""}
                            onChange={e => setEvidenceMap(prev => ({ ...prev, [ctrl.id]: e.target.value }))}
                            placeholder="Add evidence, links, or notes..."
                            className="w-full bg-slate-900/60 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500/50 resize-none"
                          />
                          <button
                            onClick={() => saveEvidence(ctrl.id)}
                            disabled={updating === ctrl.id}
                            className="mt-2 px-3 py-1.5 rounded-lg text-xs bg-blue-600/20 text-blue-400 border border-blue-500/20 hover:bg-blue-600/30 transition-all disabled:opacity-50"
                          >
                            Save Evidence
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* DPDP Act Checklist */}
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-white">DPDP Act 2023 — Compliance Checklist</h2>
            <p className="text-xs text-slate-500 mt-1">Digital Personal Data Protection Act · Click to update status</p>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {loading ? (
              <div className="col-span-2 text-center py-6 text-slate-500 text-sm">Loading...</div>
            ) : dpdp.length === 0 ? (
              <div className="col-span-2 text-center py-6 text-slate-500 text-sm">DPDP controls not found.</div>
            ) : (
              dpdp.map((item) => (
                <div key={item.id} className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                  item.status === "COMPLIANT" ? "bg-emerald-500/5 border-emerald-500/20" :
                  item.status === "PARTIAL" ? "bg-yellow-500/5 border-yellow-500/20" :
                  "bg-red-500/5 border-red-500/20"
                }`}>
                  {item.status === "COMPLIANT"
                    ? <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    : <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />}
                  <div className="flex-1 min-w-0">
                    <span className={`text-sm ${item.status === "COMPLIANT" ? "text-emerald-300" : "text-slate-400"}`}>
                      {item.controlName}
                    </span>
                  </div>
                  <select
                    value={item.status}
                    onChange={e => updateStatus(item.id, e.target.value)}
                    disabled={updating === item.id}
                    className="text-xs bg-slate-800 border border-slate-700/50 rounded px-2 py-1 text-slate-300 focus:outline-none focus:border-blue-500/50"
                  >
                    {STATUS_OPTIONS.map(s => (
                      <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                    ))}
                  </select>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
