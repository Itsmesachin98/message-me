import { getAuth } from "@clerk/express";

import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

const getMessages = async (req, res) => {
    try {
        const { id: otherUserId } = req.params;
        const { userId: currentUserId } = getAuth(req);

        // Authorization check
        if (!currentUserId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Prevent chatting with yourself
        if (currentUserId === otherUserId) {
            return res
                .status(400)
                .json({ message: "Cannot chat with yourself" });
        }

        // Find conversation between two users
        const conversation = await Conversation.findOne({
            participants: { $all: [currentUserId, otherUserId] },
        });

        // If no conversation exists → return empty chat
        if (!conversation) {
            return res.status(200).json({
                conversationId: null,
                messages: [],
            });
        }

        // Fetch messages (fast, indexed)
        const messages = await Message.find({
            conversationId: conversation._id,
        })
            .sort({ createdAt: 1 })
            .select("senderId content messageType mediaUrl createdAt isEdited");

        // Respond
        return res.status(200).json({
            conversationId: conversation._id,
            messages,
        });
    } catch (error) {
        console.error("Error in getMessages controller:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export { getMessages };
