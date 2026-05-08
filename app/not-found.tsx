import Link from "next/link";
import { Footer } from "@/components/Footer";

export default function NotFound() {
  return (
    <main className="tx-main pb-24">
      <section className="pb-32 pt-16 md:pt-24">
        <div className="smallcaps">Error</div>
        <div className="mt-4 flex items-baseline gap-[0.05em] font-serif leading-[0.85] text-ink-strong">
          <span className="italic tracking-[-0.04em] text-[clamp(5rem,16vw,13rem)] text-magenta">
            404
          </span>
        </div>
        <h1 className="mt-8 max-w-[20ch] font-serif text-[clamp(1.9rem,3vw,2.4rem)] font-normal leading-[1.12] tracking-tight text-ink-strong">
          That issue isn&apos;t here.
        </h1>
        <p className="mt-6 max-w-measure-wide font-mono text-[15px] leading-[1.55] text-ink-muted md:text-[16px]">
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
