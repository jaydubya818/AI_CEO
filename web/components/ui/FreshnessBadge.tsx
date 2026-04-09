import { freshnessClasses, freshnessFromMinutes } from "@/lib/formatters";

export function FreshnessBadge({ minutes }: { minutes: number }) {
  const freshness = freshnessFromMinutes(minutes);
  return (
    <span
      className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider ${freshnessClasses(
        freshness,
      )}`}
    >
      {freshness}
    </span>
  );
}
