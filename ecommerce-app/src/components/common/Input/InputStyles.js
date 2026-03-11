import { cva } from "class-variance-authority";

export const inputStyles = cva(
    "w-full rounded-base border transition shadow-sm focus:outline-none",
    {
        variants: {
            variant: {
                default: "border-gray-300 focus:ring-2 focus:ring-brand-blue",
                error: "border-brand-red focus:ring-2 focus:ring-brand-red",
                success: "border-green-500 focus:ring-2 focus:ring-green-500",
            },
            size: {
                sm: "px-2 py-1 text-sm",
                md: "px-3 py-2 text-base",
                lg: "px-4 py-3 text-lg",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "md",
        },
    }
);
