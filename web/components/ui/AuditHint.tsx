export function AuditHint({ text }: { text: string }) {
  return (
    <p className="text-[11px] text-slate-500">
      Audit visibility: <span className="text-slate-400">{text}</span>
    </p>
  );
}
