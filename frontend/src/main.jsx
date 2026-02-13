import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import ClerkWithRouter from "./wrapper/ClerkWrapper";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <ClerkWithRouter>
                <App />
            </ClerkWithRouter>
        </BrowserRouter>
    </StrictMode>,
);
