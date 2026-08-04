import crypto from "crypto";
import UploadFileModel from "../../models/UploadModel.js";
const Sharefile = async (req, res) => {
    try {
        const { id } = req.params;
        const file = await UploadFileModel.findById(id);
        if (!file) {
            return res
                .status(404)
                .json({
                    message: "file not found"
                })
        }
        if (file.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed."
            });
        }
        const token = crypto.randomBytes(16).toString("hex");
        file.shareToken = token;
        file.isPublic = true;

        await file.save();
        return res.status(200).json({
            success: true,
            message: "File shared successfully.",
            shareLink: `http://localhost:9090/auth/api/sharedonwload/${token}`
        });

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
export default Sharefile;