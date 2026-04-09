import { Badge } from "./badge";

export function DecisionOptionCard({
  title,
  result,
  recommended,
}: {
  title: string;
  result: string;
  recommended?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-3 ${
        recommended
          ? "border-cyan-400/30 bg-cyan-500/10"
          : "border-white/10 bg-white/[0.03]"
      }`}
    >
      <div className="mb-1 flex items-center justify-between gap-2">
        <p className={`text-xs ${recommended ? "text-cyan-200" : "text-slate-400"}`}>
          {recommended ? "Recommended option" : "Option"}
        </p>
        <Badge variant={recommended ? "accent" : "muted"}>
          {recommended ? "Best tradeoff" : "Alternative"}
        </Badge>
      </div>
      <p className="mt-1 text-sm font-medium text-slate-100">{title}</p>
      <p className="mt-2 text-xs text-slate-300">{result}</p>
    </div>
  );
}
