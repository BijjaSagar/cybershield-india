export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const PLAN_MAP: Record<string, "KAVACH" | "SURAKSHA" | "RAKSHAK"> = {
  kavach: "KAVACH",
  suraksha: "SURAKSHA",
  rakshak: "RAKSHAK",
};

const DPDP_ITEMS = [
  { id: "DPDP-01", name: "Data inventory mapping" },
  { id: "DPDP-02", name: "Breach detection workflow" },
  { id: "DPDP-03", name: "DPB 24-hour notification draft" },
  { id: "DPDP-04", name: "Data principal notification template" },
  { id: "DPDP-05", name: "Consent log active" },
  { id: "DPDP-06", name: "Data deletion request tracker" },
  { id: "DPDP-07", name: "Privacy policy DPDP-compliant" },
  { id: "DPDP-08", name: "Data Protection Officer designated" },
];

const CERT_IN_CONTROLS = [
  { id: "CI-01", name: "Secure Configuration Management" },
  { id: "CI-02", name: "Network Access Control" },
  { id: "CI-03", name: "User Access Management" },
  { id: "CI-04", name: "Malware Protection" },
  { id: "CI-05", name: "Patch Management" },
  { id: "CI-06", name: "Security Monitoring & Logging" },
  { id: "CI-07", name: "Incident Management" },
  { id: "CI-08", name: "Data Backup & Recovery" },
  { id: "CI-09", name: "Encryption & Key Management" },
  { id: "CI-10", name: "Vulnerability Management" },
  { id: "CI-11", name: "Third-Party Risk Management" },
  { id: "CI-12", name: "Physical Security" },
  { id: "CI-13", name: "Security Awareness Training" },
  { id: "CI-14", name: "Business Continuity Planning" },
  { id: "CI-15", name: "Audit & Compliance Review" },
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, phone, company, plan: planRaw } = body;

    // Validate
    if (!name || !email || !password || !company) {
      return NextResponse.json(
        { error: "Name, email, password, and company are required." },
        { status: 400 }
      );
    }
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const emailLower = email.toLowerCase().trim();
    const plan = PLAN_MAP[planRaw] ?? "SURAKSHA";

    // Check duplicate email
    const existing = await prisma.user.findUnique({
      where: { email: emailLower },
    });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists. Please sign in." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const trialEndsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

    // Step 1 — Create organization
    const org = await prisma.organization.create({
      data: {
        name: company.trim(),
        plan,
        subscriptionStatus: "TRIAL",
        trialEndsAt,
      },
    });

    // Step 2 — Create user
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: emailLower,
        password: hashedPassword,
        phone: phone?.trim() ?? null,
        role: "OWNER",
        orgId: org.id,
      },
    });

    // Step 3 — Seed 15 CERT-In compliance controls (non-blocking)
    prisma.complianceItem.createMany({
      data: CERT_IN_CONTROLS.map((c) => ({
        orgId: org.id,
        framework: "CERT_IN",
        controlId: c.id,
        controlName: c.name,
        status: "NOT_STARTED" as const,
      })),
      skipDuplicates: true,
    }).catch((e) => console.error("[register] compliance seed error:", e));

    prisma.complianceItem.createMany({
      data: DPDP_ITEMS.map((c) => ({
        orgId: org.id,
        framework: "DPDP",
        controlId: c.id,
        controlName: c.name,
        status: "NOT_STARTED" as const,
      })),
      skipDuplicates: true,
    }).catch((e) => console.error("[register] dpdp seed error:", e));

    return NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email },
      trial: {
        plan,
        endsAt: trialEndsAt.toISOString(),
        daysLeft: 14,
      },
    });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[register] error:", message);
    return NextResponse.json(
      { error: "Registration failed. Please try again.", detail: message },
      { status: 500 }
    );
  }
}
