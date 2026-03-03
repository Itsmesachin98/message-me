import express from "express";

import {
    checkAuth,
    getUsers,
    signup,
    login,
    logout,
    updateProfile,
} from "../controllers/user.controller.js";

import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, getUsers);
router.get("/check", protectRoute, checkAuth);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.put("/update-profile", protectRoute, updateProfile);

export default router;
