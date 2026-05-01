import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllIssues, getIssueBySlug } from "@/lib/mdx";
import { IssueHeader } from "@/components/IssueHeader";
import { IssueBody } from "@/components/IssueBody";
import { TagList } from "@/components/TagChip";
import { SubscribeForm } from "@/components/SubscribeForm";
import { tagsForIssue } from "@/lib/tags";

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

  return (
    <article>
      <IssueHeader issue={issue} />
      {issue.content.trim() ? (
        <div className="mb-2 border-l border-rule pl-5 font-serif text-[18px] italic leading-[1.65] text-muted">
          {issue.content.trim().split(/\n\n+/).map((p, i) => (
            <p key={i} className="mb-4 last:mb-0">
              {p}
            </p>
          ))}
        </div>
      ) : null}

      <IssueBody issue={issue} />

      <div className="mt-16">
        <TagList tags={tagsForIssue(issue)} />
      </div>

      <div className="mt-16">
        <SubscribeForm compact />
      </div>
    </article>
  );
}
