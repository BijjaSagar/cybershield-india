"use client";

import { useState } from "react";
import { Topbar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SeverityBadge } from "@/components/ui/badge";
import { mockThreats } from "@/lib/mock-data";
import { timeAgo, formatDate } from "@/lib/utils";
import { Activity, Filter, RefreshCw, Globe, Target, AlertTriangle } from "lucide-react";
import { type Severity, type ThreatStatus } from "@/types";

const severityOrder: Severity[] = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];

export default function ThreatsPage() {
  const [filter, setFilter] = useState<"all" | Severity>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | ThreatStatus>("all");

  const filtered = mockThreats.filter((t) => {
    const bySev = filter === "all" || t.severity === filter;
    const byStat = statusFilter === "all" || t.status === statusFilter;
    return bySev && byStat;
  });

  const counts = {
    CRITICAL: mockThreats.filter(t => t.severity === "CRITICAL").length,
    HIGH: mockThreats.filter(t => t.severity === "HIGH").length,
    MEDIUM: mockThreats.filter(t => t.severity === "MEDIUM").length,
    LOW: mockThreats.filter(t => t.severity === "LOW").length,
  };

  return (
    <div>
      <Topbar
        title="Threat Monitor"
        subtitle="Real-time security monitoring across all systems"
      />
      <div className="p-6 space-y-5">
        {/* Summary cards */}
        <div className="grid grid-cols-4 gap-4">
          {severityOrder.map((sev) => {
            const colorMap: Record<Severity, string> = {
              CRITICAL: "border-red-500/30 bg-red-500/5 text-red-400",
              HIGH: "border-orange-500/30 bg-orange-500/5 text-orange-400",
              MEDIUM: "border-yellow-500/30 bg-yellow-500/5 text-yellow-400",
              LOW: "border-blue-500/30 bg-blue-500/5 text-blue-400",
            };
            return (
              <button
                key={sev}
                onClick={() => setFilter(filter === sev ? "all" : sev)}
                className={`rounded-xl border p-4 text-left transition-all ${colorMap[sev]} ${filter === sev ? "ring-1 ring-current" : "hover:opacity-80"}`}
              >
                <div className="text-2xl font-bold">{counts[sev]}</div>
                <div className="text-sm font-semibold mt-0.5">{sev}</div>
              </button>
            );
          })}
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-sm text-slate-400">
            <Filter className="w-4 h-4" />
            Status:
          </div>
          {(["all", "active", "investigating", "resolved"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                statusFilter === s
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-slate-700/50"
              }`}
            >
              {s}
            </button>
          ))}
          <button className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 bg-slate-800/60 border border-slate-700/50 transition-all">
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>

        {/* Threat table */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400 pulse-dot" />
              <h2 className="font-semibold text-white">
                {filtered.length} threat{filtered.length !== 1 ? "s" : ""} {filter !== "all" ? `(${filter})` : ""}
              </h2>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-700/30">
              {filtered.map((threat) => (
                <div key={threat.id} className="px-5 py-4 hover:bg-slate-700/20 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 pt-0.5">
                      <SeverityBadge severity={threat.severity} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-white text-sm">{threat.type}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                          threat.status === "active" ? "bg-red-500/20 text-red-400" :
                          threat.status === "investigating" ? "bg-yellow-500/20 text-yellow-400" :
                          "bg-emerald-500/20 text-emerald-400"
                        }`}>
                          {threat.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400">{threat.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          {threat.source_ip} ({threat.source_country})
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          {threat.target}
                        </span>
                        <span className="flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          {threat.attempts} attempt{threat.attempts !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                    <div className="text-right text-xs text-slate-500 flex-shrink-0">
                      <div>{timeAgo(threat.timestamp)}</div>
                      <div className="text-slate-600 mt-0.5">{formatDate(threat.timestamp)}</div>
                    </div>
                  </div>

                  {/* Actions for active threats */}
                  {threat.status !== "resolved" && (
                    <div className="flex gap-2 mt-3 ml-[76px]">
                      <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600/20 text-blue-400 border border-blue-500/20 hover:bg-blue-600/30 transition-all">
                        Investigate
                      </button>
                      <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-700/50 text-slate-400 hover:text-slate-200 transition-all">
                        Block IP
                      </button>
                      <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all">
                        Mark Resolved
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
