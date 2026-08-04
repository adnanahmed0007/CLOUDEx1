
import UploadFileModel from "../../models/UploadModel.js";
const RenameFile = async (req, res) => {
    try {

        const { id } = req.params;
        const { originalName } = req.body;
        if (!originalName) {
            return res.status(400).json({
                success: false,
                message: "New file name is required."
            });
        }
        const findFile = await UploadFileModel.findById(id);

        if (!findFile) {
            return res
                .status(404)
                .json({
                    message: "file not found"
                })
        }
        if (findFile.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to dowload  this file."
            });
        }

        findFile.originalName = originalName;
        await findFile.save();
        return res.status(200).json({
            success: true,
            message: "File renamed successfully.",
            file: findFile
        });

    }
    catch (e) {
        console.error(e);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}
export default RenameFile;