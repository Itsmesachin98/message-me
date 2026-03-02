import jwt from "jsonwebtoken";

// Generate JWT Token
const generateAccessToken = (payload) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }

    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
        issuer: "chatsync-api",
    });
};

// Attach JWT to HTTP-only Cookie
const sendTokenCookie = (res, token) => {
    const isProduction = process.env.NODE_ENV === "production";

    res.cookie(process.env.JWT_COOKIE_NAME || "accessToken", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};

export { generateAccessToken, sendTokenCookie };
