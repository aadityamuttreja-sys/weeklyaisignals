"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Masthead() {
  const pathname = usePathname() ?? "/";
  const isActive = (p: string) => pathname === p || pathname.startsWith(p + "/");
  return (
    <header className="bg-paper">
      <div className="mx-auto flex max-w-[1180px] items-baseline justify-between px-6 py-6">
        <Link
          href="/"
          aria-label="Weekly AI Signals — home"
          className="flex items-baseline gap-[0.3em] whitespace-nowrap font-serif text-[1.45rem] tracking-tight text-ink-strong"
        >
          <span className="font-medium">Weekly</span>
          <span className="font-medium italic">AI Signals</span>
        </Link>
        <nav className="flex gap-8 font-sans text-[0.86rem]">
          <Link
            href="/archive"
            className={
              isActive("/archive")
                ? "text-ink-strong font-medium"
                : "text-ink-muted hover:text-accent"
            }
          >
            Archive
          </Link>
          <Link
            href="/about"
            className={
              isActive("/about")
                ? "text-ink-strong font-medium"
                : "text-ink-muted hover:text-accent"
            }
          >
            About
          </Link>
          <a href="/rss.xml" className="text-ink-muted hover:text-accent">
            RSS<span className="ml-[0.18em] text-[0.78em] text-ink-faint">↗</span>
          </a>
        </nav>
      </div>
      <div className="h-px bg-rule" />
    </header>
  );
}
