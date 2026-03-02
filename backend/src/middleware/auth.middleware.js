import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
    try {
        let token;

        // Check cookie first
        if (req.cookies?.accessToken) {
            token = req.cookies.accessToken;
        }

        // Fallback to Authorization header (Bearer token)
        // if (!token && req.headers.authorization?.startsWith("Bearer ")) {
        //     token = req.headers.authorization.split(" ")[1];
        // }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - No token provided",
            });
        }

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch user (lean for performance)
        const user = await User.findById(decoded.userId)
            .select("-password")
            .lean();

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - User not found",
            });
        }

        // Attach user to request
        req.user = user;

        next();
    } catch (error) {
        console.error("ProtectRoute Error:", error);

        // Handle specific JWT errors
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - Token expired",
            });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - Invalid token",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export default protectRoute;
