import "./index.css";
import React from "react";
import { createRoot } from "react-dom/client"; // Updated import
import { App } from "./App";

const container = document.getElementById("root");

if (container) {
    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}