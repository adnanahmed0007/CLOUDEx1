import FolderModel from "../../models/FolderModel.js";

const GetAllFolders = async (req, res) => {
    try {

        const folders = await FolderModel.find({
            owner: req.user._id
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            folders
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });

    }
};

export default GetAllFolders;