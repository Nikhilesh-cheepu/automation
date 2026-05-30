import { NextRequest, NextResponse } from "next/server";
import { generateGoogleSeo, type GoogleSeoInput } from "@/lib/ai/google-seo";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as GoogleSeoInput & { clientId?: string };

    if (!body.businessName?.trim() || !body.businessType?.trim()) {
      return NextResponse.json(
        { error: "Business name and type are required" },
        { status: 400 }
      );
    }

    if (body.clientId) {
      const client = await prisma.client.findUnique({
        where: { id: body.clientId },
      });
      if (client) {
        body.brandVoice = body.brandVoice ?? client.brandVoice ?? undefined;
        body.businessName = body.businessName || client.name;
      }
    }

    const result = await generateGoogleSeo({
      businessName: body.businessName.trim(),
      businessType: body.businessType.trim(),
      location: body.location?.trim() || "your area",
      services: body.services?.trim() || "general services",
      targetKeywords: body.targetKeywords?.trim(),
      currentDescription: body.currentDescription?.trim(),
      brandVoice: body.brandVoice?.trim(),
    });

    return NextResponse.json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
