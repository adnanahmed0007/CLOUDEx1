import UploadFileModel from "../../models/UploadModel.js";

const GetFolderFiles = async (req, res) => {
    try {

        const { folderId } = req.params;

        const files = await UploadFileModel.find({
            owner: req.user._id,
            folder: folderId,
            isTrashed: false
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            files
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};

export default GetFolderFiles;