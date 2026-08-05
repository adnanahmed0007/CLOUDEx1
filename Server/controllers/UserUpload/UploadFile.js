import UploadFileModel from "../../models/UploadModel.js";
import redisClient from "../../config/redis.js";
import { uploadBufferToCloudinary } from "../../util/uploadToCloudinary.js";
import path from "path";

const UploadFile = async (req, res) => {

    try {
        const { folderId } = req.body;


        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a file."
            });
        }


        if (req.user.storageUsed + req.file.size > req.user.storageLimit) {
            return res.status(400).json({
                success: false,
                message: "Storage limit exceeded."
            });
        }

        // req.file.buffer holds the raw bytes (multer memoryStorage) —
        // stream them up to Cloudinary instead of writing to local disk.
        const uniqueName =
            Date.now() + "-" + path.parse(req.file.originalname).name;

        const cloudinaryResult = await uploadBufferToCloudinary(
            req.file.buffer,
            {
                folder: `cloudex/${req.user._id}`,
                filename: uniqueName,
                mimeType: req.file.mimetype,
            }
        );
        console.log("clodinar" + " " + cloudinaryResult)

        const file = new UploadFileModel({
            owner: req.user._id,
            folder: folderId || null,
            originalName: req.file.originalname,
            fileName: uniqueName,
            filePath: cloudinaryResult.secure_url,
            cloudinaryId: cloudinaryResult.public_id,
            resourceType: cloudinaryResult.resource_type,
            mimeType: req.file.mimetype,
            fileSize: req.file.size,
        });



        await file.save();



        req.user.storageUsed += req.file.size;

        await req.user.save();
        await Promise.all([
            redisClient.del(`files:${req.user._id}`),
            redisClient.del(`dashboard:${req.user._id}`)
        ]);

        const remainingStorage =
            req.user.storageLimit - req.user.storageUsed;

        return res.status(201).json({
            success: true,
            message: "File uploaded successfully.",

            file,

            storage: {
                usedBytes: req.user.storageUsed,
                remainingBytes: remainingStorage,
                limitBytes: req.user.storageLimit,

                usedMB: (req.user.storageUsed / (1024 * 1024)).toFixed(2),
                remainingMB: (remainingStorage / (1024 * 1024)).toFixed(2),
                limitMB: (req.user.storageLimit / (1024 * 1024)).toFixed(2),

                usedPercentage: (
                    (req.user.storageUsed / req.user.storageLimit) * 100
                ).toFixed(2) + "%"
            }
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export default UploadFile;