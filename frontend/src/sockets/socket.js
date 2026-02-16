import { io } from "socket.io-client";

let socket;

const connectSocket = (userId) => {
    socket = io(import.meta.env.VITE_API_BASE_URL, {
        auth: { userId },
        autoConnect: true,
    });

    socket.on("connect", () => {
        console.log(socket.id);
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
