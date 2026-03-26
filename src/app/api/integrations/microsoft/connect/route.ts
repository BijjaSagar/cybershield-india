export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clientId = process.env.MICROSOFT_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json({ error: "Microsoft integration not configured" }, { status: 503 });
  }

  const tenantId = process.env.MICROSOFT_TENANT_ID ?? "common";
  const baseUrl = process.env.NEXTAUTH_URL ?? "https://cybershieldindia.com";
  const redirectUri = `${baseUrl}/api/integrations/microsoft/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirectUri,
    response_mode: "query",
    scope: "https://graph.microsoft.com/AuditLog.Read.All https://graph.microsoft.com/Directory.Read.All offline_access",
    state: (session.user as any).orgId,
  });

  return NextResponse.redirect(
    `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize?${params}`
  );
}
