import { cn } from "~/utils/cn";

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement> & {
  required?: boolean;
};

export function Label({ children, required, className, ...props }: LabelProps) {
  return (
    <label className={cn("text-[13px] font-medium text-foreground", className)} {...props}>
      {children}
      {required && <span className="text-danger ml-0.5">*</span>}
    </label>
  );
}
