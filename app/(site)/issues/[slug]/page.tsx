import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllIssues, getIssueBySlug } from "@/lib/mdx";
import { IssueHeader } from "@/components/IssueHeader";
import { Section } from "@/components/Section";
import { TldrList } from "@/components/Tldr";
import { Item, CompactItem } from "@/components/Item";
import { DeepDive } from "@/components/DeepDive";
import { TagChip } from "@/components/TagChip";
import { SubscribeForm } from "@/components/SubscribeForm";
import { Footer } from "@/components/Footer";

export function generateStaticParams() {
  return getAllIssues().map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const issue = getIssueBySlug(slug);
  if (!issue) return {};
  return {
    title: issue.title,
    description: issue.summary,
    openGraph: {
      title: issue.title,
      description: issue.summary,
      type: "article",
      publishedTime: issue.publishDate,
    },
  };
}

export default async function IssuePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const issue = getIssueBySlug(slug);
  if (!issue) notFound();

  const builders = issue.sections.builders;
  const everythingElse = issue.sections.everythingElse;
  const deepDive = issue.sections.deepDive ?? null;
  const tldr = issue.sections.tldr;

  const tags = Array.from(
    new Set([
      ...issue.tags,
      ...builders.flatMap((b) => b.tags),
      ...everythingElse.flatMap((b) => b.tags),
      ...(deepDive?.tags ?? []),
    ])
  );

  return (
    <main className="tx-main pb-24">
      <IssueHeader
        issueNumber={issue.issueNumber}
        publishDate={issue.publishDate}
        readingTimeMinutes={issue.readingTimeMinutes ?? 6}
        title={issue.title}
        summary={issue.summary}
        slug={issue.slug}
      />

      <article className="grid grid-cols-1 gap-10 py-16 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16 xl:gap-20">
        <aside className="tx-toc lg:sticky lg:top-20 lg:self-start">
          <span className="tx-toc-label">// CONTENTS</span>
          <ol>
            {tldr.length ? (
              <li>
                <a href="#tldr">The 60-second read</a>
              </li>
            ) : null}
            {builders.length ? (
              <li>
                <a href="#builders">For builders</a>
              </li>
            ) : null}
            {deepDive ? (
              <li>
                <a href="#deepdive">Deep dive</a>
              </li>
            ) : null}
            {everythingElse.length ? (
              <li>
                <a href="#else">Everything else</a>
              </li>
            ) : null}
          </ol>
          <div className="my-8 h-px bg-rule" />
          <div className="tx-toc-label normal-case tracking-normal text-ink-faint">// TAGGED</div>
          <div className="mt-3 flex flex-wrap gap-2 normal-case">
            {tags.slice(0, 8).map((t) => (
              <TagChip key={t} tag={t} />
            ))}
          </div>
          {deepDive ? (
            <>
              <div className="my-8 h-px bg-rule" />
              <a
                href="#deepdive"
                className="inline-block font-mono text-[12px] normal-case tracking-normal text-accent hover:underline"
              >
                Skip to deep dive →
              </a>
            </>
          ) : null}
        </aside>

        <div className="max-w-measure-wide">
          {tldr.length ? (
            <Section kicker="01" label="The 60-second read" id="tldr">
              <TldrList items={tldr} />
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

      <div className="border-t border-rule pt-12">
        <div className="smallcaps">Tagged in this issue</div>
        <div className="mt-4 flex flex-wrap gap-3">
          {tags.map((t) => (
            <TagChip key={t} tag={t} />
          ))}
        </div>
      </div>

      <SubscribeForm source={`issue-${issue.issueNumber}`} />
      <Footer />
    </main>
  );
}
