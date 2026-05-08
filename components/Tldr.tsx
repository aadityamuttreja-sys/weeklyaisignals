export function TldrList({ items }: { items: string[] }) {
  return (
    <ol className="m-0 list-none border border-rule-soft p-0">
      {items.map((it, i) => (
        <li
          key={i}
          className="group grid grid-cols-[56px_1fr] items-center gap-4 border-b border-rule px-5 py-5 transition-colors last:border-b-0 hover:bg-accent/[0.04] md:grid-cols-[80px_1fr_auto] md:gap-6 md:px-6"
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-accent">
            // {String(i + 1).padStart(2, "0")}
          </span>
          <span className="font-serif text-[1.05rem] leading-[1.55] text-ink-strong md:text-[1.12rem]">
            {it}
          </span>
          <span className="hidden text-lg text-ink-faint transition-colors group-hover:text-accent md:block md:justify-self-end">
            →
          </span>
        </li>
      ))}
    </ol>
  );
}
