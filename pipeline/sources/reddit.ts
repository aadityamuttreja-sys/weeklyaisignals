import type { RawItem } from "../types";

const SUBS = ["MachineLearning", "LocalLLaMA"];

export async function fetchReddit(opts: { perSub?: number } = {}): Promise<RawItem[]> {
  const perSub = opts.perSub ?? 30;
  const all: RawItem[] = [];
  for (const sub of SUBS) {
    try {
      const items = await fetchSub(sub, perSub);
      all.push(...items);
    } catch (err) {
      console.warn(`[reddit] ${sub} failed:`, err);
    }
  }
  return all;
}

async function fetchSub(sub: string, limit: number): Promise<RawItem[]> {
  const url = `https://www.reddit.com/r/${sub}/top.json?t=week&limit=${limit}`;
  const res = await fetch(url, {
    headers: {
      "user-agent": "weekly-ai-signals/0.1 (+https://github.com/aadityamuttreja-sys/weeklyaisignals)",
      accept: "application/json",
    },
  });
  if (!res.ok) throw new Error(`reddit r/${sub} ${res.status}`);
  const data = (await res.json()) as RedditListing;
  return data.data.children
    .map((c) => c.data)
    .filter((p) => !p.is_self && p.url && !p.over_18)
    .map<RawItem>((p) => ({
      title: p.title,
      url: p.url,
      source: `r/${sub}`,
      publishedAt: new Date(p.created_utc * 1000).toISOString(),
      engagement: (p.score ?? 0) + (p.num_comments ?? 0),
      rawText: p.selftext?.slice(0, 1500) || undefined,
    }));
}

type RedditListing = {
  data: {
    children: Array<{
      data: {
        title: string;
        url: string;
        score: number | null;
        num_comments: number | null;
        created_utc: number;
        is_self: boolean;
        over_18: boolean;
        selftext?: string;
      };
    }>;
  };
};
