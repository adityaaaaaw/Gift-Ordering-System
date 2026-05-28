import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "flex w-full rounded-xl border border-border bg-card/45 backdrop-blur-md px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 transition-all duration-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:opacity-50 disabled:cursor-not-allowed",
          {
            "border-destructive focus:border-destructive focus:ring-destructive/15": !!error,
          },
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
export default Input;
