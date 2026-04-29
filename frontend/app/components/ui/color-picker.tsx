import { FARVE_PALETTE } from "~/types";
import { cn } from "~/utils/cn";

type ColorPickerProps = {
  value: string;
  onChange: (value: string) => void;
};

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {FARVE_PALETTE.map((option) => (
        <button
          key={option.value}
          type="button"
          title={option.label}
          onClick={() => onChange(option.value)}
          className={cn(
            "h-7 w-7 rounded-full border-2 transition-transform hover:scale-110",
            value === option.value ? "border-accent scale-110" : "border-transparent"
          )}
          style={{ backgroundColor: option.hex }}
        />
      ))}
    </div>
  );
}
