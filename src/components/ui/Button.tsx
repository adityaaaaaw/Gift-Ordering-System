import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] cursor-pointer",
          {
            // Variants
            "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/25":
              variant === "default",
            "bg-secondary text-secondary-foreground hover:bg-secondary/80":
              variant === "secondary",
            "border border-border bg-transparent text-foreground hover:bg-muted":
              variant === "outline",
            "bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted":
              variant === "ghost",
            "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md shadow-destructive/20":
              variant === "destructive",
            
            // Sizes
            "h-8 px-3 rounded-lg text-[10px]": size === "sm",
            "h-10 px-5": size === "md",
            "h-12 px-7 rounded-2xl text-sm": size === "lg",
          },
          className
        )}
        {...props}
      >
        {isLoading && (
          <span className="mr-2 h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
