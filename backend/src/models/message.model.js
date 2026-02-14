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
            type: String, // clerkUserId
            required: true,
            index: true,
        },

        content: {
            type: String,
            trim: true,
            required: function () {
                return this.messageType === "text";
            },
        },

        messageType: {
            type: String,
            enum: ["text", "image", "file"],
            default: "text",
        },

        mediaUrl: {
            type: String,
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
