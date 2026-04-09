import type { ReactNode } from "react";

export function Card({
  title,
  right,
  children,
  stale,
}: {
  title: string;
  right?: string;
  children: ReactNode;
  stale?: boolean;
}) {
  return (
    <article
      className={`relative overflow-hidden rounded-2xl border p-5 shadow-[0_10px_44px_rgba(0,0,0,0.28)] backdrop-blur-sm transition duration-200 hover:-translate-y-0.5 ${
        stale
          ? "border-rose-400/25 bg-gradient-to-b from-rose-500/[0.1] to-white/[0.03] hover:border-rose-400/40"
          : "border-white/10 bg-gradient-to-b from-white/[0.09] to-white/[0.03] hover:border-white/20"
      }`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-wide text-slate-100">{title}</h3>
        {right ? <span className="text-xs text-slate-400">{right}</span> : null}
      </div>
      {children}
    </article>
  );
}
