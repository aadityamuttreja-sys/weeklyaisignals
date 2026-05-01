import crypto from "node:crypto";
import type { RawItem } from "./types";

export function canonicalUrl(url: string): string {
  try {
    const u = new URL(url);
    u.hash = "";
    for (const k of [...u.searchParams.keys()]) {
      if (k.toLowerCase().startsWith("utm_") || k === "ref" || k === "ref_src") {
        u.searchParams.delete(k);
      }
    }
    u.host = u.host.replace(/^www\./, "");
    return u.toString().replace(/\/$/, "");
  } catch {
    return url;
  }
}

export function itemHash(item: RawItem): string {
  const key = `${canonicalUrl(item.url)}|${item.title.toLowerCase().trim()}`;
  return crypto.createHash("sha1").update(key).digest("hex");
}

export function dedupBatch(items: RawItem[]): RawItem[] {
  const seen = new Set<string>();
  const out: RawItem[] = [];
  for (const i of items) {
    const h = itemHash(i);
    if (seen.has(h)) continue;
    seen.add(h);
    out.push(i);
  }
  return out;
}
