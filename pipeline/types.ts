export type RawItem = {
  title: string;
  url: string;
  source: string;
  publishedAt?: string;
  engagement?: number;
  rawText?: string;
};

export type SummarizedItem = RawItem & {
  summary: string;
  tags: string[];
  bucket: "tldr" | "builders" | "deepDive" | "everythingElse";
  bucketScore: number;
};
