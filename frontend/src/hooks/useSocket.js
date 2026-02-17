import { useEffect } from "react";

import { connectSocket, disconnectSocket } from "../sockets/socket";

const useSocket = (token) => {
    useEffect(() => {
        if (!token) return;

        connectSocket(token);

        return () => {
            disconnectSocket();
        };
    }, [token]);
};

export default useSocket;
