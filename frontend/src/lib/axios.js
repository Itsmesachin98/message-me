import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const axiosInstance = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    withCredentials: true,
});

// 🔥 Add this interceptor
axiosInstance.interceptors.request.use(
    async (config) => {
        if (window.Clerk?.session) {
            const token = await window.Clerk.session.getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error),
);
