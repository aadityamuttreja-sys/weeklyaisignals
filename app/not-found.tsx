import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-20">
      <p className="smallcaps mb-4">404</p>
      <h1 className="font-serif text-[28px] font-semibold tracking-tight text-ink">
        That issue isn&apos;t here.
      </h1>
      <p className="mt-4 text-muted">
        It may have been a draft, or the URL is off.{" "}
        <Link href="/archive">Browse the archive →</Link>
      </p>
    </div>
  );
}
