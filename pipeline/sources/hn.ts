import type { RawItem } from "../types";

const AI_QUERY =
  "(AI OR LLM OR \"language model\" OR Anthropic OR OpenAI OR \"open source\" OR agent)";

export async function fetchHN(opts: { sinceDays?: number; hits?: number } = {}): Promise<
  RawItem[]
> {
  const sinceDays = opts.sinceDays ?? 7;
  const hits = opts.hits ?? 50;
  const since = Math.floor((Date.now() - sinceDays * 86_400_000) / 1000);

  const url = new URL("https://hn.algolia.com/api/v1/search");
  url.searchParams.set("query", AI_QUERY);
  url.searchParams.set("tags", "story");
  url.searchParams.set("numericFilters", `created_at_i>${since},points>30`);
  url.searchParams.set("hitsPerPage", String(hits));

  const res = await fetch(url.toString(), {
    headers: { "user-agent": "weekly-ai-signals/0.1 (+https://github.com)" },
  });
  if (!res.ok) {
    throw new Error(`HN fetch failed: ${res.status}`);
  }
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
