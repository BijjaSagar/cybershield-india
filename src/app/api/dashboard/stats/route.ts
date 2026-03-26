export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orgId = (session.user as any).orgId;
    if (!orgId) return NextResponse.json({ error: "No org" }, { status: 400 });

    const [
      threatCount,
      activeIncidents,
      logCount,
      complianceItems,
      trainings,
      vulnerabilities,
    ] = await Promise.all([
      prisma.threat.count({ where: { orgId, status: "ACTIVE" } }),
      prisma.incident.count({ where: { orgId, status: { in: ["OPEN", "INVESTIGATING"] } } }),
      prisma.logEntry.count({ where: { orgId } }),
      prisma.complianceItem.findMany({ where: { orgId, framework: "CERT_IN" } }),
      prisma.trainingProgress.findMany({ where: { orgId } }),
      prisma.vulnerability.count({ where: { orgId, status: { in: ["OPEN", "IN_PROGRESS"] } } }),
    ]);

    const compliantCount = complianceItems.filter((c: { status: string }) => c.status === "COMPLIANT").length;
    const complianceScore = complianceItems.length > 0
      ? Math.round((compliantCount / complianceItems.length) * 100)
      : 0;

    const completedTrainings = trainings.filter((t: { completed: boolean }) => t.completed).length;
    const trainingScore = trainings.length > 0
      ? Math.round((completedTrainings / trainings.length) * 100)
      : 0;

    return NextResponse.json({
      threats: threatCount,
      incidents: activeIncidents,
      logs: logCount,
      complianceScore,
      trainingScore,
      vulnerabilities,
    });
  } catch (err) {
    console.error("[dashboard/stats]", err);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
