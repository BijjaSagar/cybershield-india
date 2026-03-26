export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function refreshGoogleToken(refreshToken: string): Promise<string | null> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: process.env.GOOGLE_CLIENT_ID ?? "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      grant_type: "refresh_token",
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
      where: { orgId_provider: { orgId, provider: "google_workspace" } },
    });

    if (!integration || integration.status !== "active") {
      return NextResponse.json({ error: "Google Workspace not connected" }, { status: 400 });
    }

    let accessToken = integration.accessToken ?? "";

    // Refresh token if expired
    if (integration.tokenExpiresAt && integration.tokenExpiresAt < new Date()) {
      if (integration.refreshToken) {
        const newToken = await refreshGoogleToken(integration.refreshToken);
        if (newToken) {
          accessToken = newToken;
          await prisma.integration.update({
            where: { id: integration.id },
            data: { accessToken: newToken, tokenExpiresAt: new Date(Date.now() + 3600 * 1000) },
          });
        }
      }
    }

    // Pull Google Workspace Admin Audit Logs (last 24h)
    const startTime = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const applications = ["login", "admin", "drive", "token"];
    let ingested = 0;

    for (const app of applications) {
      try {
        const auditRes = await fetch(
          `https://admin.googleapis.com/admin/reports/v1/activity/users/all/applications/${app}?startTime=${startTime}&maxResults=100`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        if (!auditRes.ok) continue;

        const auditData = await auditRes.json();
        const items = auditData.items ?? [];

        for (const item of items) {
          const events = item.events ?? [];
          for (const event of events) {
            const eventName = event.name ?? "unknown";
            const actorEmail = item.actor?.email ?? "";
            const ipAddress = item.ipAddress ?? undefined;

            // Map event to severity
            let severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO" = "INFO";
            if (eventName.includes("login_failure") || eventName.includes("suspicious")) severity = "HIGH";
            else if (eventName.includes("login_success")) severity = "LOW";
            else if (eventName.includes("2sv_disable") || eventName.includes("password_change")) severity = "MEDIUM";
            else if (eventName.includes("account_disabled_admin")) severity = "CRITICAL";

            // Map to log type
            let logType: "AUTH" | "CLOUD" | "APPLICATION" | "SYSTEM" | "NETWORK" | "ENDPOINT" = "CLOUD";
            if (app === "login") logType = "AUTH";
            else if (app === "admin") logType = "CLOUD";
            else if (app === "drive") logType = "APPLICATION";

            const timestamp = item.id?.time ? new Date(item.id.time) : new Date();

            try {
              await prisma.logEntry.create({
                data: {
                  orgId,
                  source: `Google Workspace (${app})`,
                  type: logType,
                  severity,
                  message: `${eventName} — ${actorEmail}`,
                  ipAddress,
                  userId: actorEmail,
                  rawData: JSON.stringify({ event, actor: item.actor }),
                  timestamp,
                },
              });
              ingested++;
            } catch (_) {
              // Skip duplicate entries
            }
          }
        }
      } catch (appErr) {
        console.error(`[google/sync] app=${app}`, appErr);
      }
    }

    await prisma.integration.update({
      where: { id: integration.id },
      data: { lastSyncAt: new Date(), lastSyncError: null },
    });

    return NextResponse.json({ ingested, message: `Synced ${ingested} events from Google Workspace` });
  } catch (err) {
    console.error("[google/sync]", err);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
