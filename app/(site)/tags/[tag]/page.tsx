import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllTags, getIssuesByTag } from "@/lib/tags";

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `#${tag}`,
    description: `Every issue of Weekly AI Signals tagged #${tag}.`,
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const issues = getIssuesByTag(decoded);
  if (!issues.length) notFound();

  return (
    <div>
      <header className="mb-10">
        <p className="smallcaps mb-3">Tag</p>
        <h1 className="font-serif text-[32px] font-semibold leading-[1.2] tracking-tight">
          #{decoded}
        </h1>
        <p className="mt-4 text-muted">
          {issues.length} issue{issues.length === 1 ? "" : "s"} tagged{" "}
          <span className="smallcaps">#{decoded}</span>.
        </p>
      </header>
      <ul>
        {issues.map((issue) => (
          <li key={issue.slug} className="border-b border-rule py-7">
            <p className="smallcaps mb-2">
              Issue {issue.issueNumber} · {formatDate(issue.publishDate)}
            </p>
            <h2 className="font-serif text-[22px] font-semibold leading-[1.3] tracking-tight">
              <Link href={`/issues/${issue.slug}`}>{issue.title}</Link>
            </h2>
            <p className="mt-2 text-[17px] leading-[1.6] text-muted">{issue.summary}</p>
          </li>
        ))}
      </ul>
      <p className="mt-8">
        <Link href="/archive" className="smallcaps !border-b-0">
          ← Back to archive
        </Link>
      </p>
    </div>
  );
}
