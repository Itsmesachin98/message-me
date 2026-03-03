import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },

        fullName: {
            type: String,
            required: [true, "Full name is required"],
            trim: true,
            minlength: [2, "Full name must be at least 2 characters"],
            maxlength: [50, "Full name cannot exceed 50 characters"],
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"],
            select: false, // hides password from queries by default
        },

        profilePic: {
            url: String,
            publicId: String,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

// Index for faster email lookup
userSchema.index({ email: 1 });

const User = mongoose.model("User", userSchema);

export default User;
