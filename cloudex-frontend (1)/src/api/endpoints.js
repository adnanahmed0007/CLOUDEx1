import api, { SERVER_URL } from "./axios";


export const signup = (name, email, password) =>
  api.post("/signup", { name, email, password });
export const getFolders = () => api.get("/getallfolder");
export const getFolderFiles = (folderId) =>
  api.get(`/folder/${folderId}/files`);
export const createFolder = (data) =>
  api.post("/folder/create", data);

export const deleteFolder = (folderId) =>
  api.delete(`/folder/${folderId}`);

export const renameFolder = (folderId, data) =>
  api.patch(`/folder/${folderId}`, data);
export const login = (email, password) =>
  api.post("/login", { email, password });
export const logout = () => api.post("/logout");

export const updatePassword = (password, newpassword) =>
  api.patch("/updatepassword", { password, newpassword });

// --- Files ----------------------------------------------------------------
export const uploadFile = (file, folderId = null, onUploadProgress) => {
  const formData = new FormData();

  formData.append("file", file);

  if (folderId) {
    formData.append("folderId", folderId);
  }

  return api.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  });
};

export const getAllFiles = () => api.get("/getall");

export const getFiles = ({ page = 1, limit = 10, sort = "newest" } = {}) =>
  api.get("/files", { params: { page, limit, sort } });

export const getTrashedFiles = () => api.get("/filestrashed");

export const searchFiles = (fileName) =>
  api.get("/search", { params: { fileName } });

export const trashFile = (id) => api.delete(`/delete/${id}`);

export const restoreFile = (id) => api.patch(`/restore/${id}`);

export const permanentlyDeleteFile = (id) => api.delete(`/trash/${id}`);

export const renameFile = (id, originalName) =>
  api.post(`/rename/${id}`, { originalName });

export const shareFile = (id) => api.post(`/share/${id}`);

export const getDashboard = () => api.get("/apidashboard");


export const downloadFile = (id) =>
  api.get(`/download/${id}`, { responseType: "blob" });
export const viewFile = (id) =>
  api.get(`/view/${id}`, {
    responseType: "blob",
  });


export const publicDownloadUrl = (token) =>
  `${SERVER_URL}/auth/api/sharedonwload/${token}`;

export const triggerBrowserDownload = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename || "download";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
