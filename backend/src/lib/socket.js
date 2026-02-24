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
    console.log(
        `User connected. User id - ${socket.data.userId}, Socket id - ${socket.id}`,
    );

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

    socket.on("sendMessage", async ({ conversationId, text }) => {
        const senderId = socket.data.userId;

        const message = await Message.create({
            conversationId,
            senderId,
            content: text,
        });

        io.to(conversationId).emit("newMessage", message);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.data.userId);
    });
});

export { io, app, server };
