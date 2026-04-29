import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Button } from "~/components/ui/button";

type FormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
  submitLabel?: string;
};

export function FormModal({
  open,
  onOpenChange,
  title,
  onSubmit,
  children,
  submitLabel = "Gem",
}: FormModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-background rounded-lg shadow-xl w-full max-w-[480px] max-h-[90vh] overflow-auto">
          <div className="flex items-center justify-between px-6 pt-6 pb-4">
            <Dialog.Title className="text-[18px] font-semibold text-foreground">
              {title}
            </Dialog.Title>
            <Dialog.Close className="text-foreground-muted hover:text-foreground transition-colors">
              <X className="h-5 w-5" />
            </Dialog.Close>
          </div>
          <form onSubmit={onSubmit}>
            <div className="px-6 pb-4 flex flex-col gap-4">{children}</div>
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
