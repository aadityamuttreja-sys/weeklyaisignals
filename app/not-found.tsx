import Link from "next/link";
import { Footer } from "@/components/Footer";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-[1180px] px-6">
      <section className="pt-24 pb-32">
        <div className="smallcaps">Error</div>
        <div className="mt-4 flex items-baseline gap-[0.05em] font-serif text-ink-strong leading-[0.85]">
          <span className="font-medium italic tracking-[-0.04em] text-[clamp(5rem,16vw,13rem)]">
            404
          </span>
        </div>
        <h1 className="mt-8 max-w-[20ch] font-serif text-[clamp(1.9rem,3vw,2.4rem)] font-medium leading-[1.12] tracking-tight text-ink-strong">
          That issue isn&apos;t here.
        </h1>
        <p className="mt-6 max-w-[38rem] font-serif text-[1.18rem] leading-[1.5] text-ink-muted">
          The URL may be off, or it was a draft that never shipped.{" "}
          <Link href="/archive" className="link-rule text-accent">
            Browse the archive →
          </Link>
        </p>
      </section>
      <Footer />
    </main>
  );
}
