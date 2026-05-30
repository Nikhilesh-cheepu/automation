import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    clientId?: string;
    platform?: string;
  };

  if (!body.clientId || !body.platform) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  await prisma.connection.updateMany({
    where: {
      clientId: body.clientId,
      platform: body.platform,
    },
    data: {
      status: "disconnected",
      accessToken: null,
      refreshToken: null,
      externalId: null,
      accountName: null,
      tokenExpiresAt: null,
      metadata: null,
    },
  });

  return NextResponse.json({ ok: true });
}
