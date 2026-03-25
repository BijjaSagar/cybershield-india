// Mock data for CyberShield India dashboard
// Replace with real API calls when backend is ready

import { type Threat, type CertInControl, type Incident, type LogEntry } from "@/types";

// Fixed base time — avoids SSR/client hydration mismatch caused by Date.now()
const BASE = new Date("2026-03-25T11:30:00.000Z").getTime();
const t = (offsetMs: number) => new Date(BASE - offsetMs).toISOString();

export const mockThreats: Threat[] = [
  {
    id: "t1",
    type: "Brute Force",
    severity: "CRITICAL" as const,
    source_ip: "45.33.32.156",
    source_country: "Russia",
    target: "Admin Login Portal",
    attempts: 23,
    timestamp: t(5 * 60000),
    status: "active" as const,
    description: "अज्ञात स्थान से लॉगिन प्रयास: 23 बार असफल। तुरंत कार्रवाई करें।",
  },
  {
    id: "t2",
    type: "Phishing Attempt",
    severity: "HIGH" as const,
    source_ip: "104.21.44.23",
    source_country: "Ukraine",
    target: "Employee Email",
    attempts: 1,
    timestamp: t(18 * 60000),
    status: "investigating" as const,
    description: "Malicious link clicked in phishing email by 1 employee.",
  },
  {
    id: "t3",
    type: "Port Scan",
    severity: "MEDIUM" as const,
    source_ip: "185.220.101.45",
    source_country: "Germany",
    target: "Network Perimeter",
    attempts: 480,
    timestamp: t(2 * 3600000),
    status: "resolved" as const,
    description: "Automated port scan detected. Firewall rule applied.",
  },
  {
    id: "t4",
    type: "SQL Injection",
    severity: "HIGH" as const,
    source_ip: "103.21.58.11",
    source_country: "China",
    target: "Business Web App",
    attempts: 7,
    timestamp: t(4 * 3600000),
    status: "resolved" as const,
    description: "SQL injection attempt on customer portal login form.",
  },
  {
    id: "t5",
    type: "Anomalous Login",
    severity: "MEDIUM" as const,
    source_ip: "49.37.202.89",
    source_country: "India",
    target: "Admin Account",
    attempts: 1,
    timestamp: t(6 * 3600000),
    status: "resolved" as const,
    description: "Login from new device/location. Verified by user.",
  },
];

export const mockCertInControls: CertInControl[] = [
  { id: 1, name: "Asset Inventory", status: "compliant" as const, score: 100, details: "127 assets auto-discovered and catalogued" },
  { id: 2, name: "Network Security", status: "compliant" as const, score: 94, details: "Firewall rules active, segmentation in place" },
  { id: 3, name: "Secure Configuration", status: "partial" as const, score: 72, details: "3 devices with non-standard configurations detected" },
  { id: 4, name: "Patch Management", status: "partial" as const, score: 68, details: "7 systems with overdue security patches" },
  { id: 5, name: "Vulnerability Management", status: "compliant" as const, score: 88, details: "Last scan: 2 days ago, 4 medium issues open" },
  { id: 6, name: "Application Security", status: "compliant" as const, score: 91, details: "OWASP Top-10 scan passed — no critical issues" },
  { id: 7, name: "Access Control", status: "compliant" as const, score: 95, details: "MFA enabled for all 34 users" },
  { id: 8, name: "Admin Account Control", status: "partial" as const, score: 75, details: "2 shared admin accounts detected — action needed" },
  { id: 9, name: "Audit Logging", status: "compliant" as const, score: 100, details: "180-day retention active on AWS Mumbai" },
  { id: 10, name: "Incident Response", status: "compliant" as const, score: 98, details: "6-hour reporting pipeline tested and active" },
  { id: 11, name: "Backup & Recovery", status: "compliant" as const, score: 87, details: "Daily backup verified. Last restore test: 12 days ago" },
  { id: 12, name: "Malware Protection", status: "partial" as const, score: 80, details: "2 endpoints missing updated AV definitions" },
  { id: 13, name: "Governance & Policy", status: "compliant" as const, score: 90, details: "Security policy document uploaded and acknowledged" },
  { id: 14, name: "Third-Party Risk", status: "non-compliant" as const, score: 42, details: "Vendor risk register not updated in 45 days" },
  { id: 15, name: "Security Awareness", status: "partial" as const, score: 65, details: "6/10 employees completed last month's training" },
];

