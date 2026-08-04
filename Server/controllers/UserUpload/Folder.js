import FolderModel from "../../models/FolderModel.js";

const Folder = async (req, res) => {
    try {

        const { name, parent } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Folder name is required"
            });
        }

        const existingFolder = await FolderModel.findOne({
            owner: req.user._id,
            name,
            parent: parent || null
        });

        if (existingFolder) {
            return res.status(400).json({
                message: "Folder already exists"
            });
        }

        const folder = await FolderModel.create({
            owner: req.user._id,
            name,
            parent: parent || null
        });

        return res.status(201).json({
            message: "Folder created successfully",
            folder
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

export default Folder;