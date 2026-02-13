import { SignIn } from "@clerk/clerk-react";

function LoginPage() {
    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <SignIn routing="path" path="/login" signUpUrl="/signup" />
        </div>
    );
}

export default LoginPage;
