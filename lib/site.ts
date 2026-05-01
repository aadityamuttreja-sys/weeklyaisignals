function resolveSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export const site = {
  name: "Weekly AI Signals",
  description:
    "A weekly read on what changed in AI — for executives, builders, and practitioners.",
  url: resolveSiteUrl(),
  author: "Weekly AI Signals",
};
