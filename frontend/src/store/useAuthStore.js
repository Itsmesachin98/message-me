import { create } from "zustand";
import toast from "react-hot-toast";

import { axiosInstance } from "../lib/axios.js";
import { disconnectSocket } from "../sockets/socket.js";

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,

    // GET /api/users/check
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/users/check");
            set({ authUser: res.data });
        } catch (error) {
            console.log("Error in checkAuth:", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    // POST /api/users/signup
    signup: async (data) => {
        set({ isSigningUp: true });

        try {
            const res = await axiosInstance.post("/users/signup", data);
            set({ authUser: res.data });
            toast.success("Account created successfully");
            // get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isSigningUp: false });
        }
    },

    // POST /api/users/login
    login: async (data) => {
        set({ isLoggingIn: true });

        try {
            const res = await axiosInstance.post("/users/login", data);
            set({ authUser: res.data });
            toast.success("Logged in successfully");

            // get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isLoggingIn: false });
        }
    },

    // POST api/users/logout
    logout: async () => {
        try {
            await axiosInstance.post("/users/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");
            disconnectSocket();
            // get().disconnectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    // updateProfile: async (data) => {
    //     set({ isUpdatingProfile: true });
    //     try {
    //         const res = await axiosInstance.put("/auth/update-profile", data);
    //         set({ authUser: res.data });
    //         toast.success("Profile updated successfully");
    //     } catch (error) {
    //         console.log("error in update profile:", error);
    //         toast.error(error.response.data.message);
    //     } finally {
    //         set({ isUpdatingProfile: false });
    //     }
    // },

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
