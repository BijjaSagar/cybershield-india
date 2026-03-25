"use client";

import { useState } from "react";
import { Topbar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SeverityBadge } from "@/components/ui/badge";
import { mockLogs, mockStats } from "@/lib/mock-data";
import { formatDate, timeAgo } from "@/lib/utils";
import { FileText, Database, Shield, Download, Filter, Server } from "lucide-react";
import { type LogEntry } from "@/types";

const logTypeColors: Record<LogEntry["type"], string> = {
  AUTH: "bg-blue-500/20 text-blue-400",
  FIREWALL: "bg-orange-500/20 text-orange-400",
  ENDPOINT: "bg-purple-500/20 text-purple-400",
  APP: "bg-green-500/20 text-green-400",
  CLOUD: "bg-cyan-500/20 text-cyan-400",
  WEB: "bg-yellow-500/20 text-yellow-400",
  DB: "bg-pink-500/20 text-pink-400",
};

export default function LogsPage() {
  const [typeFilter, setTypeFilter] = useState<LogEntry["type"] | "ALL">("ALL");

  const filtered = typeFilter === "ALL" ? mockLogs : mockLogs.filter(l => l.type === typeFilter);

  return (
    <div>
      <Topbar
        title="Log Vault"
        subtitle="180-day tamper-proof log retention · AWS Mumbai (India data residency)"
      />
      <div className="p-6 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="flex items-center gap-3 py-4">
              <Database className="w-8 h-8 text-blue-400 bg-blue-500/10 rounded-lg p-1.5" />
              <div>
                <div className="text-xl font-bold text-white">{mockStats.logsRetained.toLocaleString("en-IN")}</div>
                <div className="text-xs text-slate-400">Total logs retained</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 py-4">
              <Shield className="w-8 h-8 text-emerald-400 bg-emerald-500/10 rounded-lg p-1.5" />
              <div>
                <div className="text-xl font-bold text-white">180</div>
                <div className="text-xs text-slate-400">Days retained (CERT-In compliant)</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 py-4">
              <Server className="w-8 h-8 text-purple-400 bg-purple-500/10 rounded-lg p-1.5" />
              <div>
                <div className="text-xl font-bold text-white">AWS Mumbai</div>
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

        {/* Log sources */}
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-white text-sm">Active Log Sources</h2>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            {[
              { name: "Google Workspace", status: "active", logs: "2,341 today" },
              { name: "Microsoft 365", status: "active", logs: "1,892 today" },
              { name: "Network Firewall", status: "active", logs: "8,234 today" },
              { name: "AWS CloudTrail", status: "active", logs: "934 today" },
              { name: "Business Website", status: "active", logs: "4,521 today" },
              { name: "MySQL Database", status: "active", logs: "1,203 today" },
              { name: "Windows Endpoints", status: "active", logs: "3,891 today" },
              { name: "CRM Application", status: "warning", logs: "Last: 3h ago" },
            ].map((src) => (
              <div key={src.name} className={`flex items-start gap-2 p-3 rounded-lg border ${
                src.status === "active"
                  ? "bg-emerald-500/5 border-emerald-500/20"
                  : "bg-yellow-500/5 border-yellow-500/20"
              }`}>
                <span className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${
                  src.status === "active" ? "bg-emerald-400" : "bg-yellow-400"
                }`} />
                <div>
                  <div className="text-xs font-medium text-white">{src.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{src.logs}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Log viewer */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="font-semibold text-white">Recent Security Logs</h2>
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="w-4 h-4 text-slate-500" />
                {(["ALL", "AUTH", "FIREWALL", "ENDPOINT", "APP", "CLOUD", "WEB"] as const).map((t) => (
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
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-400 bg-slate-700/60 border border-slate-600/50 hover:text-slate-200 transition-all">
                  <Download className="w-3.5 h-3.5" />
                  Export
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-700/30">
              {filtered.map((log) => (
                <div key={log.id} className="px-5 py-3 hover:bg-slate-700/20 transition-all flex items-start gap-4">
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold flex-shrink-0 mt-0.5 font-mono ${logTypeColors[log.type as LogEntry["type"]]}`}>
                    {log.type}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-slate-300 truncate">{log.event}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{log.source}</div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <SeverityBadge severity={log.severity as import("@/types").Severity} />
                    <span className="text-xs text-slate-500">{timeAgo(log.timestamp)}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-5 py-3 border-t border-slate-700/30">
              <button className="text-xs text-blue-400 hover:text-blue-300 transition-all">
                Load more logs (showing 8 of {mockStats.logsRetained.toLocaleString("en-IN")}) →
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
