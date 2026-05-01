import type { RawItem } from "../types";
import { fetchHN } from "./hn";
import { fetchArxiv } from "./arxiv";
import { fetchReddit } from "./reddit";
import { fetchAllRss } from "./rss";

export async function fetchAllSources(): Promise<RawItem[]> {
  const tasks = [
    label("Hacker News", fetchHN({ sinceDays: 7, hits: 50 })),
    label("arXiv", fetchArxiv({ sinceDays: 7, max: 60 })),
    label("Reddit", fetchReddit({ perSub: 30 })),
    label("RSS", fetchAllRss({ sinceDays: 7 })),
  ];
  const settled = await Promise.allSettled(tasks);
  const out: RawItem[] = [];
  for (const r of settled) {
    if (r.status === "fulfilled") out.push(...r.value);
  }
  return out;
}

async function label(
  name: string,
  p: Promise<RawItem[]>
): Promise<RawItem[]> {
  try {
    const items = await p;
    console.log(`  [${name}] ${items.length} items`);
    return items;
  } catch (err) {
    console.warn(`  [${name}] failed:`, err);
    return [];
  }
}
