import { Redis } from "@upstash/redis";

let client: Redis | null = null;

export function kv(): Redis | null {
  if (client) return client;
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  client = new Redis({ url, token });
  return client;
}

export type SubscriberRecord = {
  email: string;
  createdAt: string;
  source: string;
  confirmed: boolean;
  unsubToken: string;
};

function subKey(email: string) {
  return `subscribers:${email.toLowerCase()}`;
}

const INDEX_KEY = "subscribers:index";

export async function addSubscriber(
  email: string,
  source = "web"
): Promise<{ created: boolean }> {
  const r = kv();
  if (!r) {
    console.warn("[kv] not configured — skipping subscriber persist");
    return { created: false };
  }
  const key = subKey(email);
  const exists = await r.exists(key);
  if (exists) return { created: false };
  const record: SubscriberRecord = {
    email: email.toLowerCase(),
    createdAt: new Date().toISOString(),
    source,
    confirmed: false,
    unsubToken: cryptoRandom(),
  };
  await r.hset(key, record as unknown as Record<string, unknown>);
  await r.sadd(INDEX_KEY, email.toLowerCase());
  return { created: true };
}

export async function listSubscribers(): Promise<string[]> {
  const r = kv();
  if (!r) return [];
  return await r.smembers(INDEX_KEY);
}

function cryptoRandom() {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}
