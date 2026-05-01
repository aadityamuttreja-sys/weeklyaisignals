import fs from "node:fs";
import path from "node:path";
import { fetchAllSources } from "./sources";
import { dedupBatch } from "./dedup";
import { filterUnseen, markSeen } from "./dedup-kv";
import { rank } from "./rank";
import { summarizeAll } from "./summarize";
import { synthesizeDeepDive } from "./deepdive";
import { assembleDraft, writeDraft } from "./assemble";
import type { SummarizedItem } from "./types";

const DRY = process.argv.includes("--dry");

async function main() {
  console.log(`[pipeline] starting${DRY ? " (dry run, no LLM calls)" : ""}`);

  console.log("[pipeline] fetching all sources…");
  const raw = await fetchAllSources();
  console.log(`  total: ${raw.length} items`);

  const deduped = dedupBatch(raw);
  console.log(`  ${deduped.length} after in-batch dedup`);

  const fresh = await filterUnseen(deduped);

  const ranked = rank(fresh, 25);
  console.log(`  ${ranked.length} after rank`);

  let summarized: SummarizedItem[];
  if (DRY) {
    summarized = ranked.map((i, idx) => ({
      ...i,
      summary: `(dry run) ${i.title}`,
      tags: ["models"],
      bucket:
        idx < 3 ? "tldr" : idx < 9 ? "builders" : idx === 9 ? "deepDive" : "everythingElse",
      bucketScore: 0.7,
    }));
  } else {
    console.log("[pipeline] summarizing with Claude Sonnet…");
    summarized = await summarizeAll(ranked);
  }

  let deepDive = null;
  if (!DRY && summarized.length) {
    console.log("[pipeline] synthesizing deep dive with Claude Opus…");
    try {
      deepDive = await synthesizeDeepDive(summarized);
      if (deepDive) {
        console.log(`  deep dive: ${deepDive.title}`);
      }
    } catch (err) {
      console.warn("[pipeline] deep-dive synthesis failed:", err);
    }
  }

  const issueNumber = computeNextIssueNumber();
  const draft = assembleDraft({
    items: summarized,
    issueNumber,
    deepDive: deepDive ?? undefined,
  });
  const filepath = writeDraft(draft);

  if (!DRY) {
    await markSeen(ranked);
  }

  console.log(`\n[pipeline] draft written → ${filepath}`);
  console.log(`[pipeline] open the dev server and visit /issues/${draft.slug} to preview.`);
}

function computeNextIssueNumber(): number {
  const dirs = ["content/issues", "content/drafts"];
  let max = 0;
  for (const d of dirs) {
    const full = path.join(process.cwd(), d);
    if (!fs.existsSync(full)) continue;
    for (const f of fs.readdirSync(full)) {
      if (!f.endsWith(".mdx")) continue;
      const txt = fs.readFileSync(path.join(full, f), "utf8");
      const m = txt.match(/issueNumber:\s*(\d+)/);
      if (m) max = Math.max(max, parseInt(m[1], 10));
    }
  }
  return max + 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
