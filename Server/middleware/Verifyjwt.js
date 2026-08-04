import jwt from "jsonwebtoken";
import UserDetaildatabse from "../models/Usermodel.js";

const verifyJwt = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await UserDetaildatabse.findById(decoded.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        req.user = user;


        next();

    } catch (error) {
        console.error("Upload Error:", error);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};

export default verifyJwt;