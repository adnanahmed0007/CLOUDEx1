import redisClient from "../../config/redis.js";
import UploadFileModel from "../../models/UploadModel.js";
const GetAllfile = async (req, res) => {
    try {
        const cacheKey = `files:${req.user._id}`;
        const cachedFiles = await redisClient.get(cacheKey);

        if (cachedFiles) {
            const data = JSON.parse(cachedFiles);

            return res.status(200).json({
                success: true,
                source: "redis",
                message: "we got the files",
                ...data
            });
        }
        const files = await UploadFileModel.find({
            owner: req.user._id
        });
        await redisClient.setEx(
            cacheKey,
            60,
            JSON.stringify({ totalFiles: files.length, files })
        );

        return res.status(200).json({
            success: true,
            totalFiles: files.length,
            files
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
}
export default GetAllfile;