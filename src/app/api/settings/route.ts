export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const orgId = (session.user as any).orgId;
    if (!orgId) return NextResponse.json({ error: "No org" }, { status: 400 });

    const [org, user] = await Promise.all([
      prisma.organization.findUnique({ where: { id: orgId } }),
      prisma.user.findUnique({ where: { id: (session.user as any).id } }),
    ]);

    if (!org) return NextResponse.json({ error: "Org not found" }, { status: 404 });

    return NextResponse.json({
      org: {
        id: org.id,
        name: org.name,
        plan: org.plan,
        industry: org.industry ?? "",
        employeeCount: org.employeeCount,
        gstNumber: org.gstNumber ?? "",
        nodalOfficer: org.nodalOfficer ?? "",
        nodalEmail: org.nodalEmail ?? "",
        nodalPhone: org.nodalPhone ?? "",
        certInId: org.certInId ?? "",
        subscriptionStatus: org.subscriptionStatus,
        trialEndsAt: org.trialEndsAt,
      },
      user: {
        name: user?.name ?? "",
        email: user?.email ?? "",
        phone: user?.phone ?? "",
      },
    });
  } catch (err) {
    console.error("[api/settings GET]", err);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const orgId = (session.user as any).orgId;
    const userId = (session.user as any).id;
    const body = await req.json();

    const orgData: any = {};
    if (body.name !== undefined) orgData.name = body.name;
    if (body.industry !== undefined) orgData.industry = body.industry;
    if (body.employeeCount !== undefined) orgData.employeeCount = parseInt(body.employeeCount);
    if (body.gstNumber !== undefined) orgData.gstNumber = body.gstNumber;
    if (body.nodalOfficer !== undefined) orgData.nodalOfficer = body.nodalOfficer;
    if (body.nodalEmail !== undefined) orgData.nodalEmail = body.nodalEmail;
    if (body.nodalPhone !== undefined) orgData.nodalPhone = body.nodalPhone;
    if (body.certInId !== undefined) orgData.certInId = body.certInId;

    await prisma.organization.update({ where: { id: orgId }, data: orgData });

    // Update user name/phone if provided
    if (body.userName || body.userPhone) {
      const userData: any = {};
      if (body.userName) userData.name = body.userName;
      if (body.userPhone) userData.phone = body.userPhone;
      await prisma.user.update({ where: { id: userId }, data: userData });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[api/settings PATCH]", err);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
