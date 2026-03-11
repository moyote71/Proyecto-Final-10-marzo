// src/layout/Layout/LayoutStyles.js
import { cva } from "class-variance-authority";

const LayoutStyles = {
    layout: cva(
        "min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300"
    ),

    main: cva(
        "flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8"
    )
};

export default LayoutStyles;
