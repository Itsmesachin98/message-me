import { create } from "zustand";
import toast from "react-hot-toast";

import { axiosInstance } from "../lib/axios.js";
import { disconnectSocket } from "../sockets/socket.js";
import { useChatStore } from "./useChatStore.js";

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,

    // GET /api/users/check
    checkAuth: async () => {
        set({ isCheckingAuth: true });

        try {
            const res = await axiosInstance.get("/users/check");
            set({ authUser: res.data.user });
        } catch (error) {
            console.log("Error in checkAuth: ", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    // POST /api/users/signup
    signup: async (credentials) => {
        set({ isSigningUp: true });

        try {
            const res = await axiosInstance.post("/users/signup", credentials);
            const { user, message } = res.data;
            set({ authUser: user });
            toast.success(message || "User registered successfully");

            // get().connectSocket();
        } catch (error) {
            const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                "Something went wrong";

            toast.error(errorMessage);

            set({ authUser: null });
        } finally {
            set({ isSigningUp: false });
        }
    },

    // POST /api/users/login
    login: async (credentials) => {
        set({ isLoggingIn: true });

        try {
            const res = await axiosInstance.post("/users/login", credentials);
            const { user, message } = res.data;
            set({ authUser: user });
            toast.success(message || "Login successful");

            // get().connectSocket();
        } catch (error) {
            const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                "Something went wrong";

            toast.error(errorMessage);

            set({ authUser: null });
        } finally {
            set({ isLoggingIn: false });
        }
    },

    // POST api/users/logout
    logout: async () => {
        try {
            const res = await axiosInstance.post("/users/logout");
            set({ authUser: null });
            useChatStore.getState().resetChat();
            disconnectSocket();
            toast.success(res?.data?.message || "Logged out successfully");
        } catch (error) {
            const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                "Logout failed";

            toast.error(errorMessage);
        }
    },

    // POST /api/users/update-profile
    updateProfile: async (payload) => {
        set({ isUpdatingProfile: true });

        try {
            const res = await axiosInstance.put(
                "/users/update-profile",
                payload,
            );
            const { user, message } = res.data;
            set({ authUser: user });
            toast.success(message || "Profile updated successfully");
        } catch (error) {
            const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                "Failed to update profile";

            toast.error(errorMessage);
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    // connectSocket: () => {
    //     const { authUser } = get();
    //     if (!authUser || get().socket?.connected) return;

    //     const socket = io(BASE_URL, {
    //         query: {
    //             userId: authUser._id,
    //         },
    //     });
    //     socket.connect();

    //     set({ socket: socket });

    //     socket.on("getOnlineUsers", (userIds) => {
    //         set({ onlineUsers: userIds });
    //     });
    // },
    // disconnectSocket: () => {
    //     if (get().socket?.connected) get().socket.disconnect();
    // },
}));
