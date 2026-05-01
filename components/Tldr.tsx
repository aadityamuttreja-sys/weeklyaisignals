export function TldrList({ items }: { items: string[] }) {
  return (
    <ol className="m-0 list-none p-0">
      {items.map((it, i) => (
        <li
          key={i}
          className="grid grid-cols-[36px_1fr] gap-4 border-b border-rule-soft py-4 last:border-b-0"
        >
          <span className="pt-[0.4em] self-start font-mono text-[0.74rem] tracking-[0.06em] text-ink-faint">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="font-serif text-[1.05rem] leading-[1.62] text-ink-strong">
            {it}
          </span>
        </li>
      ))}
    </ol>
  );
}
