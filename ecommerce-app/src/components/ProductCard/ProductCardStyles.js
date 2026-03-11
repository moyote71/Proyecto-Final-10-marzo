import { cva } from "class-variance-authority";

const card = cva(`
    rounded-xl p-4 transition-all flex shadow-md

    bg-white dark:bg-neutral-900

    border border-neutral-200 dark:border-neutral-800

    hover:border-[#14B8A6]/60            
    hover:shadow-[0_0_10px_0_rgba(20,184,166,0.25)]

    focus-within:ring-2 
    focus-within:ring-[#14B8A6]/50 
    focus-within:ring-offset-2 
    focus-within:ring-offset-white 
    dark:focus-within:ring-offset-neutral-900

    transition-all duration-300`,
    {
        variants: {
            orientation: {
                vertical: "flex-col gap-4",
                horizontal: "md:flex-row flex-col gap-4",
            },
        },
        defaultVariants: {
            orientation: "vertical",
        },
    }
);

const image = cva(
    `object-cover rounded-lg
    border border-neutral-200 dark:border-neutral-700`,
    {
        variants: {
            orientation: {
                vertical: "w-full h-56",
                horizontal: "w-40 h-40",
            },
        },
        defaultVariants: {
            orientation: "vertical",
        },
    }
);

const content = cva("flex flex-col flex-1");

const title = cva(
    `text-lg font-semibold mb-1 
    text-neutral-900 dark:text-white`);

const description = cva(
    `text-sm mb-2 
    text-neutral-500 dark:text-neutral-400`);

const price = cva(
    `text-xl font-bold mb-3
    text-[#14B8A6]
    dark:text-[#2DD4BF]`);

const footer = cva("flex items-center justify-between mt-auto");

const ProductCardStyles = {
    card,
    image,
    content,
    title,
    description,
    price,
    footer,
};

export default ProductCardStyles;
