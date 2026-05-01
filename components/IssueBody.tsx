import type { Issue } from "@/lib/mdx";
import { Section } from "./Section";
import { Tldr } from "./Tldr";
import { Item } from "./Item";
import { CompactItem } from "./Item";
import { DeepDive } from "./DeepDive";

export function IssueBody({ issue }: { issue: Issue }) {
  const { sections } = issue;
  return (
    <>
      {sections.tldr.length ? (
        <Section label="The 60-second read">
          <Tldr bullets={sections.tldr} />
        </Section>
      ) : null}

      {sections.builders.length ? (
        <Section label="For builders">
          {sections.builders.map((item, i) => (
            <Item key={i} item={item} />
          ))}
        </Section>
      ) : null}

      {sections.deepDive ? (
        <Section label="Deep dive">
          <DeepDive
            title={sections.deepDive.title}
            body={sections.deepDive.body}
            sourceUrl={sections.deepDive.sourceUrl}
            tags={sections.deepDive.tags}
          />
        </Section>
      ) : null}

      {sections.everythingElse.length ? (
        <Section label="Everything else">
          {sections.everythingElse.map((item, i) => (
            <CompactItem key={i} item={item} />
          ))}
        </Section>
      ) : null}
    </>
  );
}
