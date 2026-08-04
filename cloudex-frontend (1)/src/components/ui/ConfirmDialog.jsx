import Modal from "./Modal";
import { AlertTriangle } from "lucide-react";

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description,
  confirmLabel = "Confirm",
  danger = false,
  loading = false,
}) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="flex gap-3">
        {danger && (
          <div className="shrink-0 w-9 h-9 rounded-full bg-coral-soft flex items-center justify-center">
            <AlertTriangle size={18} className="text-coral" />
          </div>
        )}
        <p className="text-sm text-ink-muted leading-relaxed">{description}</p>
      </div>
      <div className="flex justify-end gap-2 mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium rounded-lg text-ink-muted hover:bg-paper transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className={`px-4 py-2 text-sm font-medium rounded-lg text-white transition-colors disabled:opacity-60 ${
            danger ? "bg-coral hover:bg-coral/90" : "bg-cobalt hover:bg-cobalt-deep"
          }`}
        >
          {loading ? "Working…" : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
