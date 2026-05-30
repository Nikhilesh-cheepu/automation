import Link from "next/link";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Image,
  Video,
  FileText,
  Repeat,
  Building2,
  ArrowRight,
} from "lucide-react";

const tools = [
  {
    title: "Google Profile SEO",
    description: "Descriptions, keywords, posts, FAQs for GBP",
    icon: Building2,
    phase: "Live",
    href: "/google-seo",
    live: true,
    providers: "Claude / OpenAI",
  },
  {
    title: "Weekly content batch",
    description: "7 post ideas per client — hooks, captions, hashtags",
    icon: Sparkles,
    phase: "Live",
    href: "/ai-studio/content-batch",
    live: true,
    providers: "Claude / OpenAI",
  },
  {
    title: "Generate image",
    description: "Static posts — 1:1, 9:16, 4:5",
    icon: Image,
    phase: "Phase 1c",
    providers: "Nanobanana (auto)",
  },
  {
    title: "Generate video / Reel",
    description: "Short-form video drafts",
    icon: Video,
    phase: "Phase 1c",
    providers: "Higgsfield (auto)",
  },
  {
    title: "Repurpose content",
    description: "One post → IG, Story, GBP, internal blurb",
    icon: Repeat,
    phase: "Phase 1b",
    providers: "Claude / OpenAI",
  },
  {
    title: "Weekly client report",
    description: "Wins, learnings, next week plan",
    icon: FileText,
    phase: "Phase 1b",
    providers: "Claude",
  },
];

export default function AiStudioPage() {
  return (
    <DashboardShell
      title="AI Studio"
      description="Text: Claude + OpenAI · Visual: Nanobanana + Higgsfield"
    >
      <div className="mb-4 rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm sm:mb-6">
        <p className="font-medium text-primary">Approval pipeline</p>
        <p className="mt-1 text-muted-foreground">
          Generate → Preview → Edit → Approve → Calendar → Publish
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Card
              key={tool.title}
              className={
                tool.live ? "ring-1 ring-primary/40" : "flex flex-col"
              }
            >
              <CardHeader className="pb-2">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-base">{tool.title}</CardTitle>
              </CardHeader>
              <CardContent className="mt-auto space-y-3">
                <p className="text-sm text-muted-foreground">
                  {tool.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  {tool.providers}
                </p>
                {tool.live && tool.href ? (
                  <Button className="h-11 w-full sm:h-9" asChild>
                    <Link href={tool.href}>
                      Open <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                ) : (
                  <Button
                    className="h-11 w-full sm:h-9"
                    variant="secondary"
                    disabled
                  >
                    {tool.phase}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </DashboardShell>
  );
}
