import type { RawItem } from "../types";

const QUERIES = [
  "AI",
  "LLM",
  "language model",
  "Anthropic",
  "OpenAI",
  "agent",
  "open source model",
];

export async function fetchHN(opts: { sinceDays?: number; hits?: number } = {}): Promise<
  RawItem[]
> {
  const sinceDays = opts.sinceDays ?? 7;
  const perQuery = Math.ceil((opts.hits ?? 50) / QUERIES.length);
  const since = Math.floor((Date.now() - sinceDays * 86_400_000) / 1000);

  const settled = await Promise.allSettled(
    QUERIES.map((q) => fetchOne(q, since, perQuery))
  );

  const seen = new Set<string>();
  const out: RawItem[] = [];
  for (const r of settled) {
    if (r.status !== "fulfilled") continue;
    for (const item of r.value) {
      if (seen.has(item.url)) continue;
      seen.add(item.url);
      out.push(item);
    }
  }
  return out;
}

async function fetchOne(query: string, since: number, hits: number): Promise<RawItem[]> {
  const url = new URL("https://hn.algolia.com/api/v1/search");
  url.searchParams.set("query", query);
  url.searchParams.set("tags", "story");
  url.searchParams.set("numericFilters", `created_at_i>${since},points>20`);
  url.searchParams.set("hitsPerPage", String(hits));

  const res = await fetch(url.toString(), {
    headers: { "user-agent": "weekly-ai-signals/0.1 (+https://github.com)" },
  });
  if (!res.ok) throw new Error(`HN ${query} ${res.status}`);
  const data = (await res.json()) as { hits: HNHit[] };

  return data.hits
    .filter((h) => h.url && h.title)
    .map<RawItem>((h) => ({
      title: h.title,
      url: h.url!,
      source: "Hacker News",
      publishedAt: new Date(h.created_at_i * 1000).toISOString(),
      engagement: (h.points ?? 0) + (h.num_comments ?? 0),
    }));
}

type HNHit = {
  title: string;
  url: string | null;
  points: number | null;
  num_comments: number | null;
  created_at_i: number;
};
