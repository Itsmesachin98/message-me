import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

import messageRoutes from "./routes/message.route.js";
import userRoutes from "./routes/user.route.js";
import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";

connectDB();

const PORT = process.env.PORT;
const FRONTEND_URL = process.env.FRONTEND_URL;

// Clerk middleware
app.use(
    clerkMiddleware({
        secretKey: process.env.CLERK_SECRET_KEY,
    }),
);

app.use(express.json());
app.use(cookieParser());
// app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cors({ origin: FRONTEND_URL, credentials: true }));

app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

server.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`));
