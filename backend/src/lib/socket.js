import dotenv from "dotenv";
dotenv.config();

import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";
import jwt from "jsonwebtoken";
import cookie from "cookie";

import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import cloudinary from "./cloudinary.js";

const app = express();
const server = createServer(app);

const FRONTEND_URL = process.env.FRONTEND_URL;

const io = new Server(server, {
    cors: {
        origin: [FRONTEND_URL],
        credentials: true,
    },
});

const onlineUsers = new Map();

io.use(async (socket, next) => {
    try {
        const cookies = socket.handshake.headers.cookie;

        if (!cookies) return next(new Error("Unauthorized - No cookies"));

        const parsedCookies = cookie.parse(cookies);
        const token = parsedCookies.accessToken;

        if (!token) return next(new Error("Unauthorized - No token"));

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.data.userId = decoded.userId;
        next();
    } catch (error) {
        console.error("Socket auth failed:", error.message);
        next(new Error("Unauthorized"));
    }
});

io.on("connection", (socket) => {
    const userId = socket.data.userId;

    console.log(
        `User connected. User id - ${userId}, Socket id - ${socket.id}`,
    );

    // Add user to online map
    if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, new Set());
    }

    onlineUsers.get(userId).add(socket.id);

    // Broadcast online users
    io.emit("onlineUsers", [...onlineUsers.keys()]);

    // Join Conversation
    socket.on("joinConversation", async (roomId) => {
        socket.join(roomId);
    });

    // Leave Conversation
    socket.on("leaveConversation", (conversationId) => {
        socket.leave(conversationId.toString());
    });

    socket.on("sendMessage", async (payload) => {
        try {
            const {
                content,
                image,
                senderId,
                receiverId,
                conversationId,
                tempId,
            } = payload;

            // const senderId = userId;

            // Upload image if present
            let imageUrl = null;

            if (image) {
                const uploadResponse = await cloudinary.uploader.upload(image, {
                    folder: "chatsync/sent_pictures", // FOLDER STRUCTURE
                });

                imageUrl = uploadResponse.secure_url;
            }

            const roomId = [userId, receiverId].sort().join("_");

            io.to(roomId).emit("newMessage", payload);

            return;

            const participants = [senderId, receiverId].sort();
            let conversation;

            // CASE 1: If conversationId exists
            if (conversationId) {
                conversation = await Conversation.findById(conversationId);
            }

            // CASE 2: Find by participants
            if (!conversation) {
                conversation = await Conversation.findOne({ participants });
            }

            // CASE 3: Create conversation
            if (!conversation) {
                conversation = await Conversation.create({
                    participants,
                    createdBy: senderId,
                });
            }

            // Save message
            const message = await Message.create({
                conversationId: conversation._id,
                senderId,
                content,
                mediaUrl: imageUrl,
            });

            io.to(conversation._id.toString()).emit("newMessage", {
                ...message,
                tempId,
            });
        } catch (err) {
            console.error("sendMessage error:", err);
        }
    });

    // Handle Disconnection
    socket.on("disconnect", () => {
        if (!onlineUsers.has(userId)) return;

        onlineUsers.get(userId).delete(socket.id);

        if (onlineUsers.get(userId).size === 0) {
            onlineUsers.delete(userId);
        }

        io.emit("onlineUsers", [...onlineUsers.keys()]);

        console.log("User disconnected:", userId);
    });
});

export { io, app, server };
