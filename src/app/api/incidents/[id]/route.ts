export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const orgId = (session.user as any).orgId;
    const { id } = await params;

    const body = await req.json();
    const data: any = {};
    if (body.status) data.status = body.status;
    if (body.certInReported) {
      data.certInReported = true;
      data.certInReportedAt = new Date();
    }
    if (body.status === "RESOLVED" || body.status === "CLOSED") {
      data.resolvedAt = new Date();
    }

    const incident = await prisma.incident.updateMany({
      where: { id, orgId },
      data,
    });

    return NextResponse.json(incident);
  } catch (err) {
    return NextResponse.json({ error: "Failed to update incident" }, { status: 500 });
  }
}
