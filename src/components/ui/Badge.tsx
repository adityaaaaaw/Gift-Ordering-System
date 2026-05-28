import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "outline" | "destructive" | "success" | "warning";
}

export const Badge: React.FC<BadgeProps> = ({ className, variant = "default", ...props }) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider select-none",
        {
          "bg-primary/10 border-primary/20 text-primary": variant === "default",
          "bg-secondary border-border text-secondary-foreground": variant === "secondary",
          "border-border bg-transparent text-foreground": variant === "outline",
          "bg-destructive/10 border-destructive/20 text-destructive": variant === "destructive",
          "bg-emerald-500/10 border-emerald-500/20 text-emerald-500": variant === "success",
          "bg-amber-500/10 border-amber-500/20 text-amber-500": variant === "warning",
        },
        className
      )}
      {...props}
    />
  );
};

export default Badge;
