export function AssumptionChip({ text }: { text: string }) {
  return (
    <span className="inline-flex rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] text-slate-300">
      {text}
    </span>
  );
}
