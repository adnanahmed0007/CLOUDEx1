import mongoose from "mongoose";

const uploadFileSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserDetaildatabse", // Change this to your actual User model name
            required: true,
        },
        folder: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Folder",
            default: null
        }
        ,
        originalName: {
            type: String,
            required: true,
            trim: true,
        },

        fileName: {
            type: String,
            required: true,
            unique: true,
        },

        filePath: {
            // Cloudinary secure_url of the file
            type: String,
            required: true,
        },

        cloudinaryId: {
            // Cloudinary public_id, needed to delete the file later
            type: String,
            required: true,
        },

        resourceType: {
            // "image" | "video" | "raw" — Cloudinary needs this to delete correctly
            type: String,
            required: true,
        },

        mimeType: {
            type: String,
            required: true,
        },

        fileSize: {
            type: Number,
            required: true,
        },


        isTrashed: {
            type: Boolean,
            default: false,
        }
        , shareToken: {
            type: String,
            default: null
        },

        isPublic: {
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: true,
    }
);

const UploadFileModel = mongoose.model("UploadFile", uploadFileSchema);

export default UploadFileModel;