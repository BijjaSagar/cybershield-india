import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const checks: Record<string, string> = {
    status: "ok",
    timestamp: new Date().toISOString(),
    DATABASE_URL: process.env.DATABASE_URL ? "✅ set" : "❌ MISSING",
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "✅ set" : "❌ MISSING",
  };

  try {
    // Test DB connection
    await prisma.organization.count();
    checks.database = "✅ connected";
  } catch (err: unknown) {
    checks.database = "❌ " + (err instanceof Error ? err.message : String(err));
  }

  const allOk = checks.database.startsWith("✅") && checks.DATABASE_URL.startsWith("✅");

  return NextResponse.json(checks, { status: allOk ? 200 : 500 });
}
