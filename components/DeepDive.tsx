import { TagChip } from "./TagChip";

export interface DeepDiveBlock {
  title: string;
  standfirst: string;
  body: string[];
  pullQuote: string;
  tags: string[];
  sourceUrl?: string;
}

export function DeepDive({
  block,
  dropCap = true,
}: {
  block: DeepDiveBlock;
  dropCap?: boolean;
}) {
  const firstParagraph = block.body[0] ?? "";
  const restParagraphs = block.body.slice(1);
  const hasPullQuote = block.pullQuote && block.pullQuote.trim().length > 0;
  const splitAt = Math.max(1, Math.floor(restParagraphs.length / 2));
  const beforePull = hasPullQuote ? restParagraphs.slice(0, splitAt) : restParagraphs;
  const afterPull = hasPullQuote ? restParagraphs.slice(splitAt) : [];

  const prose = "max-w-measure-wide font-serif text-[1.125rem] leading-[1.55] text-ink md:text-[1.22rem]";

  return (
    <div className="pt-3">
      <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-muted">
        // DEEP DIVE · ESSAY
      </div>
      <h3 className="max-w-[22ch] font-serif text-[clamp(1.9rem,3vw,2.4rem)] font-normal leading-[1.12] tracking-tight text-ink-strong">
        {block.sourceUrl ? (
          <a href={block.sourceUrl} target="_blank" rel="noreferrer" className="link-rule">
            {block.title}
          </a>
        ) : (
          block.title
        )}
      </h3>
      {block.standfirst ? (
        <p className="mt-4 max-w-measure-wide border-l-2 border-accent pl-5 font-mono text-[15px] italic leading-[1.55] text-ink-muted md:text-[16px]">
          {block.standfirst}
        </p>
      ) : null}
      <div className="mt-8">
        {firstParagraph ? (
          <p className={`mb-[1.1em] ${prose}`}>
            {dropCap ? (
              <>
                <span className="float-left mr-[0.08em] mb-[-0.08em] mt-[0.05em] font-serif text-[5.2em] font-normal italic leading-[0.85] text-accent md:text-[5.6em]">
                  {firstParagraph[0]}
                </span>
                {firstParagraph.slice(1)}
              </>
            ) : (
              firstParagraph
            )}
          </p>
        ) : null}
        {beforePull.map((p, i) => (
          <p key={`b-${i}`} className={`mb-[1.1em] ${prose}`}>
            {p}
          </p>
        ))}
      </div>
      {hasPullQuote ? (
        <blockquote className="relative my-12 max-w-measure-wide border-l-2 border-magenta pl-8 font-serif text-[1.35rem] italic leading-[1.25] text-ink-strong md:text-[1.65rem]">
          <span
            className="pointer-events-none absolute left-8 top-[-1.5rem] font-serif text-[4.5rem] leading-none text-magenta md:left-8 md:text-[5.5rem]"
            aria-hidden
          >
            &ldquo;
          </span>
          <span className="relative z-[1]">{block.pullQuote}</span>
        </blockquote>
      ) : null}
      {afterPull.map((p, i) => (
        <p key={`a-${i}`} className={`mb-[1.1em] ${prose}`}>
          {p}
        </p>
      ))}
      {block.tags.length ? (
        <div className="mt-6 flex flex-wrap gap-3">
          {block.tags.map((t) => (
            <TagChip key={t} tag={t} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
