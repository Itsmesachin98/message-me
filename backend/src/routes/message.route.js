import express from "express";
import { requireAuth } from "@clerk/express";

import { getMessages } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/:id", requireAuth(), getMessages);

export default router;
