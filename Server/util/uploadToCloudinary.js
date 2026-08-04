import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";

/**
 * Uploads a Buffer (from multer memoryStorage) to Cloudinary.
 * resource_type: "auto" lets Cloudinary decide image / video / raw
 * based on the file content, which is what we want since we accept
 * images, videos, pdfs and documents.
 */
export const uploadBufferToCloudinary = (buffer, { folder, filename }) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                public_id: filename,
                resource_type: "auto",
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

/**
 * Deletes a file from Cloudinary. resourceType must match what was
 * returned when the file was uploaded ("image" | "video" | "raw").
 */
export const deleteFromCloudinary = (publicId, resourceType = "raw") => {
    return cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
    });
};
