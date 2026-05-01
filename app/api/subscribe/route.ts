import { NextResponse } from "next/server";
import { z } from "zod";
import { Ratelimit } from "@upstash/ratelimit";
import { addSubscriber, kv } from "@/lib/kv";

const Body = z.object({
  email: z.string().email().max(254),
  source: z.string().max(64).optional(),
});

let ratelimit: Ratelimit | null = null;
function getRatelimit() {
  if (ratelimit) return ratelimit;
  const r = kv();
  if (!r) return null;
  ratelimit = new Ratelimit({
    redis: r,
    limiter: Ratelimit.slidingWindow(5, "1 m"),
    analytics: false,
    prefix: "rl:subscribe",
  });
  return ratelimit;
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "anon";

  const rl = getRatelimit();
  if (rl) {
    const { success } = await rl.limit(ip);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Try again in a minute." },
        { status: 429 }
      );
    }
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }

  try {
    const { created } = await addSubscriber(parsed.data.email, parsed.data.source);
    return NextResponse.json({ ok: true, created });
  } catch (err) {
    console.error("[subscribe] failed", err);
    return NextResponse.json(
      { error: "Something went wrong on our end." },
      { status: 500 }
    );
  }
}
