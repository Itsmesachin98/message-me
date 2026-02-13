import express from "express";
import { requireAuth } from "@clerk/express";

import syncUser from "../controllers/auth.controller.js";

// import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/sync", requireAuth(), syncUser);
// router.post("/signup", signup);
// router.post("/login", login);
// router.post("/logout", logout);
// router.put("/update-profile", protectRoute, updateProfile);

// router.get("/check", protectRoute, checkAuth);

export default router;
