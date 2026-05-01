import RSS from "rss";
import { getAllIssues } from "@/lib/mdx";
import { site } from "@/lib/site";

export const revalidate = 3600;

export async function GET() {
  const feed = new RSS({
    title: site.name,
    description: site.description,
    site_url: site.url,
    feed_url: `${site.url}/rss.xml`,
    language: "en",
    pubDate: new Date(),
    ttl: 60,
  });

  for (const issue of getAllIssues()) {
    const url = `${site.url}/issues/${issue.slug}`;
    const desc = renderItemDescription(issue);
    feed.item({
      title: issue.title,
      url,
      guid: url,
      date: new Date(issue.publishDate + "T00:00:00Z"),
      description: desc,
      categories: issue.tags,
    });
  }

  return new Response(feed.xml({ indent: true }), {
    headers: { "content-type": "application/rss+xml; charset=utf-8" },
  });
}

function renderItemDescription(issue: ReturnType<typeof getAllIssues>[number]) {
  const lines: string[] = [`<p>${escape(issue.summary)}</p>`];
  if (issue.sections.tldr.length) {
    lines.push("<h3>The 60-second read</h3><ul>");
    for (const b of issue.sections.tldr) lines.push(`<li>${escape(b)}</li>`);
    lines.push("</ul>");
  }
  if (issue.sections.builders.length) {
    lines.push("<h3>For builders</h3><ul>");
    for (const i of issue.sections.builders) {
      lines.push(
        `<li><a href="${escape(i.url)}">${escape(i.title)}</a> — ${escape(i.source)}</li>`
      );
    }
    lines.push("</ul>");
  }
  if (issue.sections.deepDive) {
    lines.push(`<h3>Deep dive: ${escape(issue.sections.deepDive.title)}</h3>`);
  }
  return lines.join("");
}

function escape(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
