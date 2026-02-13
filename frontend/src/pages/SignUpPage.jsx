import { SignUp } from "@clerk/clerk-react";

const SignUpPage = () => {
    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <SignUp routing="path" path="/signup" signInUrl="/login" />
        </div>
    );
};

export default SignUpPage;
