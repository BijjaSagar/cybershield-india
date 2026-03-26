export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Static descriptions for CERT-In controls
const CERT_IN_DESCRIPTIONS: Record<string, string> = {
  "CI-01": "Maintain an up-to-date inventory of all hardware and software assets. Classify assets by criticality.",
  "CI-02": "Implement network segmentation, firewall rules, and restrict access to critical systems. Monitor network traffic.",
  "CI-03": "Enforce least-privilege access. Review user accounts quarterly. Disable inactive accounts within 24 hours.",
  "CI-04": "Deploy anti-malware on all endpoints. Update signatures automatically. Schedule weekly full scans.",
  "CI-05": "Apply critical patches within 15 days, high within 30 days. Maintain a patch tracking register.",
  "CI-06": "Centralise security logs with 180-day retention. Set up real-time alerts for critical events.",
  "CI-07": "Maintain an incident response plan. Report qualifying incidents to CERT-In within 6 hours of detection.",
  "CI-08": "Perform daily automated backups. Test restoration monthly. Store backups offsite or in cloud (India region).",
  "CI-09": "Encrypt sensitive data at rest (AES-256) and in transit (TLS 1.2+). Manage and rotate encryption keys.",
  "CI-10": "Run vulnerability scans monthly. Prioritise and remediate findings based on CVSS score and exploitability.",
  "CI-11": "Assess all third-party vendors and service providers for security risks. Include security clauses in contracts.",
  "CI-12": "Secure server rooms with access controls. Log physical access. Protect hardware against tampering.",
  "CI-13": "Conduct security awareness training for all employees at least annually. Include phishing simulation.",
  "CI-14": "Define RTO/RPO for critical systems. Test business continuity plans at least once a year.",
  "CI-15": "Conduct annual internal and third-party security audits. Track and close audit findings within 90 days.",
};

const DPDP_DESCRIPTIONS: Record<string, string> = {
  "DPDP-01": "Create and maintain a data inventory mapping all personal data collected, stored, and processed.",
  "DPDP-02": "Implement automated breach detection and workflow to notify affected parties and regulators.",
  "DPDP-03": "Draft and maintain a template for notifying the Data Protection Board within 24 hours of a breach.",
  "DPDP-04": "Prepare notification templates for data principals (customers/employees) affected by a breach.",
  "DPDP-05": "Implement a system to record and manage consent from data principals for data processing.",
  "DPDP-06": "Build a tracker and workflow for handling data deletion/erasure requests from data principals.",
  "DPDP-07": "Ensure privacy policy is updated to comply with DPDP Act 2023 requirements.",
  "DPDP-08": "Designate a Data Protection Officer (DPO) responsible for DPDP Act compliance.",
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const orgId = (session.user as any).orgId;
    if (!orgId) return NextResponse.json({ error: "No org" }, { status: 400 });

    const items = await prisma.complianceItem.findMany({
      where: { orgId },
      orderBy: [{ framework: "asc" }, { controlId: "asc" }],
    });

    const certIn = items
      .filter(i => i.framework === "CERT_IN")
      .map(i => ({
        ...i,
        description: CERT_IN_DESCRIPTIONS[i.controlId] ?? i.notes ?? "",
        score: i.status === "COMPLIANT" ? 100 : i.status === "PARTIAL" ? 60 : i.status === "NOT_STARTED" ? 0 : 20,
      }));

    const dpdp = items
      .filter(i => i.framework === "DPDP")
      .map(i => ({
        ...i,
        description: DPDP_DESCRIPTIONS[i.controlId] ?? i.notes ?? "",
        score: i.status === "COMPLIANT" ? 100 : i.status === "PARTIAL" ? 60 : i.status === "NOT_STARTED" ? 0 : 20,
      }));

    const total = certIn.length;
    const compliant = certIn.filter(i => i.status === "COMPLIANT").length;
    const score = total > 0 ? Math.round((compliant / total) * 100) : 0;

    return NextResponse.json({ certIn, dpdp, score });
  } catch (err) {
    console.error("[api/compliance GET]", err);
    return NextResponse.json({ error: "Failed to fetch compliance data" }, { status: 500 });
  }
}
