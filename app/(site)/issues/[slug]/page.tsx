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
    <main className="mx-auto max-w-[1180px] px-6">
      <IssueHeader
        issueNumber={issue.issueNumber}
        publishDate={issue.publishDate}
        readingTimeMinutes={issue.readingTimeMinutes ?? 6}
        title={issue.title}
        summary={issue.summary}
      />

      <article className="grid grid-cols-1 gap-6 py-12 pb-24 lg:grid-cols-[200px_minmax(0,38rem)] lg:gap-16 lg:justify-start">
        <aside className="font-sans text-[0.84rem]">
          <div className="lg:sticky lg:top-6">
            <div className="smallcaps">Contents</div>
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
            <div className="smallcaps">Filed</div>
            <div className="mt-3 flex flex-wrap gap-3">
              {tags.slice(0, 8).map((t) => (
                <TagChip key={t} tag={t} />
              ))}
            </div>
            {deepDive ? (
              <>
                <div className="my-6 h-px bg-rule-soft" />
                <a
                  href="#deepdive"
                  className="font-sans text-[0.84rem] font-medium text-accent"
                >
                  Skip to deep dive →
                </a>
              </>
            ) : null}
          </div>
        </aside>

        <div>
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

      <div className="border-t border-rule pt-12">
        <div className="smallcaps">Tagged in this issue</div>
        <div className="mt-4 flex flex-wrap gap-4">
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
