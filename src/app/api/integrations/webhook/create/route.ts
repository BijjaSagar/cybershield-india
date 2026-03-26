export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const orgId = (session.user as any).orgId;
    const { provider } = await req.json();

    const webhookSecret = crypto.randomBytes(32).toString("hex");

    const integration = await prisma.integration.upsert({
      where: { orgId_provider: { orgId, provider } },
      update: { webhookSecret, status: "active" },
      create: { orgId, provider, webhookSecret, status: "active" },
    });

    const baseUrl = process.env.NEXTAUTH_URL ?? "https://cybershieldindia.com";

    return NextResponse.json({
      webhookUrl: `${baseUrl}/api/webhooks/ingest`,
      webhookSecret,
      orgId,
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to create webhook" }, { status: 500 });
  }
}
