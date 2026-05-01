import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

const ItemSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  source: z.string(),
  summary: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

const SectionKey = z.enum(["tldr", "builders", "deepDive", "everythingElse"]);
export type SectionKey = z.infer<typeof SectionKey>;

const DeepDiveSchema = z
  .object({
    title: z.string(),
    standfirst: z.string().default(""),
    body: z.union([z.array(z.string()), z.string()]).transform((v) =>
      Array.isArray(v) ? v : [v]
    ),
    pullQuote: z.string().default(""),
    sourceUrl: z.string().url().optional(),
    tags: z.array(z.string()).default([]),
  })
  .nullable()
  .optional();

const FrontmatterSchema = z.object({
  title: z.string(),
  slug: z.string(),
  issueNumber: z.number().int().positive(),
  publishDate: z.string(),
  status: z.enum(["draft", "published"]).default("draft"),
  summary: z.string(),
  tags: z.array(z.string()).default([]),
  readingTimeMinutes: z.number().int().positive().optional(),
  sections: z.object({
    tldr: z.array(z.string()).default([]),
    builders: z.array(ItemSchema).default([]),
    deepDive: DeepDiveSchema,
    everythingElse: z.array(ItemSchema).default([]),
  }),
});

export type Frontmatter = z.infer<typeof FrontmatterSchema>;
export type Item = z.infer<typeof ItemSchema>;

export type Issue = Frontmatter & {
  content: string;
  filepath: string;
};

const ROOT = process.cwd();
const ISSUES_DIR = path.join(ROOT, "content", "issues");
const DRAFTS_DIR = path.join(ROOT, "content", "drafts");

function readDir(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => path.join(dir, f));
}

function loadFile(filepath: string): Issue {
  const raw = fs.readFileSync(filepath, "utf8");
  const { data, content } = matter(raw);
  const parsed = FrontmatterSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(
      `Invalid frontmatter in ${filepath}:\n${parsed.error.toString()}`
    );
  }
  return { ...parsed.data, content, filepath };
}

export function getAllIssues(): Issue[] {
  const issues = readDir(ISSUES_DIR)
    .map(loadFile)
    .filter((i) => i.status === "published");
  return issues.sort((a, b) =>
    a.publishDate < b.publishDate ? 1 : a.publishDate > b.publishDate ? -1 : 0
  );
}

export function getAllDrafts(): Issue[] {
  return readDir(DRAFTS_DIR).map(loadFile);
}

export function getIssueBySlug(slug: string): Issue | null {
  const all = [...getAllIssues(), ...getAllDrafts()];
  return all.find((i) => i.slug === slug) ?? null;
}

export function getLatestIssue(): Issue | null {
  return getAllIssues()[0] ?? null;
}
