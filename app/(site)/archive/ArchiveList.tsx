"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type ArchiveIssue = {
  slug: string;
  title: string;
  summary: string;
  publishDate: string;
  issueNumber: number;
  tags: string[];
};

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function ArchiveList({
  issues,
  allTags,
}: {
  issues: ArchiveIssue[];
  allTags: string[];
}) {
  const [active, setActive] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return issues.filter((i) => {
      if (active.size > 0 && !i.tags.some((t) => active.has(t))) return false;
      if (q && !`${i.title} ${i.summary}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [issues, active, query]);

  function toggle(tag: string) {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  }

  return (
    <div>
      <div className="border-y border-rule py-5">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search issues…"
          className="w-full border border-rule bg-paper px-4 py-3 font-sans text-[15px] text-ink placeholder:text-muted focus:border-ink focus:outline-none"
        />
        {allTags.length ? (
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
            {allTags.map((t) => {
              const on = active.has(t);
              return (
                <button
                  key={t}
                  onClick={() => toggle(t)}
                  className={`smallcaps !border-b-0 transition-colors ${
                    on ? "text-accent" : "text-muted hover:text-ink"
                  }`}
                >
                  #{t}
                </button>
              );
            })}
            {active.size > 0 ? (
              <button
                onClick={() => setActive(new Set())}
                className="smallcaps !border-b-0 text-muted hover:text-ink"
              >
                clear
              </button>
            ) : null}
          </div>
        ) : null}
      </div>

      <ul className="mt-2">
        {filtered.length === 0 ? (
          <li className="py-10 text-muted">No issues match those filters.</li>
        ) : (
          filtered.map((issue) => (
            <li key={issue.slug} className="border-b border-rule py-7">
              <p className="smallcaps mb-2">
                Issue {issue.issueNumber} · {formatDate(issue.publishDate)}
              </p>
              <h2 className="font-serif text-[22px] font-semibold leading-[1.3] tracking-tight">
                <Link href={`/issues/${issue.slug}`}>{issue.title}</Link>
              </h2>
              <p className="mt-2 text-[17px] leading-[1.6] text-muted">{issue.summary}</p>
              {issue.tags.length ? (
                <p className="mt-3">
                  {issue.tags.map((t) => (
                    <span
                      key={t}
                      className="smallcaps mr-3 inline-block text-muted"
                    >
                      #{t}
                    </span>
                  ))}
                </p>
              ) : null}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
