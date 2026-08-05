import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";

export const uploadBufferToCloudinary = (
    buffer,
    { folder, filename, mimeType }
) => {
    return new Promise((resolve, reject) => {

        const resourceType =
            mimeType.startsWith("image/")
                ? "image"
                : mimeType.startsWith("video/")
                    ? "video"
                    : "raw";

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                public_id: filename,
                resource_type: resourceType,   // ✅ changed
                use_filename: true,
                unique_filename: false,
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );

        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
};

export const deleteFromCloudinary = (publicId, resourceType = "raw") => {
    return cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
    });
};