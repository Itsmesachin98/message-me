import express from "express";

import {
    getMessages,
    saveMessages,
} from "../controllers/message.controller.js";

import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/:id", protectRoute, getMessages);
router.post("/", protectRoute, saveMessages);

export default router;
