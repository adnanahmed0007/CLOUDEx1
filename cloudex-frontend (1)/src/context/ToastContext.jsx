import { createContext, useCallback, useContext, useState, useMemo } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (message, type = "info") => {
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => remove(id), 4000);
    },
    [remove]
  );

  const toast = useMemo(
    () => ({
      success: (msg) => push(msg, "success"),
      error: (msg) => push(msg, "error"),
      info: (msg) => push(msg, "info"),
    }),
    [push]
  );

  const icons = {
    success: <CheckCircle2 size={18} className="text-mint" />,
    error: <XCircle size={18} className="text-coral" />,
    info: <Info size={18} className="text-cobalt" />,
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-[calc(100%-2rem)] max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="animate-toastIn flex items-start gap-2.5 bg-ink text-white rounded-xl shadow-pop px-4 py-3 text-sm"
          >
            {icons[t.type]}
            <p className="flex-1 leading-snug">{t.message}</p>
            <button
              onClick={() => remove(t.id)}
              className="text-white/50 hover:text-white transition-colors"
              aria-label="Dismiss notification"
            >
              <X size={15} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
