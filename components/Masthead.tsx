import Link from "next/link";

export function Masthead() {
  return (
    <header className="border-b border-rule">
      <div className="mx-auto flex w-full max-w-prose items-baseline justify-between px-6 py-6">
        <Link
          href="/"
          className="!border-b-0 font-serif text-[22px] font-semibold tracking-tight text-ink hover:!border-b-0"
        >
          Weekly AI Signals
        </Link>
        <nav className="flex items-baseline gap-6">
          <Link href="/archive" className="smallcaps !border-b-0 hover:text-ink">
            Archive
          </Link>
          <Link href="/about" className="smallcaps !border-b-0 hover:text-ink">
            About
          </Link>
          <Link href="/rss.xml" className="smallcaps !border-b-0 hover:text-ink">
            RSS
          </Link>
        </nav>
      </div>
    </header>
  );
}
