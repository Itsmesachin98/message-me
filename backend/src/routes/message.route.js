import express from "express";
import { requireAuth } from "@clerk/express";

import {
    getMessages,
    saveMessages,
} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/:id", requireAuth(), getMessages);
router.post("/", requireAuth(), saveMessages);

export default router;
