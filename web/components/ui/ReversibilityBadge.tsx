import type { Reversibility } from "@/lib/types";
import { DoorOpen, Lock } from "lucide-react";

export function ReversibilityBadge({ value }: { value: Reversibility }) {
  const isReversible = value === "reversible";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
        isReversible
          ? "border-emerald-300/25 bg-emerald-400/10 text-emerald-200"
          : "border-rose-300/25 bg-rose-400/10 text-rose-200"
      }`}
    >
      {isReversible ? (
        <DoorOpen className="h-3 w-3" />
      ) : (
        <Lock className="h-3 w-3" />
      )}
      {isReversible ? "Two-way door" : "One-way door"}
    </span>
  );
}
