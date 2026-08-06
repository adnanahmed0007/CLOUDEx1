 import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";
import * as api from "../api/endpoints";
import { useToast } from "../context/ToastContext";
import { formatBytes, formatDate } from "../utils/format";
import EmptyState from "../components/ui/EmptyState";
import { FileIcon } from "../components/ui/FileTypeBadge";
import UploadDropzone from "../components/ui/UploadDropzone";

import {
    Eye,
    Download,
    Pencil,
    Trash2,
    Share2,
    Copy,
    Check,
} from "lucide-react";

import Modal from "../components/ui/Modal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
export default function Folder() {
    const [renameTarget, setRenameTarget] = useState(null);
    const [renameValue, setRenameValue] = useState("");

    const [trashTarget, setTrashTarget] = useState(null);
    const [trashing, setTrashing] = useState(false);

    const [shareTarget, setShareTarget] = useState(null);
    const [shareLink, setShareLink] = useState("");
    const [shareLoading, setShareLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const { folderId } = useParams();

    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);

    const toast = useToast();

    useEffect(() => {
        let mounted = true;

        const loadFiles = async () => {
            try {
                const { data } = await api.getFolderFiles(folderId);

                if (!mounted) return;

                setFiles(data.files);
            } catch (err) {
                toast.error(
                    err.response?.data?.message || "Couldn't load folder."
                );
            } finally {
                if (mounted) setLoading(false);
            }
        };

        loadFiles();

        return () => {
            mounted = false;
        };
    }, [folderId]);
    const submitRename = async (e) => {
        e.preventDefault();
        if (!renameValue.trim()) return;
        try {
            await api.renameFile(renameTarget._id, renameValue.trim());
            toast.success("File renamed.");
            setRenameTarget(null);
            const { data } = await api.getFolderFiles(folderId);
            setFiles(data.files);
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
            const { data } = await api.getFolderFiles(folderId);
            setFiles(data.files);
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
    return (
        <div className="space-y-6 animate-fadeUp">

            <div className="flex items-center gap-3">
                <Link
                    to="/dashboard"
                    className="flex items-center gap-2 text-cobalt hover:underline"
                >
                    <ArrowLeft size={18} />
                    Back
                </Link>

                <h2 className="font-display text-2xl font-semibold text-gray-900 dark:text-white">
                    Folder
                </h2>
            </div>
            <UploadDropzone
                onFileSelected={async (file) => {
                    try {
                        await api.uploadFile(file, folderId);

                        toast.success("Uploaded successfully");

                        const { data } = await api.getFolderFiles(folderId);
                        setFiles(data.files);

                    } catch (err) {
                        toast.error("Upload failed");
                    }
                }}
            />

            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl2 shadow-card p-5 transition-colors">

                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="h-14 rounded-lg bg-gray-100 dark:bg-slate-700 animate-pulse"
                            />
                        ))}
                    </div>
                ) : files.length === 0 ? (
                    <EmptyState
                        icon={FileText}
                        title="Folder is empty"
                        description="Upload a file into this folder."
                    />
                ) : (
                    <ul className="divide-y divide-gray-200 dark:divide-slate-700">
                        {files.map((file) => (
                            <li
                                key={file._id}
                                className="flex items-center justify-between py-4"
                            >
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
                                        <FileIcon
                                            mimeType={file.mimeType}
                                            size={18}
                                        />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 dark:text-white truncate">
                                            {file.originalName}
                                        </p>

                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {formatBytes(file.fileSize)} • {formatDate(file.createdAt)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">

                                    <button
                                        onClick={async () => {
                                            const res = await api.viewFile(file._id);
                                            const url = window.URL.createObjectURL(res.data);
                                            window.open(url, "_blank");
                                        }}
                                        className="p-2 rounded text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                                    >
                                        <Eye size={18} />
                                    </button>

                                    <button
                                        onClick={async () => {
                                            const res = await api.downloadFile(file._id);
                                            api.triggerBrowserDownload(res.data, file.originalName);
                                        }}
                                        className="p-2 rounded text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                                    >
                                        <Download size={18} />
                                    </button>

                                    <button
                                        onClick={() => {
                                            setRenameTarget(file);
                                            setRenameValue(file.originalName);
                                        }}
                                        className="p-2 rounded text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                                    >
                                        <Pencil size={18} />
                                    </button>

                                    <button
                                        onClick={() => setTrashTarget(file)}
                                        className="p-2 rounded hover:bg-gray-100 dark:hover:bg-slate-700 text-red-500 dark:text-red-400"
                                    >
                                        <Trash2 size={18} />
                                    </button>

                                    <button
                                        onClick={() => openShare(file)}
                                        className="p-2 rounded text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                                    >
                                        <Share2 size={18} />
                                    </button>

                                </div>
                            </li>
                        ))}
                    </ul>
                )}

            </div>
            <Modal
                open={!!renameTarget}
                title="Rename File"
                onClose={() => setRenameTarget(null)}
            >
                <form onSubmit={submitRename} className="space-y-4">
                    <input
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white rounded-lg px-3 py-2 outline-none focus:border-cobalt focus:ring-2 focus:ring-cobalt/20"
                    />

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setRenameTarget(null)}
                            className="px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="px-4 py-2 bg-cobalt text-white rounded-lg hover:bg-cobalt-deep transition-colors"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </Modal>
            <ConfirmDialog
                open={!!trashTarget}
                title="Move file to Trash?"
                description={
                    trashTarget
                        ? `"${trashTarget.originalName}" will be moved to trash.`
                        : ""
                }
                confirmLabel={trashing ? "Moving..." : "Move to Trash"}
                onCancel={() => setTrashTarget(null)}
                onConfirm={confirmTrash}
            />
            <Modal
                open={!!shareTarget}
                title="Share File"
                onClose={() => setShareTarget(null)}
            >
                {shareLoading ? (
                    <p className="text-gray-600 dark:text-gray-400">Generating link...</p>
                ) : (
                    <div className="space-y-4">
                        <input
                            value={shareLink}
                            readOnly
                            className="w-full border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white rounded-lg px-3 py-2"
                        />

                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(shareLink);
                                setCopied(true);
                            }}
                            className="w-full bg-cobalt text-white rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-cobalt-deep transition-colors"
                        >
                            {copied ? <Check size={18} /> : <Copy size={18} />}
                            {copied ? "Copied!" : "Copy Link"}
                        </button>
                    </div>
                )}
            </Modal>
        </div>
    );
}
