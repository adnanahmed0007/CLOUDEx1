import UploadFileModel from "../../models/UploadModel.js";

const Trashed = async (req, res) => {
    try {
        const trashedFiles = await UploadFileModel.find({
            owner: req.user._id,
            isTrashed: true
        }).sort({ updatedAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Trashed files fetched successfully.",
            totalFiles: trashedFiles.length,
            files: trashedFiles
        });

    } catch (e) {
        console.error(e);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export default Trashed;