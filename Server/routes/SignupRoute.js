import express from "express";
import SignupController from "../controllers/Authentication/SignupController.js";
import Login from "../controllers/Authentication/LoginController.js";
import updatePassword from "../controllers/Authentication/UpdatePassword.js";
import verifyJwt from "../middleware/Verifyjwt.js";
import upload from "../middleware/UploadFileMiddelware.js";
import UploadFile from "../controllers/UserUpload/UploadFile.js";
import GetAllfile from "../controllers/UserUpload/GetAllfiles.js";
import DeleteFile from "../controllers/UserUpload/DeleteFile.js";
import Downloadfile from "../controllers/UserUpload/Downloadfile.js";
import RenameFile from "../controllers/UserUpload/RenamFile.js";
import SearchFile from "../controllers/UserUpload/SearchFile.js";
import Pagination from "../controllers/UserUpload/Pginationfile.js";
import Trashed from "../controllers/UserUpload/GetTrashedfile.js";
import RestoreFile from "../controllers/UserUpload/RestoreFile.js";
import PermanentDelete from "../controllers/UserUpload/DeletePermanently.js";
import ApiDashboard from "../controllers/UserUpload/ApiDashboard.js";
import rateLimiter from "../middleware/Ratelimiter.js";
import Logout from "../controllers/Authentication/Logout.js";
import RenameFolder from "../controllers/UserUpload/RenameFolder.js";
import Sharefile from "../controllers/UserUpload/ShareFile.js";
import dowloandlink from "../controllers/UserUpload/DownloadLink.js";
import ViewFile from "../controllers/UserUpload/ViewFile.js";
import Folder from "../controllers/UserUpload/Folder.js";
import GetAllFolders from "../controllers/UserUpload/GetallFolder.js";
import GetFolderFiles from "../controllers/UserUpload/GetFolderFile.js";
import DeleteFolder from "../controllers/UserUpload/DeleteFolder.js";

const Route = express.Router();
Route.post("/signup", rateLimiter, SignupController);
Route.post("/login", rateLimiter, Login)
Route.post("/logout", rateLimiter, Logout)

Route.patch("/updatepassword", verifyJwt, rateLimiter, updatePassword);
Route.post("/upload", verifyJwt, rateLimiter, upload.single("file"), UploadFile);
Route.get("/getall", verifyJwt, GetAllfile);
Route.delete("/delete/:id", verifyJwt, DeleteFile);
Route.get("/download/:id", verifyJwt, Downloadfile)
Route.post("/rename/:id", verifyJwt, RenameFile)
Route.get("/search", verifyJwt, SearchFile)
Route.get("/files", verifyJwt, Pagination)
Route.get("/filestrashed", verifyJwt, Trashed)
Route.patch("/restore/:id", verifyJwt, RestoreFile);
Route.delete("/trash/:id", verifyJwt, PermanentDelete);
Route.get("/apidashboard", verifyJwt, ApiDashboard);
Route.post("/share/:id", verifyJwt, Sharefile);
Route.get("/sharedonwload/:token", dowloandlink);
Route.get("/view/:id", verifyJwt, ViewFile);
Route.post("/folder/create", verifyJwt, Folder);
Route.get("/getallfolder", verifyJwt, GetAllFolders);
Route.get("/folder/:folderId/files", verifyJwt, GetFolderFiles);
Route.delete("/folder/:folderId", verifyJwt, DeleteFolder);
Route.patch("/folder/:folderId", verifyJwt, RenameFolder);
export default Route;
