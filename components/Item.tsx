import type { Item as ItemType } from "@/lib/mdx";
import { TagList } from "./TagChip";

export function Item({ item }: { item: ItemType }) {
  return (
    <article className="mb-8 border-l border-rule pl-5">
      <h3 className="font-serif text-[21px] font-semibold leading-[1.3] tracking-tight">
        <a href={item.url} target="_blank" rel="noreferrer">
          {item.title}
        </a>
      </h3>
      <p className="smallcaps mt-1">{item.source}</p>
      {item.summary ? (
        <p className="mt-3 text-[18px] leading-[1.65] text-ink">{item.summary}</p>
      ) : null}
      <TagList tags={item.tags} />
    </article>
  );
}

export function CompactItem({ item }: { item: ItemType }) {
  return (
    <article className="mb-5 border-l border-rule pl-5">
      <h3 className="font-serif text-[18px] font-semibold leading-[1.35]">
        <a href={item.url} target="_blank" rel="noreferrer">
          {item.title}
        </a>
        <span className="smallcaps ml-3 align-middle">{item.source}</span>
      </h3>
      {item.summary ? (
        <p className="mt-1 text-[16px] leading-[1.6] text-muted">{item.summary}</p>
      ) : null}
      <TagList tags={item.tags} />
    </article>
  );
}
