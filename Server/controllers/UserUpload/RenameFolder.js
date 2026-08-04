import FolderModel from "../../models/FolderModel.js";

const RenameFolder = async (req, res) => {
    try {

        const { folderId } = req.params;
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Folder name is required"
            });
        }

        const folder = await FolderModel.findOne({
            _id: folderId,
            owner: req.user._id
        });

        if (!folder) {
            return res.status(404).json({
                success: false,
                message: "Folder not found"
            });
        }

        // Prevent duplicate names in the same parent
        const existingFolder = await FolderModel.findOne({
            owner: req.user._id,
            parent: folder.parent,
            name,
            _id: { $ne: folderId }
        });

        if (existingFolder) {
            return res.status(400).json({
                success: false,
                message: "Folder with this name already exists"
            });
        }

        folder.name = name;
        await folder.save();

        return res.status(200).json({
            success: true,
            message: "Folder renamed successfully",
            folder
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};

export default RenameFolder;