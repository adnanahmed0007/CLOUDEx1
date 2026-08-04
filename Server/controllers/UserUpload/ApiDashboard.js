import redisClient from "../../config/redis.js";
import UploadFileModel from "../../models/UploadModel.js";

const ApiDashboard = async (req, res) => {
    try {

        const cacheKey = `dashboard:${req.user._id}`;

        const cachedDashboard = await redisClient.get(cacheKey);

        if (cachedDashboard) {
            const data = JSON.parse(cachedDashboard);

            return res.status(200).json({
                success: true,
                source: "redis",
                message: "we got the files",
                ...data
            });
        }

        const totalFiles = await UploadFileModel.countDocuments({
            owner: req.user._id,
            isTrashed: false
        });

        const trashedFiles = await UploadFileModel.countDocuments({
            owner: req.user._id,
            isTrashed: true
        });

        const recentFiles = await UploadFileModel.find({
            owner: req.user._id,
            isTrashed: false
        })
            .sort({ createdAt: -1 })
            .limit(5);

        const dashboardData = {
            message: "Dashboard fetched successfully.",

            user: {
                name: req.user.name,
                email: req.user.email,
                plan: req.user.plan
            },

            summary: {
                totalFiles,
                trashedFiles
            },

            storage: {
                usedBytes: req.user.storageUsed,
                remainingBytes:
                    req.user.storageLimit - req.user.storageUsed,
                limitBytes: req.user.storageLimit,

                usedMB: (
                    req.user.storageUsed /
                    (1024 * 1024)
                ).toFixed(2),

                remainingMB: (
                    (req.user.storageLimit - req.user.storageUsed) /
                    (1024 * 1024)
                ).toFixed(2),

                limitMB: (
                    req.user.storageLimit /
                    (1024 * 1024)
                ).toFixed(2),

                usedPercentage: (
                    (req.user.storageUsed /
                        req.user.storageLimit) * 100
                ).toFixed(2)
            },

            recentFiles
        };


        await redisClient.setEx(
            cacheKey,
            60,
            JSON.stringify(dashboardData)
        );

        return res.status(200).json({
            success: true,
            source: "mongodb",
            ...dashboardData
        });

    } catch (e) {

        console.error(e);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};

export default ApiDashboard;