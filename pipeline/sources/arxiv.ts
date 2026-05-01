import type { RawItem } from "../types";

const QUERY = "cat:cs.AI+OR+cat:cs.CL+OR+cat:cs.LG";

export async function fetchArxiv(opts: { sinceDays?: number; max?: number } = {}): Promise<
  RawItem[]
> {
  const sinceDays = opts.sinceDays ?? 7;
  const max = opts.max ?? 100;
  const url =
    `https://export.arxiv.org/api/query?search_query=${QUERY}` +
    `&sortBy=submittedDate&sortOrder=descending&start=0&max_results=${max}`;

  const res = await fetch(url, {
    headers: { "user-agent": "weekly-ai-signals/0.1 (+https://github.com)" },
  });
  if (!res.ok) throw new Error(`arXiv fetch failed: ${res.status}`);
  const xml = await res.text();
  const cutoff = Date.now() - sinceDays * 86_400_000;

  return parseArxivAtom(xml).filter((i) => {
    if (!i.publishedAt) return false;
    return Date.parse(i.publishedAt) >= cutoff;
  });
}

function parseArxivAtom(xml: string): RawItem[] {
  const out: RawItem[] = [];
  const entryRe = /<entry>([\s\S]*?)<\/entry>/g;
  let match: RegExpExecArray | null;
  while ((match = entryRe.exec(xml))) {
    const block = match[1];
    const title = pluck(block, "title");
    const summary = pluck(block, "summary");
    const published = pluck(block, "published");
    const link =
      block.match(/<link[^>]*rel="alternate"[^>]*href="([^"]+)"/)?.[1] ??
      block.match(/<id>([^<]+)<\/id>/)?.[1];
    if (!title || !link) continue;
    out.push({
      title: title.replace(/\s+/g, " ").trim(),
      url: link,
      source: "arXiv",
      publishedAt: published ? new Date(published).toISOString() : undefined,
      rawText: summary?.replace(/\s+/g, " ").trim().slice(0, 1500),
    });
  }
  return out;
}

function pluck(block: string, tag: string): string | undefined {
  return block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`))?.[1];
}
