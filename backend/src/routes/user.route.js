import express from "express";

import {
    pingAllUsers,
    checkAuth,
    getUsers,
    signup,
    login,
    logout,
    updateProfile,
} from "../controllers/user.controller.js";

import protectRoute from "../middleware/auth.middleware.js";
import { registerSchema } from "../validators/auth.validator.js";
import validateRequest from "../middleware/validateRequest.js";

const router = express.Router();

router.get("/", protectRoute, getUsers);
router.get("/check", protectRoute, checkAuth);
router.get("/ping-users", pingAllUsers);

router.post("/signup", validateRequest(registerSchema), signup);
router.post("/login", login);
router.post("/logout", logout);

router.put("/update-profile", protectRoute, updateProfile);

export default router;
