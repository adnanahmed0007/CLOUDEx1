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

                <h2 className="font-display text-2xl font-semibold text-ink">
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

            <div className="bg-surface rounded-xl2 shadow-card p-5">

                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="h-14 rounded-lg bg-paper animate-pulse"
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
                    <ul className="divide-y divide-line">
                        {files.map((file) => (
                            <li
                                key={file._id}
                                className="flex items-center justify-between py-4"
                            >
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="w-10 h-10 rounded-lg bg-paper flex items-center justify-center">
                                        <FileIcon
                                            mimeType={file.mimeType}
                                            size={18}
                                        />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-ink truncate">
                                            {file.originalName}
                                        </p>

                                        <p className="text-xs text-ink-faint">
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
                                        className="p-2 rounded hover:bg-paper"
                                    >
                                        <Eye size={18} />
                                    </button>

                                    <button
                                        onClick={async () => {
                                            const res = await api.downloadFile(file._id);
                                            api.triggerBrowserDownload(res.data, file.originalName);
                                        }}
                                        className="p-2 rounded hover:bg-paper"
                                    >
                                        <Download size={18} />
                                    </button>

                                    <button
                                        onClick={() => {
                                            setRenameTarget(file);
                                            setRenameValue(file.originalName);
                                        }}
                                        className="p-2 rounded hover:bg-paper"
                                    >
                                        <Pencil size={18} />
                                    </button>

                                    <button
                                        onClick={() => setTrashTarget(file)}
                                        className="p-2 rounded hover:bg-paper text-red-500"
                                    >
                                        <Trash2 size={18} />
                                    </button>

                                    <button
                                        onClick={() => openShare(file)}
                                        className="p-2 rounded hover:bg-paper"
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
                        className="w-full border rounded-lg px-3 py-2"
                    />

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setRenameTarget(null)}
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
                    <p>Generating link...</p>
                ) : (
                    <div className="space-y-4">
                        <input
                            value={shareLink}
                            readOnly
                            className="w-full border rounded-lg px-3 py-2"
                        />

                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(shareLink);
                                setCopied(true);
                            }}
                            className="w-full bg-cobalt text-white rounded-lg py-2 flex items-center justify-center gap-2"
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