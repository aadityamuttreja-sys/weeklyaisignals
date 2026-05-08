import { fmtDate, fmtDateTransmission } from "@/lib/date";
import { IssueTerminal } from "@/components/IssueTerminal";

export interface IssueHeaderProps {
  issueNumber: number;
  publishDate: string;
  readingTimeMinutes: number;
  title: string;
  summary: string;
  slug: string;
  showTerminal?: boolean;
}

export function IssueHeader({
  issueNumber,
  publishDate,
  readingTimeMinutes,
  title,
  summary,
  slug,
  showTerminal = true,
}: IssueHeaderProps) {
  const tx = String(issueNumber).padStart(3, "0");

  return (
    <header className="relative border-b border-dashed border-rule-soft pb-12 pt-16 md:pt-20">
      <dl className="mb-12 grid grid-cols-2 gap-6 border-b border-rule pb-6 text-[11px] uppercase tracking-[0.08em] text-ink-faint md:grid-cols-4 md:gap-8">
        <div>
          <dt className="mb-1 text-[10px]">Transmission</dt>
          <dd className="font-mono text-xs normal-case tracking-normal text-accent">// {tx}</dd>
        </div>
        <div>
          <dt className="mb-1 text-[10px]">Filed</dt>
          <dd className="font-mono text-xs normal-case tracking-normal text-ink">
            {fmtDateTransmission(publishDate)}
          </dd>
        </div>
        <div>
          <dt className="mb-1 text-[10px]">Read time</dt>
          <dd className="font-mono text-xs normal-case tracking-normal text-ink">
            {readingTimeMinutes} min
          </dd>
        </div>
        <div>
          <dt className="mb-1 text-[10px]">Status</dt>
          <dd className="font-mono text-xs normal-case tracking-normal text-accent">CURATED</dd>
        </div>
      </dl>

      <h1 className="font-serif text-[clamp(2.5rem,8.5vw,5.5rem)] font-normal leading-[0.92] tracking-[-0.02em] text-ink-strong">
        {title}
      </h1>

      <p className="standfirst mt-7 max-w-[42.5rem] border-l-2 border-accent pl-5 font-mono text-[17px] leading-[1.55] text-ink-muted">
        <span className="text-ink-faint">&gt;</span> {summary}
      </p>

      <pre
        className="my-8 overflow-hidden text-[11px] leading-none tracking-normal text-ink-faint max-sm:text-[8px]"
        aria-hidden
      >
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      </pre>

      {showTerminal ? (
        <IssueTerminal
          issueNumber={issueNumber}
          slug={slug}
          publishDate={publishDate}
          readingTimeMinutes={readingTimeMinutes}
        />
      ) : null}

      <p className="sr-only">Published {fmtDate(publishDate)}.</p>
    </header>
  );
}
