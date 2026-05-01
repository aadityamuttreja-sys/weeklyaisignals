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
      <main className="mx-auto max-w-[1180px] px-6">
        <section className="py-32">
          <div className="smallcaps">Coming soon</div>
          <h1 className="mt-3 max-w-[20ch] font-serif text-[clamp(2.4rem,4.6vw,3.6rem)] font-medium leading-[1.05] tracking-tight text-ink-strong">
            Weekly AI Signals.
          </h1>
          <p className="mt-6 max-w-[38rem] font-serif text-[1.18rem] leading-[1.5] text-ink-muted">
            One short, dense email each Monday on what changed in AI. Curated,
            skeptical, short. The first issue ships next Monday.
          </p>
          <div className="mt-10 max-w-[36rem]">
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

  const tags = Array.from(
    new Set([
      ...latest.tags,
      ...builders.flatMap((b) => b.tags),
      ...everythingElse.flatMap((b) => b.tags),
      ...(deepDive?.tags ?? []),
    ])
  );

  return (
    <main className="mx-auto max-w-[1180px] px-6">
      {/* Hero standfirst */}
      <section className="grid grid-cols-1 gap-6 py-16 md:grid-cols-[3fr_2fr] md:gap-16">
        <div>
          <div className="smallcaps">A weekly read of what changed in AI</div>
          <h1 className="mt-4 max-w-[18ch] font-serif text-[clamp(2.4rem,4.6vw,3.6rem)] font-medium leading-[1.02] tracking-tight text-ink-strong">
            Curated, <span className="italic">skeptical</span>, short.
          </h1>
          <p className="mt-6 max-w-[38rem] font-serif text-[1.18rem] leading-[1.5] text-ink-muted">
            Each Monday: a tiered read of the week's most consequential research,
            launches, and shifts. Built for executives skimming, builders shipping,
            and practitioners going deep.
          </p>
        </div>
        <div className="self-end">
          <SubscribeForm source="home" variant="inline" />
          <p className="mt-3 font-mono text-[0.74rem] tracking-[0.06em] text-ink-faint">
            FREE · NO TRACKING · UNSUBSCRIBE WITH ONE CLICK
          </p>
        </div>
      </section>

      {/* Issue ribbon */}
      {ribbon.length > 1 ? (
        <div className="border-y border-rule">
          <div className="flex gap-8 overflow-x-auto py-4 font-mono text-[0.74rem] tracking-[0.08em]">
            {ribbon.map((iss, i) => (
              <Link
                key={iss.slug}
                href={`/issues/${iss.slug}`}
                className={
                  i === 0
                    ? "whitespace-nowrap text-ink-strong"
                    : "whitespace-nowrap text-ink-muted hover:text-accent"
                }
              >
                №{String(iss.issueNumber).padStart(2, "0")} ·{" "}
                {fmtDateShort(iss.publishDate).toUpperCase()}
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      {/* Inline latest issue */}
      <IssueHeader
        issueNumber={latest.issueNumber}
        publishDate={latest.publishDate}
        readingTimeMinutes={latest.readingTimeMinutes ?? 6}
        title={latest.title}
        summary={latest.summary}
      />

      <article className="grid grid-cols-1 gap-6 py-12 lg:grid-cols-[200px_minmax(0,38rem)] lg:gap-16 lg:justify-start">
        <aside className="font-sans text-[0.84rem]">
          <div className="lg:sticky lg:top-6">
            <div className="smallcaps">Latest issue</div>
            <ul className="mt-3 flex list-none flex-col gap-2 p-0">
              <li>
                <a href="#tldr" className="text-ink-muted hover:text-accent">
                  The 60-second read
                </a>
              </li>
              <li>
                <a href="#builders" className="text-ink-muted hover:text-accent">
                  For builders
                </a>
              </li>
              {deepDive ? (
                <li>
                  <a href="#deepdive" className="text-ink-muted hover:text-accent">
                    Deep dive
                  </a>
                </li>
              ) : null}
              <li>
                <a href="#else" className="text-ink-muted hover:text-accent">
                  Everything else
                </a>
              </li>
            </ul>
            <div className="my-6 h-px bg-rule-soft" />
            <Link
              href={`/issues/${latest.slug}`}
              className="font-sans text-[0.84rem] font-medium text-accent"
            >
              Open full issue →
            </Link>
          </div>
        </aside>

        <div>
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
                    className="border-t border-rule-soft py-8 first:border-t-0 first:pt-3"
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
        <section className="border-t border-rule py-12">
          <div className="mb-8 grid grid-cols-[auto_auto_1fr] items-baseline gap-4">
            <span className="font-mono text-[0.74rem] tracking-[0.16em] text-ink-faint">
              ARCHIVE
            </span>
            <span className="font-serif text-[1.18rem] italic text-ink-strong">
              Recent issues
            </span>
            <span className="h-px self-center bg-ink-strong" />
          </div>
          <ol className="m-0 list-none p-0">
            {recent.map((issue) => (
              <li
                key={issue.slug}
                className="border-t border-rule-soft first:border-t-0"
              >
                <Link
                  href={`/issues/${issue.slug}`}
                  className="grid grid-cols-[64px_100px_1fr] items-baseline gap-4 py-4 transition-colors hover:bg-accent/5"
                >
                  <span className="font-mono text-[0.74rem] tabular-nums tracking-[0.04em] text-ink-faint">
                    №{String(issue.issueNumber).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-[0.74rem] tabular-nums tracking-[0.04em] text-ink-muted">
                    {fmtDateShort(issue.publishDate).toUpperCase()}
                  </span>
                  <span className="font-serif text-[1.18rem] font-medium text-ink-strong">
                    {issue.title}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
          <p className="mt-8">
            <Link
              href="/archive"
              className="font-mono text-[0.78rem] tracking-[0.08em] text-ink-muted hover:text-accent"
            >
              SEE FULL ARCHIVE →
            </Link>
          </p>
        </section>
      ) : null}

      <SubscribeForm source="home-bottom" />

      <Footer />
    </main>
  );
}
