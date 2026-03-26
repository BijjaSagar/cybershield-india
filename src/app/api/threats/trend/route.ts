export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const orgId = (session.user as any).orgId;
    if (!orgId) return NextResponse.json({ error: "No org" }, { status: 400 });

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const threats = await prisma.threat.findMany({
      where: { orgId, detectedAt: { gte: sevenDaysAgo } },
      select: { detectedAt: true, status: true },
    });

    // Build a 7-day array
    const days: { day: string; date: string; threats: number; blocked: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayName = d.toLocaleDateString("en-IN", { weekday: "short" });

      const dayThreats = threats.filter(t => t.detectedAt.toISOString().startsWith(dateStr));
      const blocked = dayThreats.filter(t => t.status === "MITIGATED" || t.status === "FALSE_POSITIVE").length;

      days.push({
        day: dayName,
        date: dateStr,
        threats: dayThreats.length,
        blocked,
      });
    }

    return NextResponse.json({ trend: days });
  } catch (err) {
    console.error("[api/threats/trend]", err);
    return NextResponse.json({ error: "Failed to fetch trend" }, { status: 500 });
  }
}
