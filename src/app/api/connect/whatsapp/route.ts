import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/** Save WhatsApp Business API credentials per client (compartment). */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      clientId?: string;
      phoneNumberId?: string;
      wabaId?: string;
      accessToken?: string;
    };

    if (!body.clientId || !body.phoneNumberId || !body.accessToken) {
      return NextResponse.json(
        { error: "clientId, phoneNumberId, and accessToken required" },
        { status: 400 }
      );
    }

    await prisma.connection.upsert({
      where: {
        clientId_platform: {
          clientId: body.clientId,
          platform: "whatsapp",
        },
      },
      create: {
        clientId: body.clientId,
        platform: "whatsapp",
        status: "connected",
        externalId: body.phoneNumberId,
        accountName: body.wabaId ? `WABA ${body.wabaId}` : "WhatsApp Business",
        accessToken: body.accessToken,
        metadata: JSON.stringify({
          phoneNumberId: body.phoneNumberId,
          wabaId: body.wabaId,
        }),
      },
      update: {
        status: "connected",
        externalId: body.phoneNumberId,
        accountName: body.wabaId ? `WABA ${body.wabaId}` : "WhatsApp Business",
        accessToken: body.accessToken,
        metadata: JSON.stringify({
          phoneNumberId: body.phoneNumberId,
          wabaId: body.wabaId,
        }),
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Save failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
