import { io } from "socket.io-client";
import { useChatStore } from "../store/useChatStore";

let socket;

const connectSocket = () => {
    if (socket) return socket; // prevent multiple connections

    socket = io(import.meta.env.VITE_API_BASE_URL, {
        transports: ["websocket"],
        autoConnect: true,
        withCredentials: true,
    });

    socket.on("connect", () => {
        if (import.meta.env.MODE === "development") {
            console.log("Connected:", socket.id);
        }
    });

    // Attach listeners here
    socket.on("onlineUsers", (users) => {
        useChatStore.getState().setOnlineUsers(users);
    });

    socket.on("newMessage", (message) => {
        useChatStore.getState().addMessage(message);
    });

    return socket;
};

const getSocket = () => socket;

const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;

        if (import.meta.env.MODE === "development") {
            console.log("Disconnected");
        }
    }
};

export { connectSocket, getSocket, disconnectSocket };
