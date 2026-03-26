export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const orgId = (session.user as any).orgId;
    if (!orgId) return NextResponse.json({ error: "No org" }, { status: 400 });

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") ?? "20");

    const where: any = { orgId };
    if (status && status !== "all") where.status = status.toUpperCase();

    const [incidents, total] = await Promise.all([
      prisma.incident.findMany({
        where,
        orderBy: { detectedAt: "desc" },
        take: limit,
      }),
      prisma.incident.count({ where }),
    ]);

    return NextResponse.json({ incidents, total });
  } catch (err) {
    console.error("[api/incidents GET]", err);
    return NextResponse.json({ error: "Failed to fetch incidents" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const orgId = (session.user as any).orgId;
    if (!orgId) return NextResponse.json({ error: "No org" }, { status: 400 });

    const body = await req.json();
    const detectedAt = new Date();
    const deadline = new Date(detectedAt.getTime() + 6 * 60 * 60 * 1000); // +6 hours

    const incident = await prisma.incident.create({
      data: {
        orgId,
        title: body.title,
        severity: body.severity ?? "HIGH",
        description: body.description,
        affectedSystems: body.affectedSystems ?? [],
        certInDeadline: deadline,
        detectedAt,
        status: "OPEN",
      },
    });

    return NextResponse.json(incident, { status: 201 });
  } catch (err) {
    console.error("[api/incidents POST]", err);
    return NextResponse.json({ error: "Failed to create incident" }, { status: 500 });
  }
}
