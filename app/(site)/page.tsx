import Link from "next/link";
import { getAllIssues, getLatestIssue } from "@/lib/mdx";
import { IssueHeader } from "@/components/IssueHeader";
import { IssueBody } from "@/components/IssueBody";
import { SubscribeForm } from "@/components/SubscribeForm";
import { TagList } from "@/components/TagChip";
import { tagsForIssue } from "@/lib/tags";

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default function Home() {
  const latest = getLatestIssue();
  const recent = getAllIssues().slice(1, 6);

  if (!latest) {
    return (
      <div className="py-16">
        <SubscribeForm />
        <p className="mt-12 text-muted">No issues published yet. The first one ships next Monday.</p>
      </div>
    );
  }

  return (
    <>
      <SubscribeForm />
      <div className="mt-16">
        <IssueHeader issue={latest} />
        {latest.content.trim() ? (
          <div className="mb-2 border-l border-rule pl-5 font-serif text-[18px] italic leading-[1.65] text-muted">
            {latest.content.trim().split(/\n\n+/).map((p, i) => (
              <p key={i} className="mb-4 last:mb-0">
                {p}
              </p>
            ))}
          </div>
        ) : null}
        <IssueBody issue={latest} />
        <div className="mt-16">
          <TagList tags={tagsForIssue(latest)} />
        </div>
      </div>

      {recent.length ? (
        <section className="mt-20">
          <div className="hairline pt-5">
            <h2 className="smallcaps mb-6 text-ink">Recent issues</h2>
          </div>
          <ul className="space-y-6">
            {recent.map((issue) => (
              <li key={issue.slug} className="border-l border-rule pl-5">
                <p className="smallcaps mb-1">
                  Issue {issue.issueNumber} · {formatDate(issue.publishDate)}
                </p>
                <h3 className="font-serif text-[20px] font-semibold leading-[1.3] tracking-tight">
                  <Link href={`/issues/${issue.slug}`}>{issue.title}</Link>
                </h3>
                <p className="mt-2 text-[16px] leading-[1.6] text-muted">{issue.summary}</p>
              </li>
            ))}
          </ul>
          <p className="mt-8">
            <Link href="/archive" className="smallcaps !border-b-0">
              See full archive →
            </Link>
          </p>
        </section>
      ) : null}
    </>
  );
}
