export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/webhooks/ingest
// Body: { orgId, secret, events: [{ type, source, severity, message, ipAddress, rawData }] }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orgId, secret, events } = body;

    if (!orgId || !secret || !Array.isArray(events)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Verify webhook secret against integration record
    const integration = await prisma.integration.findFirst({
      where: { orgId, webhookSecret: secret, status: "active" },
    });

    if (!integration) {
      return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
    }

    // Batch insert logs
    const logData = events.map((e: any) => ({
      orgId,
      source: e.source ?? integration.provider,
      type: e.type ?? "SYSTEM",
      severity: e.severity ?? "LOW",
      message: e.message ?? e.description ?? "Event received",
      ipAddress: e.ipAddress,
      userId: e.userId,
      rawData: e.rawData ? JSON.stringify(e.rawData) : undefined,
    }));

    await prisma.logEntry.createMany({ data: logData });

    // Update last sync time
    await prisma.integration.update({
      where: { id: integration.id },
      data: { lastSyncAt: new Date() },
    });

    return NextResponse.json({ ingested: logData.length });
  } catch (err) {
    console.error("[webhooks/ingest]", err);
    return NextResponse.json({ error: "Ingestion failed" }, { status: 500 });
  }
}
