import { cn } from "~/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
        {
          primary: "bg-accent text-accent-foreground hover:opacity-90 active:opacity-80",
          secondary: "bg-surface text-foreground border border-border hover:bg-surface-hover",
          ghost: "text-foreground-muted hover:bg-surface hover:text-foreground active:bg-surface-hover",
          danger: "bg-danger text-white hover:opacity-90 active:opacity-80",
        }[variant],
        {
          sm: "text-[13px] px-3 py-1.5 gap-1.5",
          md: "text-sm px-4 py-2 gap-2",
          lg: "text-base px-5 py-2.5 gap-2",
        }[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
