import { useUser, useAuth } from "@clerk/clerk-react";
import { useEffect, useCallback } from "react";

import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
    const { selectedUser } = useChatStore();
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth(); // Clerk JWT getter

    // Sync authenticated Clerk user with backend DB
    const syncUserWithBackend = useCallback(async () => {
        if (!user) return;

        try {
            const token = await getToken(); // get JWT here

            const response = await fetch(
                "http://localhost:5001/api/auth/sync",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`, // send JWT
                    },
                    body: JSON.stringify({
                        clerkUserId: user.id,
                        email: user.primaryEmailAddress?.emailAddress,
                        name: user.fullName,
                    }),
                },
            );

            if (!response.ok) {
                console.error("Failed to sync user with backend");
            }
        } catch (error) {
            console.error("Error syncing user:", error);
        }
    }, [user, getToken]);

    useEffect(() => {
        if (isLoaded && user) {
            syncUserWithBackend();
        }
    }, [isLoaded, user, syncUserWithBackend]);

    if (!isLoaded) return null;

    return (
        <div className="h-screen bg-base-200">
            <div className="flex items-center justify-center pt-20 px-4">
                <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
                    <div className="flex h-full rounded-lg overflow-hidden">
                        <Sidebar />

                        {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
