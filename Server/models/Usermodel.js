import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
        },

        // Storage used by the user (Bytes)
        storageUsed: {
            type: Number,
            default: 0,
        },

        // Maximum storage allowed (1 GB by default)
        storageLimit: {
            type: Number,
            default: 1024 * 1024 * 1024, // 1 GB
        },

        // User subscription plan
        plan: {
            type: String,
            enum: ["free", "basic", "pro", "premium"],
            default: "free",
        },

        // Plan expiry date
        planExpiresAt: {
            type: Date,
            default: null,
        },

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },

        isVerified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const UserDetaildatabse = mongoose.model("Userdata", userSchema);

export default UserDetaildatabse;