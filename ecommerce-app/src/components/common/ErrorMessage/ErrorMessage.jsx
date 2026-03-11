import React from "react";
import "./ErrorMessage.css";
import { cn } from "../../../utils/cn";

export default function ErrorMessage({ children, className }) {
    return (
        <div className={cn("error-message", className)}>
            {children}
        </div>
    );
}
