"use client";

import Link from "next/link";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import {
  Shield, Activity, FileText, AlertTriangle, Lock, BookOpen,
  BarChart3, CheckCircle2, XCircle, ArrowRight, ChevronDown,
  ChevronUp, Star, Zap, Globe, Clock, Server, Award, Users,
  Phone, Mail, Building2
} from "lucide-react";
import { useState } from "react";

/* ─── HERO ─────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 bg-white">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.04)_1px,transparent_1px)] bg-[size:64px_64px]" />
      {/* Blue glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-100 rounded-full blur-3xl opacity-60 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center py-24">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-semibold mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          CERT-In CISG-2024-03 Compliant · DPDP Act 2023 Ready · Made for Bharat
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 leading-tight mb-6">
          India's Most Affordable<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
            Cybersecurity Platform
          </span><br />
          for SMBs
        </h1>

        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          CyberShield India protects your business from cyber attacks, automates CERT-In compliance,
          and keeps you safe from ₹200 crore DPDP Act penalties — all for less than your monthly phone bill.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link href="/signup"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
            Start Free 14-Day Trial
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a href="#how-it-works"
            className="w-full sm:w-auto px-8 py-4 rounded-xl border border-slate-300 hover:border-blue-400 text-slate-700 font-semibold text-base transition-all flex items-center justify-center gap-2 bg-white">
            See How It Works
          </a>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
          {[
            { icon: Shield, text: "CERT-In Compliant" },
            { icon: Server, text: "Data Stored in India 🇮🇳" },
            { icon: Lock, text: "AES-256 Encrypted" },
            { icon: Clock, text: "Up in 30 Minutes" },
            { icon: Award, text: "No Hardware Required" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-1.5">
              <Icon className="w-3.5 h-3.5 text-blue-500" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── STATS BAR ─────────────────────────────────────────── */
