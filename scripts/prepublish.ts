import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const DRAFTS = path.join(process.cwd(), "content", "drafts");
const ISSUES = path.join(process.cwd(), "content", "issues");

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function listDrafts(): string[] {
  if (!fs.existsSync(DRAFTS)) return [];
  return fs
    .readdirSync(DRAFTS)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => path.join(DRAFTS, f));
}

function publishOne(draftPath: string): { from: string; to: string } {
  const raw = fs.readFileSync(draftPath, "utf8");
  const { data, content } = matter(raw);

  data.status = "published";
  if (!data.publishDate) data.publishDate = todayIso();

  const slug =
    typeof data.slug === "string" && data.slug
      ? data.slug
      : path.basename(draftPath, ".mdx");

  fs.mkdirSync(ISSUES, { recursive: true });
  const target = path.join(ISSUES, `${slug}.mdx`);
  if (fs.existsSync(target)) {
    throw new Error(`Refusing to overwrite published issue: ${target}`);
  }

  const out = matter.stringify(content, data);
  fs.writeFileSync(target, out, "utf8");
  fs.unlinkSync(draftPath);

  return { from: draftPath, to: target };
}

function main() {
  const drafts = listDrafts();
  if (!drafts.length) {
    console.log("[prepublish] no drafts to promote");
    return;
  }
  for (const d of drafts) {
    try {
      const moved = publishOne(d);
      console.log(`[prepublish] ${path.basename(moved.from)} → ${path.relative(process.cwd(), moved.to)}`);
    } catch (err) {
      console.error(`[prepublish] failed on ${d}:`, err);
      process.exit(1);
    }
  }
}

main();
