 import { useCallback, useEffect, useState } from "react";
import { RotateCcw, Trash2, Trash } from "lucide-react";
import * as api from "../api/endpoints";
import { useToast } from "../context/ToastContext";
import EmptyState from "../components/ui/EmptyState";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import FileTypeBadge, { FileIcon } from "../components/ui/FileTypeBadge";
import { formatBytes, formatDate } from "../utils/format";

export default function TrashPage() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restoringId, setRestoringId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const toast = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.getTrashedFiles();
      setFiles(data.files || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't load trash.");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const restore = async (file) => {
    setRestoringId(file._id);
    try {
      await api.restoreFile(file._id);
      toast.success(`${file.originalName} restored.`);
      setFiles((prev) => prev.filter((f) => f._id !== file._id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't restore file.");
    } finally {
      setRestoringId(null);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await api.permanentlyDeleteFile(deleteTarget._id);
      toast.success("File permanently deleted.");
      setFiles((prev) => prev.filter((f) => f._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't delete file.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeUp">
      <div>
        <h2 className="font-display font-semibold text-2xl text-gray-900 dark:text-white">Trash</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Files stay here until you restore or permanently delete them.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl2 shadow-card overflow-hidden transition-colors">
        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-gray-100 dark:bg-slate-700 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : files.length === 0 ? (
          <EmptyState
            icon={Trash}
            title="Trash is empty"
            description="Files you delete will show up here first."
          />
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-slate-700">
            {files.map((f) => (
              <li key={f._id} className="flex items-center gap-3 px-6 py-3.5">
                <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-slate-700 flex items-center justify-center shrink-0">
                  <FileIcon mimeType={f.mimeType} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {f.originalName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-0.5">
                    {formatBytes(f.fileSize)} · trashed {formatDate(f.updatedAt)}
                  </p>
                </div>
                <div className="hidden sm:block">
                  <FileTypeBadge mimeType={f.mimeType} />
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => restore(f)}
                    disabled={restoringId === f._id}
                    title="Restore"
                    className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-mint hover:bg-mint-soft dark:hover:bg-mint/20 transition-colors disabled:opacity-50"
                  >
                    <RotateCcw size={15} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(f)}
                    title="Delete forever"
                    className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-coral hover:bg-coral-soft dark:hover:bg-coral/20 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        danger
        title="Delete forever?"
        description={`"${deleteTarget?.originalName}" will be permanently deleted. This can't be undone.`}
        confirmLabel="Delete forever"
      />
    </div>
  );
}
