import { generateText } from "@/lib/ai/router";

export interface ContentPost {
  title: string;
  format: "feed" | "story" | "reel" | "carousel";
  hook: string;
  caption: string;
  hashtags: string[];
  cta: string;
}

export interface ContentBatchResult {
  posts: ContentPost[];
  source: "claude" | "openai" | "template";
}

export function buildContentBatchPrompt(input: {
  clientName: string;
  brandVoice?: string;
  businessType?: string;
  location?: string;
  goal?: string;
  count: number;
}): string {
  return `You are a social media manager for "${input.clientName}".
Brand voice: ${input.brandVoice ?? "energetic, local, friendly"}
Business: ${input.businessType ?? "local business"}
Location: ${input.location ?? "local area"}
Goal this week: ${input.goal ?? "engagement and foot traffic"}

Create ${input.count} Instagram post ideas. Return ONLY valid JSON:
{
  "posts": [
    {
      "title": "short internal title",
      "format": "feed|story|reel|carousel",
      "hook": "first line hook",
      "caption": "full caption 2-4 sentences",
      "hashtags": ["tag1", "tag2"],
      "cta": "call to action"
    }
  ]
}`;
}

export function templateContentBatch(input: {
  clientName: string;
  businessType?: string;
  count: number;
}): ContentBatchResult {
  const type = input.businessType ?? "sports bar";
  const templates: ContentPost[] = [
    {
      title: "Game night promo",
      format: "reel",
      hook: `Match day at ${input.clientName}! 🏆`,
      caption: `Big screens, cold drinks, and the best crowd in town. Join us this weekend at ${input.clientName} — your home for live sports and good vibes.`,
      hashtags: ["#SportsBar", "#GameDay", "#LiveSports", "#WeekendVibes"],
      cta: "Tag your squad in the comments!",
    },
    {
      title: "Behind the bar",
      format: "story",
      hook: "What goes into your favourite pint?",
      caption: `A quick peek behind the bar at ${input.clientName}. Quality pours, friendly staff, zero compromise.`,
      hashtags: ["#BehindTheScenes", "#BarLife", "#LocalSpot"],
      cta: "Visit us tonight!",
    },
    {
      title: "Customer favourite",
      format: "carousel",
      hook: "Top 3 crowd favourites this month",
      caption: `From wings to burgers — here's what our regulars keep ordering. Which one are you trying first?`,
      hashtags: ["#Foodie", "#BarFood", "#MustTry"],
      cta: "Save this for your next visit",
    },
    {
      title: "Weekend hours",
      format: "feed",
      hook: "We're open all weekend!",
      caption: `Plan your weekend at ${input.clientName}. Great ${type} energy, live matches, and tables filling fast — book or walk in.`,
      hashtags: ["#WeekendPlans", "#OpenNow", "#LocalBusiness"],
      cta: "DM us to reserve",
    },
    {
      title: "Review shoutout",
      format: "feed",
      hook: "Why locals love us ⭐",
      caption: `Nothing beats real feedback from our community. Thank you for making ${input.clientName} the go-to spot.`,
      hashtags: ["#CustomerLove", "#LocalFavorite", "#ThankYou"],
      cta: "Leave us a Google review!",
    },
  ];

  return {
    posts: templates.slice(0, input.count),
    source: "template",
  };
}

export async function generateContentBatch(input: {
  clientName: string;
  brandVoice?: string;
  businessType?: string;
  location?: string;
  goal?: string;
  count?: number;
}): Promise<ContentBatchResult> {
  const count = input.count ?? 7;
  const prompt = buildContentBatchPrompt({ ...input, count });

  try {
    const { text, provider } = await generateText(prompt, { provider: "auto" });
    if (provider === "template") {
      return templateContentBatch({
        clientName: input.clientName,
        businessType: input.businessType,
        count,
      });
    }
    const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();
    const parsed = JSON.parse(cleaned) as { posts: ContentPost[] };
    return { posts: parsed.posts, source: provider };
  } catch {
    return templateContentBatch({
      clientName: input.clientName,
      businessType: input.businessType,
      count,
    });
  }
}
