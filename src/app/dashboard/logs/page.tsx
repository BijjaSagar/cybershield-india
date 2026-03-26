"use client";

import { useState, useEffect, useCallback } from "react";
import { Topbar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SeverityBadge } from "@/components/ui/badge";
import { timeAgo } from "@/lib/utils";
import { FileText, Database, Shield, Download, Filter, Server, RefreshCw } from "lucide-react";

type LogType = "AUTH" | "NETWORK" | "SYSTEM" | "APPLICATION" | "ENDPOINT" | "CLOUD";

interface LogEntry {
  id: string;
  source: string;
  type: string;
  severity: string;
  message: string;
  ipAddress?: string;
  userId?: string;
  timestamp: string;
}

const logTypeColors: Record<string, string> = {
  AUTH: "bg-blue-500/20 text-blue-400",
  NETWORK: "bg-orange-500/20 text-orange-400",
  ENDPOINT: "bg-purple-500/20 text-purple-400",
  APPLICATION: "bg-green-500/20 text-green-400",
  CLOUD: "bg-cyan-500/20 text-cyan-400",
  SYSTEM: "bg-yellow-500/20 text-yellow-400",
};

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<LogType | "ALL">("ALL");
  const [offset, setOffset] = useState(0);
  const LIMIT = 50;

  const fetchLogs = useCallback(async (reset = false) => {
    setLoading(true);
    const newOffset = reset ? 0 : offset;
    try {
      const params = new URLSearchParams({
        limit: LIMIT.toString(),
        offset: newOffset.toString(),
      });
      if (typeFilter !== "ALL") params.set("type", typeFilter);

      const res = await fetch(`/api/logs?${params}`);
      if (res.ok) {
        const data = await res.json();
        if (reset) {
          setLogs(data.logs ?? []);
          setOffset(0);
        } else {
          setLogs(prev => [...prev, ...(data.logs ?? [])]);
        }
        setTotal(data.total ?? 0);
      }
    } catch (err) {
      console.error("Failed to fetch logs", err);
    }
    setLoading(false);
  }, [typeFilter, offset]);

  useEffect(() => {
    fetchLogs(true);
    setOffset(0);
  }, [typeFilter]);

  function loadMore() {
    const newOffset = offset + LIMIT;
    setOffset(newOffset);
  }

  useEffect(() => {
    if (offset > 0) fetchLogs(false);
  }, [offset]);

  return (
    <div>
      <Topbar
        title="Log Vault"
        subtitle="180-day tamper-proof log retention · India data residency"
      />
      <div className="p-6 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="flex items-center gap-3 py-4">
              <Database className="w-8 h-8 text-blue-400 bg-blue-500/10 rounded-lg p-1.5" />
              <div>
                <div className="text-xl font-bold text-white">{loading ? "—" : total.toLocaleString("en-IN")}</div>
                <div className="text-xs text-slate-400">Total logs retained</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 py-4">
              <Shield className="w-8 h-8 text-emerald-400 bg-emerald-500/10 rounded-lg p-1.5" />
              <div>
                <div className="text-xl font-bold text-white">180</div>
                <div className="text-xs text-slate-400">Days retained (CERT-In)</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 py-4">
              <Server className="w-8 h-8 text-purple-400 bg-purple-500/10 rounded-lg p-1.5" />
              <div>
                <div className="text-xl font-bold text-white">NeonDB</div>
                <div className="text-xs text-slate-400">India data residency 🇮🇳</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 py-4">
              <FileText className="w-8 h-8 text-orange-400 bg-orange-500/10 rounded-lg p-1.5" />
              <div>
                <div className="text-xl font-bold text-white">AES-256</div>
                <div className="text-xs text-slate-400">Encrypted at rest</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Log viewer */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="font-semibold text-white">Security Logs</h2>
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="w-4 h-4 text-slate-500" />
                {(["ALL", "AUTH", "NETWORK", "ENDPOINT", "APPLICATION", "CLOUD", "SYSTEM"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTypeFilter(t)}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                      typeFilter === t
                        ? "bg-blue-600 text-white"
                        : "bg-slate-800/60 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {t}
                  </button>
                ))}
                <button
                  onClick={() => fetchLogs(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-400 bg-slate-700/60 border border-slate-600/50 hover:text-slate-200 transition-all"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                  Refresh
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-400 bg-slate-700/60 border border-slate-600/50 hover:text-slate-200 transition-all">
                  <Download className="w-3.5 h-3.5" />
                  Export
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {!loading && logs.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <div className="text-sm font-medium">No logs yet</div>
                <div className="text-xs text-slate-500 mt-1">
                  Connect Google Workspace, Microsoft 365, or use the webhook API to ingest logs
                </div>
              </div>
            ) : (
              <div className="divide-y divide-slate-700/30">
                {logs.map((log) => (
                  <div key={log.id} className="px-5 py-3 hover:bg-slate-700/20 transition-all flex items-start gap-4">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold flex-shrink-0 mt-0.5 font-mono ${logTypeColors[log.type] ?? "bg-slate-500/20 text-slate-400"}`}>
                      {log.type}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-slate-300 truncate">{log.message}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{log.source}{log.ipAddress ? ` · ${log.ipAddress}` : ""}</div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <SeverityBadge severity={log.severity as any} />
                      <span className="text-xs text-slate-500">{timeAgo(log.timestamp)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {logs.length < total && (
              <div className="px-5 py-3 border-t border-slate-700/30">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="text-xs text-blue-400 hover:text-blue-300 transition-all disabled:opacity-50"
                >
                  {loading ? "Loading..." : `Load more (showing ${logs.length} of ${total.toLocaleString("en-IN")}) →`}
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
