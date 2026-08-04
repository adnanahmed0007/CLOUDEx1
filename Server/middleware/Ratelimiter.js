import redisClient from "../config/redis.js";
const rateLimiter = async (req, res, next) => {
    const key = `login:${req.ip}`
    const request = await redisClient.incr(key);
    if (request == 1) {
        await redisClient.expire(key, 60);
    }
    if (request > 5) {
        return res.status(429).json({
            success: false,
            message: "Too many requests. Try again after 1 minute."
        });
    }
    next();

}
export default rateLimiter;