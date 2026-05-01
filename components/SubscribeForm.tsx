"use client";

import { useState, FormEvent } from "react";

export interface SubscribeFormProps {
  source?: string;
  variant?: "block" | "inline";
}

export function SubscribeForm({
  source = "site",
  variant = "block",
}: SubscribeFormProps) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState("error");
      return;
    }
    setState("sending");
    try {
      const r = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      setState(r.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  if (variant === "inline") {
    return (
      <form
        onSubmit={submit}
        className="flex items-stretch gap-3 border-t border-rule pt-3"
      >
        <input
          className="field flex-1"
          type="email"
          placeholder="you@domain.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={state === "sending" || state === "done"}
        />
        <button
          className="btn whitespace-nowrap"
          disabled={state === "sending" || state === "done"}
        >
          {state === "done" ? "Subscribed" : state === "sending" ? "…" : "Subscribe"}
        </button>
      </form>
    );
  }
  return (
    <div className="py-24">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-24">
        <div>
          <div className="smallcaps">Subscribe</div>
          <h2 className="mt-3 max-w-[18ch] font-serif text-[clamp(1.9rem,3vw,2.4rem)] font-medium leading-tight tracking-tight text-ink-strong">
            One issue every Monday. No filler.
          </h2>
          <p className="mt-5 font-serif text-[1.05rem] leading-[1.62] text-ink-muted">
            A weekly read of what changed in AI — written for executives, builders,
            and practitioners. Free, no tracking pixels, unsubscribe with one click.
          </p>
        </div>
        <form onSubmit={submit} className="mt-5 flex flex-col gap-2">
          <label
            className="font-mono text-[0.74rem] tracking-[0.06em] text-ink-muted"
            htmlFor={`sub-${source}`}
          >
            EMAIL
          </label>
          <input
            id={`sub-${source}`}
            className="field"
            type="email"
            placeholder="you@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={state === "sending" || state === "done"}
          />
          <div className="mt-3 flex items-center justify-between gap-3">
            <button
              className="btn"
              disabled={state === "sending" || state === "done"}
            >
              {state === "done"
                ? "Subscribed ✓"
                : state === "sending"
                  ? "Sending…"
                  : "Subscribe"}
            </button>
            <span
              className={`font-mono text-[0.74rem] tracking-[0.06em] ${
                state === "error" ? "text-accent" : "text-ink-faint"
              }`}
            >
              {state === "error" ? "INVALID EMAIL" : "POST /api/subscribe"}
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
