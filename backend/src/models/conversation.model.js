import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema(
    {
        participants: [
            {
                type: String, // clerkUserId
                required: true,
            },
        ],

        lastMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
        },

        createdBy: {
            type: String, // clerkUserId
            required: true,
        },

        isArchived: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

// Ensure exactly 2 participants (1-to-1 chat)
ConversationSchema.pre("save", function (next) {
    if (this.participants.length !== 2) {
        return next(new Error("Conversation must have exactly 2 participants"));
    }
    next();
});

// Fast lookup to find conversation between two users
ConversationSchema.index({ participants: 1 });

const Conversation = mongoose.model("Conversation", ConversationSchema);

export default Conversation;
