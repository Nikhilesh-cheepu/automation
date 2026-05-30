export type AIProvider = "claude" | "openai" | "auto";

function pickProvider(preferred?: AIProvider): "claude" | "openai" | null {
  const hasClaude = Boolean(process.env.ANTHROPIC_API_KEY);
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);

  if (preferred === "claude" && hasClaude) return "claude";
  if (preferred === "openai" && hasOpenAI) return "openai";
  if (preferred === "auto" || !preferred) {
    if (hasClaude) return "claude";
    if (hasOpenAI) return "openai";
  }
  return null;
}

export async function generateText(
  prompt: string,
  options?: { provider?: AIProvider; maxTokens?: number }
): Promise<{ text: string; provider: "claude" | "openai" | "template" }> {
  const provider = pickProvider(options?.provider);
  const maxTokens = options?.maxTokens ?? 4096;

  if (provider === "claude") {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: maxTokens,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const data = await res.json();
    const text = data.content?.[0]?.text;
    if (text) return { text, provider: "claude" };
    throw new Error(data.error?.message ?? "Claude request failed");
  }

  if (provider === "openai") {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: maxTokens,
      }),
    });
    const data = await res.json();
    const text = data.choices?.[0]?.message?.content;
    if (text) return { text, provider: "openai" };
    throw new Error(data.error?.message ?? "OpenAI request failed");
  }

  return { text: prompt, provider: "template" };
}
