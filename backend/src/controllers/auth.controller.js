import User from "../models/user.model.js";

const syncUser = async (req, res) => {
    try {
        const { userId: clerkUserId } = req.auth(); // from verified JWT
        const { email, name } = req.body;

        // Validate input
        if (!clerkUserId || !email) {
            return res.status(400).json({
                success: false,
                message: "clerkUserId and email are required",
            });
        }

        const user = await User.findOneAndUpdate(
            { clerkUserId }, // 🔑 unique identity
            {
                $set: {
                    email,
                    name,
                },
            },
            {
                new: true,
                upsert: true, // 🚀 atomic create-if-not-exists
            },
        );

        return res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        console.error("Error syncing user:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export default syncUser;
