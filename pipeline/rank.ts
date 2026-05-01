import type { RawItem } from "./types";

const SOURCE_AUTHORITY: Record<string, number> = {
  "Hacker News": 0.7,
  arXiv: 0.85,
  Reddit: 0.6,
  RSS: 0.9,
};

export function score(item: RawItem): number {
  const authority = SOURCE_AUTHORITY[item.source] ?? 0.5;
  const engagement = Math.log10((item.engagement ?? 1) + 1);
  const ageHours = item.publishedAt
    ? Math.max(0, (Date.now() - Date.parse(item.publishedAt)) / 3_600_000)
    : 168;
  const recency = Math.exp(-ageHours / 96);
  return authority * 0.5 + engagement * 0.3 + recency * 0.2;
}

export function rank(items: RawItem[], top = 40): RawItem[] {
  return items
    .map((i) => ({ i, s: score(i) }))
    .sort((a, b) => b.s - a.s)
    .slice(0, top)
    .map(({ i }) => i);
}
