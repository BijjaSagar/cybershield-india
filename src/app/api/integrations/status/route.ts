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

    const integrations = await prisma.integration.findMany({
      where: { orgId },
      select: {
        provider: true,
        status: true,
        adminEmail: true,
        tenantId: true,
        lastSyncAt: true,
        lastSyncError: true,
        webhookSecret: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ integrations });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch integrations" }, { status: 500 });
  }
}
