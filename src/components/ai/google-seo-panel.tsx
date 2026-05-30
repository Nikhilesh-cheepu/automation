"use client";

import { useState } from "react";
import { Building2, Copy, Check, Loader2, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import type { GoogleSeoResult } from "@/lib/ai/google-seo";
import type { ClientWithAccounts } from "@/lib/clients-db";

interface GoogleSeoPanelProps {
  clients: ClientWithAccounts[];
  hasAiKey: boolean;
}

function CopyBlock({ label, text }: { label: string; text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-lg border border-border p-3 sm:p-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-sm font-medium">{label}</p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-10 min-w-10 shrink-0"
          onClick={copy}
        >
          {copied ? (
            <Check className="h-4 w-4 text-emerald-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
      <p className="whitespace-pre-wrap text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

export function GoogleSeoPanel({ clients, hasAiKey }: GoogleSeoPanelProps) {
  const googleClients = clients.filter((c) => c.platforms.includes("google"));
  const [clientId, setClientId] = useState(googleClients[0]?.id ?? "");
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [location, setLocation] = useState("");
  const [services, setServices] = useState("");
  const [targetKeywords, setTargetKeywords] = useState("");
  const [currentDescription, setCurrentDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GoogleSeoResult | null>(null);

  function onClientChange(id: string) {
    setClientId(id);
    const c = googleClients.find((x) => x.id === id);
    if (c) {
      setBusinessName(c.name.replace(/^Upcoming — /, ""));
      setBusinessType("");
      setServices("");
    }
  }

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/google-seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: clientId || undefined,
          businessName: businessName || googleClients.find((c) => c.id === clientId)?.name,
          businessType,
          location,
          services,
          targetKeywords,
          currentDescription,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4 sm:space-y-6">
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-4 text-sm">
          <p className="font-medium text-primary">Google Business Profile SEO</p>
          <p className="mt-1 text-muted-foreground">
            AI suggests descriptions, keywords, posts, FAQs, and a profile
            checklist — copy into Google Business Profile.
            {!hasAiKey && " Using smart templates until you add Claude/OpenAI keys."}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Building2 className="h-5 w-5" />
            Business details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {googleClients.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="client">Client</Label>
              <select
                id="client"
                value={clientId}
                onChange={(e) => onClientChange(e.target.value)}
                className="flex h-11 w-full rounded-lg border border-border bg-background px-3 text-base md:text-sm"
              >
                {googleClients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                    {c.googleStatus === "connected" ? " ✓ Google" : ""}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="name">Business name</Label>
              <Input
                id="name"
                placeholder="e.g. Bella's Bakery"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Business type</Label>
              <Input
                id="type"
                placeholder="e.g. bakery, salon, gym"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="City, area, or full address"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="services">Services (comma-separated)</Label>
              <Input
                id="services"
                placeholder="cakes, catering, custom orders"
                value={services}
                onChange={(e) => setServices(e.target.value)}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="keywords">Target keywords (optional)</Label>
              <Input
                id="keywords"
                placeholder="best bakery mumbai, wedding cakes"
                value={targetKeywords}
                onChange={(e) => setTargetKeywords(e.target.value)}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="current">Current GBP description (optional)</Label>
              <Textarea
                id="current"
                placeholder="Paste existing description to improve it"
                value={currentDescription}
                onChange={(e) => setCurrentDescription(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button
            className="h-12 w-full text-base sm:h-11"
            onClick={generate}
            disabled={loading || !businessType.trim()}
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Generating SEO…
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Suggest Google Profile SEO
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-4 pb-4">
          <div className="flex items-center gap-2">
            <Badge variant={result.source === "ai" ? "success" : "secondary"}>
              {result.source === "ai" ? "AI generated" : "Smart template"}
            </Badge>
          </div>

          <CopyBlock
            label="Business description (paste in GBP)"
            text={result.businessDescription}
          />
          <CopyBlock label="Short tagline" text={result.shortDescription} />

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Primary keywords</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {result.primaryKeywords.map((k) => (
                <Badge key={k} variant="outline">
                  {k}
                </Badge>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Services to list on profile</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                {result.servicesList.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Google Posts (3 ideas)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {result.googlePosts.map((p, i) => (
                <CopyBlock
                  key={i}
                  label={p.title}
                  text={p.body}
                />
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">FAQ suggestions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {result.faqSuggestions.map((f, i) => (
                <CopyBlock
                  key={i}
                  label={f.question}
                  text={f.answer}
                />
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Local SEO tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {result.localSeoTips.map((t, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-primary">•</span>
                    {t}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Profile checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {result.profileChecklist.map((item, i) => (
                  <li
                    key={i}
                    className="flex gap-3 rounded-lg border border-border p-3"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                      {i + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
