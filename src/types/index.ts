export type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export type ThreatStatus = "active" | "investigating" | "resolved";

export interface Threat {
  id: string;
  type: string;
  severity: Severity;
  source_ip: string;
  source_country: string;
  target: string;
  attempts: number;
  timestamp: string;
  status: ThreatStatus;
  description: string;
}

export type ComplianceStatus = "compliant" | "partial" | "non-compliant";

export interface CertInControl {
  id: number;
  name: string;
  status: ComplianceStatus;
  score: number;
  details: string;
}

export type IncidentStatus = "detected" | "draft_ready" | "filed" | "closed";

export interface Incident {
  id: string;
  title: string;
  severity: Severity;
  certInCategory: string;
  detectedAt: string;
  deadline: string;
  status: IncidentStatus;
  reportFiled: boolean;
  affectedSystems: string[];
  description: string;
}

export interface LogEntry {
  id: string;
  type: "AUTH" | "FIREWALL" | "ENDPOINT" | "APP" | "CLOUD" | "WEB" | "DB";
  source: string;
  event: string;
  severity: Severity;
  timestamp: string;
}
