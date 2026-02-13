import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        clerkUserId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },

        name: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
        },

        avatarUrl: {
            type: String,
        },

        status: {
            type: String,
            enum: ["online", "offline", "away"],
            default: "offline",
        },

        isBanned: {
            type: Boolean,
            default: false,
        },

        lastSeenAt: {
            type: Date,
        },
    },
    { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
