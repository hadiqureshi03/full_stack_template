import { Plus } from "lucide-react";
import { Button } from "~/components/ui/button";

type PageHeaderProps = {
  title: string;
  onAdd?: () => void;
  addLabel?: string;
};

export function PageHeader({ title, onAdd, addLabel = "Tilføj" }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-[22px] font-semibold text-foreground">{title}</h1>
      {onAdd && (
        <Button onClick={onAdd}>
          <Plus className="h-4 w-4" />
          {addLabel}
        </Button>
      )}
    </div>
  );
}
