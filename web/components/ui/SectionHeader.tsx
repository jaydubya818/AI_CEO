import { Button } from "./button";

export function SectionHeader({
  title,
  subtitle,
  actionLabel,
  onAction,
}: {
  title: string;
  subtitle: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-[1.4rem] font-semibold tracking-tight text-slate-100 md:text-[1.55rem]">
          {title}
        </h2>
        <p className="mt-1 text-sm leading-6 text-slate-400">{subtitle}</p>
      </div>
      {actionLabel ? (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
