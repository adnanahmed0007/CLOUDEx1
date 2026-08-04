import { X } from "lucide-react";
import { useEffect } from "react";

export default function Modal({ open, onClose, title, children, maxWidth = "max-w-md" }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm animate-fadeUp"
        onClick={onClose}
      />
      <div
        className={`relative bg-surface rounded-xl2 shadow-pop w-full ${maxWidth} animate-fadeUp`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-line">
          <h3 className="font-display font-semibold text-base text-ink">{title}</h3>
          <button
            onClick={onClose}
            className="text-ink-faint hover:text-ink transition-colors rounded-md p-1"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
