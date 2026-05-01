import Link from "next/link";

export interface TagChipProps {
  tag: string;
  active?: boolean;
  className?: string;
}

export function TagChip({ tag, active = false, className = "" }: TagChipProps) {
  return (
    <Link
      href={`/tags/${tag}`}
      className={[
        "font-mono text-[0.72rem] text-ink-muted hover:text-accent transition-colors",
        active && "text-accent",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      #{tag}
    </Link>
  );
}

export function TagList({ tags }: { tags: string[] }) {
  if (!tags.length) return null;
  return (
    <div className="flex flex-wrap gap-3">
      {tags.map((t) => (
        <TagChip key={t} tag={t} />
      ))}
    </div>
  );
}
