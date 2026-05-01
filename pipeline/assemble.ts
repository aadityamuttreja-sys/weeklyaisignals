import fs from "node:fs";
import path from "node:path";
import type { SummarizedItem } from "./types";

type Buckets = {
  tldr: SummarizedItem[];
  builders: SummarizedItem[];
  deepDive: SummarizedItem[];
  everythingElse: SummarizedItem[];
};

const LIMITS = { tldr: 5, builders: 6, deepDive: 1, everythingElse: 8 };

function bucketize(items: SummarizedItem[]): Buckets {
  const buckets: Buckets = { tldr: [], builders: [], deepDive: [], everythingElse: [] };
  const sorted = [...items].sort((a, b) => b.bucketScore - a.bucketScore);
  for (const item of sorted) {
    const arr = buckets[item.bucket];
    if (arr.length < LIMITS[item.bucket]) {
      arr.push(item);
    } else {
      buckets.everythingElse.push(item);
    }
  }
  buckets.everythingElse = buckets.everythingElse.slice(0, LIMITS.everythingElse);
  return buckets;
}

function escapeYaml(s: string): string {
  return s.replace(/"/g, '\\"').replace(/\n/g, " ").replace(/\s+/g, " ").trim();
}

function renderItemList(items: SummarizedItem[]): string {
  return items
    .map(
      (i) =>
        `    - title: "${escapeYaml(i.title)}"\n` +
        `      url: "${i.url}"\n` +
        `      source: "${escapeYaml(i.source)}"\n` +
        `      summary: "${escapeYaml(i.summary)}"\n` +
        `      tags: [${i.tags.map((t) => JSON.stringify(t)).join(", ")}]`
    )
    .join("\n");
}

function nextMonday(d = new Date()): Date {
  const out = new Date(d);
  const day = out.getUTCDay();
  const offset = (8 - day) % 7 || 7;
  out.setUTCDate(out.getUTCDate() + offset);
  return out;
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function assembleDraft(opts: {
  items: SummarizedItem[];
  issueNumber: number;
  publishDate?: string;
}): { mdx: string; slug: string; filename: string } {
  const buckets = bucketize(opts.items);
  const publishDate = opts.publishDate ?? isoDate(nextMonday());
  const slug = publishDate;

  const allTags = new Set<string>();
  for (const item of [
    ...buckets.tldr,
    ...buckets.builders,
    ...buckets.deepDive,
    ...buckets.everythingElse,
  ]) {
    for (const t of item.tags) allTags.add(t);
  }
  const issueTags = [...allTags].slice(0, 8);

  const tldrLines = buckets.tldr.map((i) => `    - "${escapeYaml(i.summary)}"`).join("\n");

  const deep = buckets.deepDive[0];
  const deepDiveBlock = deep
    ? [
        `  deepDive:`,
        `    title: "${escapeYaml(deep.title)}"`,
        `    body: "${escapeYaml(deep.summary)}"`,
        `    sourceUrl: "${deep.url}"`,
        `    tags: [${deep.tags.map((t) => JSON.stringify(t)).join(", ")}]`,
      ].join("\n")
    : "  deepDive: null";

  const headline = buckets.tldr[0]?.title ?? buckets.builders[0]?.title ?? "Weekly signals";
  const summaryLine =
    buckets.tldr[0]?.summary ??
    buckets.builders[0]?.summary ??
    "This week's most important shifts in AI, distilled.";

  const mdx = `---
title: "Issue ${opts.issueNumber} — ${escapeYaml(headline.slice(0, 80))}"
slug: "${slug}"
issueNumber: ${opts.issueNumber}
publishDate: "${publishDate}"
status: draft
summary: "${escapeYaml(summaryLine)}"
readingTimeMinutes: 6
tags: [${issueTags.map((t) => JSON.stringify(t)).join(", ")}]
sections:
  tldr:
${tldrLines || '    []'}
  builders:
${renderItemList(buckets.builders) || '    []'}
${deepDiveBlock}
  everythingElse:
${renderItemList(buckets.everythingElse) || '    []'}
---

This issue was assembled by the curation pipeline and is awaiting review. Edit this introduction before publishing.
`;

  const filename = `${slug}.mdx`;
  return { mdx, slug, filename };
}

export function writeDraft(out: { mdx: string; filename: string }): string {
  const dir = path.join(process.cwd(), "content", "drafts");
  fs.mkdirSync(dir, { recursive: true });
  const filepath = path.join(dir, out.filename);
  fs.writeFileSync(filepath, out.mdx, "utf8");
  return filepath;
}
