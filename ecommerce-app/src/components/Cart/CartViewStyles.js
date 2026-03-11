import { cva } from "class-variance-authority";

export const cartViewStyles = {
    container: cva(
        "w-full max-w-3xl mx-auto p-4 rounded-xl shadow-md",
        {
            variants: {},
            defaultVariants: {},
        }
    ),

    wrapper: "space-y-4 bg-gray-soft p-4 rounded-xl",

    header: "mb-4",
    item: "grid grid-cols-[70px_1fr_auto_auto_auto] items-center gap-4 p-3 rounded-lg bg-gray-soft-dark border border-gray-300",

    itemImage: "w-20 h-20",
    itemInfo: "flex flex-col justify-center",

    price: "text-gray-600 text-sm",

    quantity: "flex items-center gap-2",

    quantityText: "w-6 text-center",

    total: "font-semibold text-gray-700",

    removeButton:
        "text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full p-1"
};
