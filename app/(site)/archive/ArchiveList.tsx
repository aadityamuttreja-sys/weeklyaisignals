"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { TagChip } from "@/components/TagChip";
import { fmtDateShort, yearOf } from "@/lib/date";

export interface ArchiveEntry {
  slug: string;
  issueNumber: number;
  publishDate: string;
  title: string;
  summary: string;
  readingTimeMinutes: number;
  tags: string[];
}

export function ArchiveList({
  archive,
  allTags,
}: {
  archive: ArchiveEntry[];
  allTags: string[];
}) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Set<string>>(new Set());

  const filtered = useMemo(
    () =>
      archive.filter((iss) => {
        const q = query.trim().toLowerCase();
        const qok =
          !q ||
          iss.title.toLowerCase().includes(q) ||
          iss.summary.toLowerCase().includes(q) ||
          String(iss.issueNumber) === q;
        const tok =
          active.size === 0 || iss.tags.some((t) => active.has(t));
        return qok && tok;
      }),
    [archive, query, active]
  );

  const grouped = useMemo(() => {
    const m = new Map<number, ArchiveEntry[]>();
    filtered.forEach((iss) => {
      const y = yearOf(iss.publishDate);
      if (!m.has(y)) m.set(y, []);
      m.get(y)!.push(iss);
    });
    return [...m.entries()].sort((a, b) => b[0] - a[0]);
  }, [filtered]);

  const toggle = (t: string) =>
    setActive((cur) => {
      const next = new Set(cur);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });

  return (
    <>
      <div className="grid grid-cols-1 gap-6 border-t border-rule py-6 md:grid-cols-[1fr_2fr] md:gap-12">
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[0.74rem] tracking-[0.06em] text-ink-faint">
            SEARCH
          </span>
          <input
            className="field"
            type="search"
            placeholder="title, summary, or № issue"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[0.74rem] tracking-[0.06em] text-ink-faint">
            FILTER
          </span>
          <div className="flex flex-wrap gap-2">
            {allTags.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => toggle(t)}
                className={`tag-btn ${active.has(t) ? "is-on" : ""}`}
              >
                #{t}
              </button>
            ))}
            {active.size > 0 && (
              <button
                className="tag-btn is-clear"
                onClick={() => setActive(new Set())}
              >
                clear
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="h-px bg-rule" />

      <div className="py-6 pb-24">
        {grouped.map(([year, issues]) => (
          <section
            key={year}
            className="grid grid-cols-1 gap-3 border-t border-rule py-8 md:grid-cols-[200px_1fr] md:gap-12"
          >
            <div>
              <div className="sticky top-6">
                <div className="font-serif text-[clamp(2rem,5vw,4rem)] font-medium leading-none tracking-tight tabular-nums text-ink-strong">
                  {year}
                </div>
                <div className="mt-2 font-mono text-[0.74rem] tracking-[0.08em] text-ink-faint">
                  {issues.length} {issues.length === 1 ? "ISSUE" : "ISSUES"}
                </div>
              </div>
            </div>
            <ol className="m-0 list-none p-0">
              {issues.map((iss) => (
                <li
                  key={iss.slug}
                  className="border-t border-rule-soft first:border-t-0"
                >
                  <Link
                    href={`/issues/${iss.slug}`}
                    className="grid grid-cols-[64px_100px_1fr_auto] items-baseline gap-4 py-4 transition-colors hover:bg-accent/5"
                  >
                    <span className="font-mono text-[0.74rem] tabular-nums tracking-[0.04em] text-ink-faint">
                      №{String(iss.issueNumber).padStart(2, "0")}
                    </span>
                    <span className="font-mono text-[0.74rem] tabular-nums tracking-[0.04em] text-ink-muted">
                      {fmtDateShort(iss.publishDate).toUpperCase()}
                    </span>
                    <span className="font-serif text-[1.18rem] font-medium text-ink-strong">
                      {iss.title}
                    </span>
                    <span className="flex gap-3">
                      {iss.tags.slice(0, 3).map((t) => (
                        <TagChip key={t} tag={t} />
                      ))}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        ))}
        {filtered.length === 0 && (
          <p className="font-serif text-[1.05rem] text-ink-muted">
            No issues match those filters.{" "}
            <button
              className="text-accent underline"
              onClick={() => {
                setQuery("");
                setActive(new Set());
              }}
            >
              Reset.
            </button>
          </p>
        )}
      </div>
    </>
  );
}
