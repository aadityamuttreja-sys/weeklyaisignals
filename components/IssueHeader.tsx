import { fmtDate } from "@/lib/date";

export interface IssueHeaderProps {
  issueNumber: number;
  publishDate: string;
  readingTimeMinutes: number;
  title: string;
  summary: string;
}

export function IssueHeader({
  issueNumber,
  publishDate,
  readingTimeMinutes,
  title,
  summary,
}: IssueHeaderProps) {
  return (
    <header className="pt-24 pb-8">
      <div className="mb-8 flex items-start justify-between">
        <div className="flex items-baseline gap-[0.05em] font-serif text-ink-strong leading-[0.85]">
          <span className="mr-[0.08em] italic font-normal text-ink-faint text-[clamp(3rem,7vw,6rem)]">
            №
          </span>
          <span className="font-medium tabular-nums tracking-[-0.04em] text-[clamp(5rem,14vw,11rem)]">
            {String(issueNumber).padStart(2, "0")}
          </span>
        </div>
        <div className="flex flex-col gap-1 pt-3 text-right font-mono text-[0.74rem] tracking-[0.05em]">
          <div className="text-ink-muted">{fmtDate(publishDate).toUpperCase()}</div>
          <div className="text-ink-faint">{readingTimeMinutes} MIN READ</div>
        </div>
      </div>
      <h1 className="mt-3 max-w-[20ch] font-serif font-medium leading-[1.05] tracking-tight text-ink-strong text-[clamp(2.4rem,4.6vw,3.6rem)]">
        {title}
      </h1>
      <p className="mt-6 max-w-[38rem] font-serif text-[1.18rem] leading-[1.5] text-ink-muted">
        {summary}
      </p>
      <div className="mt-12 h-px bg-rule" />
    </header>
  );
}
