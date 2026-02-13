import { useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { Loader } from "lucide-react";

function ProtectedRoute({ children }) {
    const { isSignedIn, isLoaded } = useAuth();

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader className="size-10 animate-spin" />
            </div>
        );
    }

    if (!isSignedIn) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;
