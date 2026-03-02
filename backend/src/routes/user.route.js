import express from "express";

import {
    checkAuth,
    getUsers,
    signup,
    login,
    logout,
} from "../controllers/user.controller.js";

import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, getUsers);
router.get("/check", protectRoute, checkAuth);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

export default router;
