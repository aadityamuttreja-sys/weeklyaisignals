import fs from "node:fs";
import path from "node:path";
import type Anthropic from "@anthropic-ai/sdk";
import { getClient } from "./anthropic-client";
import type { SummarizedItem } from "./types";

const PROMPT_PATH = path.join(process.cwd(), "pipeline", "prompts", "deep-dive.md");
const MODEL = "claude-opus-4-7";

export type DeepDive = {
  title: string;
  standfirst: string;
  body: string[];
  pullQuote: string;
  sourceUrl?: string;
  tags: string[];
};

export async function synthesizeDeepDive(
  items: SummarizedItem[]
): Promise<DeepDive | null> {
  const top = items
    .slice()
    .sort((a, b) => b.bucketScore - a.bucketScore)
    .slice(0, 12);
  if (top.length === 0) return null;

  const system = fs.readFileSync(PROMPT_PATH, "utf8");
  const userText = top
    .map(
      (i, idx) =>
        `${idx + 1}. **${i.title}** (${i.source}) — ${i.url}\n   ${i.summary}`
    )
    .join("\n\n");

  const res = await getClient().messages.create({
    model: MODEL,
    max_tokens: 2000,
    system: [
      {
        type: "text",
        text: system,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: `Top items from this week:\n\n${userText}` }],
  });

  const text = res.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();

  const parsed = parseJsonLoose(text);
  if (!parsed.title || !parsed.body) {
    console.warn("[deepdive] Opus returned malformed response, skipping");
    return null;
  }
  const body = Array.isArray(parsed.body)
    ? parsed.body.map(String)
    : [String(parsed.body)];
  return {
    title: String(parsed.title),
    standfirst: parsed.standfirst ? String(parsed.standfirst) : "",
    body,
    pullQuote: parsed.pullQuote ? String(parsed.pullQuote) : "",
    sourceUrl: parsed.anchorUrl ? String(parsed.anchorUrl) : undefined,
    tags: Array.isArray(parsed.tags) ? parsed.tags.map(String) : [],
  };
}

function parseJsonLoose(s: string): Record<string, unknown> {
  const fenced = s.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenced ? fenced[1] : s;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1) return {};
  try {
    return JSON.parse(candidate.slice(start, end + 1));
  } catch {
    return {};
  }
}
