import { cva } from "class-variance-authority";

const breadcrumbStyles = {
    nav: cva("w-full py-3 text-sm text-gray-600 dark:text-gray-300"),

    container: cva("max-w-6xl mx-auto px-4 flex items-center"),

    list: cva("flex items-center gap-2"),

    item: cva("flex items-center gap-2"),

    link: cva(
        "flex items-center gap-1 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition"
    ),

    text: cva("ml-1"),

    separator: cva("text-gray-400 dark:text-gray-500"),

    current: cva("font-semibold text-blue-600 dark:text-blue-400"),
};

export default breadcrumbStyles;
