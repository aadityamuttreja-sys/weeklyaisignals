"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

function fmtClockUtc(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getUTCDate())}.${p(d.getUTCMonth() + 1)}.${d.getUTCFullYear()} / ${p(d.getUTCHours())}:${p(d.getUTCMinutes())} UTC`;
}

export function Masthead() {
  const pathname = usePathname() ?? "/";
  const isActive = (p: string) => pathname === p || pathname.startsWith(p + "/");
  const [clock, setClock] = useState("");

  useEffect(() => {
    const tick = () => setClock(fmtClockUtc(new Date()));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-paper">
      <div className="tx-main flex items-center justify-between gap-4 py-2.5 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-6">
        <div className="hidden min-w-0 items-center gap-[18px] text-[11px] uppercase tracking-[0.05em] text-ink-muted md:flex">
          <span
            className="tx-blink-dot inline-block shrink-0 rounded-[1px] bg-accent shadow-[0_0_12px_var(--accent)]"
            aria-hidden
          />
          <span className="whitespace-nowrap">SIGNAL: live</span>
          <span className="truncate normal-case tracking-normal text-ink-faint">
            {clock ? `// ${clock}` : "// …"}
          </span>
        </div>
        <Link
          href="/"
          aria-label="Weekly AI Signals — home"
          className="font-mono text-xs font-semibold normal-case tracking-[0.02em] text-ink-strong md:justify-self-center"
        >
          Weekly<span className="text-accent">/</span>AI
          <span className="text-accent">.</span>Signals
        </Link>
        <nav className="flex shrink-0 justify-end gap-4 font-mono text-[11px] normal-case tracking-normal md:gap-5">
          <Link
            href="/archive"
            className={
              isActive("/archive")
                ? "font-medium text-accent"
                : "text-ink-muted hover:text-accent"
            }
          >
            Archive
          </Link>
          <Link
            href="/about"
            className={
              isActive("/about")
                ? "font-medium text-accent"
                : "text-ink-muted hover:text-accent"
            }
          >
            About
          </Link>
          <a href="/rss.xml" className="text-ink-muted hover:text-accent">
            RSS<span className="ml-0.5 text-[0.78em] text-ink-faint">↗</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
