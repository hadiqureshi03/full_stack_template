import * as RadixCheckbox from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "~/utils/cn";

type CheckboxProps = {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  id?: string;
  disabled?: boolean;
};

export function Checkbox({ label, checked, onCheckedChange, id, disabled }: CheckboxProps) {
  const checkboxId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex items-center gap-2">
      <RadixCheckbox.Root
        id={checkboxId}
        checked={checked}
        onCheckedChange={(val) => onCheckedChange(val === true)}
        disabled={disabled}
        className={cn(
          "h-4 w-4 rounded border border-border bg-background flex items-center justify-center transition-colors focus:outline-none focus:border-border-strong",
          checked && "bg-accent border-accent",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <RadixCheckbox.Indicator>
          <Check className="h-3 w-3 text-accent-foreground" />
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>
      <label
        htmlFor={checkboxId}
        className={cn("text-sm text-foreground cursor-pointer", disabled && "opacity-50 cursor-not-allowed")}
      >
        {label}
      </label>
    </div>
  );
}
