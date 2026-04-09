export function ConflictFlag({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <span className="inline-flex rounded-full border border-rose-400/40 bg-rose-500/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-rose-200">
      contradiction detected
    </span>
  );
}
