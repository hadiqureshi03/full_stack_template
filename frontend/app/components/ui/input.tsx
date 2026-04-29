import { cn } from "~/utils/cn";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string | null;
};

export function Input({ label, error, required, className, id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-[13px] font-medium text-foreground">
          {label}
          {required && <span className="text-danger ml-0.5">*</span>}
        </label>
      )}
      <input
        id={inputId}
        required={required}
        className={cn(
          "w-full px-3 py-2 text-sm rounded-md border bg-background text-foreground placeholder:text-foreground-subtle transition-colors",
          "border-border focus:outline-none focus:border-border-strong",
          error && "border-danger focus:border-danger",
          className
        )}
        {...props}
      />
      {error && <span className="text-[12px] text-danger">{error}</span>}
    </div>
  );
}
