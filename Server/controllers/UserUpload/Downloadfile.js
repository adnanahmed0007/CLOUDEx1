import UploadFileModel from "../../models/UploadModel.js";
import { Readable } from "stream";

const Downloadfile = async (req, res) => {
    try {
        const { id } = req.params;
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

        // File lives on Cloudinary now — fetch it server-side and pipe
        // it through, so the browser still gets a proper file download
        // with the original filename (frontend uses responseType: "blob").
        const cloudinaryRes = await fetch(findFile.filePath);

        if (!cloudinaryRes.ok || !cloudinaryRes.body) {
            return res.status(404).json({
                success: false,
                message: "File not found on server."
            });
        }

        res.setHeader("Content-Type", findFile.mimeType);
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${encodeURIComponent(findFile.originalName)}"`
        );

        Readable.fromWeb(cloudinaryRes.body).pipe(res);

    }
    catch (e) {
        console.error(e);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}
export default Downloadfile;
