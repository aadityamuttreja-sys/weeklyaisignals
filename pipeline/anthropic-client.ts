import Anthropic, { ClientOptions } from "@anthropic-ai/sdk";

let client: Anthropic | null = null;

export function getClient(): Anthropic {
  if (client) return client;

  const baseURL = process.env.ANTHROPIC_BASE_URL || undefined;
  const authToken = process.env.ANTHROPIC_AUTH_TOKEN || undefined;
  const apiKey = process.env.ANTHROPIC_API_KEY || undefined;

  const opts: ClientOptions = {};
  if (baseURL) opts.baseURL = baseURL;

  if (authToken) {
    opts.authToken = authToken;
  } else if (apiKey) {
    opts.apiKey = apiKey;
  } else {
    throw new Error(
      "Missing credentials: set ANTHROPIC_AUTH_TOKEN (Vercel AI Gateway) or ANTHROPIC_API_KEY"
    );
  }

  client = new Anthropic(opts);
  return client;
}
