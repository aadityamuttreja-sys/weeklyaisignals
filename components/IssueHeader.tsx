import type { Issue } from "@/lib/mdx";

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function IssueHeader({ issue }: { issue: Issue }) {
  return (
    <header className="mb-10">
      <p className="smallcaps mb-4">
        Issue {issue.issueNumber}
        <span className="mx-2 text-rule">·</span>
        {formatDate(issue.publishDate)}
        {issue.readingTimeMinutes ? (
          <>
            <span className="mx-2 text-rule">·</span>
            {issue.readingTimeMinutes} min read
          </>
        ) : null}
      </p>
      <h1 className="font-serif text-[34px] font-semibold leading-[1.2] tracking-tight text-ink">
        {issue.title}
      </h1>
      <p className="mt-5 text-[19px] leading-[1.65] text-muted">{issue.summary}</p>
    </header>
  );
}
