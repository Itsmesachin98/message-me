import bcrypt from "bcryptjs";

import User from "../models/user.model.js";
import { generateAccessToken, sendTokenCookie } from "../lib/token.js";
import cloudinary from "../lib/cloudinary.js";
import getBase64SizeInKB from "../lib/utils.js";

// GET /api/users
const getUsers = async (req, res) => {
    try {
        const currentUserId = req.user._id;

        const users = await User.find({ _id: { $ne: currentUserId } }) // exclude self
            .select("fullName email profilePic createdAt") // select only needed fields
            .sort({ createdAt: -1 }) // newest users first
            .lean(); // performance optimization

        return res.status(200).json({ success: true, users });
    } catch (error) {
        console.error("GetUsers Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

// POST /api/users/signup
const signup = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        // Basic Validation
        if (!fullName?.trim() || !email?.trim() || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters",
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Check if user already exists
        const existingUser = await User.findOne({ email: normalizedEmail });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already registered",
            });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create User
        const newUser = await User.create({
            fullName: fullName.trim(),
            email: normalizedEmail,
            password: hashedPassword,
        });

        // Generate Token AFTER successful creation
        const token = generateAccessToken({ userId: newUser._id });

        sendTokenCookie(res, token);

        // Response
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            },
        });
    } catch (error) {
        console.error("Signup Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

// POST /api/users/login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email?.trim() || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Find user and explicitly select password
        const user = await User.findOne({ email: normalizedEmail }).select(
            "+password",
        );

        // Always use same error message (security best practice)
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Generate token
        const token = generateAccessToken({ userId: user._id });

        sendTokenCookie(res, token);

        // Send response (never send password)
        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                profilePic: user.profilePic,
            },
        });
    } catch (error) {
        console.error("Login Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

// POST /api/users/logout
const logout = async (req, res) => {
    try {
        const isProduction = process.env.NODE_ENV === "production";

        res.clearCookie(process.env.JWT_COOKIE_NAME || "accessToken", {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
        });

        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        console.error("Logout Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

// GET /api/users/check
const checkAuth = (req, res) => {
    try {
        // protectRoute already ensures req.user exists
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        return res.status(200).json({
            success: true,
            user: req.user,
        });
    } catch (error) {
        console.error("CheckAuth Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

// PUT /api/users/update-profile
const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({
                success: false,
                message: "Profile picture is required",
            });
        }

        // Validate image size (max 50KB)
        const imageSizeKB = getBase64SizeInKB(profilePic);

        if (imageSizeKB > 1024) {
            return res.status(400).json({
                success: false,
                message: "Image size must be less than 1024KB",
            });
        }

        // Get existing user
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Upload to Cloudinary inside folder
        const uploadResponse = await cloudinary.uploader.upload(profilePic, {
            folder: "chatsync/profile_pictures", // FOLDER STRUCTURE
            resource_type: "image",
            transformation: [
                { width: 300, height: 300, crop: "fill", gravity: "face" },
                { quality: "auto" },
            ],
        });

        // Delete old profile pic (if exists & from Cloudinary)
        if (user?.profilePic?.publicId) {
            try {
                await cloudinary.uploader.destroy(user.profilePic.publicId);
            } catch (err) {
                console.log("Old image deletion failed:", err.message);
            }
        }

        // Update user
        user.profilePic = {
            url: uploadResponse.secure_url,
            publicId: uploadResponse.public_id,
        };

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                profilePic: user.profilePic,
            },
        });
    } catch (error) {
        console.error("UpdateProfile Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export { getUsers, signup, login, logout, checkAuth, updateProfile };
