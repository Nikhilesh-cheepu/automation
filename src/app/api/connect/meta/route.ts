import { NextRequest, NextResponse } from "next/server";
import { isMetaConfigured } from "@/lib/env";
import { getMetaAuthUrl } from "@/lib/oauth/meta";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const clientId = request.nextUrl.searchParams.get("clientId");
  if (!clientId) {
    return NextResponse.json({ error: "clientId required" }, { status: 400 });
  }

  if (!isMetaConfigured()) {
    return NextResponse.redirect(
      new URL(
        `/settings?error=meta_not_configured&clientId=${clientId}`,
        request.url
      )
    );
  }

  return NextResponse.redirect(getMetaAuthUrl(clientId));
}
