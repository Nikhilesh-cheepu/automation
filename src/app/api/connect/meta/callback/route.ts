import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  exchangeMetaCode,
  getInstagramBusinessAccount,
  parseMetaState,
} from "@/lib/oauth/meta";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      new URL(`/settings?error=meta_denied`, request.url)
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      new URL(`/settings?error=meta_invalid`, request.url)
    );
  }

  const parsed = parseMetaState(state);
  if (!parsed?.clientId) {
    return NextResponse.redirect(
      new URL(`/settings?error=meta_invalid_state`, request.url)
    );
  }

  try {
    const token = await exchangeMetaCode(code);
    const ig = await getInstagramBusinessAccount(token, parsed.clientId);

    await prisma.connection.upsert({
      where: {
        clientId_platform: {
          clientId: parsed.clientId,
          platform: "instagram",
        },
      },
      create: {
        clientId: parsed.clientId,
        platform: "instagram",
        status: "connected",
        externalId: ig.igId,
        accountName: `@${ig.igUsername}`,
        accessToken: ig.accessToken,
        metadata: JSON.stringify({
          pageId: ig.pageId,
          pageName: ig.pageName,
        }),
      },
      update: {
        status: "connected",
        externalId: ig.igId,
        accountName: `@${ig.igUsername}`,
        accessToken: ig.accessToken,
        metadata: JSON.stringify({
          pageId: ig.pageId,
          pageName: ig.pageName,
        }),
      },
    });

    return NextResponse.redirect(
      new URL(
        `/settings?connected=instagram&clientId=${parsed.clientId}&account=${encodeURIComponent(ig.igUsername)}`,
        request.url
      )
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Connection failed";
    return NextResponse.redirect(
      new URL(
        `/settings?error=meta_failed&detail=${encodeURIComponent(msg)}`,
        request.url
      )
    );
  }
}
