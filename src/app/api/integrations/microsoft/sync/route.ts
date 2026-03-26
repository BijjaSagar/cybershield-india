export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function refreshMicrosoftToken(refreshToken: string, tenantId: string): Promise<string | null> {
  const res = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: process.env.MICROSOFT_CLIENT_ID ?? "",
      client_secret: process.env.MICROSOFT_CLIENT_SECRET ?? "",
      grant_type: "refresh_token",
      scope: "https://graph.microsoft.com/AuditLog.Read.All offline_access",
    }),
  });
  const data = await res.json();
  return data.access_token ?? null;
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const orgId = (session.user as any).orgId;

    const integration = await prisma.integration.findUnique({
      where: { orgId_provider: { orgId, provider: "microsoft_365" } },
    });

    if (!integration || integration.status !== "active") {
      return NextResponse.json({ error: "Microsoft 365 not connected" }, { status: 400 });
    }

    let accessToken = integration.accessToken ?? "";
    const tenantId = integration.tenantId ?? "common";

    // Refresh if expired
    if (integration.tokenExpiresAt && integration.tokenExpiresAt < new Date()) {
      if (integration.refreshToken) {
        const newToken = await refreshMicrosoftToken(integration.refreshToken, tenantId);
        if (newToken) {
          accessToken = newToken;
          await prisma.integration.update({
            where: { id: integration.id },
            data: { accessToken: newToken, tokenExpiresAt: new Date(Date.now() + 3600 * 1000) },
          });
        }
      }
    }

    let ingested = 0;

    // Pull sign-in audit logs from Microsoft Graph
    const startTime = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    try {
      const signInsRes = await fetch(
        `https://graph.microsoft.com/v1.0/auditLogs/signIns?$filter=createdDateTime ge ${startTime}&$top=100`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if (signInsRes.ok) {
        const data = await signInsRes.json();
        const signIns = data.value ?? [];

        for (const signIn of signIns) {
          const success = signIn.status?.errorCode === 0;
          const severity = !success ? "MEDIUM" : "INFO";
          const riskLevel = signIn.riskLevelDuringSignIn;
          const adjustedSeverity = riskLevel === "high" ? "HIGH" : riskLevel === "medium" ? "MEDIUM" : severity;

          try {
            await prisma.logEntry.create({
              data: {
                orgId,
                source: "Microsoft 365",
                type: "AUTH",
                severity: adjustedSeverity as any,
                message: `Sign-in ${success ? "success" : "failure"}: ${signIn.userPrincipalName ?? signIn.userDisplayName ?? "unknown"} from ${signIn.location?.city ?? "unknown"}, ${signIn.location?.countryOrRegion ?? ""}`,
                ipAddress: signIn.ipAddress,
                userId: signIn.userPrincipalName,
                rawData: JSON.stringify(signIn),
                timestamp: new Date(signIn.createdDateTime),
              },
            });
            ingested++;
          } catch (_) {}
        }
      }
    } catch (err) {
      console.error("[microsoft/sync] signIns error", err);
    }

    // Also pull directory audit logs
    try {
      const auditRes = await fetch(
        `https://graph.microsoft.com/v1.0/auditLogs/directoryAudits?$filter=activityDateTime ge ${startTime}&$top=100`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if (auditRes.ok) {
        const auditData = await auditRes.json();
        for (const audit of auditData.value ?? []) {
          const severity = audit.result === "failure" ? "MEDIUM" : "INFO";
          try {
            await prisma.logEntry.create({
              data: {
                orgId,
                source: "Microsoft 365 (Directory)",
                type: "CLOUD",
                severity: severity as any,
                message: `${audit.operationType}: ${audit.activityDisplayName} by ${audit.initiatedBy?.user?.userPrincipalName ?? "system"}`,
                userId: audit.initiatedBy?.user?.userPrincipalName,
                rawData: JSON.stringify(audit),
                timestamp: new Date(audit.activityDateTime),
              },
            });
            ingested++;
          } catch (_) {}
        }
      }
    } catch (err) {
      console.error("[microsoft/sync] auditLogs error", err);
    }

    await prisma.integration.update({
      where: { id: integration.id },
      data: { lastSyncAt: new Date(), lastSyncError: null },
    });

    return NextResponse.json({ ingested, message: `Synced ${ingested} events from Microsoft 365` });
  } catch (err) {
    console.error("[microsoft/sync]", err);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