export const mockIncidents: Incident[] = [
  {
    id: "inc-001",
    title: "Ransomware attempt on accounting server",
    severity: "CRITICAL" as const,
    certInCategory: "Ransomware / Crypto Attack",
    detectedAt: t(2 * 3600000),
    deadline: new Date(BASE + 4 * 3600000).toISOString(),
    status: "draft_ready" as const,
    reportFiled: false,
    affectedSystems: ["Accounting Server (192.168.1.10)", "File Share"],
    description: "CryptoLocker variant detected attempting to encrypt files on shared drive. Blocked by endpoint agent. CERT-In report auto-drafted.",
  },
  {
    id: "inc-002",
    title: "Unauthorised data access — customer database",
    severity: "HIGH" as const,
    certInCategory: "Unauthorized Access",
    detectedAt: t(18 * 3600000),
    deadline: t(12 * 3600000),
    status: "filed" as const,
    reportFiled: true,
    affectedSystems: ["MySQL DB Server", "Customer Portal"],
    description: "Ex-employee credentials used to access customer database. Credentials revoked. CERT-In report filed within 6-hour window.",
  },
  {
    id: "inc-003",
    title: "DDoS attack on business website",
    severity: "HIGH" as const,
    certInCategory: "DDoS / Availability Attack",
    detectedAt: t(3 * 24 * 3600000),
    deadline: t(2.75 * 24 * 3600000),
    status: "closed" as const,
    reportFiled: true,
    affectedSystems: ["Website (www.example.com)", "CDN"],
    description: "15-minute DDoS attack causing website downtime. Mitigated via Cloudflare. CERT-In report filed.",
  },
];

export const mockLogs: LogEntry[] = [
  { id: "l1", type: "AUTH", source: "Google Workspace", event: "Failed login - akash@company.com from 45.33.32.156", severity: "HIGH", timestamp: t(5 * 60000) },
  { id: "l2", type: "FIREWALL", source: "Network Perimeter", event: "Blocked inbound connection from 103.21.58.11:3389", severity: "MEDIUM", timestamp: t(12 * 60000) },
  { id: "l3", type: "ENDPOINT", source: "Laptop-AK01", event: "USB device inserted — Kingston DataTraveler 32GB", severity: "LOW", timestamp: t(25 * 60000) },
  { id: "l4", type: "APP", source: "Customer Portal", event: "SQL injection pattern detected in login form — blocked", severity: "HIGH", timestamp: t(4 * 3600000) },
  { id: "l5", type: "AUTH", source: "Microsoft 365", event: "Successful admin login from new location — Bengaluru", severity: "MEDIUM", timestamp: t(6 * 3600000) },
  { id: "l6", type: "CLOUD", source: "AWS Mumbai", event: "S3 bucket policy changed by IAM user dev-bot", severity: "HIGH", timestamp: t(8 * 3600000) },
  { id: "l7", type: "ENDPOINT", source: "Server-01", event: "Patch KB5025221 overdue by 14 days", severity: "MEDIUM", timestamp: t(24 * 3600000) },
  { id: "l8", type: "WEB", source: "Business Website", event: "SSL certificate expires in 12 days", severity: "MEDIUM", timestamp: t(24 * 3600000) },
];

export const mockStats = {
  totalThreatsToday: 14,
  activeAlerts: 2,
  certInScore: 82,
  logsRetained: 156420,
  incidentsThisMonth: 3,
  incidentsFiled: 3,
  employeeTrainingRate: 65,
  openVulnerabilities: 11,
  daysUntilAudit: 47,
  lastScanTime: t(2 * 24 * 3600000),
};

export const mockThreatTrend = [
  { day: "Mon", threats: 8, blocked: 8 },
  { day: "Tue", threats: 14, blocked: 13 },
  { day: "Wed", threats: 6, blocked: 6 },
  { day: "Thu", threats: 19, blocked: 18 },
  { day: "Fri", threats: 11, blocked: 11 },
  { day: "Sat", threats: 4, blocked: 4 },
  { day: "Sun", threats: 14, blocked: 12 },
];
