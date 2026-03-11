import { useEffect, useRef } from "react";

import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
// import { formatMessageTime } from "../lib/utils";
import { getSocket } from "../sockets/socket";
import { useAuthStore } from "../store/useAuthStore";

const ChatContainer = () => {
    const { authUser } = useAuthStore();

    const {
        messages,
        getMessages,
        isMessagesLoading,
        conversationId,
        selectedUser,
    } = useChatStore();

    const messageEndRef = useRef(null);

    useEffect(() => {
        if (!selectedUser) return;

        getMessages(selectedUser._id);
    }, [selectedUser]);

    useEffect(() => {
        const socket = getSocket();
        if (!socket || !selectedUser) return;

        const roomId = [authUser._id, selectedUser._id].sort().join("_");

        socket.emit("joinConversation", roomId);

        return () => {
            socket.emit("leaveConversation", roomId);
        };
    }, [conversationId, selectedUser]);

    useEffect(() => {
        if (messageEndRef.current && messages) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    console.log(messages);

    if (isMessagesLoading) {
        return (
            <div className="flex-1 flex flex-col overflow-auto">
                <ChatHeader />
                <MessageSkeleton />
                <MessageInput />
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader />

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message._id}
                        className={`chat ${
                            message.senderId === authUser._id
                                ? "chat-end"
                                : "chat-start"
                        }`}
                        ref={messageEndRef}
                    >
                        <div className="chat-image avatar">
                            <div className="size-10 rounded-full border">
                                <img
                                    src={
                                        message.senderId === authUser._id
                                            ? authUser.profilePic?.url ||
                                              "/avatar.png"
                                            : selectedUser.profilePic?.url ||
                                              "/avatar.png"
                                    }
                                    alt="profile pic"
                                />
                            </div>
                        </div>
                        <div className="chat-header mb-1">
                            <time className="text-xs opacity-50 ml-1">
                                {message.messageSentTime}
                            </time>
                        </div>
                        <div className="chat-bubble flex flex-col">
                            {message.mediaUrl && (
                                <img
                                    src={message.mediaUrl}
                                    alt="Attachment"
                                    className="sm:max-w-[200px] rounded-md mb-2"
                                />
                            )}
                            {message.content && <p>{message.content}</p>}
                        </div>
                    </div>
                ))}
            </div>

            <MessageInput />
        </div>
    );
};

export default ChatContainer;
