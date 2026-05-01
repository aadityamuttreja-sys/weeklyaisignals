import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllTags, getIssuesByTag } from "@/lib/tags";
import { Footer } from "@/components/Footer";
import { fmtDateShort } from "@/lib/date";

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
    title: `#${decodeURIComponent(tag)}`,
    description: `Every issue of Weekly AI Signals tagged #${decodeURIComponent(tag)}.`,
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
    <main className="mx-auto max-w-[1180px] px-6">
      <header className="pt-24 pb-12">
        <div className="smallcaps">Tag</div>
        <h1 className="mt-3 font-serif text-[clamp(2.4rem,7vw,5rem)] font-medium leading-[1.05] tracking-tight text-accent">
          #{decoded}
        </h1>
        <p className="mt-6 max-w-[38rem] font-serif text-[1.18rem] leading-[1.5] text-ink-muted">
          {issues.length} {issues.length === 1 ? "issue" : "issues"} filed under{" "}
          <span className="font-mono text-[0.92em] text-accent">#{decoded}</span>.
        </p>
        <div className="mt-12 h-px bg-rule" />
      </header>

      <ol className="m-0 list-none p-0 pb-24">
        {issues.map((iss) => (
          <li key={iss.slug} className="border-b border-rule-soft last:border-b-0">
            <Link
              href={`/issues/${iss.slug}`}
              className="grid grid-cols-[64px_100px_1fr] items-baseline gap-4 py-6 transition-colors hover:bg-accent/5"
            >
              <span className="font-mono text-[0.74rem] tabular-nums tracking-[0.04em] text-ink-faint">
                №{String(iss.issueNumber).padStart(2, "0")}
              </span>
              <span className="font-mono text-[0.74rem] tabular-nums tracking-[0.04em] text-ink-muted">
                {fmtDateShort(iss.publishDate).toUpperCase()}
              </span>
              <div>
                <div className="font-serif text-[1.18rem] font-medium text-ink-strong">
                  {iss.title}
                </div>
                <p className="mt-1 max-w-[38rem] font-serif text-[1rem] leading-[1.55] text-ink-muted">
                  {iss.summary}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ol>

      <p className="pb-12">
        <Link
          href="/archive"
          className="font-mono text-[0.78rem] tracking-[0.08em] text-ink-muted hover:text-accent"
        >
          ← BACK TO ARCHIVE
        </Link>
      </p>

      <Footer />
    </main>
  );
}
