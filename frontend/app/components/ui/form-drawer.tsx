import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Button } from "~/components/ui/button";

type FormDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
  submitLabel?: string;
};

export function FormDrawer({
  open,
  onOpenChange,
  title,
  onSubmit,
  children,
  submitLabel = "Gem",
}: FormDrawerProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Dialog.Content className="fixed right-0 top-0 bottom-0 z-50 bg-background w-[480px] max-w-full flex flex-col shadow-xl">
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border">
            <Dialog.Title className="text-[18px] font-semibold text-foreground">
              {title}
            </Dialog.Title>
            <Dialog.Close className="text-foreground-muted hover:text-foreground transition-colors">
              <X className="h-5 w-5" />
            </Dialog.Close>
          </div>
          <form onSubmit={onSubmit} className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
              {children}
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-border">
              <Dialog.Close asChild>
                <Button variant="secondary" type="button">
                  Annuller
                </Button>
              </Dialog.Close>
              <Button type="submit">{submitLabel}</Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
