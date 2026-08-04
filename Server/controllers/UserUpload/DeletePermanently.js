
import UploadFileModel from "../../models/UploadModel.js";
import { deleteFromCloudinary } from "../../util/uploadToCloudinary.js";

const PermanentDelete = async (req, res) => {
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
                message: "You are not allowed to permanently delete this file."
            });
        }


        if (!findFile.isTrashed) {
            return res.status(400).json({
                success: false,
                message: "Move the file to trash before permanently deleting it."
            });
        }


        try {
            await deleteFromCloudinary(findFile.cloudinaryId, findFile.resourceType);
        } catch (cloudErr) {
            // Don't block the DB cleanup if the file is already gone
            // from Cloudinary for some reason — just log it.
            console.error("Cloudinary delete failed:", cloudErr.message);
        }


        req.user.storageUsed = Math.max(
            0,
            req.user.storageUsed - findFile.fileSize
        );

        await req.user.save();

        await findFile.deleteOne();

        return res.status(200).json({
            success: true,
            message: "File permanently deleted successfully.",
            deletedFile: {
                id: findFile._id,
                name: findFile.originalName
            },
            storage: {
                usedBytes: req.user.storageUsed,
                remainingBytes: req.user.storageLimit - req.user.storageUsed,
                limitBytes: req.user.storageLimit,

                usedMB: (req.user.storageUsed / (1024 * 1024)).toFixed(2),

                remainingMB: (
                    (req.user.storageLimit - req.user.storageUsed) /
                    (1024 * 1024)
                ).toFixed(2),

                usedPercentage: (
                    (req.user.storageUsed / req.user.storageLimit) * 100
                ).toFixed(2)
            }
        });

    } catch (e) {
        console.error(e);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export default PermanentDelete;