function StatsBar() {
  const stats = [
    { value: "63M", label: "Indian SMBs at risk" },
    { value: "30%", label: "YoY rise in cyber attacks" },
    { value: "₹8–15L", label: "Avg. breach cost for SMBs" },
    { value: "6 hrs", label: "CERT-In reporting deadline" },
    { value: "₹200Cr", label: "Max DPDP Act penalty" },
    { value: "91%", label: "SMBs with no security tool" },
  ];
  return (
    <section className="bg-slate-50 border-y border-slate-200 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
          {stats.map(s => (
            <div key={s.label}>
              <div className="text-2xl font-bold text-slate-900">{s.value}</div>
              <div className="text-xs text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── PROBLEM ────────────────────────────────────────────── */
function Problem() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-xs font-semibold mb-6">
              The Problem
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6 leading-tight">
              Indian SMBs are under attack.<br />
              <span className="text-red-500">But can't afford protection.</span>
            </h2>
            <p className="text-slate-600 leading-relaxed mb-8">
              Enterprise cybersecurity tools like CrowdStrike and Darktrace cost ₹83,000–₹4 lakh/month and need
              a dedicated security team to operate. For India's 63 million SMBs, that's completely out of reach.
            </p>
            <div className="space-y-4">
              {[
                "₹8–15 lakh average data breach cost — enough to shut down most SMBs",
                "369 million malware detections across Indian endpoints in FY2024–25",
                "Ransomware attacks on Indian SMBs increased 3x between 2022 and 2025",
                "CERT-In now mandates 6-hour incident reporting or face criminal penalties",
                "DPDP Act 2023 penalties up to ₹200 crore for data breach notification failure",
              ].map(p => (
                <div key={p} className="flex items-start gap-3">
                  <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700">{p}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-500 mb-5 uppercase tracking-wider">Competitor Comparison</h3>
            <div className="space-y-3">
              {[
                { name: "CrowdStrike Falcon", cost: "₹6,000+/user/mo", india: false, certin: false, smb: false },
                { name: "Darktrace", cost: "₹1.5L–₹5L/mo", india: false, certin: false, smb: false },
                { name: "Sophos Central", cost: "₹800/user/mo", india: "partial", certin: "partial", smb: "medium" },
                { name: "Quick Heal Enterprise", cost: "₹400/user/mo", india: true, certin: "partial", smb: "medium" },
                { name: "CyberShield India", cost: "₹999–₹3,999/mo", india: true, certin: true, smb: true, highlight: true },
              ].map(r => (
                <div key={r.name} className={`flex items-center gap-3 p-3 rounded-lg text-xs ${r.highlight ? "bg-blue-50 border border-blue-200" : "bg-slate-50"}`}>
                  <span className={`flex-1 font-medium ${r.highlight ? "text-blue-700" : "text-slate-700"}`}>{r.name}</span>
                  <span className={`w-24 text-right ${r.highlight ? "text-blue-600 font-bold" : "text-slate-500"}`}>{r.cost}</span>
                  <Tick val={r.india} />
                  <Tick val={r.certin} />
                  <Tick val={r.smb} />
                </div>
              ))}
              <div className="flex items-center gap-3 px-3 text-[10px] text-slate-400">
                <span className="flex-1" />
                <span className="w-24 text-right">India-built</span>
                <span className="w-4 text-center">CERT-In</span>
                <span className="w-4 text-center">SMB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Tick({ val }: { val: boolean | string }) {
  if (val === true) return <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />;
  if (val === "partial") return <span className="w-4 h-4 text-yellow-500 flex-shrink-0 text-center font-bold">~</span>;
  return <XCircle className="w-4 h-4 text-red-300 flex-shrink-0" />;
}

/* ─── HOW IT WORKS ───────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Connect Your Systems in 30 Minutes",
      desc: "Connect Google Workspace, Microsoft 365, AWS, or your network in minutes — no hardware, no agents to install. CyberShield auto-discovers all your assets and starts monitoring immediately.",
      icon: Zap,
      color: "blue",
    },
    {
      step: "02",
      title: "CyberShield Monitors 24/7",
      desc: "Our AI-powered engine watches every login, file access, network connection, and device 24x7. The moment something suspicious happens, you get an instant WhatsApp + SMS alert in Hindi or English.",
      icon: Activity,
      color: "purple",
    },
    {
      step: "03",
      title: "Auto-Report to CERT-In in 1 Tap",
      desc: "If a reportable incident is detected, CyberShield auto-drafts the CERT-In report with all required fields. You review it on your phone and submit with one tap — always within the 6-hour deadline.",
      icon: FileText,
      color: "orange",
    },
    {
      step: "04",
      title: "Stay Audit-Ready All Year",
      desc: "Your live compliance scorecard shows exactly where you stand against all 15 CERT-In MSME controls and DPDP Act requirements. One-click PDF audit export, ready for your CERT-In empanelled auditor.",
      icon: Shield,
      color: "green",
    },
  ];

  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200",
    green: "bg-emerald-50 text-emerald-600 border-emerald-200",
  };

  return (
    <section id="how-it-works" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-semibold mb-4">
            How It Works
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Secure your business in 4 simple steps
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto">
            No security expertise needed. No hardware to install. Up and running in 30 minutes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {steps.map((s) => (
            <div key={s.step} className="rounded-2xl bg-white border border-slate-200 p-8 hover:border-blue-300 hover:shadow-md transition-all shadow-sm">
              <div className="flex items-start gap-5">
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0 ${colorMap[s.color]}`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-mono text-slate-400 mb-1">STEP {s.step}</div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FEATURES ───────────────────────────────────────────── */
function Features() {
  const modules = [
    { icon: Activity, title: "Threat Monitor", color: "red", desc: "Real-time monitoring of logins, file access, network activity, and device health. Instant WhatsApp alerts in Hindi or English the moment something suspicious happens.", tags: ["24/7 Monitoring", "WhatsApp Alerts", "Hindi UI"] },
    { icon: AlertTriangle, title: "Incident Response Engine", color: "orange", desc: "Auto-detects and classifies security incidents. Automatically drafts CERT-In compliance reports pre-filled with all required fields. Submit in 1 tap — never miss the 6-hour deadline.", tags: ["6-Hour Auto-Report", "CERT-In Filing", "1-Tap Submit"] },
    { icon: FileText, title: "Log Vault", color: "purple", desc: "Captures and stores 180 days of security logs — firewall, auth, app, database, cloud — on AWS Mumbai servers. Tamper-proof, AES-256 encrypted, and one-click audit-ready export.", tags: ["180-Day Retention", "India Servers", "Tamper-Proof"] },
    { icon: Lock, title: "Vulnerability Scanner", color: "yellow", desc: "Weekly automated VAPT scan of your websites, apps, and network for known CVEs and OWASP Top-10 vulnerabilities. Plain-language fix instructions written for non-technical owners.", tags: ["Weekly Auto-Scan", "CVE Detection", "OWASP Top-10"] },
    { icon: Shield, title: "Compliance Dashboard", color: "blue", desc: "Live scorecard against all 15 CERT-In MSME controls + DPDP Act checklist. Auto-collects evidence for each control. One-click PDF export formatted for CERT-In empanelled auditors.", tags: ["15 CERT-In Controls", "DPDP Checklist", "PDF Export"] },
    { icon: Users, title: "Access Guard", color: "cyan", desc: "Enforces MFA across all business systems, monitors privileged accounts, detects anomalous login patterns, and manages password policies — with zero technical configuration.", tags: ["MFA Enforcement", "Privilege Monitor", "Anomaly Detection"] },
    { icon: BarChart3, title: "DPDP Compliance Suite", color: "pink", desc: "Data inventory mapping, breach detection, DPB 24-hour notification drafting, consent log, and data deletion request tracker. Avoid ₹200 crore penalties under the DPDP Act 2023.", tags: ["Data Inventory", "DPB Notification", "Consent Log"] },
    { icon: BookOpen, title: "Security Awareness Training", color: "green", desc: "Monthly 10-minute training modules in Hindi + English. Phishing simulations. Employee security scores. WhatsApp-delivered training for non-desk workers — because 82% of breaches are human error.", tags: ["Hindi + English", "Phishing Simulation", "Employee Scores"] },
  ];

  const colorMap: Record<string, string> = {
    red: "bg-red-50 text-red-600 border-red-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    yellow: "bg-yellow-50 text-yellow-600 border-yellow-200",
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    cyan: "bg-cyan-50 text-cyan-600 border-cyan-200",
    pink: "bg-pink-50 text-pink-600 border-pink-200",
    green: "bg-emerald-50 text-emerald-600 border-emerald-200",
  };

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-semibold mb-4">
            8 Integrated Modules
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Everything your SMB needs. Nothing you don't.
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto">
            One platform. One price. Complete protection against cyber threats, regulatory fines, and data breaches.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {modules.map((m) => (
            <div key={m.title} className="rounded-xl bg-white border border-slate-200 p-5 hover:border-blue-300 hover:-translate-y-0.5 hover:shadow-md transition-all shadow-sm">
              <div className={`w-10 h-10 rounded-lg border flex items-center justify-center mb-4 ${colorMap[m.color]}`}>
                <m.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 text-sm mb-2">{m.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">{m.desc}</p>
              <div className="flex flex-wrap gap-1">
                {m.tags.map(t => (
                  <span key={t} className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px]">{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CERT-IN COMPLIANCE SECTION ─────────────────────────── */
function ComplianceSection() {
  const controls = [
    "Asset Inventory", "Network Security", "Secure Configuration", "Patch Management",
    "Vulnerability Management", "Application Security", "Access Control", "Admin Account Control",
    "Audit Logging", "Incident Response", "Backup & Recovery", "Malware Protection",
    "Governance & Policy", "Third-Party Risk", "Security Awareness",
  ];

  return (
    <section id="compliance" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-semibold mb-6">
              CERT-In Native
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
              100% CERT-In compliant.<br />
              <span className="text-emerald-600">Automatically.</span>
            </h2>
            <p className="text-slate-600 leading-relaxed mb-8">
              CERT-In issued 15 mandatory Elemental Cyber Defense Controls for all Indian MSMEs on September 1, 2025
              (CISG-2024-03). Non-compliance means exclusion from government tenders, criminal penalties, and regulatory action.
              <br /><br />
              CyberShield maps every single control to a built-in feature. Compliance is automatic — not a checklist you manually fill.
            </p>
            <div className="space-y-3 mb-8">
              {[
                { label: "6-hour incident reporting", desc: "Auto-drafts and submits CERT-In reports within deadline" },
                { label: "180-day log retention", desc: "All logs stored in India on AWS Mumbai — always audit-ready" },
                { label: "Annual audit evidence", desc: "One-click PDF export formatted for CERT-In empanelled auditors" },
                { label: "DPDP Act 2023", desc: "Breach detection, DPB notifications, consent logs — all automated" },
              ].map(i => (
                <div key={i.label} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-sm text-slate-900 font-medium">{i.label}</span>
                    <span className="text-sm text-slate-600"> — {i.desc}</span>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/signup" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-all shadow-sm">
              Check Your Compliance Score Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div>
            <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-slate-800 text-sm">15 CERT-In MSME Controls — CISG-2024-03</h3>
                <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">All Covered</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {controls.map((c, i) => (
                  <div key={c} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0">
                    <span className="text-xs font-mono text-slate-400 w-6 flex-shrink-0">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-sm text-slate-700 flex-1">{c}</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── PRICING ─────────────────────────────────────────────── */
function Pricing() {
  const plans = [
    {
      name: "Suraksha Basic",
      hindi: "सुरक्षा बेसिक",
      price: "999",
      period: "month",
      tag: null,
      desc: "For micro businesses, freelancers & small shops with a digital presence.",
      employees: "Up to 10 employees",
      features: [
        "Log Vault (180-day retention)",
        "Threat Monitor",
        "CERT-In Incident Reporting",
        "Compliance Dashboard",
        "WhatsApp + Email Alerts",
        "Basic Vulnerability Scan",
        "1 Nodal Officer Account",
      ],
      notIncluded: ["Access Guard", "DPDP Compliance Suite", "Security Awareness Training", "MSSP Mode"],
      cta: "Start Free Trial",
      color: "slate",
    },
    {
      name: "Suraksha Pro",
      hindi: "सुरक्षा प्रो",
      price: "2,499",
      period: "month",
      tag: "Most Popular",
      desc: "For growing SMBs, GST-registered businesses, and e-commerce sellers.",
      employees: "Up to 50 employees",
      features: [
        "Everything in Basic, plus:",
        "Vulnerability Scanner (weekly)",
        "Access Guard (MFA enforcement)",
        "DPDP Act Compliance Suite",
        "Hindi Language UI",
        "Google Workspace + M365 Integration",
        "Priority Email Support",
      ],
      notIncluded: ["Security Awareness Training", "MSSP Mode", "White-label"],
      cta: "Start Free Trial",
      color: "blue",
    },
    {
      name: "Suraksha Enterprise",
      hindi: "सुरक्षा एंटरप्राइज",
      price: "3,999",
      period: "month",
      tag: "Best Value",
      desc: "For mid-size businesses, government vendors, IT companies & financial services.",
      employees: "Up to 500 employees",
      features: [
        "Everything in Pro, plus:",
        "Security Awareness Training",
        "Phishing Simulations",
        "MSSP Multi-Client Portal",
        "White-label Option",
        "ISO 27001 Prep Pack",
        "Priority Phone + WhatsApp Support",
      ],
      notIncluded: [],
      cta: "Start Free Trial",
      color: "purple",
    },
    {
      name: "MSSP Partner Pack",
      hindi: null,
      price: "9,999",
      period: "month",
      tag: "For IT Providers",
      desc: "For IT service companies, CAs, and ISPs managing multiple SMB clients.",
      employees: "Up to 25 SMB clients",
      features: [
        "Unlimited client management",
        "Full reseller portal",
        "White-label branding",
        "Client billing management",
        "SLA management dashboard",
        "Dedicated account manager",
        "API access for integrations",
      ],
      notIncluded: [],
      cta: "Contact Sales",
      color: "orange",
    },
  ];

  const colorBorder: Record<string, string> = {
    slate: "border-slate-200",
    blue: "border-blue-400",
    purple: "border-purple-300",
    orange: "border-orange-300",
  };
  const colorTag: Record<string, string> = {
    slate: "bg-slate-200 text-slate-700",
    blue: "bg-blue-600 text-white",
    purple: "bg-purple-600 text-white",
    orange: "bg-orange-500 text-white",
  };

  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-semibold mb-4">
            Simple, Transparent Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Protect your business from ₹999/month
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto">
            Flat monthly fee — no per-user trap. 14-day free trial. Cancel anytime.
            <br />1/50th the cost of enterprise tools. 100% the protection.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {plans.map((p) => (
            <div key={p.name} className={`rounded-2xl bg-white border ${colorBorder[p.color]} p-6 flex flex-col relative shadow-sm ${p.color === "blue" ? "ring-2 ring-blue-400 shadow-blue-100 shadow-md" : ""}`}>
              {p.tag && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold ${colorTag[p.color]}`}>
                  {p.tag}
                </div>
              )}
              <div className="mb-5">
                <div className="text-slate-900 font-bold text-base">{p.name}</div>
                {p.hindi && <div className="text-slate-400 text-xs mt-0.5">{p.hindi}</div>}
              </div>
              <div className="mb-2">
                <span className="text-3xl font-bold text-slate-900">₹{p.price}</span>
                <span className="text-slate-500 text-sm">/{p.period}</span>
              </div>
              <div className="text-xs text-blue-600 mb-4 font-medium">{p.employees}</div>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">{p.desc}</p>
              <ul className="space-y-2.5 mb-6 flex-1">
                {p.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
                {p.notIncluded.map(f => (
                  <li key={f} className="flex items-start gap-2 text-xs text-slate-400">
                    <XCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-slate-300" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={p.cta === "Contact Sales" ? "#contact" : "/signup"}
                className={`w-full py-2.5 rounded-xl text-sm font-semibold text-center transition-all ${
                  p.color === "blue"
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                    : "border border-slate-300 hover:border-blue-400 hover:text-blue-600 text-slate-700 bg-white"
                }`}>
                {p.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Custom govt plan */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Building2 className="w-10 h-10 text-blue-600 flex-shrink-0" />
            <div>
              <div className="font-bold text-slate-900 text-lg">Government / PSU Custom Plan</div>
              <div className="text-slate-600 text-sm mt-1">Dedicated instance · India data residency certification · Custom CERT-In integration · On-premise option · 99.9% SLA</div>
            </div>
          </div>
          <a href="#contact" className="flex-shrink-0 px-6 py-3 rounded-xl border border-blue-400 hover:bg-blue-600 hover:text-white text-blue-600 font-semibold text-sm transition-all">
            Contact for Pricing
          </a>
        </div>
      </div>
    </section>
  );
}

/* ─── TESTIMONIALS ───────────────────────────────────────── */
function Testimonials() {
  const reviews = [
    { name: "Rajesh Mehta", role: "Director, Mehta Exports Pvt Ltd", location: "Surat, Gujarat", text: "We got audited by a CERT-In empanelled firm and cleared it in the first attempt. The compliance dashboard showed exactly what to fix. Worth every rupee.", rating: 5 },
    { name: "Priya Nair", role: "CEO, DigiTech Solutions", location: "Kochi, Kerala", text: "We had a phishing attack at 11pm. CyberShield detected it instantly, sent me a WhatsApp alert, and auto-drafted the CERT-In report. We filed it before the 6-hour deadline. Incredible.", rating: 5 },
    { name: "Amit Bhandari", role: "Founder, QuickBill SaaS", location: "Pune, Maharashtra", text: "As an IT company we are now reselling CyberShield to all our SMB clients under our own brand. Our clients love the Hindi alerts and the simple dashboard.", rating: 5 },
    { name: "Sunita Sharma", role: "CFO, Sharma Pharma Distributors", location: "Nagpur, Maharashtra", text: "Setting up took exactly 22 minutes. I connected Google Workspace and it immediately showed us 3 security issues we had no idea about. The plain-language fix instructions are perfect.", rating: 5 },
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Trusted by Indian SMBs across sectors
          </h2>
          <p className="text-slate-600">From manufacturing to SaaS, exporters to government vendors</p>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {reviews.map((r) => (
            <div key={r.name} className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-slate-700 text-sm leading-relaxed mb-5">"{r.text}"</p>
              <div>
                <div className="text-slate-900 text-sm font-semibold">{r.name}</div>
                <div className="text-slate-500 text-xs mt-0.5">{r.role} · {r.location}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FAQ ─────────────────────────────────────────────────── */
function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const faqs = [
    { q: "Do I need any technical knowledge to use CyberShield India?", a: "No. CyberShield is designed for business owners — not security experts. The dashboard is in plain Hindi and English. Setup takes 30 minutes. Alerts are written like: 'Someone tried to log in from Russia 23 times. Here is what to do.'" },
    { q: "How does the CERT-In 6-hour reporting work?", a: "The moment CyberShield detects a reportable incident (ransomware, data breach, DDoS, etc.), it auto-classifies it against CERT-In's 20 incident categories and pre-fills the official CERT-In reporting form. You receive a WhatsApp alert with a link to review the report. You tap 'Submit' — done. The entire process takes under 2 minutes and is timestamped as audit proof." },
    { q: "Where is our data stored? Is it safe?", a: "All your logs, security data, and incident reports are stored exclusively on AWS Mumbai (ap-south-1) servers — within Indian jurisdiction as required by CERT-In. Data is encrypted with AES-256 at rest and TLS 1.3 in transit. CyberShield staff cannot read your log contents (zero-knowledge encryption)." },
    { q: "We already use Quick Heal / Seqrite. Why switch?", a: "Quick Heal and Seqrite are excellent antivirus products but they are endpoint-only. They do not provide SIEM, log retention (CERT-In requires 180 days), automated CERT-In incident reporting, DPDP Act compliance workflows, or the compliance dashboard. CyberShield is a complete compliance + security platform — not just an antivirus." },
    { q: "What happens if we get a cyber attack?", a: "CyberShield's Incident Response Engine detects the attack in minutes (not days), classifies it, sends you an immediate WhatsApp alert, auto-drafts the CERT-In report, and gives you a step-by-step remediation checklist. You are never alone in an incident." },
    { q: "Is there a free trial?", a: "Yes — 14 days free, no credit card required. Connect your Google Workspace or Microsoft 365 account and CyberShield will immediately show you your security posture and compliance gaps. You'll know the value before you pay." },
    { q: "Can our IT vendor / CA firm manage CyberShield for us?", a: "Absolutely. The MSSP Partner Pack lets IT service providers, CA firms, and ISPs manage multiple client accounts from a single portal under their own brand (white-label). Many IT vendors use CyberShield to offer cybersecurity as a managed service to their existing SMB clients." },
    { q: "What is the DPDP Act and why does it matter?", a: "India's Digital Personal Data Protection Act 2023 is now actively enforced. If your business collects customer data (names, phone numbers, email addresses, payment info) and suffers a data breach, you must notify the Data Protection Board within 24 hours or face fines up to ₹200 crore. CyberShield's DPDP Suite automates breach detection, notification drafting, consent logging, and deletion request tracking." },
  ];

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-slate-600">Everything you need to know before getting started</p>
        </div>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
              <button className="w-full px-6 py-4 flex items-start gap-4 text-left hover:bg-slate-50 transition-colors" onClick={() => setOpen(open === i ? null : i)}>
                <span className="flex-1 text-sm font-semibold text-slate-800">{f.q}</span>
                {open === i ? <ChevronUp className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" /> : <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />}
              </button>
              {open === i && (
                <div className="px-6 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4 bg-slate-50">
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CONTACT ─────────────────────────────────────────────── */
function Contact() {
  return (
    <section id="contact" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">Get in Touch</h2>
            <p className="text-slate-600 leading-relaxed mb-8">
              Government contracts, custom deployments, MSSP partnerships, or just want a live demo?
              Our team responds within 2 hours on business days.
            </p>
            <div className="space-y-4">
              {[
                { icon: Phone, label: "+91 20 XXXX XXXX", sub: "Mon–Sat, 9am–7pm IST" },
                { icon: Mail, label: "sales@cybershield.in", sub: "Response within 2 business hours" },
                { icon: Globe, label: "cybershield.in", sub: "Schedule a live demo" },
              ].map(c => (
                <div key={c.label} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center flex-shrink-0">
                    <c.icon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-slate-900 text-sm font-medium">{c.label}</div>
                    <div className="text-slate-500 text-xs">{c.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-white border border-slate-200 p-8 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-6">Request a Demo</h3>
            <div className="space-y-4">
              {[
                { label: "Your Name", placeholder: "Rajesh Mehta", type: "text" },
                { label: "Company Name", placeholder: "Mehta Exports Pvt Ltd", type: "text" },
                { label: "Phone Number", placeholder: "+91 98765 43210", type: "tel" },
                { label: "Email Address", placeholder: "rajesh@company.com", type: "email" },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-xs text-slate-600 mb-1.5 font-medium">{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-colors" />
                </div>
              ))}
              <div>
                <label className="block text-xs text-slate-600 mb-1.5 font-medium">Message (optional)</label>
                <textarea rows={3} placeholder="Tell us about your business size and security needs..."
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-colors resize-none" />
              </div>
              <button className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-sm">
                Request Demo →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── CTA BANNER ─────────────────────────────────────────── */
function CTABanner() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="text-4xl mb-4">🛡️</div>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Don't wait for a breach to act.
        </h2>
        <p className="text-blue-100 mb-8 text-lg max-w-2xl mx-auto">
          Start your free 14-day trial today. See your security posture in 30 minutes.
          No credit card. No hardware. No security expertise required.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/signup"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white hover:bg-blue-50 text-blue-700 font-bold text-base transition-all shadow-lg flex items-center justify-center gap-2">
            Start Free 14-Day Trial — No Card Required
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <p className="text-blue-200 text-xs mt-4">
          Trusted by 200+ Indian SMBs · CERT-In Compliant · Data stays in India 🇮🇳
        </p>
      </div>
    </section>
  );
}

/* ─── MAIN PAGE ──────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-800">
      <Navbar />
      <Hero />
      <StatsBar />
      <Problem />
      <HowItWorks />
      <Features />
      <ComplianceSection />
      <Pricing />
      <Testimonials />
      <FAQ />
      <Contact />
      <CTABanner />
      <Footer />
    </div>
  );
}
