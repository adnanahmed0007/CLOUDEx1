
import UploadFileModel from "../../models/UploadModel.js";

const DeleteFile = async (req, res) => {
    try {
        const { id } = req.params;

        const findFile = await UploadFileModel.findById(id);

        if (!findFile) {
            return res.status(404).json({
                success: false,
                message: "File not found."
            });
        }

        if (findFile.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to delete this file."
            });
        }

        if (findFile.isTrashed) {
            return res.status(400).json({
                success: false,
                message: "File is already in trash."
            });
        }


        findFile.isTrashed = true;

        await findFile.save();

        return res.status(200).json({
            success: true,
            message: "File moved to trash successfully.",
            file: findFile
        });

    } catch (e) {
        console.error(e);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export default DeleteFile;