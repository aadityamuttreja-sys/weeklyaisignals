import Link from "next/link";
import { getAllIssues, getLatestIssue } from "@/lib/mdx";
import { IssueHeader } from "@/components/IssueHeader";
import { Section } from "@/components/Section";
import { TldrList } from "@/components/Tldr";
import { Item, CompactItem } from "@/components/Item";
import { DeepDive } from "@/components/DeepDive";
import { TagChip } from "@/components/TagChip";
import { SubscribeForm } from "@/components/SubscribeForm";
import { Footer } from "@/components/Footer";
import { fmtDateShort } from "@/lib/date";

export default function Home() {
  const latest = getLatestIssue();
  const recent = getAllIssues().slice(1, 6);
  const ribbon = getAllIssues().slice(0, 6);

  if (!latest) {
    return (
      <main className="tx-main pb-24">
        <section className="py-24 md:py-32">
          <div className="smallcaps">Coming soon</div>
          <h1 className="mt-4 max-w-[18ch] font-serif text-[clamp(2.4rem,6vw,3.75rem)] font-normal leading-[1.02] tracking-tight text-ink-strong">
            Weekly AI <span className="italic text-accent">Signals.</span>
          </h1>
          <p className="mt-6 max-w-measure-wide border-l-2 border-accent pl-5 font-mono text-[15px] leading-[1.55] text-ink-muted md:text-[17px]">
            One short, dense email each Monday on what changed in AI. Curated, skeptical, short. The first issue ships next Monday.
          </p>
          <div className="mt-10 max-w-md">
            <SubscribeForm source="home-empty" variant="inline" />
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  const builders = latest.sections.builders;
  const everythingElse = latest.sections.everythingElse;
  const deepDive = latest.sections.deepDive ?? null;

  return (
    <main className="tx-main pb-24">
      <section className="grid grid-cols-1 gap-12 border-b border-dashed border-rule-soft py-14 md:grid-cols-[3fr_2fr] md:gap-16 md:py-20">
        <div>
          <div className="smallcaps">A weekly read of what changed in AI</div>
          <h1 className="mt-4 max-w-[16ch] font-serif text-[clamp(2.4rem,6vw,3.75rem)] font-normal leading-[1.02] tracking-tight text-ink-strong">
            Curated, <span className="italic text-accent">skeptical</span>, short.
          </h1>
          <p className="mt-6 max-w-measure-wide border-l-2 border-accent pl-5 font-mono text-[15px] leading-[1.55] text-ink-muted md:text-[17px]">
            Each Monday: a tiered read of the week&apos;s most consequential research, launches, and shifts. Built for executives skimming, builders shipping, and practitioners going deep.
          </p>
        </div>
        <div className="self-end">
          <SubscribeForm source="home" variant="inline" />
          <p className="mt-3 font-mono text-[0.72rem] uppercase tracking-[0.08em] text-ink-faint">
            Free · No tracking · One-click unsubscribe
          </p>
        </div>
      </section>

      {ribbon.length > 1 ? (
        <div className="border-b border-rule">
          <div className="flex gap-8 overflow-x-auto py-3 font-mono text-[0.72rem] uppercase tracking-[0.08em]">
            {ribbon.map((iss, i) => (
              <Link
                key={iss.slug}
                href={`/issues/${iss.slug}`}
                className={
                  i === 0
                    ? "whitespace-nowrap text-accent"
                    : "whitespace-nowrap text-ink-muted hover:text-accent"
                }
              >
                // {String(iss.issueNumber).padStart(2, "0")} ·{" "}
                {fmtDateShort(iss.publishDate).toUpperCase()}
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      <IssueHeader
        issueNumber={latest.issueNumber}
        publishDate={latest.publishDate}
        readingTimeMinutes={latest.readingTimeMinutes ?? 6}
        title={latest.title}
        summary={latest.summary}
        slug={latest.slug}
      />

      <article className="grid grid-cols-1 gap-10 py-12 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16 xl:gap-20">
        <aside className="tx-toc lg:sticky lg:top-20 lg:self-start">
          <span className="tx-toc-label">// LATEST ISSUE</span>
          <ol>
            <li>
              <a href="#tldr">The 60-second read</a>
            </li>
            <li>
              <a href="#builders">For builders</a>
            </li>
            {deepDive ? (
              <li>
                <a href="#deepdive">Deep dive</a>
              </li>
            ) : null}
            <li>
              <a href="#else">Everything else</a>
            </li>
          </ol>
          <div className="my-8 h-px bg-rule" />
          <Link
            href={`/issues/${latest.slug}`}
            className="inline-block font-mono text-[12px] normal-case tracking-normal text-accent hover:underline"
          >
            Open full issue →
          </Link>
        </aside>

        <div className="max-w-measure-wide">
          {latest.sections.tldr.length ? (
            <Section kicker="01" label="The 60-second read" id="tldr">
              <TldrList items={latest.sections.tldr} />
            </Section>
          ) : null}

          {builders.length ? (
            <Section kicker="02" label="For builders" id="builders">
              <ol className="m-0 list-none p-0">
                {builders.map((it, i) => (
                  <li
                    key={i}
                    className="border-t border-rule py-10 first:border-t-0 first:pt-4"
                  >
                    <Item item={it} index={i + 1} />
                  </li>
                ))}
              </ol>
            </Section>
          ) : null}

          {deepDive ? (
            <Section kicker="03" label="Deep dive" id="deepdive">
              <DeepDive
                block={{
                  title: deepDive.title,
                  standfirst: deepDive.standfirst,
                  body: deepDive.body,
                  pullQuote: deepDive.pullQuote,
                  tags: deepDive.tags,
                  sourceUrl: deepDive.sourceUrl,
                }}
              />
            </Section>
          ) : null}

          {everythingElse.length ? (
            <Section
              kicker={deepDive ? "04" : "03"}
              label="Everything else"
              id="else"
            >
              <ul className="m-0 list-none p-0">
                {everythingElse.map((it, i) => (
                  <li key={i}>
                    <CompactItem item={it} />
                  </li>
                ))}
              </ul>
            </Section>
          ) : null}
        </div>
      </article>

      {recent.length ? (
        <section className="border-t border-rule py-14">
          <div className="mb-8 border-t border-rule pt-8">
            <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.1em] text-accent">
              // ARCHIVE ·
            </div>
            <h2 className="font-serif text-[clamp(1.75rem,4vw,2.75rem)] font-normal leading-[1.05] tracking-[-0.015em] text-ink-strong">
              Recent issues
            </h2>
          </div>
          <ol className="m-0 list-none p-0">
            {recent.map((issue) => (
              <li key={issue.slug} className="border-t border-rule first:border-t-0">
                <Link
                  href={`/issues/${issue.slug}`}
                  className="grid grid-cols-[64px_100px_1fr] items-baseline gap-4 py-4 transition-colors hover:bg-accent/[0.04]"
                >
                  <span className="font-mono text-[0.74rem] tabular-nums tracking-[0.04em] text-ink-faint">
                    //{String(issue.issueNumber).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-[0.74rem] tabular-nums tracking-[0.04em] text-ink-muted">
                    {fmtDateShort(issue.publishDate).toUpperCase()}
                  </span>
                  <span className="font-serif text-[1.15rem] font-normal text-ink-strong md:text-[1.2rem]">
                    {issue.title}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
          <p className="mt-8">
            <Link
              href="/archive"
              className="font-mono text-[0.78rem] uppercase tracking-[0.08em] text-ink-muted hover:text-accent"
            >
              See full archive →
            </Link>
          </p>
        </section>
      ) : null}

      <SubscribeForm source="home-bottom" />

      <Footer />
    </main>
  );
}
