import { clerkClient } from "@clerk/express";
import { Server } from "socket.io";
import { createServer } from "http";
import { verifyToken } from "@clerk/express";

import express from "express";

const app = express();
const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
    },
});

io.use(async (socket, next) => {
    console.log("Test 1");
    try {
        const { token } = socket.handshake.auth;

        console.log("Test 2");

        if (!token) {
            return next(new Error("Unauthorized"));
        }

        const payload = await verifyToken(token, {
            secretKey: process.env.CLERK_SECRET_KEY,
        });

        console.log("Test 3");

        socket.data.userId = payload.sub; // userId

        console.log("Test 4");
        next();
    } catch (err) {
        console.log("This is the actual error: ", err);
        console.error("Socket auth failed:", err.message);
        next(new Error("Unauthorized"));
    }
});

io.on("connection", (socket) => {
    console.log("User connected");
    console.log(`This is user id: ${socket.data.userId}`);
    console.log(`This is socket id: ${socket.id}`);

    // addUser(socket.userId, socket.id);

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.userId);
        // removeUser(socket.userId);
    });
});

// export function getReceiverSocketId(userId) {
//     return userSocketMap[userId];
// }

// Used to store online users
// const userSocketMap = {};

// io.on("connection", (socket) => {
//     console.log("A user connected", socket.id);

//     // const userId = socket.handshake.query.userId;
//     // if (userId) userSocketMap[userId] = socket.id;

//     // io.emit() is used to send events to all the connected clients
//     // io.emit("getOnlineUsers", Object.keys(userSocketMap));

//     socket.on("disconnect", () => {
//         console.log("A user disconnected", socket.id);
//         // delete userSocketMap[userId];
//         // io.emit("getOnlineUsers", Object.keys(userSocketMap));
//     });
// });

export { io, app, server };
