import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
  Eye,
  Download,
  Pencil,
  Trash2,
  Share2,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  Copy,
  Check,
} from "lucide-react";
import * as api from "../api/endpoints";
import { useToast } from "../context/ToastContext";
import UploadDropzone from "../components/ui/UploadDropzone";
import EmptyState from "../components/ui/EmptyState";
import Modal from "../components/ui/Modal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import FileTypeBadge, { FileIcon } from "../components/ui/FileTypeBadge";
import {
  formatBytes,
  formatDate,
  fileCategory,
  MAX_UPLOAD_BYTES,
  categoryStyles,
} from "../utils/format";

const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "largest", label: "Largest" },
  { value: "smallest", label: "Smallest" },
  { value: "name", label: "Name (A–Z)" },
];

export default function Files() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get("q") || "";

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalFiles, setTotalFiles] = useState(0);
  const [sort, setSort] = useState("newest");

  const [searchInput, setSearchInput] = useState(urlQuery);
  const [activeSearch, setActiveSearch] = useState(urlQuery);

  const [renameTarget, setRenameTarget] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [trashTarget, setTrashTarget] = useState(null);
  const [trashing, setTrashing] = useState(false);
  const [shareTarget, setShareTarget] = useState(null);
  const [shareLink, setShareLink] = useState("");
  const [shareLoading, setShareLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const toast = useToast();

  const loadFiles = useCallback(async () => {
    setLoading(true);
    try {
      if (activeSearch.trim()) {
        const { data } = await api.searchFiles(activeSearch.trim());
        setFiles(data.files || []);
        setTotalFiles(data.totalFiles ?? data.files?.length ?? 0);
        setTotalPages(1);
      } else {
        const { data } = await api.getFiles({ page, limit: 12, sort });
        setFiles(data.files || []);
        setTotalPages(data.totalPages || 1);
        setTotalFiles(data.totalFiles ?? 0);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setFiles([]);
        setTotalFiles(0);
      } else {
        toast.error(err.response?.data?.message || "Couldn't load files.");
      }
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sort, activeSearch]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  const handleUpload = async (file) => {
    const category = fileCategory(file.type);
    const maxBytes = MAX_UPLOAD_BYTES[category];

    if (file.size > maxBytes) {
      toast.error(
        `${categoryStyles[category].label} files can't be larger than ${formatBytes(
          maxBytes
        )}. "${file.name}" is ${formatBytes(file.size)}.`
      );
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    try {
      await api.uploadFile(file, null, (evt) => {
        if (evt.total)
          setUploadProgress(Math.round((evt.loaded / evt.total) * 100));
      });
      toast.success(`${file.name} uploaded.`);
      setPage(1);
      loadFiles();
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDownload = async (file) => {
    try {
      const { data } = await api.downloadFile(file._id);
      api.triggerBrowserDownload(data, file.originalName);
    } catch (err) {
      toast.error(err.response?.data?.message || "Download failed.");
    }
  };
  const handleView = async (file) => {
    try {
      const { data } = await api.viewFile(file._id);

      const url = URL.createObjectURL(data);

      window.open(url, "_blank");
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't open file.");
    }
  };

  const submitRename = async (e) => {
    e.preventDefault();
    if (!renameValue.trim()) return;
    try {
      await api.renameFile(renameTarget._id, renameValue.trim());
      toast.success("File renamed.");
      setRenameTarget(null);
      loadFiles();
    } catch (err) {
      toast.error(err.response?.data?.message || "Rename failed.");
    }
  };

  const confirmTrash = async () => {
    setTrashing(true);
    try {
      await api.trashFile(trashTarget._id);
      toast.success("Moved to trash.");
      setTrashTarget(null);
      loadFiles();
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't move to trash.");
    } finally {
      setTrashing(false);
    }
  };

  const openShare = async (file) => {
    setShareTarget(file);
    setShareLink("");
    setCopied(false);
    setShareLoading(true);
    try {
      const { data } = await api.shareFile(file._id);
      const token = data.shareLink?.split("/").pop();
      setShareLink(token ? api.publicDownloadUrl(token) : data.shareLink);
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't create share link.");
      setShareTarget(null);
    } finally {
      setShareLoading(false);
    }
  };

  const runSearch = (e) => {
    e.preventDefault();
    setActiveSearch(searchInput.trim());
    setPage(1);
    setSearchParams(searchInput.trim() ? { q: searchInput.trim() } : {});
  };

  const clearSearch = () => {
    setSearchInput("");
    setActiveSearch("");
    setSearchParams({});
  };

  return (
    <div className="space-y-6 animate-fadeUp">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-display font-semibold text-2xl text-ink">My Files</h2>
          <p className="text-sm text-ink-muted mt-1">
            {totalFiles} file{totalFiles === 1 ? "" : "s"}
            {activeSearch ? ` matching "${activeSearch}"` : ""}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <form onSubmit={runSearch} className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"
            />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search files…"
              className="bg-surface border border-line rounded-lg pl-9 pr-8 py-2 text-sm w-48 sm:w-60 focus:border-cobalt transition-colors"
            />
            {(searchInput || activeSearch) && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink"
              >
                <X size={14} />
              </button>
            )}
          </form>

          {!activeSearch && (
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="bg-surface border border-line rounded-lg px-3 py-2 text-sm focus:border-cobalt transition-colors"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  Sort: {s.label}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <UploadDropzone onFileSelected={handleUpload} disabled={uploading} />
      {uploading && (
        <div className="w-full bg-line rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-cobalt h-full transition-all duration-200"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}

      <div className="bg-surface rounded-xl2 shadow-card overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-14 bg-paper rounded-lg animate-pulse" />
            ))}
          </div>
        ) : files.length === 0 ? (
          <EmptyState
            icon={FolderOpen}
            title={activeSearch ? "No matches found" : "No files yet"}
            description={
              activeSearch
                ? "Try a different search term."
                : "Drop a file above to get started."
            }
          />
        ) : (
          <>
            {/* Desktop table */}
            <table className="w-full hidden sm:table">
              <thead>
                <tr className="text-left text-xs font-medium text-ink-faint uppercase tracking-wide border-b border-line">
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Size</th>
                  <th className="px-4 py-3 font-medium">Uploaded</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {files.map((f) => (
                  <tr key={f._id} className="hover:bg-paper/60 transition-colors group">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-paper flex items-center justify-center shrink-0">
                          <FileIcon mimeType={f.mimeType} />
                        </div>
                        <span className="text-sm font-medium text-ink truncate max-w-[220px]">
                          {f.originalName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <FileTypeBadge mimeType={f.mimeType} />
                    </td>
                    <td className="px-4 py-3 text-sm font-mono text-ink-muted">
                      {formatBytes(f.fileSize)}
                    </td>
                    <td className="px-4 py-3 text-sm text-ink-muted">
                      {formatDate(f.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                        <IconBtn label="View" onClick={() => handleView(f)}>
                          <Eye size={15} />
                        </IconBtn>

                        <IconBtn label="Download" onClick={() => handleDownload(f)}>
                          <Download size={15} />
                        </IconBtn>
                        <IconBtn
                          label="Share"
                          onClick={() => openShare(f)}
                        >
                          <Share2 size={15} />
                        </IconBtn>
                        <IconBtn
                          label="Rename"
                          onClick={() => {
                            setRenameTarget(f);
                            setRenameValue(f.originalName);
                          }}
                        >
                          <Pencil size={15} />
                        </IconBtn>
                        <IconBtn
                          label="Move to trash"
                          danger
                          onClick={() => setTrashTarget(f)}
                        >
                          <Trash2 size={15} />
                        </IconBtn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile cards */}
            <ul className="sm:hidden divide-y divide-line">
              {files.map((f) => (
                <li key={f._id} className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-paper flex items-center justify-center shrink-0">
                    <FileIcon mimeType={f.mimeType} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink truncate">
                      {f.originalName}
                    </p>
                    <p className="text-xs text-ink-faint font-mono mt-0.5">
                      {formatBytes(f.fileSize)} · {formatDate(f.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <IconBtn label="View" onClick={() => handleView(f)}>
                      <Eye size={15} />
                    </IconBtn>

                    <IconBtn label="Download" onClick={() => handleDownload(f)}>
                      <Download size={15} />
                    </IconBtn>
                    <IconBtn label="Share" onClick={() => openShare(f)}>
                      <Share2 size={15} />
                    </IconBtn>
                    <IconBtn
                      label="Rename"
                      onClick={() => {
                        setRenameTarget(f);
                        setRenameValue(f.originalName);
                      }}
                    >
                      <Pencil size={15} />
                    </IconBtn>
                    <IconBtn danger label="Trash" onClick={() => setTrashTarget(f)}>
                      <Trash2 size={15} />
                    </IconBtn>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        {!activeSearch && totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-line">
            <p className="text-xs text-ink-muted">
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-1.5 rounded-lg border border-line disabled:opacity-40 hover:bg-paper transition-colors"
              >
                <ChevronLeft size={15} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-1.5 rounded-lg border border-line disabled:opacity-40 hover:bg-paper transition-colors"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Rename modal */}
      <Modal
        open={!!renameTarget}
        onClose={() => setRenameTarget(null)}
        title="Rename file"
      >
        <form onSubmit={submitRename} className="space-y-4">
          <input
            autoFocus
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            className="w-full border border-line rounded-lg px-3.5 py-2.5 text-sm focus:border-cobalt transition-colors"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setRenameTarget(null)}
              className="px-4 py-2 text-sm font-medium rounded-lg text-ink-muted hover:bg-paper transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium rounded-lg bg-cobalt text-white hover:bg-cobalt-deep transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </Modal>

      {/* Trash confirm */}
      <ConfirmDialog
        open={!!trashTarget}
        onClose={() => setTrashTarget(null)}
        onConfirm={confirmTrash}
        loading={trashing}
        danger
        title="Move to trash?"
        description={`"${trashTarget?.originalName}" will be moved to trash. You can restore it anytime before it's permanently deleted.`}
        confirmLabel="Move to trash"
      />

      {/* Share modal */}
      <Modal
        open={!!shareTarget}
        onClose={() => setShareTarget(null)}
        title="Share file"
      >
        <p className="text-sm text-ink-muted mb-3">
          Anyone with this link can download{" "}
          <span className="font-medium text-ink">
            {shareTarget?.originalName}
          </span>
          .
        </p>
        {shareLoading ? (
          <div className="h-11 bg-paper rounded-lg animate-pulse" />
        ) : (
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={shareLink}
              className="flex-1 border border-line rounded-lg px-3.5 py-2.5 text-sm font-mono bg-paper truncate"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(shareLink);
                setCopied(true);
                toast.success("Link copied.");
                setTimeout(() => setCopied(false), 2000);
              }}
              className="shrink-0 p-2.5 rounded-lg bg-cobalt text-white hover:bg-cobalt-deep transition-colors"
              aria-label="Copy link"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}

function IconBtn({ children, label, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`p-2 rounded-lg transition-colors ${danger
        ? "text-ink-muted hover:text-coral hover:bg-coral-soft"
        : "text-ink-muted hover:text-cobalt hover:bg-cobalt-soft"
        }`}
    >
      {children}
    </button>
  );
}
