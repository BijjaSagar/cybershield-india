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
    return NextResponse.redirect(`${baseUrl}/dashboard/settings?integration_error=google`);
  }

  try {
    const redirectUri = `${baseUrl}/api/integrations/google/callback`;

    // Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID ?? "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokens = await tokenRes.json();

    if (!tokenRes.ok || !tokens.access_token) {
      console.error("[google/callback] token exchange failed", tokens);
      return NextResponse.redirect(`${baseUrl}/dashboard/settings?integration_error=google_token`);
    }

    // Get admin email from userinfo
    let adminEmail = "";
    try {
      const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });
      const userInfo = await userRes.json();
      adminEmail = userInfo.email ?? "";
    } catch (_) {}

    // Upsert integration record
    await prisma.integration.upsert({
      where: { orgId_provider: { orgId, provider: "google_workspace" } },
      update: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token ?? undefined,
        tokenExpiresAt: tokens.expires_in ? new Date(Date.now() + tokens.expires_in * 1000) : undefined,
        adminEmail,
        status: "active",
        lastSyncError: null,
      },
      create: {
        orgId,
        provider: "google_workspace",
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token ?? undefined,
        tokenExpiresAt: tokens.expires_in ? new Date(Date.now() + tokens.expires_in * 1000) : undefined,
        adminEmail,
        status: "active",
      },
    });

    return NextResponse.redirect(`${baseUrl}/dashboard/settings?integration_success=google`);
  } catch (err) {
    console.error("[google/callback]", err);
    return NextResponse.redirect(`${baseUrl}/dashboard/settings?integration_error=google`);
  }
}
