"use client";

import { useState, useEffect, useCallback } from "react";
import { Topbar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SeverityBadge } from "@/components/ui/badge";
import { timeAgo, formatDate } from "@/lib/utils";
import { Filter, RefreshCw, Globe, Target, CheckCircle2 } from "lucide-react";

type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
type ThreatStatus = "ACTIVE" | "INVESTIGATING" | "MITIGATED" | "FALSE_POSITIVE";

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

const severityOrder: Severity[] = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];

export default function ThreatsPage() {
  const [threats, setThreats] = useState<Threat[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | Severity>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | ThreatStatus>("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchThreats = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== "all") params.set("severity", filter);
      if (statusFilter !== "all") params.set("status", statusFilter);
      params.set("limit", "50");

      const res = await fetch(`/api/threats?${params}`);
      if (res.ok) {
        const data = await res.json();
        setThreats(data.threats ?? []);
        setTotal(data.total ?? 0);
      }
    } catch (err) {
      console.error("Failed to fetch threats", err);
    }
    setLoading(false);
  }, [filter, statusFilter]);

  useEffect(() => { fetchThreats(); }, [fetchThreats]);

  async function updateStatus(id: string, status: string) {
    setActionLoading(id);
    try {
      await fetch(`/api/threats/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      await fetchThreats();
    } catch (err) {
      console.error("Failed to update threat", err);
    }
    setActionLoading(null);
  }

  // Count by severity from current full data
  const allThreats = threats;
  const counts = {
    CRITICAL: allThreats.filter(t => t.severity === "CRITICAL").length,
    HIGH: allThreats.filter(t => t.severity === "HIGH").length,
    MEDIUM: allThreats.filter(t => t.severity === "MEDIUM").length,
    LOW: allThreats.filter(t => t.severity === "LOW").length,
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
                <div className="text-2xl font-bold">{loading ? "—" : counts[sev]}</div>
                <div className="text-sm font-semibold mt-0.5">{sev}</div>
              </button>
            );
          })}
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1 text-sm text-slate-400">
            <Filter className="w-4 h-4" />
            Status:
          </div>
          {(["all", "ACTIVE", "INVESTIGATING", "MITIGATED"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                statusFilter === s
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-slate-700/50"
              }`}
            >
              {s.toLowerCase()}
            </button>
          ))}
          <button
            onClick={fetchThreats}
            className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 bg-slate-800/60 border border-slate-700/50 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Threat table */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400 pulse-dot" />
              <h2 className="font-semibold text-white">
                {loading ? "Loading..." : `${total} threat${total !== 1 ? "s" : ""}${filter !== "all" ? ` (${filter})` : ""}`}
              </h2>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {!loading && threats.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <CheckCircle2 className="w-12 h-12 text-emerald-500/30 mx-auto mb-3" />
                <div className="text-sm font-medium">No threats detected</div>
                <div className="text-xs text-slate-500 mt-1">
                  Connect Google Workspace or Microsoft 365 to start monitoring
                </div>
              </div>
            ) : (
              <div className="divide-y divide-slate-700/30">
                {threats.map((threat) => (
                  <div key={threat.id} className="px-5 py-4 hover:bg-slate-700/20 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 pt-0.5">
                        <SeverityBadge severity={threat.severity as any} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-semibold text-white text-sm">{threat.type}</span>
                          <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                            threat.status === "ACTIVE" ? "bg-red-500/20 text-red-400" :
                            threat.status === "INVESTIGATING" ? "bg-yellow-500/20 text-yellow-400" :
                            threat.status === "MITIGATED" ? "bg-emerald-500/20 text-emerald-400" :
                            "bg-slate-500/20 text-slate-400"
                          }`}>
                            {threat.status.toLowerCase()}
                          </span>
                        </div>
                        {threat.description && <p className="text-sm text-slate-400">{threat.description}</p>}
                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            {threat.source}
                          </span>
                          {threat.target && (
                            <span className="flex items-center gap-1">
                              <Target className="w-3 h-3" />
                              {threat.target}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right text-xs text-slate-500 flex-shrink-0">
                        <div>{timeAgo(threat.detectedAt)}</div>
                        <div className="text-slate-600 mt-0.5">{formatDate(threat.detectedAt)}</div>
                      </div>
                    </div>

                    {/* Actions for active threats */}
                    {(threat.status === "ACTIVE" || threat.status === "INVESTIGATING") && (
                      <div className="flex gap-2 mt-3 ml-[76px]">
                        {threat.status === "ACTIVE" && (
                          <button
                            onClick={() => updateStatus(threat.id, "INVESTIGATING")}
                            disabled={actionLoading === threat.id}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600/20 text-blue-400 border border-blue-500/20 hover:bg-blue-600/30 transition-all disabled:opacity-50"
                          >
                            Investigate
                          </button>
                        )}
                        <button
                          onClick={() => updateStatus(threat.id, "MITIGATED")}
                          disabled={actionLoading === threat.id}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all disabled:opacity-50"
                        >
                          Mark Resolved
                        </button>
                        <button
                          onClick={() => updateStatus(threat.id, "FALSE_POSITIVE")}
                          disabled={actionLoading === threat.id}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-700/50 text-slate-400 hover:text-slate-200 transition-all disabled:opacity-50"
                        >
                          False Positive
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
