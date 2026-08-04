import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Files, Trash2, UploadCloud, ArrowUpRight } from "lucide-react";
import * as api from "../api/endpoints";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import StorageGauge from "../components/ui/StorageGauge";
import { FileIcon } from "../components/ui/FileTypeBadge";
import { formatBytes, formatDate } from "../utils/format";
import EmptyState from "../components/ui/EmptyState";
import { Folder as FolderIcon } from "lucide-react";
import Modal from "../components/ui/Modal";
import ConfirmDialog from "../components/ui/ConfirmDialog";

export default function Dashboard() {
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [folders, setFolders] = useState([]);
  const toast = useToast();
  const { user } = useAuth();

  const [renameFolder, setRenameFolder] = useState(null);
  const [renameFolderValue, setRenameFolderValue] = useState("");
  const [deleteFolderTarget, setDeleteFolderTarget] = useState(null);
  const [deletingFolder, setDeletingFolder] = useState(false);
  const handleDeleteFolder = async () => {
    setDeletingFolder(true);

    try {
      await api.deleteFolder(deleteFolderTarget._id);

      const { data } = await api.getFolders();
      setFolders(data.folders);

      setDeleteFolderTarget(null);

      toast.success("Folder deleted successfully");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Couldn't delete folder."
      );
    } finally {
      setDeletingFolder(false);
    }
  };
  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        const [dashboardRes, folderRes] = await Promise.all([
          api.getDashboard(),
          api.getFolders(),
        ]);

        if (!mounted) return;

        setData(dashboardRes.data);
        setFolders(folderRes.data.folders);
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Couldn't load dashboard."
        );
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  const firstName = (data?.user?.name || user?.name || "there").split(" ")[0];

  const stats = [
    {
      label: "Total files",
      value: data?.summary?.totalFiles ?? "—",
      icon: Files,
      color: "bg-cobalt-soft text-cobalt",
      to: "/files",
    },
    {
      label: "In trash",
      value: data?.summary?.trashedFiles ?? "—",
      icon: Trash2,
      color: "bg-coral-soft text-coral",
      to: "/trash",
    },
    {
      label: "Plan",
      value: data?.user?.plan ? data.user.plan : "free",
      icon: UploadCloud,
      color: "bg-mint-soft text-mint",
      capitalize: true,
      to: "/settings",
    },
  ];
  const handleCreateFolder = async () => {
    if (!folderName.trim()) {
      return toast.error("Folder name is required");
    }

    try {
      await api.createFolder({
        name: folderName,
      });

      const { data } = await api.getFolders();

      setFolders(data.folders);

      setFolderName("");
      setShowFolderModal(false);

      toast.success("Folder created successfully");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Couldn't create folder."
      );
    }
  };
  const handleRenameFolder = async (e) => {
    e.preventDefault();

    if (!renameFolderValue.trim()) return;

    try {
      await api.renameFolder(renameFolder._id, {
        name: renameFolderValue,
      });

      const { data } = await api.getFolders();
      setFolders(data.folders);

      setRenameFolder(null);
      setRenameFolderValue("");

      toast.success("Folder renamed successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Rename failed.");
    }
  };
  return (
    <div className="space-y-6 animate-fadeUp">
      <div>
        <h2 className="font-display font-semibold text-2xl text-ink">
          Hey {firstName} 👋
        </h2>
        <p className="text-sm text-ink-muted mt-1">
          Here's what's happening in your vault.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Storage card */}
        <div className="bg-surface rounded-xl2 shadow-card p-6 flex flex-col items-center justify-center">
          <p className="text-xs font-medium text-ink-muted mb-4 self-start uppercase tracking-wide">
            Storage
          </p>
          {loading ? (
            <div className="w-32 h-32 rounded-full bg-paper animate-pulse" />
          ) : (
            <StorageGauge
              usedBytes={data?.storage?.usedBytes || 0}
              limitBytes={data?.storage?.limitBytes || 1}
            />
          )}
          <Link
            to="/files"
            className="mt-4 text-xs font-medium text-cobalt hover:underline flex items-center gap-1"
          >
            Manage files <ArrowUpRight size={12} />
          </Link>
        </div>

        {/* Stat cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-5">
          {stats.map((s) => (
            <Link
              to={s.to}
              key={s.label}
              className="bg-surface rounded-xl2 shadow-card p-5 flex flex-col gap-3 hover:shadow-pop transition-shadow"
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.color}`}>
                <s.icon size={17} />
              </div>
              <div>
                <p
                  className={`font-display font-semibold text-xl text-ink ${s.capitalize ? "capitalize" : ""
                    }`}
                >
                  {loading ? "···" : s.value}
                </p>
                <p className="text-xs text-ink-muted mt-0.5">{s.label}</p>
              </div>
            </Link>
          ))}

          <div className="sm:col-span-3 bg-surface rounded-xl2 shadow-card p-5">
            <p className="text-xs font-medium text-ink-muted mb-3 uppercase tracking-wide">
              Recent activity
            </p>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-10 bg-paper rounded-lg animate-pulse" />
                ))}
              </div>
            ) : data?.recentFiles?.length ? (
              <ul className="divide-y divide-line">
                {data.recentFiles.map((f) => (
                  <li key={f._id} className="flex items-center gap-3 py-2.5">
                    <div className="w-8 h-8 rounded-lg bg-paper flex items-center justify-center shrink-0">
                      <FileIcon mimeType={f.mimeType} size={15} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-ink truncate">
                        {f.originalName}
                      </p>
                      <p className="text-xs text-ink-faint font-mono">
                        {formatBytes(f.fileSize)} · {formatDate(f.createdAt)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                icon={UploadCloud}
                title="No files yet"
                description="Upload your first file to see it here."
                action={
                  <Link
                    to="/files"
                    className="text-sm font-medium bg-cobalt text-white px-4 py-2 rounded-lg hover:bg-cobalt-deep transition-colors"
                  >
                    Go to My Files
                  </Link>
                }
              />
            )}
          </div>
        </div>
      </div>
      <div className="bg-surface rounded-xl2 shadow-card p-5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-semibold text-lg text-ink">
            My Folders
          </h3>

          <button
            onClick={() => setShowFolderModal(true)}
            className="px-4 py-2 bg-cobalt text-white rounded-lg hover:bg-cobalt-deep transition">
            + New Folder
          </button>
        </div>

        {folders.length === 0 ? (
          <p className="text-sm text-ink-muted">
            No folders created yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {folders.map((folder) => (
              <Link
                key={folder._id}
                to={`/folder/${folder._id}`}
                className="border border-line rounded-xl p-5 hover:shadow-card hover:border-cobalt transition block"
              >
                <div className="w-12 h-12 rounded-xl bg-cobalt-soft flex items-center justify-center mb-3">
                  <FolderIcon className="text-cobalt" size={28} />
                </div>

                <div className="flex items-center justify-between">
                  <p className="font-medium text-ink truncate">
                    {folder.name}
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setRenameFolder(folder);
                        setRenameFolderValue(folder.name);
                      }}
                      className="text-cobalt hover:text-cobalt-deep"
                    >
                      ✏️
                    </button>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setDeleteFolderTarget(folder);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      {showFolderModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[400px] shadow-xl">

            <h2 className="text-xl font-semibold mb-4">
              Create Folder
            </h2>

            <input
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Folder name"
              className="w-full border rounded-lg px-4 py-2 mb-5"
            />

            <div className="flex justify-end gap-3">

              <button
                onClick={() => {
                  setShowFolderModal(false);
                  setFolderName("");
                }}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateFolder}
                className="px-4 py-2 bg-cobalt text-white rounded-lg"
              >
                Create
              </button>

            </div>

          </div>
        </div>
      )}
      <Modal
        open={!!renameFolder}
        title="Rename Folder"
        onClose={() => setRenameFolder(null)}
      >
        <form onSubmit={handleRenameFolder} className="space-y-4">
          <input
            value={renameFolderValue}
            onChange={(e) => setRenameFolderValue(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Folder name"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setRenameFolder(null)}
              className="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-cobalt text-white rounded-lg"
            >
              Save
            </button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog
        open={!!deleteFolderTarget}
        title="Delete Folder?"
        description={
          deleteFolderTarget
            ? `"${deleteFolderTarget.name}" will be permanently deleted.`
            : ""
        }
        confirmLabel={deletingFolder ? "Deleting..." : "Delete"}
        onCancel={() => setDeleteFolderTarget(null)}
        onConfirm={handleDeleteFolder}
      />
    </div>

  );
}
