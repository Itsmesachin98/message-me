import { create } from "zustand";
import toast from "react-hot-toast";

import { axiosInstance } from "../lib/axios";

export const useChatStore = create((set, get) => ({
    messages: [],
    conversationId: null,
    isMessagesLoading: false,

    users: [],
    selectedUser: null,
    isUsersLoading: false,

    onlineUsers: [],

    // GET /api/users
    getUsers: async () => {
        const { users } = get();

        // Prevent unnecessary API calls if users already exist
        if (users && users.length > 0) return;

        set({ isUsersLoading: true });

        try {
            const res = await axiosInstance.get("/users");
            const fetchedUsers = res?.data?.users || [];
            set({ users: fetchedUsers });
        } catch (err) {
            console.log("Error fetching users: ", err);

            const errorMessage =
                err?.response?.data?.message || "Failed to load users";

            toast.error(errorMessage);
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
            console.log("Error fetching messages: ", err);

            const errorMessage =
                err?.response?.data?.message || "Failed to load messages";

            toast.error(errorMessage);
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    setOnlineUsers: (users) => set({ onlineUsers: users }),

    addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),

    setSelectedUser: (selectedUser) => set({ selectedUser }),

    setConversationId: (id) => set({ conversationId: id }),

    resetChat: () =>
        set({
            selectedUser: null,
            conversationId: null,
            messages: [],
            users: [],
        }),
}));
