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
      <div className="mb-8 border-t border-rule pt-8 first:border-t-0 first:pt-0">
        <div className="mb-2 font-mono text-[11px] font-normal uppercase tracking-[0.1em] text-accent">
          // {kicker} ·
        </div>
        <h2 className="font-serif text-[clamp(1.75rem,4vw,2.75rem)] font-normal leading-[1.05] tracking-[-0.015em] text-ink-strong">
          {label}
        </h2>
      </div>
      <div>{children}</div>
    </section>
  );
}
