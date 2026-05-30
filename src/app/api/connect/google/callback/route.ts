import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  exchangeGoogleCode,
  getGoogleAccountName,
  parseGoogleState,
} from "@/lib/oauth/google";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      new URL(`/settings?error=google_denied`, request.url)
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      new URL(`/settings?error=google_invalid`, request.url)
    );
  }

  const parsed = parseGoogleState(state);
  if (!parsed?.clientId) {
    return NextResponse.redirect(
      new URL(`/settings?error=google_invalid_state`, request.url)
    );
  }

  try {
    const tokens = await exchangeGoogleCode(code);
    const accountName = await getGoogleAccountName(tokens.accessToken);
    const expiresAt = tokens.expiresIn
      ? new Date(Date.now() + tokens.expiresIn * 1000)
      : null;

    await prisma.connection.upsert({
      where: {
        clientId_platform: {
          clientId: parsed.clientId,
          platform: "google",
        },
      },
      create: {
        clientId: parsed.clientId,
        platform: "google",
        status: "connected",
        accountName,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        tokenExpiresAt: expiresAt,
      },
      update: {
        status: "connected",
        accountName,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken ?? undefined,
        tokenExpiresAt: expiresAt,
      },
    });

    return NextResponse.redirect(
      new URL(
        `/settings?connected=google&clientId=${parsed.clientId}`,
        request.url
      )
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Connection failed";
    return NextResponse.redirect(
      new URL(
        `/settings?error=google_failed&detail=${encodeURIComponent(msg)}`,
        request.url
      )
    );
  }
}
