import { NextRequest, NextResponse } from "next/server";
import { generateContentBatch } from "@/lib/ai/content-batch";
import { getClientById } from "@/config/clients";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      clientId?: string;
      goal?: string;
      count?: number;
    };

    if (!body.clientId) {
      return NextResponse.json({ error: "clientId required" }, { status: 400 });
    }

    const client = await prisma.client.findUnique({
      where: { id: body.clientId },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const config = getClientById(body.clientId);

    const result = await generateContentBatch({
      clientName: client.name,
      brandVoice: client.brandVoice ?? undefined,
      businessType: config?.businessType,
      location: config?.location,
      goal: body.goal,
      count: body.count ?? 7,
    });

    return NextResponse.json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
