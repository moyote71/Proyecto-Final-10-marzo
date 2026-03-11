import React from "react";
import { cn } from "../../../utils/cn";
import "./LiquidButton.css";

export default function LiquidButton({
    as: Component = "button",
    children,
    className,
    variant = "default",
    size = "md",
    ...props
}) {
    return (
        <Component
            className={cn(
                "liquid-btn",
                `liquid-${variant}`,
                `liquid-${size}`,
                className
            )}
            {...props}
        >
            <span className="liquid-bg"></span>
            <span className="liquid-glow"></span>
            <span className="liquid-content">{children}</span>
        </Component>
    );
}
