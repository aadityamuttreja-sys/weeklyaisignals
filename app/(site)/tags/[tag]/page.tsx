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
    <main className="tx-main pb-24">
      <header className="border-b border-dashed border-rule-soft pb-12 pt-16 md:pt-20">
        <div className="smallcaps">Tag</div>
        <h1 className="mt-3 font-serif text-[clamp(2.4rem,7vw,4.5rem)] font-normal leading-[1.05] tracking-tight text-accent">
          #{decoded}
        </h1>
        <p className="mt-6 max-w-measure-wide font-mono text-[15px] leading-[1.55] text-ink-muted md:text-[16px]">
          {issues.length} {issues.length === 1 ? "issue" : "issues"} filed under{" "}
          <span className="font-mono text-[0.92em] text-accent">#{decoded}</span>.
        </p>
      </header>

      <ol className="m-0 list-none p-0 pb-24">
        {issues.map((iss) => (
          <li key={iss.slug} className="border-b border-rule last:border-b-0">
            <Link
              href={`/issues/${iss.slug}`}
              className="grid grid-cols-[64px_100px_1fr] items-baseline gap-4 py-6 transition-colors hover:bg-accent/[0.04]"
            >
              <span className="font-mono text-[0.74rem] tabular-nums tracking-[0.04em] text-ink-faint">
                //{String(iss.issueNumber).padStart(2, "0")}
              </span>
              <span className="font-mono text-[0.74rem] tabular-nums tracking-[0.04em] text-ink-muted">
                {fmtDateShort(iss.publishDate).toUpperCase()}
              </span>
              <div>
                <div className="font-serif text-[1.18rem] font-normal text-ink-strong">
                  {iss.title}
                </div>
                <p className="mt-1 max-w-measure-wide font-serif text-[1rem] leading-[1.55] text-ink-muted">
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
          className="font-mono text-[0.78rem] uppercase tracking-[0.08em] text-ink-muted hover:text-accent"
        >
          ← BACK TO ARCHIVE
        </Link>
      </p>

      <Footer />
    </main>
  );
}
