import { cn } from "@/lib/utils";
import { type Severity, type ComplianceStatus } from "@/types";

const severityConfig: Record<Severity, string> = {
  CRITICAL: "bg-red-100 text-red-700 border border-red-300",
  HIGH: "bg-orange-100 text-orange-700 border border-orange-300",
  MEDIUM: "bg-yellow-100 text-yellow-700 border border-yellow-300",
  LOW: "bg-blue-100 text-blue-700 border border-blue-300",
};

const complianceConfig: Record<ComplianceStatus, string> = {
  compliant: "bg-emerald-100 text-emerald-700 border border-emerald-300",
  partial: "bg-yellow-100 text-yellow-700 border border-yellow-300",
  "non-compliant": "bg-red-100 text-red-700 border border-red-300",
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
    <span className={cn("inline-block w-2 h-2 rounded-full", active ? "bg-emerald-500 pulse-dot" : "bg-slate-300")} />
  );
}
