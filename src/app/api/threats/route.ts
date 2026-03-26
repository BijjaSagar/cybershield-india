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
    const severity = searchParams.get("severity");
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") ?? "50");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    const where: any = { orgId };
    if (severity && severity !== "all") where.severity = severity.toUpperCase();
    if (status && status !== "all") where.status = status.toUpperCase();

    const [threats, total] = await Promise.all([
      prisma.threat.findMany({
        where,
        orderBy: { detectedAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.threat.count({ where }),
    ]);

    return NextResponse.json({ threats, total });
  } catch (err) {
    console.error("[api/threats GET]", err);
    return NextResponse.json({ error: "Failed to fetch threats" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const orgId = (session.user as any).orgId;
    if (!orgId) return NextResponse.json({ error: "No org" }, { status: 400 });

    const body = await req.json();
    const threat = await prisma.threat.create({
      data: {
        orgId,
        type: body.type,
        severity: body.severity ?? "MEDIUM",
        source: body.source ?? "manual",
        target: body.target,
        description: body.description,
        rawLog: body.rawLog,
        status: body.status ?? "ACTIVE",
      },
    });

    return NextResponse.json(threat, { status: 201 });
  } catch (err) {
    console.error("[api/threats POST]", err);
    return NextResponse.json({ error: "Failed to create threat" }, { status: 500 });
  }
}
