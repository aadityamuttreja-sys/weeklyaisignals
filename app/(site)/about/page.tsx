import { SubscribeForm } from "@/components/SubscribeForm";
import { Footer } from "@/components/Footer";
import { getAllIssues } from "@/lib/mdx";
import { getAllTags } from "@/lib/tags";

export const metadata = {
  title: "About",
  description: "About Weekly AI Signals.",
};

export default function AboutPage() {
  const issueCount = getAllIssues().length;
  const tagCount = getAllTags().length;

  return (
    <main className="tx-main pb-24">
      <header className="border-b border-dashed border-rule-soft pb-12 pt-16 md:pt-20">
        <div className="smallcaps">About</div>
        <h1 className="mt-3 max-w-[18ch] font-serif text-[clamp(2.4rem,6vw,3.75rem)] font-normal leading-[1.05] tracking-tight text-ink-strong">
          What this is.
        </h1>
      </header>

      <article className="grid grid-cols-1 gap-10 py-14 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
        <aside className="font-mono text-[0.84rem] lg:sticky lg:top-20 lg:self-start">
          <div className="border border-rule-soft bg-paper-deep/50 p-5">
            <div className="smallcaps">By the numbers</div>
            <dl className="mt-4 grid grid-cols-2 gap-y-3">
              <dt className="text-[0.74rem] tracking-[0.06em] text-ink-faint">ISSUES</dt>
              <dd className="font-serif text-[1.05rem] font-normal tabular-nums text-ink-strong">
                {issueCount}
              </dd>
              <dt className="text-[0.74rem] tracking-[0.06em] text-ink-faint">TAGS</dt>
              <dd className="font-serif text-[1.05rem] font-normal tabular-nums text-ink-strong">
                {tagCount}
              </dd>
              <dt className="text-[0.74rem] tracking-[0.06em] text-ink-faint">CADENCE</dt>
              <dd className="font-serif text-[1.05rem] font-normal text-ink-strong">Weekly</dd>
              <dt className="text-[0.74rem] tracking-[0.06em] text-ink-faint">COST</dt>
              <dd className="font-serif text-[1.05rem] font-normal text-ink-strong">Free</dd>
            </dl>
          </div>
        </aside>

        <div className="max-w-measure-wide space-y-6 font-serif text-[1.05rem] leading-[1.62] text-ink md:text-[1.12rem]">
          <p className="border-l-2 border-accent pl-5 font-mono text-[15px] italic leading-[1.55] text-ink-muted md:text-[16px]">
            Weekly AI Signals is a single, dense email each Monday on what
            actually changed in AI the prior week — across research, products,
            and infrastructure.
          </p>
          <p>
            It is structured for a mixed audience. The <em>60-second read</em>{" "}
            at the top is for executives who need the gist.{" "}
            <em>For builders</em> distills what&apos;s shippable into your stack
            this week. The <em>deep dive</em> is one longer treatment of the
            most important paper or launch, written for practitioners.{" "}
            <em>Everything else</em> is the linkroll — short notes on things
            worth knowing.
          </p>
          <p>
            The issue is curated by an automated pipeline that reads arXiv,
            Hacker News, Reddit (r/MachineLearning, r/LocalLLaMA), and a
            hand-picked set of lab and newsletter RSS feeds. Items are ranked,
            deduplicated across weeks, summarized, and assembled into a draft.
            A human reviews, edits, and approves every issue before it ships.
            No AI slop.
          </p>
          <p>
            Each item is tagged, so the archive is filterable by topic. The
            full feed is available at{" "}
            <a href="/rss.xml" className="link-rule text-accent">
              /rss.xml
            </a>
            .
          </p>
        </div>
      </article>

      <SubscribeForm source="about" />
      <Footer />
    </main>
  );
}
