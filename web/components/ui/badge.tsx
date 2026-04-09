import type { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-wide",
  {
    variants: {
      variant: {
        default: "border-white/15 bg-white/[0.05] text-slate-200",
        accent: "border-cyan-400/35 bg-cyan-400/15 text-cyan-100",
        muted: "border-white/10 bg-white/[0.03] text-slate-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type BadgeProps = VariantProps<typeof badgeVariants> & {
  children: ReactNode;
  className?: string;
};

export function Badge({ children, className, variant }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)}>{children}</span>;
}
