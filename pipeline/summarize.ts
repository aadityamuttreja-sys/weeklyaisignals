import fs from "node:fs";
import path from "node:path";
import Anthropic from "@anthropic-ai/sdk";
import type { RawItem, SummarizedItem } from "./types";

const SYSTEM_PROMPT_PATH = path.join(
  process.cwd(),
  "pipeline",
  "prompts",
  "summarize.md"
);

let cachedSystem: string | null = null;
function loadSystem() {
  if (cachedSystem) return cachedSystem;
  cachedSystem = fs.readFileSync(SYSTEM_PROMPT_PATH, "utf8");
  return cachedSystem;
}

let client: Anthropic | null = null;
function getClient() {
  if (client) return client;
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not set");
  }
  client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return client;
}

const MODEL = "claude-sonnet-4-6";

export async function summarizeItem(item: RawItem): Promise<SummarizedItem> {
  const system = loadSystem();
  const userText = [
    `Title: ${item.title}`,
    `Source: ${item.source}`,
    `URL: ${item.url}`,
    item.publishedAt ? `Published: ${item.publishedAt}` : "",
    item.rawText ? `\nExcerpt:\n${item.rawText.slice(0, 4000)}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const res = await getClient().messages.create({
    model: MODEL,
    max_tokens: 400,
    system: [
      {
        type: "text",
        text: system,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: userText }],
  });

  const text = res.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();

  const parsed = parseJsonLoose(text);

  return {
    ...item,
    summary: String(parsed.summary ?? "").trim(),
    tags: Array.isArray(parsed.tags) ? parsed.tags.map(String) : [],
    bucket:
      parsed.bucket === "tldr" ||
      parsed.bucket === "builders" ||
      parsed.bucket === "deepDive" ||
      parsed.bucket === "everythingElse"
        ? parsed.bucket
        : "everythingElse",
    bucketScore: typeof parsed.bucketScore === "number" ? parsed.bucketScore : 0.5,
  };
}

export async function summarizeAll(items: RawItem[]): Promise<SummarizedItem[]> {
  const out: SummarizedItem[] = [];
  for (const item of items) {
    try {
      const s = await summarizeItem(item);
      out.push(s);
      process.stdout.write(`  ✓ ${s.bucket.padEnd(15)} ${s.title.slice(0, 60)}\n`);
    } catch (err) {
      console.warn(`  ✗ failed: ${item.title}`, err);
    }
  }
  return out;
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
