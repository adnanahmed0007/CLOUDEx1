import mongoose from "mongoose"

const FolderSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserDetaildatabse",
            required: true
        },

        name: {
            type: String,
            required: true
        },

        parent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Folder",
            default: null
        }
    },
    { timestamps: true }
);
const FolderModel = mongoose.model("Folder", FolderSchema);
export default FolderModel;