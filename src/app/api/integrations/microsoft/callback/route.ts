export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const orgId = searchParams.get("state");
  const error = searchParams.get("error");

  const baseUrl = process.env.NEXTAUTH_URL ?? "https://cybershieldindia.com";

  if (error || !code || !orgId) {
    return NextResponse.redirect(`${baseUrl}/dashboard/settings?integration_error=microsoft`);
  }

  try {
    const tenantId = process.env.MICROSOFT_TENANT_ID ?? "common";
    const redirectUri = `${baseUrl}/api/integrations/microsoft/callback`;

    const tokenRes = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.MICROSOFT_CLIENT_ID ?? "",
        client_secret: process.env.MICROSOFT_CLIENT_SECRET ?? "",
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokens = await tokenRes.json();

    if (!tokenRes.ok || !tokens.access_token) {
      console.error("[microsoft/callback] token exchange failed", tokens);
      return NextResponse.redirect(`${baseUrl}/dashboard/settings?integration_error=microsoft_token`);
    }

    // Get tenant info from /me
    let adminEmail = "";
    const tenantIdResolved = tenantId;
    try {
      const meRes = await fetch("https://graph.microsoft.com/v1.0/me", {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });
      const me = await meRes.json();
      adminEmail = me.userPrincipalName ?? me.mail ?? "";
    } catch (_) {}

    await prisma.integration.upsert({
      where: { orgId_provider: { orgId, provider: "microsoft_365" } },
      update: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token ?? undefined,
        tokenExpiresAt: tokens.expires_in ? new Date(Date.now() + tokens.expires_in * 1000) : undefined,
        adminEmail,
        tenantId: tenantIdResolved,
        status: "active",
        lastSyncError: null,
      },
      create: {
        orgId,
        provider: "microsoft_365",
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token ?? undefined,
        tokenExpiresAt: tokens.expires_in ? new Date(Date.now() + tokens.expires_in * 1000) : undefined,
        adminEmail,
        tenantId: tenantIdResolved,
        status: "active",
      },
    });

    return NextResponse.redirect(`${baseUrl}/dashboard/settings?integration_success=microsoft`);
  } catch (err) {
    console.error("[microsoft/callback]", err);
    return NextResponse.redirect(`${baseUrl}/dashboard/settings?integration_error=microsoft`);
  }
}
