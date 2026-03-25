import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const PLAN_PRICES: Record<string, number> = {
  KAVACH: 99900,   // ₹999
  SURAKSHA: 249900, // ₹2499
  RAKSHAK: 399900, // ₹3999
};

// Map frontend plan IDs → Prisma enum
const PLAN_MAP: Record<string, "KAVACH" | "SURAKSHA" | "RAKSHAK"> = {
  kavach: "KAVACH",
  suraksha: "SURAKSHA",
  rakshak: "RAKSHAK",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, phone, company, plan: planRaw } = body;

    // Validate required fields
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

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const plan = PLAN_MAP[planRaw] ?? "SURAKSHA";
    const hashedPassword = await bcrypt.hash(password, 12);
    const trialEndsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days

    // Create organization + user in a transaction
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = await prisma.$transaction(async (tx: any) => {
      const org = await tx.organization.create({
        data: {
          name: company,
          plan,
          subscriptionStatus: "TRIAL",
          trialEndsAt,
        },
      });

      const newUser = await tx.user.create({
        data: {
          name,
          email: email.toLowerCase(),
          password: hashedPassword,
          phone: phone ?? null,
          role: "OWNER",
          orgId: org.id,
        },
      });

      // Seed 15 CERT-In compliance items for this org
      const certInControls = [
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

      await tx.complianceItem.createMany({
        data: certInControls.map((c) => ({
          orgId: org.id,
          framework: "CERT_IN",
          controlId: c.id,
          controlName: c.name,
          status: "NOT_STARTED",
        })),
      });

      return newUser;
    });

    return NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("[register]", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
