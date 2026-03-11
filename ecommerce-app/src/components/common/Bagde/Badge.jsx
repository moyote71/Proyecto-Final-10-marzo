import React from "react";
import { badgeStyles } from "./BadgeStyles";
import { cn } from "../../../utils/cn";

export default function Badge({ text, variant = "info", className }) {
    return (
        <span className={cn(badgeStyles({ variant }), className)}>
            {text}
        </span>
    );
}
