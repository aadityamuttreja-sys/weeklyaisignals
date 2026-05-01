import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24">
      <div className="h-px bg-rule" />
      <div className="mx-auto grid max-w-[1180px] grid-cols-1 gap-6 px-6 py-12 md:grid-cols-[2fr_3fr] md:gap-12">
        <div className="flex flex-col gap-2">
          <div className="font-serif italic text-[1.18rem] text-ink-strong">
            Weekly AI Signals
          </div>
          <div className="font-mono text-[0.74rem] tracking-[0.06em] text-ink-faint">
            EST. {new Date().getFullYear()} · CURATED WEEKLY
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
          <FooterCol title="Read">
            <Link href="/archive">Archive</Link>
            <Link href="/about">About</Link>
            <a href="/rss.xml">RSS</a>
          </FooterCol>
          <FooterCol title="Tags">
            <Link href="/tags/agents">#agents</Link>
            <Link href="/tags/evals">#evals</Link>
            <Link href="/tags/models">#models</Link>
            <Link href="/tags/infra">#infra</Link>
          </FooterCol>
          <FooterCol title="Colophon">
            <span>Newsreader · Geist · JetBrains Mono</span>
            <span className="text-ink-faint">© {new Date().getFullYear()}</span>
          </FooterCol>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 font-sans text-[0.86rem] text-ink-muted [&_a:hover]:text-accent">
      <div className="smallcaps mb-2">{title}</div>
      {children}
    </div>
  );
}
