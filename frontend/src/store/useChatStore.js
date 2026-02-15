import { create } from "zustand";
import toast from "react-hot-toast";

import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
    messages: [],
    conversationId: null,
    isMessagesLoading: false,

    users: [],
    selectedUser: null,
    isUsersLoading: false,

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

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        try {
            const res = await axiosInstance.post(
                `/messages/send/${selectedUser._id}`,
                messageData,
            );
            set({ messages: [...messages, res.data] });
        } catch (err) {
            toast.error(err.response.data.message);
        }
    },

    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        // Todo: optimize this one later
        socket.on("newMessage", (newMessage) => {
            if (newMessage.senderId !== selectedUser._id) return;
            set({ messages: [...get().messages, newMessage] });
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
