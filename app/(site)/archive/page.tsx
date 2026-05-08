import { getAllIssues } from "@/lib/mdx";
import { getAllTags } from "@/lib/tags";
import { ArchiveList } from "./ArchiveList";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Archive",
  description: "Every issue of Weekly AI Signals, filterable by topic.",
};

export default function ArchivePage() {
  const issues = getAllIssues().map((i) => ({
    slug: i.slug,
    title: i.title,
    summary: i.summary,
    publishDate: i.publishDate,
    issueNumber: i.issueNumber,
    readingTimeMinutes: i.readingTimeMinutes ?? 6,
    tags: Array.from(
      new Set([
        ...i.tags,
        ...i.sections.builders.flatMap((b) => b.tags),
        ...i.sections.everythingElse.flatMap((b) => b.tags),
        ...(i.sections.deepDive?.tags ?? []),
      ])
    ).sort(),
  }));
  const allTags = getAllTags();

  return (
    <main className="tx-main pb-24">
      <header className="border-b border-dashed border-rule-soft pb-12 pt-16 md:pt-20">
        <div className="smallcaps">Archive</div>
        <h1 className="mt-3 max-w-[18ch] font-serif text-[clamp(2.4rem,6vw,3.75rem)] font-normal leading-[1.05] tracking-tight text-ink-strong">
          Every issue, by week.
        </h1>
        <p className="mt-6 max-w-measure-wide font-mono text-[15px] leading-[1.55] text-ink-muted md:text-[16px]">
          {issues.length} {issues.length === 1 ? "issue" : "issues"} so far.
          Filter by topic, search by title, or scroll the years.
        </p>
      </header>
      <ArchiveList archive={issues} allTags={allTags} />
      <Footer />
    </main>
  );
}
