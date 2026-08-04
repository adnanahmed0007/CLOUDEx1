export function formatBytes(bytes) {
  if (bytes === 0 || bytes === undefined || bytes === null) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / Math.pow(1024, i);
  return `${value.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export function formatDate(dateString) {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(dateString) {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}


export function fileCategory(mimeType = "") {
  if (mimeType.startsWith("image/")) return "images";
  if (mimeType === "application/pdf") return "pdfs";
  if (mimeType.startsWith("video/")) return "videos";
  if (
    mimeType.includes("word") ||
    mimeType.includes("document") ||
    mimeType === "text/plain"
  )
    return "documents";
  return "others";
}

export const MAX_UPLOAD_BYTES = {
  images: 10 * 1024 * 1024,
  pdfs: 30 * 1024 * 1024,
  videos: 200 * 1024 * 1024,
  documents: 20 * 1024 * 1024,
  others: 15 * 1024 * 1024,
};

export const categoryStyles = {
  images: {
    label: "Image",
    text: "text-violet",
    bg: "bg-violet-soft",
    dot: "bg-violet",
  },
  pdfs: {
    label: "PDF",
    text: "text-coral",
    bg: "bg-coral-soft",
    dot: "bg-coral",
  },
  videos: {
    label: "Video",
    text: "text-cobalt",
    bg: "bg-cobalt-soft",
    dot: "bg-cobalt",
  },
  documents: {
    label: "Document",
    text: "text-mint",
    bg: "bg-mint-soft",
    dot: "bg-mint",
  },
  others: {
    label: "File",
    text: "text-amber",
    bg: "bg-amber-soft",
    dot: "bg-amber",
  },
};

export function initials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}