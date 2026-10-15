import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type TButtonVariant = "primary" | "outline" | "ghost" | "danger";
type TButtonSize = "sm" | "md" | "lg";

const variants: Record<TButtonVariant, string> = {
  primary: "bg-foreground text-background hover:opacity-90",
  outline: "border border-foreground/20 hover:bg-foreground/5",
  ghost: "hover:bg-foreground/5",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

const sizes: Record<TButtonSize, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: TButtonVariant;
  size?: TButtonSize;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
