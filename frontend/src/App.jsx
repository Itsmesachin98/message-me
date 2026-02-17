import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";

import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import { useThemeStore } from "./store/useThemeStore";
import ProtectedRoute from "./wrapper/ProtectedRoute";
import { connectSocket } from "./sockets/socket";

const App = () => {
    // const user = useAuth();
    // useSocket(user?.userId);

    const { isSignedIn, getToken } = useAuth();

    console.log("This is isSignedIn", isSignedIn);

    useEffect(() => {
        if (!isSignedIn) return;

        const initSocket = async () => {
            const token = await getToken();

            console.log("This is token", token);

            connectSocket(token);
        };

        initSocket();
    }, [isSignedIn, getToken]);

    const { theme } = useThemeStore();

    return (
        <div data-theme={theme}>
            <Navbar />

            <Routes>
                {/* LOGIN ROUTE */}
                <Route path="/login" element={<LoginPage />} />

                {/* SIGNUP */}
                <Route path="/signup" element={<SignUpPage />} />

                {/* HOME (protected) */}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <HomePage />
                        </ProtectedRoute>
                    }
                />

                {/* SETTINGS */}
                <Route path="/settings" element={<SettingsPage />} />
            </Routes>

            <Toaster />
        </div>
    );
};

export default App;
