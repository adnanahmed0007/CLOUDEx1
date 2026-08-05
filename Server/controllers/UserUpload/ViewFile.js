import UploadFileModel from "../../models/UploadModel.js";
import { Readable } from "stream";

const ViewFile = async (req, res) => {
    try {
        const { id } = req.params;

        const file = await UploadFileModel.findById(id);

        if (!file) {
            return res.status(404).json({
                message: "File not found",
            });
        }

        if (file.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "Unauthorized",
            });
        }

        console.log("Cloudinary URL:", file.filePath);

        const cloudinaryRes = await fetch(file.filePath);

        console.log("Status:", cloudinaryRes.status);
        console.log("Headers:", Object.fromEntries(cloudinaryRes.headers));

        if (!cloudinaryRes.ok) {
            const text = await cloudinaryRes.text();
            console.log("Cloudinary Error:", text);

            return res.status(404).json({
                message: "File not found on storage.",
            });
        }

        res.setHeader("Content-Type", file.mimeType);
        Readable.fromWeb(cloudinaryRes.body).pipe(res);

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

export default ViewFile;