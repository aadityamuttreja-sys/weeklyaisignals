import { TagChip } from "./TagChip";
import type { Item as ItemType } from "@/lib/mdx";

export function Item({ item, index }: { item: ItemType; index: number }) {
  return (
    <article className="grid grid-cols-[36px_1fr] gap-4">
      <div className="pt-[0.55em] font-mono text-[0.74rem] tracking-[0.06em] text-ink-faint">
        {String(index).padStart(2, "0")}
      </div>
      <div>
        <div className="mb-2 font-mono text-[0.74rem] tracking-[0.06em] text-ink-muted">
          {item.source.toUpperCase()}
        </div>
        <h3 className="font-serif text-[1.5rem] font-normal leading-tight text-ink-strong">
          <a href={item.url} target="_blank" rel="noreferrer" className="link-rule">
            {item.title}
          </a>
        </h3>
        {item.summary ? (
          <p className="mt-3 max-w-measure-wide font-serif text-[1.125rem] leading-[1.55] text-ink md:text-[1.22rem]">
            {item.summary}
          </p>
        ) : null}
        {item.tags.length ? (
          <div className="mt-3 flex flex-wrap gap-3">
            {item.tags.map((t) => (
              <TagChip key={t} tag={t} />
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}

export function CompactItem({ item }: { item: ItemType }) {
  return (
    <article className="grid grid-cols-[110px_1fr] gap-4 border-b border-rule py-4 font-mono text-[0.92rem] last:border-b-0">
      <div className="pt-[0.45em] text-[0.74rem] tracking-[0.06em] text-ink-muted">
        {item.source.toUpperCase()}
      </div>
      <div>
        <a
          href={item.url}
          target="_blank"
          rel="noreferrer"
          className="link-rule font-medium text-ink-strong"
        >
          {item.title}
        </a>
        {item.summary ? (
          <span className="text-ink-muted"> — {item.summary}</span>
        ) : null}
        {item.tags.length ? (
          <span className="ml-1 inline-flex flex-wrap gap-2">
            {item.tags.map((t) => (
              <TagChip key={t} tag={t} />
            ))}
          </span>
        ) : null}
      </div>
    </article>
  );
}
