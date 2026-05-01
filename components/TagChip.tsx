import Link from "next/link";

export function TagChip({ tag }: { tag: string }) {
  return (
    <Link
      href={`/tags/${encodeURIComponent(tag)}`}
      className="smallcaps !border-b-0 mr-3 inline-block hover:text-accent"
    >
      #{tag}
    </Link>
  );
}

export function TagList({ tags }: { tags: string[] }) {
  if (!tags.length) return null;
  return (
    <div className="-mr-3 mt-2 flex flex-wrap">
      {tags.map((t) => (
        <TagChip key={t} tag={t} />
      ))}
    </div>
  );
}
