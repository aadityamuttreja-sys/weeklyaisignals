export function Tldr({ bullets }: { bullets: string[] }) {
  if (!bullets.length) return null;
  return (
    <ul className="space-y-4">
      {bullets.map((b, i) => (
        <li
          key={i}
          className="border-l border-rule pl-5 text-[18px] leading-[1.65] text-ink"
        >
          {b}
        </li>
      ))}
    </ul>
  );
}
