export function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12">
      <div className="hairline pt-5">
        <h2 className="smallcaps mb-6 text-ink">{label}</h2>
      </div>
      {children}
    </section>
  );
}
