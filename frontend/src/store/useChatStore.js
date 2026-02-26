import { create } from "zustand";
import toast from "react-hot-toast";

import { axiosInstance } from "../lib/axios";
import { getSocket } from "../sockets/socket";

export const useChatStore = create((set) => ({
    messages: [],
    conversationId: null,
    isMessagesLoading: false,

    users: [],
    selectedUser: null,
    isUsersLoading: false,

    onlineUsers: [],

    // GET /api/users
    getUsers: async () => {
        set({ isUsersLoading: true, users: [] });

        try {
            const res = await axiosInstance.get("/users");
            set({ users: res.data.users });
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to load users");
            set({ users: [] });
        } finally {
            set({ isUsersLoading: false });
        }
    },

    // GET /api/messages/:otherUserId
    getMessages: async (otherUserId) => {
        set({ isMessagesLoading: true, messages: [], conversationId: null });

        try {
            const res = await axiosInstance.get(`/messages/${otherUserId}`);
            set({
                messages: res.data.messages,
                conversationId: res.data.conversationId,
            });
        } catch (err) {
            toast.error(
                err?.response?.data?.message || "Failed to load messages",
            );
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    subscribeToMessages: () => {
        const socket = getSocket();

        if (!socket) return;

        socket.off("newMessage");

        socket.on("newMessage", (newMessage) => {
            set((state) => ({ messages: [...state.messages, newMessage] }));
        });
    },

    subscribeToOnlineUsers: () => {
        const socket = getSocket();

        if (!socket) return;

        socket.off("onlineUsers");

        socket.on("onlineUsers", (users) => {
            set({ onlineUsers: users });
        });
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
