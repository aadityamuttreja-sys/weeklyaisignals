import Parser from "rss-parser";
import type { RawItem } from "../types";

type FeedSpec = { name: string; url: string };

export const FEEDS: FeedSpec[] = [
  { name: "Hugging Face", url: "https://huggingface.co/blog/feed.xml" },
  { name: "Simon Willison", url: "https://simonwillison.net/atom/everything/" },
  { name: "Latent Space", url: "https://www.latent.space/feed" },
  { name: "Sebastian Raschka", url: "https://magazine.sebastianraschka.com/feed" },
  { name: "Lil'Log", url: "https://lilianweng.github.io/index.xml" },
  { name: "Import AI", url: "https://importai.substack.com/feed" },
  { name: "The Gradient", url: "https://thegradient.pub/rss/" },
  { name: "Stratechery (free)", url: "https://stratechery.com/feed/" },
  // Lab feeds vary in availability; add as you confirm them:
  // { name: "Anthropic", url: "https://www.anthropic.com/news/rss.xml" }
  // { name: "OpenAI", url: "https://openai.com/news/rss.xml" }
  // { name: "DeepMind", url: "https://deepmind.google/blog/rss.xml" }
];

const parser: Parser = new Parser({
  timeout: 15_000,
  headers: { "user-agent": "weekly-ai-signals/0.1 (+https://github.com)" },
});

export async function fetchAllRss(opts: { sinceDays?: number } = {}): Promise<RawItem[]> {
  const sinceDays = opts.sinceDays ?? 7;
  const cutoff = Date.now() - sinceDays * 86_400_000;
  const results = await Promise.allSettled(FEEDS.map((f) => fetchOne(f, cutoff)));
  const out: RawItem[] = [];
  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    if (r.status === "fulfilled") {
      out.push(...r.value);
    } else {
      console.warn(`[rss] ${FEEDS[i].name} failed:`, r.reason);
    }
  }
  return out;
}

async function fetchOne(feed: FeedSpec, cutoff: number): Promise<RawItem[]> {
  const parsed = await parser.parseURL(feed.url);
  return (parsed.items ?? [])
    .filter((it) => it.link && it.title)
    .filter((it) => {
      const t = it.isoDate ?? it.pubDate;
      if (!t) return true;
      return Date.parse(t) >= cutoff;
    })
    .map<RawItem>((it) => ({
      title: it.title!.trim(),
      url: it.link!,
      source: feed.name,
      publishedAt: it.isoDate
        ? new Date(it.isoDate).toISOString()
        : it.pubDate
          ? new Date(it.pubDate).toISOString()
          : undefined,
      rawText: stripTags(it.contentSnippet ?? it.content ?? "").slice(0, 1500),
    }));
}

function stripTags(s: string): string {
  return s
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
