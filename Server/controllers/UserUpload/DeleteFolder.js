import FolderModel from "../../models/FolderModel.js";
import UploadFileModel from "../../models/UploadModel.js";

const DeleteFolder = async (req, res) => {
    try {

        const { folderId } = req.params;

        const folder = await FolderModel.findOne({
            _id: folderId,
            owner: req.user._id
        });

        if (!folder) {
            return res.status(404).json({
                success: false,
                message: "Folder not found"
            });
        }

        const fileExists = await UploadFileModel.findOne({
            owner: req.user._id,
            folder: folderId,
            isTrashed: false
        });

        if (fileExists) {
            return res.status(400).json({
                success: false,
                message: "Folder is not empty"
            });
        }

        await FolderModel.findByIdAndDelete(folderId);

        return res.status(200).json({
            success: true,
            message: "Folder deleted successfully"
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};

export default DeleteFolder;