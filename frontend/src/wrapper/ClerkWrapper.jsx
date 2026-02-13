import { ClerkProvider } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) throw new Error("Missing Publishable Key");

function ClerkWithRouter({ children }) {
    const navigate = useNavigate();

    return (
        <ClerkProvider
            publishableKey={PUBLISHABLE_KEY}
            navigate={(to) => navigate(to)}
        >
            {children}
        </ClerkProvider>
    );
}

export default ClerkWithRouter;
