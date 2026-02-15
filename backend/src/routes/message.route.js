import express from "express";

// import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages } from "../controllers/message.controller.js";

const router = express.Router();

// router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", getMessages);
// router.get("/:id", getMessages);

// router.post("/send/:id", protectRoute, sendMessage);

export default router;
