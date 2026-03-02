import { getAuth } from "@clerk/express";

import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

const getMessages = async (req, res) => {
    try {
        const { id: otherUserId } = req.params;
        const currentUserId = req.user._id;

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

const saveMessages = async (req, res) => {
    try {
        const { text, conversationId, receiverId } = req.body;
        const { userId: senderId } = getAuth(req);

        let conversation;

        // CASE 1: If conversationId exists
        if (conversationId) {
            conversation = await Conversation.findById(conversationId);
        }

        // CASE 2: Find by participants
        if (!conversation) {
            const participants = [senderId, receiverId].sort();

            conversation = await Conversation.findOne({ participants });
        }

        // CASE 3: Create new conversation
        if (!conversation) {
            const participants = [senderId, receiverId].sort();

            conversation = await Conversation.create({
                participants,
                createdBy: senderId,
            });
        }

        // SECURITY CHECK
        if (!conversation.participants.includes(senderId)) {
            return;
        }

        // Save message
        const message = await Message.create({
            conversationId: conversation._id,
            senderId,
            content: text,
        });

        res.status(201).json({ success: true, message });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server error" });
    }
};

export { getMessages, saveMessages };
