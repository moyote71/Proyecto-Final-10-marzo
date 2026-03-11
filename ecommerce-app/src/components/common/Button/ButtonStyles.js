import { cva } from "class-variance-authority";

export const buttonStyles = cva(
    "inline-flex items-center justify-center rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed select-none",
    {
        variants: {
            variant: {
                primary: `
                    bg-black 
                    text-white 
                    hover:bg-neutral-800 
                    active:bg-neutral-900
                    shadow-sm 
                    hover:shadow-md
                `,
                secondary: `
                    bg-white 
                    text-black 
                    border 
                    border-neutral-300 
                    hover:bg-neutral-100 
                    active:bg-neutral-200
                `,
                subtle: `
                    bg-neutral-200 
                    text-neutral-900 
                    hover:bg-neutral-300 
                    active:bg-neutral-400
                `,
                ghost: `
                    bg-transparent 
                    text-neutral-800 
                    hover:bg-neutral-200/40 
                    active:bg-neutral-300/50
                `,
                danger: `
                    bg-red-600 
                    text-white 
                    hover:bg-red-700 
                    active:bg-red-800
                `,
            },

            size: {
                sm: "px-3 py-1.5 text-sm",
                base: "px-4 py-2 text-base",
                lg: "px-5 py-3 text-lg",
            },
        },

        defaultVariants: {
            variant: "primary",
            size: "base",
        },
    }
);
