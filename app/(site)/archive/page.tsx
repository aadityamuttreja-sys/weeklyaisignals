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
    <main className="mx-auto max-w-[1180px] px-6">
      <header className="pt-24 pb-12">
        <div className="smallcaps">Archive</div>
        <h1 className="mt-3 max-w-[18ch] font-serif text-[clamp(2.4rem,4.6vw,3.6rem)] font-medium leading-[1.05] tracking-tight text-ink-strong">
          Every issue, by week.
        </h1>
        <p className="mt-6 max-w-[38rem] font-serif text-[1.18rem] leading-[1.5] text-ink-muted">
          {issues.length} {issues.length === 1 ? "issue" : "issues"} so far.
          Filter by topic, search by title, or scroll the years.
        </p>
      </header>
      <ArchiveList archive={issues} allTags={allTags} />
      <Footer />
    </main>
  );
}
