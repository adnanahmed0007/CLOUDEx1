import { useCallback, useRef, useState } from "react";
import { UploadCloud } from "lucide-react";

export default function UploadDropzone({ onFileSelected, disabled }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragging(false);
      if (disabled) return;
      const file = e.dataTransfer.files?.[0];
      if (file) onFileSelected(file);
    },
    [onFileSelected, disabled]
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => !disabled && inputRef.current?.click()}
      className={`relative flex flex-col items-center justify-center gap-2 text-center rounded-xl2 border-2 border-dashed px-6 py-10 cursor-pointer transition-colors ${
        dragging
          ? "border-cobalt bg-cobalt-soft"
          : "border-line bg-paper hover:border-cobalt/50 hover:bg-cobalt-soft/40"
      } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        disabled={disabled}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileSelected(file);
          e.target.value = "";
        }}
      />
      <div className="w-11 h-11 rounded-full bg-cobalt-soft flex items-center justify-center">
        <UploadCloud size={20} className="text-cobalt" />
      </div>
      <p className="text-sm font-medium text-ink">
        Drop a file here, or <span className="text-cobalt">browse</span>
      </p>
      <p className="text-xs text-ink-faint">
        Sorted automatically into images, PDFs, videos, documents & others
      </p>
    </div>
  );
}
