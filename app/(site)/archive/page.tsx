import { getAllIssues } from "@/lib/mdx";
import { getAllTags } from "@/lib/tags";
import { ArchiveList } from "./ArchiveList";

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
    <div>
      <header className="mb-10">
        <p className="smallcaps mb-3">Archive</p>
        <h1 className="font-serif text-[32px] font-semibold leading-[1.2] tracking-tight">
          Every issue, by week.
        </h1>
        <p className="mt-4 text-muted">
          Filter by topic to find what you&apos;re looking for.
        </p>
      </header>
      <ArchiveList issues={issues} allTags={allTags} />
    </div>
  );
}
