import { SubscribeForm } from "@/components/SubscribeForm";

export const metadata = {
  title: "About",
  description: "About Weekly AI Signals.",
};

export default function AboutPage() {
  return (
    <article>
      <header className="mb-10">
        <p className="smallcaps mb-3">About</p>
        <h1 className="font-serif text-[32px] font-semibold leading-[1.2] tracking-tight">
          What this is.
        </h1>
      </header>

      <div className="space-y-6 text-[19px] leading-[1.7]">
        <p>
          <strong>Weekly AI Signals</strong> is a single, dense email each Monday on
          what actually changed in AI the prior week — across research, products, and
          infrastructure.
        </p>
        <p>
          It is structured for a mixed audience. The <em>60-second read</em> at the
          top is for executives who need the gist. <em>For builders</em> distills
          what&apos;s shippable into your stack this week. The <em>deep dive</em> is
          one longer treatment of the most important paper or launch, written for
          practitioners. <em>Everything else</em> is the linkroll — short notes on
          things worth knowing.
        </p>
        <p>
          The issue is curated by an automated pipeline that reads arXiv, Hacker News,
          Reddit (r/MachineLearning, r/LocalLLaMA), and a hand-picked set of lab and
          newsletter RSS feeds. Items are ranked, deduplicated across weeks,
          summarized, and assembled into a draft. A human reviews, edits, and
          approves every issue before it ships. No AI slop.
        </p>
        <p>
          Each item is tagged, so the{" "}
          <a href="/archive">archive</a> is filterable by topic. The full feed is
          available at <a href="/rss.xml">/rss.xml</a>.
        </p>
      </div>

      <div className="mt-12">
        <SubscribeForm compact />
      </div>
    </article>
  );
}
