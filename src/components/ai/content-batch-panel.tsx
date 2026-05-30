"use client";

import { useState } from "react";
import { Loader2, Sparkles, Copy, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ClientWithAccounts } from "@/lib/clients-db";
import type { ContentPost } from "@/lib/ai/content-batch";
import { Badge } from "@/components/ui/badge";

interface ContentBatchPanelProps {
  clients: ClientWithAccounts[];
  hasAiKey: boolean;
}

export function ContentBatchPanel({ clients, hasAiKey }: ContentBatchPanelProps) {
  const [clientId, setClientId] = useState(
    clients.find((c) => !c.isPortfolio)?.id ?? clients[0]?.id ?? ""
  );
  const [goal, setGoal] = useState("Game day promos + foot traffic this week");
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<ContentPost[]>([]);
  const [source, setSource] = useState<string>("");

  async function generate() {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/content-batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId, goal, count: 7 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPosts(data.posts);
      setSource(data.source);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-5 w-5" />
            Weekly content batch (AI Brain)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!hasAiKey && (
            <p className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
              Add <code>ANTHROPIC_API_KEY</code> or <code>OPENAI_API_KEY</code> to{" "}
              <code>.env</code> for smarter output. Templates work without keys.
            </p>
          )}
          <div className="space-y-2">
            <Label>Client compartment</Label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="flex h-11 w-full rounded-lg border border-border bg-background px-3 text-base md:text-sm"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Goal this week</Label>
            <Textarea value={goal} onChange={(e) => setGoal(e.target.value)} />
          </div>
          <Button
            className="h-12 w-full sm:h-11"
            onClick={generate}
            disabled={loading || !clientId}
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Generating…
              </>
            ) : (
              "Generate 7 posts"
            )}
          </Button>
        </CardContent>
      </Card>

      {posts.length > 0 && (
        <div className="space-y-3">
          <Badge variant={source === "template" ? "secondary" : "success"}>
            {source === "template" ? "Smart template" : `AI: ${source}`}
          </Badge>
          {posts.map((post, i) => (
            <PostCard key={i} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

function PostCard({ post }: { post: ContentPost }) {
  const [copied, setCopied] = useState(false);
  const full = `${post.hook}\n\n${post.caption}\n\n${post.hashtags.join(" ")}\n\n${post.cta}`;

  async function copy() {
    await navigator.clipboard.writeText(full);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Card>
      <CardContent className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-medium">{post.title}</p>
            <p className="text-xs capitalize text-muted-foreground">{post.format}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={copy}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-sm whitespace-pre-wrap text-muted-foreground">{full}</p>
      </CardContent>
    </Card>
  );
}
