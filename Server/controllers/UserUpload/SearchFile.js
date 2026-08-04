import UploadFileModel from "../../models/UploadModel.js";
import redisClient from "../../config/redis.js";
const SearchFile = async (req, res) => {
    try {
        const { fileName } = req.query;
        if (!fileName) {
            return res.status(400).json({
                success: false,
                message: "File name is required."
            });
        }
        const cacheKey = `search:${req.user._id}:${fileName.toLowerCase()}`;
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



        const searchFiles = await UploadFileModel.find({
            owner: req.user._id,
            originalName: {
                $regex: fileName,
                $options: "i"
            }
        });
        if (searchFiles.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No matching files found."
            });
        }
        await redisClient.setEx(
            cacheKey,
            60,
            JSON.stringify(searchFiles)
        );



        return res.status(200).json({
            success: true,
            totalFiles: searchFiles.length,
            files: searchFiles
        });

    } catch (e) {
        console.error(e);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export default SearchFile;