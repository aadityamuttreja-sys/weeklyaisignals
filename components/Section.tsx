import { ReactNode } from "react";

export interface SectionProps {
  kicker: string;
  label: string;
  id?: string;
  children: ReactNode;
}

export function Section({ kicker, label, id, children }: SectionProps) {
  return (
    <section id={id} className="py-12 first:pt-3">
      <div className="mb-6 grid grid-cols-[auto_auto_1fr] items-baseline gap-4">
        <span className="font-mono text-[0.74rem] tracking-[0.16em] text-ink-faint">
          {kicker}
        </span>
        <span className="font-serif text-[1.18rem] italic text-ink-strong">
          {label}
        </span>
        <span className="h-px self-center bg-ink-strong" />
      </div>
      <div>{children}</div>
    </section>
  );
}
