import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-rule">
      <div className="mx-auto flex w-full max-w-prose flex-wrap items-baseline justify-between gap-4 px-6 py-10">
        <p className="smallcaps">
          © {new Date().getFullYear()} Weekly AI Signals
        </p>
        <div className="flex items-baseline gap-6">
          <Link href="/archive" className="smallcaps !border-b-0 hover:text-ink">
            Archive
          </Link>
          <Link href="/rss.xml" className="smallcaps !border-b-0 hover:text-ink">
            RSS
          </Link>
          <Link href="/about" className="smallcaps !border-b-0 hover:text-ink">
            About
          </Link>
        </div>
      </div>
    </footer>
  );
}
