"use client";

import { useState } from "react";

export function SubscribeForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");
    setMessage("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setState("err");
        setMessage(data.error ?? "Something went wrong.");
      } else {
        setState("ok");
        setMessage("You're on the list. Check your inbox each Monday.");
        setEmail("");
      }
    } catch {
      setState("err");
      setMessage("Network error. Try again in a moment.");
    }
  }

  return (
    <div
      className={
        compact
          ? "border-y border-rule py-8"
          : "border-y border-rule bg-paper py-10"
      }
    >
      <p className="smallcaps mb-3">Get it weekly</p>
      <p className="mb-5 font-serif text-[20px] leading-[1.45] text-ink">
        One short, dense email each Monday on what actually changed in AI.
      </p>
      <form onSubmit={onSubmit} className="flex flex-wrap items-stretch gap-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@domain.com"
          className="flex-1 min-w-[200px] border border-rule bg-paper px-4 py-3 font-sans text-[15px] text-ink placeholder:text-muted focus:border-ink focus:outline-none"
          disabled={state === "loading"}
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className="border border-ink bg-ink px-5 py-3 font-sans text-[14px] font-semibold uppercase tracking-[0.08em] text-paper transition-colors hover:bg-accent hover:border-accent disabled:opacity-60"
        >
          {state === "loading" ? "Subscribing…" : "Subscribe"}
        </button>
      </form>
      {message ? (
        <p
          className={`mt-3 font-sans text-[14px] ${
            state === "ok" ? "text-ink" : "text-accent"
          }`}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
