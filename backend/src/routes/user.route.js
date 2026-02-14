import express from "express";
import getClerkUsers from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", getClerkUsers);

export default router;
