import { FARVE_PALETTE } from "~/types";

type ColorBadgeProps = {
  farve: string;
};

export function ColorBadge({ farve }: ColorBadgeProps) {
  const option = FARVE_PALETTE.find((f) => f.value === farve);
  return (
    <div className="flex items-center gap-2">
      <span
        className="h-3 w-3 rounded-full flex-shrink-0"
        style={{ backgroundColor: option?.hex ?? "#ccc" }}
      />
      <span className="text-sm text-foreground">{option?.label ?? farve}</span>
    </div>
  );
}
