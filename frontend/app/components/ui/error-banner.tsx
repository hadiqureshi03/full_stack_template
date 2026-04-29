import { AlertCircle, X } from "lucide-react";

type ErrorBannerProps = {
  message: string;
  onDismiss?: () => void;
};

export function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  return (
    <div
      className="flex items-start gap-3 px-4 py-3 rounded-lg text-danger"
      style={{ backgroundColor: "rgba(192,57,43,0.08)", border: "1px solid rgba(192,57,43,0.2)" }}
    >
      <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
      <span className="text-sm flex-1">{message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Luk"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
