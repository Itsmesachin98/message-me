import { clerkClient, getAuth } from "@clerk/express";

import User from "../models/user.model.js";

const getClerkUsers = async (req, res) => {
    try {
        const { userId } = getAuth(req);

        // STEP 1 — Ensure logged-in user exists in DB
        let existingUser = await User.findOne({ clerkUserId: userId });

        if (!existingUser) {
            const clerkUser = await clerkClient.users.getUser(userId);

            existingUser = await User.create({
                clerkUserId: clerkUser.id,
                name: `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim(),
                email: clerkUser.emailAddresses?.[0]?.emailAddress ?? null,
                image: clerkUser.imageUrl ?? null,
            });
        }

        // STEP 2 — Fetch other users (from Clerk OR better from DB)
        const allClerkUsers = await clerkClient.users.getUserList({
            limit: 50,
        });

        const formattedUsers = allClerkUsers.data.map((user) => ({
            clerkId: user.id,
            name: `${user.firstName ?? ""} ${user.lastName ?? ""}`,
            email: user.emailAddresses[0]?.emailAddress,
            image: user.imageUrl,
        }));

        res.status(200).json({ success: true, users: formattedUsers });
    } catch (error) {
        console.error("Clerk fetch error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch users from Clerk",
        });
    }
};

export default getClerkUsers;
