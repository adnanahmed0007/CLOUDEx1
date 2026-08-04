
import UploadFileModel from "../../models/UploadModel.js";
import { Readable } from "stream";

const dowloandlink = async (req, res) => {
    try {
        const { token } = req.params;
        const file = await UploadFileModel.findOne({
            shareToken: token,
            isPublic: true
        });
        if (!file) {
            return res
                .status(404)
                .json({
                    message: "file not found"
                })
        }

        const cloudinaryRes = await fetch(file.filePath);

        if (!cloudinaryRes.ok || !cloudinaryRes.body) {
            return res.status(404).json({
                message: "file not found on storage"
            });
        }

        res.setHeader("Content-Type", file.mimeType);
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${encodeURIComponent(file.originalName)}"`
        );

        Readable.fromWeb(cloudinaryRes.body).pipe(res);

    }
    catch (e) {
        console.log(e)
        return res
            .status(500)
            .json({
                message: "internal server error"
            })
    }
}
export default dowloandlink;
