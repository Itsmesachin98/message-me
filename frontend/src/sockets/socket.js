import { io } from "socket.io-client";
import { useChatStore } from "../store/useChatStore";

let socket;

const connectSocket = (token) => {
    socket = io(import.meta.env.VITE_API_BASE_URL, {
        auth: { token },
        transports: ["websocket"],
        autoConnect: true,
    });

    socket.on("connect", () => {
        console.log("Connected:", socket.id);
    });

    // Attach listeners here
    socket.on("onlineUsers", (users) => {
        useChatStore.getState().setOnlineUsers(users);
    });

    socket.on("newMessage", (message) => {
        const { conversationId } = useChatStore.getState();

        if (message.conversationId !== conversationId) return;

        useChatStore.getState().addMessage(message);
    });

    return socket;
};

const getSocket = () => socket;

const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

export { connectSocket, getSocket, disconnectSocket };
