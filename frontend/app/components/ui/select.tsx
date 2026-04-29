import * as RadixSelect from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "~/utils/cn";

export type SelectOption = { label: string; value: string };

type SelectProps = {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  value: string;
  onValueChange: (value: string) => void;
  error?: string | null;
  required?: boolean;
  disabled?: boolean;
};

export function Select({
  label,
  placeholder,
  options,
  value,
  onValueChange,
  error,
  required,
  disabled,
}: SelectProps) {
  const id = label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-[13px] font-medium text-foreground">
          {label}
          {required && <span className="text-danger ml-0.5">*</span>}
        </label>
      )}
      <RadixSelect.Root value={value} onValueChange={onValueChange} disabled={disabled}>
        <RadixSelect.Trigger
          id={id}
          className={cn(
            "flex items-center justify-between w-full px-3 py-2 text-sm rounded-md border bg-background text-foreground transition-colors",
            "border-border focus:outline-none focus:border-border-strong",
            error && "border-danger",
            disabled && "opacity-50 cursor-not-allowed",
            !value && "text-foreground-subtle"
          )}
        >
          <RadixSelect.Value placeholder={placeholder} />
          <RadixSelect.Icon>
            <ChevronDown className="h-4 w-4 text-foreground-muted" />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>
        <RadixSelect.Portal>
          <RadixSelect.Content
            className="z-50 bg-background border border-border rounded-lg shadow-lg overflow-hidden"
            position="popper"
            sideOffset={4}
          >
            <RadixSelect.Viewport className="p-1">
              {options.map((opt) => (
                <RadixSelect.Item
                  key={opt.value}
                  value={opt.value}
                  className="flex items-center justify-between px-3 py-2 text-sm rounded-md text-foreground cursor-pointer hover:bg-surface-hover focus:outline-none focus:bg-surface-hover"
                >
                  <RadixSelect.ItemText>{opt.label}</RadixSelect.ItemText>
                  <RadixSelect.ItemIndicator>
                    <Check className="h-3.5 w-3.5 text-foreground-muted" />
                  </RadixSelect.ItemIndicator>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
      {error && <span className="text-[12px] text-danger">{error}</span>}
    </div>
  );
}
