import type { Freshness } from "./types";

export function freshnessFromMinutes(minutes: number): Freshness {
  if (minutes <= 30) return "fresh";
  if (minutes <= 120) return "aging";
  return "stale";
}

export function freshnessClasses(value: Freshness): string {
  if (value === "fresh") return "border-emerald-400/40 bg-emerald-500/10 text-emerald-200";
  if (value === "aging") return "border-amber-400/40 bg-amber-500/10 text-amber-200";
  return "border-rose-400/40 bg-rose-500/10 text-rose-200";
}
