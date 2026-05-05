import { createContext, useCallback, useContext, useState } from "react";

type ToastVariant = "success" | "error" | "info";

// En enkelt toast-besked med unik id så den kan fjernes præcist
type Toast = {
  id: string;
  message: string;
  variant: ToastVariant;
};

// Kun toast-funktionen eksponeres — visning og tilstand håndteres internt
type ToastContextValue = {
  toast: (message: string, variant?: ToastVariant) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Tilføjer toast og fjerner den automatisk efter 3,5 sekunder
  const toast = useCallback((message: string, variant: ToastVariant = "success") => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  // Lukker en specifik toast manuelt via krydset
  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Fast placeret container i nederste højre hjørne — z-50 sikrer den er over alt andet */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={[
              "flex items-center justify-between gap-4 px-4 py-3 rounded-lg shadow-lg text-sm font-medium min-w-[260px] max-w-[380px]",
              t.variant === "success" && "bg-success text-white",
              t.variant === "error" && "bg-danger text-white",
              t.variant === "info" && "bg-accent text-accent-foreground",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <span>{t.message}</span>
            <button
              onClick={() => dismiss(t.id)}
              className="opacity-70 hover:opacity-100 transition-opacity text-lg leading-none"
              aria-label="Luk"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// Kaster fejl ved brug udenfor provider så fejlen opdages tidligt
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}