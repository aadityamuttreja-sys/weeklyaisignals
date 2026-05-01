import { TagList } from "./TagChip";

type Props = {
  title: string;
  body: string;
  sourceUrl?: string;
  tags?: string[];
};

export function DeepDive({ title, body, sourceUrl, tags = [] }: Props) {
  const paragraphs = body.split(/\n\n+/);
  return (
    <article className="border-l border-rule pl-5">
      <h3 className="font-serif text-[26px] font-semibold leading-[1.25] tracking-tight">
        {sourceUrl ? (
          <a href={sourceUrl} target="_blank" rel="noreferrer">
            {title}
          </a>
        ) : (
          title
        )}
      </h3>
      <div className="mt-4 space-y-5">
        {paragraphs.map((p, i) => (
          <p
            key={i}
            className="text-[19px] leading-[1.7] text-ink"
            dangerouslySetInnerHTML={{ __html: renderEmphasis(p) }}
          />
        ))}
      </div>
      <TagList tags={tags} />
    </article>
  );
}

function renderEmphasis(text: string): string {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return escaped.replace(/\*([^*]+)\*/g, "<em>$1</em>");
}
