import dotenv from "dotenv";
dotenv.config();

import { Server } from "socket.io";
import { createServer } from "http";
import { verifyToken } from "@clerk/express";
import express from "express";

import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

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
        const { token } = socket.handshake.auth;

        if (!token) {
            return next(new Error("Unauthorized"));
        }

        const payload = await verifyToken(token, {
            secretKey: process.env.CLERK_SECRET_KEY,
        });

        socket.data.userId = payload.sub; // userId
        next();
    } catch (err) {
        console.log("Socket auth failed: ", err);
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
    socket.on("joinConversation", async (conversationId) => {
        const conversation = await Conversation.findById(conversationId);

        if (!conversation) return;
        if (!conversation.participants.includes(userId)) return;

        socket.join(conversationId.toString());
    });

    // Leave Conversation
    socket.on("leaveConversation", (conversationId) => {
        socket.leave(conversationId.toString());
    });

    // Send Message
    socket.on("sendMessage", async ({ conversationId, text, receiverId }) => {
        try {
            const senderId = userId;
            let conversation;

            // CASE 1: If conversationId exists
            if (conversationId) {
                conversation = await Conversation.findById(conversationId);
            }

            // CASE 2: Find by participants
            if (!conversation) {
                const participants = [senderId, receiverId].sort();

                conversation = await Conversation.findOne({ participants });
            }

            // CASE 3: Create new conversation
            if (!conversation) {
                const participants = [senderId, receiverId].sort();

                conversation = await Conversation.create({
                    participants,
                    createdBy: senderId,
                });

                socket.join(conversation._id.toString());
            }

            // SECURITY CHECK
            if (!conversation.participants.includes(senderId)) {
                return;
            }

            // Save message
            const message = await Message.create({
                conversationId: conversation._id,
                senderId,
                content: text,
            });

            io.to(conversation._id.toString()).emit("newMessage", {
                ...message.toObject(),
                conversationId: conversation._id,
            });
        } catch (err) {
            console.error("Send message error:", err);
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
