import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
    {
        conversationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conversation",
            required: true,
            index: true,
        },

        senderId: {
            type: String,
            required: true,
            index: true,
        },

        receiverId: {
            type: String,
            required: true,
            index: true,
        },

        content: {
            type: String,
            trim: true,
        },

        messageType: {
            type: String,
            enum: ["text", "image", "file"],
            default: "text",
        },

        mediaUrl: {
            type: String,
        },

        messageSentTime: {
            type: String,
            // required: true,
        },

        isEdited: {
            type: Boolean,
            default: false,
        },

        deletedAt: {
            type: Date,
        },
    },
    { timestamps: true },
);

// Compound index for fast message fetching in chat
MessageSchema.index({ conversationId: 1, createdAt: 1 });

const Message = mongoose.model("Message", MessageSchema);

export default Message;
