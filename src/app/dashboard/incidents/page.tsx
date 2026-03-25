"use client";

import { useState } from "react";
import { Topbar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SeverityBadge } from "@/components/ui/badge";
import { mockIncidents } from "@/lib/mock-data";
import { formatDate, timeAgo } from "@/lib/utils";
import {
  AlertTriangle, Clock, CheckCircle2, Send, FileText, ChevronDown, ChevronUp, Server
} from "lucide-react";

function CountdownTimer({ deadline }: { deadline: string }) {
  const ms = new Date(deadline).getTime() - Date.now();
  if (ms <= 0) return <span className="text-red-400 font-semibold text-xs">⚠ Deadline passed</span>;

  const hours = Math.floor(ms / 3600000);
  const mins = Math.floor((ms % 3600000) / 60000);

  return (
    <span className={`font-semibold text-xs ${hours < 2 ? "text-red-400" : "text-orange-400"}`}>
      ⏱ {hours}h {mins}m remaining
    </span>
  );
}

export default function IncidentsPage() {
  const [expanded, setExpanded] = useState<string | null>("inc-001");

  return (
    <div>
      <Topbar
        title="Incident Response Engine"
        subtitle="CERT-In 6-hour mandatory reporting · Auto-drafted reports"
      />
      <div className="p-6 space-y-5">
        {/* 6-hour explainer banner */}
        <div className="rounded-xl bg-orange-500/10 border border-orange-500/20 px-5 py-4">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-white font-semibold text-sm">6-Hour CERT-In Reporting Requirement</div>
              <div className="text-slate-400 text-xs mt-1">
                Under CERT-In directives, all organisations must report security incidents to CERT-In within <strong className="text-orange-400">6 hours</strong> of detection.
                CyberShield auto-drafts the CERT-In report the moment an incident is detected — you just review and submit.
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="flex items-center gap-3 py-4">
              <AlertTriangle className="w-8 h-8 text-red-400 bg-red-500/10 rounded-lg p-1.5" />
              <div>
                <div className="text-xl font-bold text-white">1</div>
                <div className="text-xs text-slate-400">Pending Action</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 py-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 bg-emerald-500/10 rounded-lg p-1.5" />
              <div>
                <div className="text-xl font-bold text-white">2</div>
                <div className="text-xs text-slate-400">Reports Filed (this month)</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 py-4">
              <Clock className="w-8 h-8 text-blue-400 bg-blue-500/10 rounded-lg p-1.5" />
              <div>
                <div className="text-xl font-bold text-white">100%</div>
                <div className="text-xs text-slate-400">On-time Filing Rate</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Incident list */}
        <div className="space-y-4">
          {mockIncidents.map((inc) => (
            <Card key={inc.id} className={inc.status === "draft_ready" ? "border-orange-500/30" : ""}>
              <button
                className="w-full px-5 py-4 flex items-start gap-4 text-left hover:bg-slate-700/10 transition-all"
                onClick={() => setExpanded(expanded === inc.id ? null : inc.id)}
              >
                <div className="flex-shrink-0 pt-0.5">
                  <SeverityBadge severity={inc.severity} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-white text-sm">{inc.title}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                      inc.status === "draft_ready" ? "bg-orange-500/20 text-orange-400" :
                      inc.status === "filed" ? "bg-blue-500/20 text-blue-400" :
                      inc.status === "closed" ? "bg-emerald-500/20 text-emerald-400" :
                      "bg-yellow-500/20 text-yellow-400"
                    }`}>
                      {inc.status === "draft_ready" ? "🟠 Report Ready — Action Required" :
                       inc.status === "filed" ? "✓ Filed with CERT-In" :
                       inc.status === "closed" ? "✓ Closed" : "Detected"}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>Category: {inc.certInCategory}</span>
                    <span>Detected {timeAgo(inc.detectedAt)}</span>
                    {inc.status === "draft_ready" && <CountdownTimer deadline={inc.deadline} />}
                    {inc.status !== "draft_ready" && inc.reportFiled && (
                      <span className="text-emerald-400">✓ Filed on time</span>
                    )}
                  </div>
                </div>
                {expanded === inc.id ? (
                  <ChevronUp className="w-4 h-4 text-slate-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />
                )}
              </button>

              {expanded === inc.id && (
                <div className="px-5 pb-5 border-t border-slate-700/30 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Description</div>
                      <p className="text-sm text-slate-300">{inc.description}</p>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-2">Affected Systems</div>
                      {inc.affectedSystems.map((sys) => (
                        <div key={sys} className="flex items-center gap-2 mb-1">
                          <Server className="w-3 h-3 text-slate-500" />
                          <span className="text-xs text-slate-400 font-mono">{sys}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <div className="text-slate-500 mb-0.5">Detected at</div>
                      <div className="text-slate-300">{formatDate(inc.detectedAt)}</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <div className="text-slate-500 mb-0.5">CERT-In Deadline</div>
                      <div className={new Date(inc.deadline) > new Date() ? "text-orange-400" : "text-emerald-400"}>
                        {formatDate(inc.deadline)}
                      </div>
                    </div>
                  </div>

                  {/* CERT-In report preview */}
                  {inc.status === "draft_ready" && (
                    <div className="rounded-lg bg-slate-900/60 border border-slate-700/50 p-4 mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <FileText className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-semibold text-white">CERT-In Report — Auto-Drafted</span>
                        <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Ready to Submit</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {[
                          ["Incident Category", inc.certInCategory],
                          ["Organisation Name", "Your Company Pvt Ltd"],
                          ["Nodal Officer", "Akash Sharma (registered)"],
                          ["First Detected", formatDate(inc.detectedAt)],
                          ["Systems Affected", inc.affectedSystems.length.toString()],
                          ["Data Breach", inc.severity === "CRITICAL" ? "Possible — under investigation" : "No"],
                        ].map(([k, v]) => (
                          <div key={k} className="flex gap-2">
                            <span className="text-slate-500 flex-shrink-0">{k}:</span>
                            <span className="text-slate-300">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex gap-2 flex-wrap">
                    {inc.status === "draft_ready" && (
                      <>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-all">
                          <Send className="w-4 h-4" />
                          Submit to CERT-In Portal
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700/60 text-slate-300 text-sm border border-slate-600/50 hover:bg-slate-700 transition-all">
                          <FileText className="w-4 h-4" />
                          Edit Report
                        </button>
                      </>
                    )}
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700/60 text-slate-300 text-sm border border-slate-600/50 hover:bg-slate-700 transition-all">
                      <FileText className="w-4 h-4" />
                      Download PDF
                    </button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
