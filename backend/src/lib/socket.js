import { Server } from "socket.io";
import { createServer } from "http";
import { verifyToken } from "@clerk/express";
import express from "express";

import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

const app = express();
const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
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

        // Security check
        if (!conversation.participants.includes(socket.data.userId)) {
            return;
        }

        socket.join(conversationId);
    });

    // Leave Conversation
    socket.on("leaveConversation", (conversationId) => {
        socket.leave(conversationId);
    });

    // Send Message
    socket.on("sendMessage", async ({ conversationId, text }) => {
        const senderId = socket.data.userId;

        const message = await Message.create({
            conversationId,
            senderId,
            content: text,
        });

        io.to(conversationId).emit("newMessage", message);
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
