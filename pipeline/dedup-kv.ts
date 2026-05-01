import type { RawItem } from "./types";
import { itemHash } from "./dedup";
import { kv } from "@/lib/kv";

const SEEN_KEY = "pipeline:seen-items";
const TTL_SECONDS = 60 * 60 * 24 * 90; // 90 days

export async function filterUnseen(items: RawItem[]): Promise<RawItem[]> {
  const r = kv();
  if (!r) {
    console.warn("[dedup-kv] KV not configured — skipping cross-week dedup");
    return items;
  }
  const hashes = items.map(itemHash);
  const seen = await r.smismember(SEEN_KEY, hashes);
  const fresh = items.filter((_, i) => !seen[i]);
  console.log(
    `[dedup-kv] ${fresh.length}/${items.length} fresh items (${
      items.length - fresh.length
    } already seen)`
  );
  return fresh;
}

export async function markSeen(items: RawItem[]): Promise<void> {
  const r = kv();
  if (!r) return;
  if (!items.length) return;
   const hashes = items.map(itemHash);
   const [first, ...rest] = hashes;
   await r.sadd(SEEN_KEY, first, ...rest);
   await r.expire(SEEN_KEY, TTL_SECONDS);
}
