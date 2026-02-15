import { clerkClient } from "@clerk/express";

const getClerkUsers = async (req, res) => {
    try {
        const users = await clerkClient.users.getUserList({ limit: 100 });

        const formattedUsers = users.data.map((user) => ({
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
