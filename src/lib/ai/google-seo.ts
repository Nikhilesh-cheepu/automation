export interface GoogleSeoInput {
  businessName: string;
  businessType: string;
  location: string;
  services: string;
  targetKeywords?: string;
  currentDescription?: string;
  brandVoice?: string;
}

export interface GoogleSeoResult {
  businessDescription: string;
  shortDescription: string;
  primaryKeywords: string[];
  servicesList: string[];
  googlePosts: Array<{ title: string; body: string }>;
  faqSuggestions: Array<{ question: string; answer: string }>;
  localSeoTips: string[];
  profileChecklist: string[];
  source: "ai" | "template";
}

export function buildGoogleSeoPrompt(input: GoogleSeoInput): string {
  return `You are a local SEO expert for Google Business Profile (GBP).

Business: ${input.businessName}
Type: ${input.businessType}
Location: ${input.location}
Services: ${input.services}
Target keywords: ${input.targetKeywords || "infer from business"}
Current GBP description: ${input.currentDescription || "none"}
Brand voice: ${input.brandVoice || "professional, friendly, local"}

Return ONLY valid JSON with this exact structure (no markdown):
{
  "businessDescription": "750 char max optimized GBP description",
  "shortDescription": "under 250 chars",
  "primaryKeywords": ["keyword1", "keyword2"],
  "servicesList": ["service1", "service2"],
  "googlePosts": [{"title": "...", "body": "..."}],
  "faqSuggestions": [{"question": "...", "answer": "..."}],
  "localSeoTips": ["tip1"],
  "profileChecklist": ["action1"]
}

Rules:
- Use natural local SEO (city/area names, no keyword stuffing)
- 3 googlePosts for GBP updates
- 4 faqSuggestions customers actually ask
- 5 localSeoTips and 6 profileChecklist items`;
}

export function templateGoogleSeo(input: GoogleSeoInput): GoogleSeoResult {
  const city = input.location.split(",")[0]?.trim() || input.location;
  const kw = input.targetKeywords?.split(",").map((k) => k.trim()).filter(Boolean) ?? [
    input.businessType,
    `${input.businessType} ${city}`,
    input.businessName,
  ];

  return {
    businessDescription: `${input.businessName} is your trusted ${input.businessType} in ${input.location}. We specialize in ${input.services}. Visit us for quality service, friendly staff, and results you can see. Serving ${city} and nearby areas — book or call today.`,
    shortDescription: `${input.businessName} — ${input.businessType} in ${city}. ${input.services.split(",")[0]?.trim() || "Quality service"}.`,
    primaryKeywords: kw.slice(0, 8),
    servicesList: input.services.split(",").map((s) => s.trim()).filter(Boolean),
    googlePosts: [
      {
        title: `Welcome to ${input.businessName}`,
        body: `Now serving ${city}! ${input.services}. Follow for offers and updates.`,
      },
      {
        title: "Why locals choose us",
        body: `Expert ${input.businessType}, convenient location, and customer-first service. Ask about our latest offers.`,
      },
      {
        title: "Book / visit this week",
        body: `Limited slots available. Message us or visit ${input.location} — we'd love to see you.`,
      },
    ],
    faqSuggestions: [
      {
        question: "What are your hours?",
        answer: "Add your exact hours in GBP — keep holidays updated for better local rankings.",
      },
      {
        question: `Do you serve ${city}?`,
        answer: `Yes, we serve ${city} and surrounding areas. Contact us for availability.`,
      },
      {
        question: "How do I book?",
        answer: "Call, message, or visit us — we'll confirm your appointment quickly.",
      },
      {
        question: "What services do you offer?",
        answer: input.services,
      },
    ],
    localSeoTips: [
      `Add "${city}" and your neighborhood to your business description naturally.`,
      "Upload 10+ high-quality photos: exterior, interior, team, and work samples.",
      "Post on GBP at least once per week (offers, events, tips).",
      "Ask happy clients for Google reviews — reply within 24 hours.",
      "Keep NAP consistent (name, address, phone) across Instagram and website.",
    ],
    profileChecklist: [
      "Verify business category (primary + additional)",
      "Complete all service items with descriptions",
      "Add attributes (women-owned, appointments, etc.) if applicable",
      "Enable messaging and set welcome message",
      "Add products/services with photos where possible",
      "Create Google Posts calendar for next 4 weeks",
    ],
    source: "template",
  };
}

export async function generateGoogleSeo(
  input: GoogleSeoInput
): Promise<GoogleSeoResult> {
  const prompt = buildGoogleSeoPrompt(input);

  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4096,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      const text = data.content?.[0]?.text;
      if (text) {
        try {
          return { ...parseSeoJson(text), source: "ai" };
        } catch {
          /* fall through */
        }
      }
    } catch {
      /* fallback */
    }
  }

  if (process.env.OPENAI_API_KEY) {
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
        }),
      });
      const data = await res.json();
      const text = data.choices?.[0]?.message?.content;
      if (text) {
        try {
          return { ...parseSeoJson(text), source: "ai" };
        } catch {
          /* fall through */
        }
      }
    } catch {
      /* fallback */
    }
  }

  return templateGoogleSeo(input);
}

function parseSeoJson(text: string): Omit<GoogleSeoResult, "source"> {
  const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();
  const parsed = JSON.parse(cleaned) as Omit<GoogleSeoResult, "source">;
  return parsed;
}
