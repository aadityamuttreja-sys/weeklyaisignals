import Link from "next/link";

export function Footer() {
  const y = new Date().getFullYear();
  return (
    <footer className="mt-20">
      <div className="border-t border-rule" />
      <div className="tx-main flex flex-col gap-8 py-10 md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4 text-[10px] uppercase tracking-[0.1em] text-ink-faint">
          <span>// END OF TRANSMISSION</span>
          <span className="text-sm tracking-[0.3em] text-accent">━━━ ✦ ━━━</span>
          <span>
            Weekly AI Signals · TX · {y}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-3 border-t border-rule pt-8 font-mono text-[0.8rem] text-ink-muted md:border-t-0 md:pt-0 sm:grid-cols-4">
          <Link href="/archive" className="hover:text-accent">
            Archive
          </Link>
          <Link href="/about" className="hover:text-accent">
            About
          </Link>
          <a href="/rss.xml" className="hover:text-accent">
            RSS
          </a>
          <span className="text-ink-faint">Instrument · IBM Plex Mono</span>
        </div>
      </div>
    </footer>
  );
}
