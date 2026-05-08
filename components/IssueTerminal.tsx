import { fmtDateTransmission } from "@/lib/date";

export function IssueTerminal({
  issueNumber,
  slug,
  publishDate,
  readingTimeMinutes,
}: {
  issueNumber: number;
  slug: string;
  publishDate: string;
  readingTimeMinutes: number;
}) {
  const tx = String(issueNumber).padStart(3, "0");
  const filed = fmtDateTransmission(publishDate);

  return (
    <div className="tx-terminal">
      <div className="tx-terminal-bar">
        <span className="tx-dot r" />
        <span className="tx-dot y" />
        <span className="tx-dot g" />
        <span className="tx-path">~/issues/{slug} — bash</span>
      </div>
      <div className="tx-terminal-body text-[13px] leading-[1.7]">
        <span className="block">
          <span className="tx-term-prompt">signals@weekly</span>{" "}
          <span className="tx-term-faded">~</span> <span className="tx-term-prompt">$</span>{" "}
          <span className="text-ink">cat ./issue-meta.json</span>
        </span>
        <span className="tx-term-out block">{`{ "transmission": "${tx}", "filed": "${filed}", "read_min": ${readingTimeMinutes} }`}</span>
        <span className="block" />
        <span className="block">
          <span className="tx-term-prompt">signals@weekly</span>{" "}
          <span className="tx-term-faded">~</span> <span className="tx-term-prompt">$</span>{" "}
          <span className="text-ink">run-pipeline --status</span>
        </span>
        <span className="tx-term-good block">▸</span>{" "}
        <span className="tx-term-out">sources ingested · ranked · deduped</span>
        <span className="tx-term-good block">▸</span>{" "}
        <span className="tx-term-out">human review: OK</span>
        <span className="tx-term-good block">▸</span>{" "}
        <span className="tx-term-out">ready for readers</span>
        <span className="block" />
        <span className="block">
          <span className="tx-term-prompt">signals@weekly</span>{" "}
          <span className="tx-term-faded">~</span> <span className="tx-term-prompt">$</span>
          <span className="tx-cursor" />
        </span>
      </div>
    </div>
  );
}
