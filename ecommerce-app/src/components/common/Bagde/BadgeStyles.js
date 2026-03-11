import { cva } from "class-variance-authority";

export const badgeStyles = cva(
    "inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-base border select-none",
    {
        variants: {
            variant: {
                info: "bg-brand-blue/10 text-brand-blue border-brand-blue/30",
                success: "bg-brand-green/10 text-brand-green border-brand-green/30",
                warning: "bg-brand-yellow/20 text-brand-yellow border-brand-yellow/30",
                danger: "bg-brand-red/10 text-brand-red border-brand-red/30",
                pink: "bg-brand-pink/10 text-brand-pink border-brand-pink/30",
                purple: "bg-brand-purple/10 text-brand-purple border-brand-purple/30",
                sky: "bg-brand-sky/10 text-brand-sky border-brand-sky/30",
                neutral: "bg-gray-200 text-gray-800 border-gray-300",
            },
        },
        defaultVariants: {
            variant: "info",
        },
    }
);
