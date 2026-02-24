// import cloudinary from "../lib/cloudinary.js";
// import { getReceiverSocketId, io } from "../lib/socket.js";

// import User from "../models/user.model.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

// const getUsersForSidebar = async (req, res) => {
//     try {
//         const loggedInUserId = req.user._id;
//         const filteredUsers = await User.find({
//             _id: { $ne: loggedInUserId },
//         }).select("-password");

//         res.status(200).json(filteredUsers);
//     } catch (error) {
//         console.error("Error in getUsersForSidebar: ", error.message);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };

const getMessages = async (req, res) => {
    try {
        const { id: otherUserId } = req.params;
        const currentUserId = req.auth().userId;

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

// socket.on("sendMessage", async () => {});

// const sendMessage = async (req, res) => {
//     try {
//         const { text, image } = req.body;
//         const { id: receiverId } = req.params;
//         const senderId = req.user._id;

//         let imageUrl;
//         if (image) {
//             const uploadResponse = await cloudinary.uploader.upload(image);
//             imageUrl = uploadResponse.secure_url;
//         }

//         const newMessage = new Message({
//             senderId,
//             receiverId,
//             text,
//             image: imageUrl,
//         });

//         await newMessage.save();

//         // todo: realtime functionality goes here => socket.io
//         const receiverSocketId = getReceiverSocketId(receiverId);
//         if (receiverSocketId) {
//             io.to(receiverSocketId).emit("newMessage", newMessage);
//         }

//         res.status(201).json(newMessage);
//     } catch (error) {
//         console.log("Error in sendMessage controller: ", error.message);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };

export { getMessages };
