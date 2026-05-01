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

  return (
    <div className="pt-3">
      <div className="mb-3 font-mono text-[0.74rem] tracking-[0.1em] text-ink-muted">
        DEEP DIVE · ESSAY
      </div>
      <h3 className="max-w-[22ch] font-serif text-[clamp(1.9rem,3vw,2.4rem)] font-medium leading-[1.12] tracking-tight text-ink-strong">
        {block.sourceUrl ? (
          <a href={block.sourceUrl} target="_blank" rel="noreferrer" className="link-rule">
            {block.title}
          </a>
        ) : (
          block.title
        )}
      </h3>
      {block.standfirst ? (
        <p className="mt-3 max-w-[36rem] font-serif italic text-[1.2rem] text-ink-muted">
          {block.standfirst}
        </p>
      ) : null}
      <div className="mt-6">
        {firstParagraph ? (
          <p className="mb-[1.1em] max-w-[38rem] font-serif text-[1.05rem] leading-[1.62] text-ink">
            {dropCap ? (
              <>
                <span className="float-left mr-[0.08em] mb-[-0.08em] mt-[0.05em] font-serif italic font-medium leading-[0.85] text-[5.6em] text-accent">
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
          <p
            key={`b-${i}`}
            className="mb-[1.1em] max-w-[38rem] font-serif text-[1.05rem] leading-[1.62] text-ink"
          >
            {p}
          </p>
        ))}
      </div>
      {hasPullQuote ? (
        <blockquote className="my-12 grid max-w-[36rem] grid-cols-[auto_1fr] items-start gap-3 border-l-2 border-accent pl-6">
          <span className="font-serif italic text-[4rem] leading-[0.6] text-accent">
            {"“"}
          </span>
          <span className="font-serif italic font-normal text-[1.4rem] leading-[1.3] text-ink-strong">
            {block.pullQuote}
          </span>
        </blockquote>
      ) : null}
      {afterPull.map((p, i) => (
        <p
          key={`a-${i}`}
          className="mb-[1.1em] max-w-[38rem] font-serif text-[1.05rem] leading-[1.62] text-ink"
        >
          {p}
        </p>
      ))}
      {block.tags.length ? (
        <div className="mt-6 flex gap-3">
          {block.tags.map((t) => (
            <TagChip key={t} tag={t} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
