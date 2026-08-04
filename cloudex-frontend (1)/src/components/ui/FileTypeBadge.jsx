import { FileImage, FileText, Video, File, FileType2 } from "lucide-react";
import { fileCategory, categoryStyles } from "../../utils/format";

const icons = {
  images: FileImage,
  pdfs: FileType2,
  videos: Video,
  documents: FileText,
  others: File,
};

export function FileIcon({ mimeType, size = 18, className = "" }) {
  const cat = fileCategory(mimeType);
  const Icon = icons[cat];
  const style = categoryStyles[cat];
  return <Icon size={size} className={`${style.text} ${className}`} />;
}

export default function FileTypeBadge({ mimeType }) {
  const cat = fileCategory(mimeType);
  const style = categoryStyles[cat];
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {style.label}
    </span>
  );
}
