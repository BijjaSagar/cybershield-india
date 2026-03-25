import { cn } from "@/lib/utils";
import { type Severity, type ComplianceStatus } from "@/types";

const severityConfig: Record<Severity, string> = {
  CRITICAL: "bg-red-500/20 text-red-400 border border-red-500/30",
  HIGH: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
  MEDIUM: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  LOW: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
};

const complianceConfig: Record<ComplianceStatus, string> = {
  compliant: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  partial: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  "non-compliant": "bg-red-500/20 text-red-400 border border-red-500/30",
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span className={cn("px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide", severityConfig[severity])}>
      {severity}
    </span>
  );
}

export function ComplianceBadge({ status }: { status: ComplianceStatus }) {
  const label = status === "non-compliant" ? "Non-Compliant" : status === "partial" ? "Partial" : "Compliant";
  return (
    <span className={cn("px-2 py-0.5 rounded text-xs font-semibold", complianceConfig[status])}>
      {label}
    </span>
  );
}

export function StatusDot({ active }: { active: boolean }) {
  return (
    <span className={cn("inline-block w-2 h-2 rounded-full", active ? "bg-emerald-400 pulse-dot" : "bg-slate-500")} />
  );
}
