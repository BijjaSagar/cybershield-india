export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Static training modules (content doesn't change per org)
export const TRAINING_MODULES = [
  { id: "TM-01", title: "Phishing Recognition", duration: "10 min", language: "Hindi + English" },
  { id: "TM-02", title: "Password Security & MFA", duration: "8 min", language: "Hindi + English" },
  { id: "TM-03", title: "WhatsApp Scam Detection", duration: "12 min", language: "Hindi" },
  { id: "TM-04", title: "USB & Physical Security", duration: "6 min", language: "English" },
  { id: "TM-05", title: "Social Engineering Awareness", duration: "10 min", language: "Hindi + English" },
];

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const orgId = (session.user as any).orgId;
    if (!orgId) return NextResponse.json({ error: "No org" }, { status: 400 });

    const progress = await prisma.trainingProgress.findMany({
      where: { orgId },
      orderBy: { createdAt: "desc" },
    });

    // Per-module completion counts
    const modules = TRAINING_MODULES.map(mod => {
      const modProgress = progress.filter(p => p.moduleId === mod.id);
      const completed = modProgress.filter(p => p.completed).length;
      return {
        ...mod,
        completed,
        total: modProgress.length,
        completionRate: modProgress.length > 0 ? Math.round((completed / modProgress.length) * 100) : 0,
      };
    });

    // Per-employee aggregated scores
    const employeeMap = new Map<string, { email: string; name: string; completedModules: number; totalModules: number; avgScore: number; scores: number[] }>();
    for (const p of progress) {
      const key = p.employeeEmail;
      if (!employeeMap.has(key)) {
        employeeMap.set(key, { email: p.employeeEmail, name: p.employeeName, completedModules: 0, totalModules: 0, avgScore: 0, scores: [] });
      }
      const emp = employeeMap.get(key)!;
      emp.totalModules++;
      if (p.completed) {
        emp.completedModules++;
        if (p.score != null) emp.scores.push(p.score);
      }
    }

    const employees = Array.from(employeeMap.values()).map(emp => ({
      ...emp,
      avgScore: emp.scores.length > 0 ? Math.round(emp.scores.reduce((a, b) => a + b, 0) / emp.scores.length) : 0,
    }));

    const totalProgress = progress.length;
    const completedProgress = progress.filter(p => p.completed).length;
    const completionRate = totalProgress > 0 ? Math.round((completedProgress / totalProgress) * 100) : 0;
    const highRisk = employees.filter(e => e.avgScore < 60 || e.completedModules === 0).length;

    return NextResponse.json({ modules, employees, completionRate, highRisk, totalEmployees: employees.length });
  } catch (err) {
    console.error("[api/awareness GET]", err);
    return NextResponse.json({ error: "Failed to fetch awareness data" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const orgId = (session.user as any).orgId;
    const body = await req.json();

    // Add a training progress record for an employee + module
    const record = await prisma.trainingProgress.upsert({
      where: {
        // Prisma needs a unique constraint — use create/update pattern
        id: body.id ?? "new",
      },
      update: {
        completed: body.completed ?? false,
        score: body.score ?? null,
        completedAt: body.completed ? new Date() : null,
      },
      create: {
        orgId,
        employeeEmail: body.employeeEmail,
        employeeName: body.employeeName,
        moduleId: body.moduleId,
        moduleName: TRAINING_MODULES.find(m => m.id === body.moduleId)?.title ?? body.moduleName ?? body.moduleId,
        completed: body.completed ?? false,
        score: body.score ?? null,
        completedAt: body.completed ? new Date() : null,
      },
    });

    return NextResponse.json(record, { status: 201 });
  } catch (err) {
    console.error("[api/awareness POST]", err);
    return NextResponse.json({ error: "Failed to save training progress" }, { status: 500 });
  }
}
