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
    const type = searchParams.get("type");
    const severity = searchParams.get("severity");
    const limit = parseInt(searchParams.get("limit") ?? "50");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    const where: any = { orgId };
    if (type && type !== "ALL") where.type = type.toUpperCase();
    if (severity && severity !== "ALL") where.severity = severity.toUpperCase();

    const [logs, total] = await Promise.all([
      prisma.logEntry.findMany({
        where,
        orderBy: { timestamp: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.logEntry.count({ where }),
    ]);

    return NextResponse.json({ logs, total });
  } catch (err) {
    console.error("[api/logs GET]", err);
    return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const orgId = (session.user as any).orgId;
    if (!orgId) return NextResponse.json({ error: "No org" }, { status: 400 });

    const body = await req.json();
    const log = await prisma.logEntry.create({
      data: {
        orgId,
        source: body.source,
        type: body.type ?? "SYSTEM",
        severity: body.severity ?? "LOW",
        message: body.message,
        ipAddress: body.ipAddress,
        userId: body.userId,
        rawData: body.rawData ? JSON.stringify(body.rawData) : undefined,
      },
    });

    return NextResponse.json(log, { status: 201 });
  } catch (err) {
    console.error("[api/logs POST]", err);
    return NextResponse.json({ error: "Failed to create log" }, { status: 500 });
  }
}
