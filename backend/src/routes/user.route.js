import express from "express";
import { requireAuth } from "@clerk/express";

import getClerkUsers from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", requireAuth(), getClerkUsers);

export default router;
