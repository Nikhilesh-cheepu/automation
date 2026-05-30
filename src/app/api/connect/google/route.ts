import { NextRequest, NextResponse } from "next/server";
import { isGoogleConfigured } from "@/lib/env";
import { getGoogleAuthUrl } from "@/lib/oauth/google";

export async function GET(request: NextRequest) {
  const clientId = request.nextUrl.searchParams.get("clientId");
  if (!clientId) {
    return NextResponse.json({ error: "clientId required" }, { status: 400 });
  }

  if (!isGoogleConfigured()) {
    return NextResponse.redirect(
      new URL(
        `/settings?error=google_not_configured&clientId=${clientId}`,
        request.url
      )
    );
  }

  return NextResponse.redirect(getGoogleAuthUrl(clientId));
}
