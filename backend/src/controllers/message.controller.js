import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";

// GET /api/messages/:otherUserId
const getMessages = async (req, res) => {
    try {
        const { id: otherUserId } = req.params;
        const currentUserId = req.user._id;

        // Authorization check
        if (!currentUserId) {
            return res
                .status(401)
                .json({ success: false, message: "Unauthorized" });
        }

        // Prevent chatting with yourself
        if (currentUserId === otherUserId) {
            return res
                .status(400)
                .json({ success: false, message: "Cannot chat with yourself" });
        }

        // Find conversation between two users
        const conversation = await Conversation.findOne({
            participants: { $all: [currentUserId, otherUserId] },
        });

        // If no conversation exists → return empty chat
        if (!conversation) {
            return res.status(200).json({
                success: true,
                conversationId: null,
                messages: [],
            });
        }

        // Fetch messages (fast, indexed)
        const messages = await Message.find({
            conversationId: conversation._id,
        })
            .sort({ createdAt: 1 })
            .select(
                "senderId content messageType mediaUrl messageSentTime createdAt isEdited",
            );

        // Respond
        return res.status(200).json({
            success: true,
            conversationId: conversation._id,
            messages,
        });
    } catch (error) {
        console.error("Error in getMessages controller:", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
};

// POST /api/messages
const saveMessages = async (req, res) => {
    try {
        const {
            content,
            senderId,
            receiverId,
            conversationId,
            mediaUrl,
            messageSentTime,
        } = req.body;
        // const senderId = req.user._id;

        // Basic validation
        if (!receiverId) {
            return res.status(400).json({
                success: false,
                message: "Receiver ID is required",
            });
        }

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

        // Security check — sender must be part of conversation
        if (!conversation.participants.includes(senderId)) {
            return res.status(403).json({
                success: false,
                message:
                    "You are not authorized to send messages in this conversation",
            });
        }

        // Upload image if present
        let imageUrl = null;

        if (mediaUrl) {
            const uploadResponse = await cloudinary.uploader.upload(mediaUrl, {
                folder: "chatsync/sent_pictures", // FOLDER STRUCTURE
            });

            imageUrl = uploadResponse.secure_url;
        }

        // Save message
        const message = await Message.create({
            conversationId: conversation._id,
            senderId,
            receiverId,
            content,
            mediaUrl: imageUrl,
            messageSentTime,
        });

        res.status(201).json({ success: true, message });
    } catch (error) {
        console.error("Save Message Error:", error);
        return res.status(500).json({ success: false, error: "Server error" });
    }
};

export { getMessages, saveMessages };
