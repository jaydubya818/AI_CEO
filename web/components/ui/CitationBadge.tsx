export function CitationBadge({ count }: { count: number }) {
  return (
    <span className="inline-flex rounded-full border border-cyan-400/35 bg-cyan-500/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-cyan-200">
      {count} sources
    </span>
  );
}
