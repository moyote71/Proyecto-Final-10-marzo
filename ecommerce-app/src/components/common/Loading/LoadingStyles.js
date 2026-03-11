import { cva } from "class-variance-authority";

export const loadingStyles = {
    container: cva(
        "flex flex-col items-center justify-center gap-3 " +
        "py-10 rounded-base w-full " +
        "bg-grayA-1 dark:bg-grayAdark-1 text-grayA-5 dark:text-grayAdark-5"
    ),

    spinner: cva(
        "w-8 h-8 rounded-full border-4 border-grayA-4 border-t-brand-blue " +
        "animate-spin"
    ),

    text: cva(
        "text-sm font-medium text-grayA-6 dark:text-grayAdark-6"
    ),
};
