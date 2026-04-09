export function ConfidenceBadge({ value }: { value: number }) {
  const tone =
    value >= 80
      ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
      : value >= 65
        ? "border-amber-400/40 bg-amber-500/10 text-amber-200"
        : "border-rose-400/40 bg-rose-500/10 text-rose-200";

  return (
    <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider ${tone}`}>
      {value}% confidence
    </span>
  );
}
