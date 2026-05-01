import type { Issue } from "./mdx";
import { getAllIssues } from "./mdx";

export type TagIndex = Record<string, Issue[]>;

export function buildTagIndex(issues = getAllIssues()): TagIndex {
  const index: TagIndex = {};
  for (const issue of issues) {
    const allTags = new Set<string>();
    for (const t of issue.tags) allTags.add(t);
    for (const item of issue.sections.builders) for (const t of item.tags) allTags.add(t);
    for (const item of issue.sections.everythingElse) for (const t of item.tags) allTags.add(t);
    if (issue.sections.deepDive) for (const t of issue.sections.deepDive.tags) allTags.add(t);
    for (const tag of allTags) {
      if (!index[tag]) index[tag] = [];
      index[tag].push(issue);
    }
  }
  return index;
}

export function getAllTags(): string[] {
  return Object.keys(buildTagIndex()).sort();
}

export function getIssuesByTag(tag: string): Issue[] {
  return buildTagIndex()[tag] ?? [];
}

export function tagsForIssue(issue: Issue): string[] {
  const set = new Set<string>(issue.tags);
  for (const item of issue.sections.builders) for (const t of item.tags) set.add(t);
  for (const item of issue.sections.everythingElse) for (const t of item.tags) set.add(t);
  if (issue.sections.deepDive) for (const t of issue.sections.deepDive.tags) set.add(t);
  return [...set].sort();
}
